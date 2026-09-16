import OpenAI from 'openai';
import { RetrievalService } from './retrieval';
import { ExtractedTechniquesDto, InvestigateResponseDto } from '../types/dtos/agent';
import { MetadataRepository } from '../repositories/metadata';

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

    // 1. Lépés: Technikák és platformok kinyerése LLM segítségével
    const rawExtracted = await this.extractTechniquesFromText(prompt);

    const validMetadataTechniques = await this.metadataRepo.validateTechniqueIds(rawExtracted.techniqueIds);
    const validTechniqueIds = validMetadataTechniques.map(t => t.id);

    // 2. Lépés: Determinisztikus gráftények és coverageScore lekérése
    const retrieval = await this.retrievalService.getMitigations({
      techniqueIds: validTechniqueIds,
      platforms: rawExtracted.platforms,
    });

    return {
      rawPrompt: prompt,
      extracted: rawExtracted,
      retrieval,
    };
  }

  private async extractTechniquesFromText(text: string): Promise<ExtractedTechniquesDto> {
    const systemPrompt = `
You are a Cyber Threat Intelligence triage engine.
Analyze the incident text and extract MITRE ATT&CK enterprise technique IDs (e.g. T1059.001, T1003).

CRITICAL: Return ONLY a raw JSON object. No explanation text, no markdown backticks, no preamble.

Required JSON format:
{
  "techniqueIds": ["T1059.001"],
  "platforms": ["Windows"],
  "confidenceExplanation": "Short explanation"
}
`;

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
      return { techniqueIds: [], platforms: [] };
    }

    try {
      const parsed = JSON.parse(content) as ExtractedTechniquesDto;
      return {
        techniqueIds: Array.isArray(parsed.techniqueIds) ? parsed.techniqueIds : [],
        platforms: Array.isArray(parsed.platforms) ? parsed.platforms : [],
        confidenceExplanation: parsed.confidenceExplanation || '',
      };
    } catch {
      return { techniqueIds: [], platforms: [] };
    }
  }
}