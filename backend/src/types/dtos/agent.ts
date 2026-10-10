import { AggregatedMitigationDto } from './retrieval';

export interface InvestigateRequestDto {
  prompt: string;
}

export interface ExtractedTechniquesDto {
  techniqueIds: string[];
  platforms?: string[];
  confidenceExplanation?: string;
}

export interface InvestigateResponseDto {
  rawPrompt: string;
  progression: AttackProgressionDto;
  mitigations: AggregatedMitigationDto[];
  totalTechniques: number;
}

export interface AttackNodeDto {
  name: string;
  techniqueId?: string;
  description: string;
}

export interface ThreatProfileDto {
  patternName: string;
  reasoning: string;
}

export interface AttackProgressionDto {
  origin: AttackNodeDto[];          
  currentTechniques: string[];      
  predictedNext: AttackNodeDto[];   
  threatProfile?: ThreatProfileDto; 
  analystSummary: string;           
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentChatRequestDto {
  messages: ChatMessage[];
  forceAnalysis?: boolean;
}

export interface AgentChatResponseDto {
  type: 'question' | 'analysis';
  message: string;
  data?: InvestigateResponseDto; 
}