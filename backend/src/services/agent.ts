import OpenAI from 'openai';
import { RetrievalService } from './retrieval';
import { InvestigateResponseDto, AttackProgressionDto, AgentChatRequestDto, AgentChatResponseDto, ChatMessage } from '../types/dtos/agent';
import { MetadataRepository } from '../repositories/metadata';
import { AttackProgressionSchema } from '../types/investigation.schema'; 

export class AgentService {
  private openai: OpenAI;
  private retrievalService: RetrievalService;
  private metadataRepo: MetadataRepository;

  constructor(retrievalService: RetrievalService, metadataRepo: MetadataRepository) {
    this.retrievalService = retrievalService;
    this.metadataRepo = metadataRepo;
    this.openai = new OpenAI({
      apiKey: process.env.LLM_API_KEY || 'dummy-key',
      baseURL: process.env.LLM_BASE_URL || 'http://localhost:11434/v1',
    });
  }

  async investigate(prompt: string): Promise<InvestigateResponseDto> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    // 1. Lépés: Idősík és technikák kinyerése az LLM-mel
    const progression = await this.analyzeProgression(prompt);

    // 2. Lépés: Csak az adatbázisban létező technikákat tartjuk meg
    const validMetadataTechniques = await this.metadataRepo.validateTechniqueIds(progression.currentTechniques);
    const validTechniqueIds = validMetadataTechniques.map((t) => t.id);

    // 3. Lépés: Determinisztikus Neo4j mitigációk és coverageScore lekérése
    const retrieval = await this.retrievalService.getMitigations({
      techniqueIds: validTechniqueIds,
    });

    return {
      rawPrompt: prompt,
      progression: {
        ...progression,
        currentTechniques: validTechniqueIds,
      },
      mitigations: retrieval.rankedMitigations,
      totalTechniques: validTechniqueIds.length,
    };
  }

async handleChat(request: AgentChatRequestDto): Promise<AgentChatResponseDto> {
    const { messages, forceAnalysis } = request;

    if (!messages || messages.length === 0) {
      throw new Error('Messages cannot be empty');
    }

    // Ha a felhasználó rákattintott, hogy "Indítsd el analízis nélkül", 
    // vagy az LLM szerint már van elég info, akkor futtatjuk a végleges investigate-et.
    if (forceAnalysis) {
      const fullContextText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const analysisResult = await this.investigate(fullContextText);
      return {
        type: 'analysis',
        message: 'Az analízis elkészült a megadott adatok alapján.',
        data: analysisResult
      };
    }

    // Kérdezzük meg az LLM-et, hogy kell-e még info, vagy álljunk készen az analízisre
    const decision = await this.decideNextStep(messages);

    if (decision.action === 'ask') {
      return {
        type: 'question',
        message: decision.question || 'Kérlek adj meg még néhány részletet az esetről (pl. iparági szektor, érintett országok).'
      };
    } else {
      // Ha az LLM úgy ítéli meg, hogy van elég info, automatikusan lefuttatjuk az analízist
      const fullContextText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const analysisResult = await this.investigate(fullContextText);
      return {
        type: 'analysis',
        message: 'Elegendő információ áll rendelkezésre. Íme az elemzés és a mitigációs stratégia:',
        data: analysisResult
      };
    }
  }

  /**
   * Segédmetódus: Az LLM eldönti, hogy kérdezzen-e még vagy eleget tud-e.
   */
  private async decideNextStep(messages: ChatMessage[]): Promise<{ action: 'ask' | 'analyze'; question?: string }> {
    const systemPrompt = `
You are an expert Cyber Threat Intelligence triage coordinator.
Review the conversation history between the analyst and you.
Your goal is to gather sufficient context (such as industry sector, target country/region, or specific malicious indicators/IOCs) to perform a precise MITRE ATT&CK analysis.

Decide whether you need to ask a clarifying question or if you have enough information to proceed with the analysis.

CRITICAL: Return ONLY a raw JSON object. No markdown backticks, no preamble.

Required JSON format:
{
  "action": "ask", // or "analyze"
  "question": "If action is 'ask', write a concise, professional clarifying question here. If 'analyze', leave empty."
}
`;

    const response = await this.openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'llama3.2',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { action: 'analyze' }; // Fallback ha hiba van
    }

    try {
      const parsed = JSON.parse(content);
      return {
        action: parsed.action === 'ask' ? 'ask' : 'analyze',
        question: parsed.question
      };
    } catch {
      return { action: 'analyze' };
    }
  }

  private async analyzeProgression(text: string): Promise<AttackProgressionDto> {
    const systemPrompt = `
You are a Cyber Threat Intelligence triage engine.
Analyze the incident text and reconstruct the attack timeline into three phases:
- origin: Suspected past entry point or root cause (e.g. initial access vectors).
- currentTechniques: Enterprise MITRE ATT&CK technique IDs observed directly in the text (e.g. ["T1059.001"]).
- predictedNext: Likely future tactical steps (e.g. lateral movement, exfiltration).
- threatProfile: Threat style name and reasoning explaining what known pattern this behavior resembles.
- analystSummary: 2 concise sentences summarizing the situation.

CRITICAL: Return ONLY a raw JSON object. No explanation text, no markdown backticks, no preamble.

Required JSON format:
{
  "origin": [
    { "name": "Initial Access", "techniqueId": "T1190", "description": "Suspected web exploit" }
  ],
  "currentTechniques": ["T1059.001"],
  "predictedNext": [
    { "name": "Lateral Movement", "techniqueId": "T1021", "description": "Attempt to pivot to internal hosts" }
  ],
  "threatProfile": {
    "patternName": "Ransomware Staging",
    "reasoning": "Observed execution and credential access often precede ransomware deployment."
  },
  "analystSummary": "Suspicious execution detected. Immediate isolation recommended."
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.LLM_MODEL || 'llama3.2',
        response_format: { type: 'json_object' },
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from LLM');
      }

      const parsedJson = JSON.parse(content);

      // ZOD VALIDÁCIÓ: Ha az LLM eltér a sémától, a Zod itt dob hibát, 
      // amit a catch ág biztonságosan elkap.
      const validatedData = AttackProgressionSchema.parse(parsedJson);

      return validatedData as AttackProgressionDto;

    } catch (error) {
      console.error('Zod validation or LLM generation error in analyzeProgression:', error);
      // Fallback biztonsági struktúra, ha az AI elrontotta volna
      return {
        origin: [],
        currentTechniques: [],
        predictedNext: [],
        analystSummary: 'Failed to parse or validate model response securely.',
      };
    }
  }
}