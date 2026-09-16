import { RetrievalResponseDto } from './retrieval';

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
  extracted: ExtractedTechniquesDto;
  retrieval: RetrievalResponseDto;
}