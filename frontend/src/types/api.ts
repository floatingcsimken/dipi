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

/**
 * A MITRE ATT&CK technikák metaadat reprezentációja.
 */
export interface TechniqueMetadata {
  id: string;
  name: string;
}

/**
 * A metaadat végpont (`/api/metadata`) által visszaadott aggregált válasz struktúrája.
 */
export interface MetadataResponseDTO {
  sectors: string[];
  malware: string[];
  techniques: TechniqueMetadata[];
}