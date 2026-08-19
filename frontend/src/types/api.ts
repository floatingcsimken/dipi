/**
 * @file api.ts
 * @description REST API kérések és válaszok DTO interfészei.
 */

import type { ThreatActorMatch, PredictedStep } from './threatIntel';

/**
 * Az incidenselemzéshez küldött bemeneti DTO (Observe).
 */
export interface AnalysisRequestDTO {
  targetSector?: string;
  observedMalwareNames?: string[];
  observedTechniqueIds?: string[];
  observedCves?: string[];
}

/**
 * Az incidenselemzés válasz DTO-ja (Orient, Decide & Act).
 */
export interface AnalysisResponseDTO {
  timestamp: string;
  inputSummary: AnalysisRequestDTO;
  attributionRanking: ThreatActorMatch[];
  predictedNextSteps: PredictedStep[];
}