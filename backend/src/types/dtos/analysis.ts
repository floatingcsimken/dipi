/**
 * @file analysis.ts
 * @description Adatátviteli objektumok (DTO) a hasonlóság-alapú elemzéshez és döntéstámogatáshoz.
 */

/**
 * Bemeneti DTO az elemzéshez (Observe fázis).
 */
export interface AnalysisRequestDto {
  targetSector?: string;           // Pl. "financial-services", "defense"
  observedTechniqueIds?: string[]; // Pl. ["T1566", "T1055"]
  observedMalwareNames?: string[]; // Pl. ["Mimikatz", "WannaCry"]
  observedCves?: string[];         // Pl. ["CVE-2017-0144"]
}

/**
 * Egy gyanúsított támadócsoport hasonlósági eredménye.
 */
export interface ThreatActorMatch {
  stixId: string;
  name: string;
  aliases: string[];
  primaryMotivation?: string;
  similarityScore: number;         // 0.0 - 1.0 közötti normalizált pontszám
  matchedTechniques: string[];
  matchedMalware: string[];
  matchedSectors: string[];
}

/**
 * Predikált következő technika és javasolt elhárítás.
 */
export interface PredictedNextStep {
  techniqueId: string;
  techniqueName: string;
  tactic: string;                  // Pl. "credential-access", "lateral-movement"
  confidence: number;              // 0.0 - 1.0
  recommendedMitigations: Array<{
    stixId: string;
    name: string;
    description?: string;
  }>;
}

/**
 * Az elemzés teljes kimenete (Orient + Decide + Act fázis).
 */
export interface AnalysisResponseDto {
  timestamp: string;
  inputSummary: AnalysisRequestDto;
  attributionRanking: ThreatActorMatch[]; // Rangsorolt APT csoportok
  predictedNextSteps: PredictedNextStep[];// Várható következő lépések és védelmi intézkedések
}