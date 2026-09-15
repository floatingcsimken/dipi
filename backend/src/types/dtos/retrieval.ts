export interface RetrievalParamsDto {
  techniqueIds?: string[];
  softwareNames?: string[];
  platforms?: string[];
}

export interface MitigationItemDto {
  mitigationId: string;
  name: string;
  description: string | null;
}

export interface TechniqueMitigationResultDto {
  techniqueId: string;
  techniqueName: string;
  platforms: string[];
  mitigations: MitigationItemDto[];
}

export interface AggregatedMitigationDto extends MitigationItemDto {
  mitigatedTechniqueIds: string[];
  coverageScore: number; // 0.0 - 1.0 közötti arány
}

export interface RetrievalResponseDto {
  totalTechniques: number;
  byTechnique: TechniqueMitigationResultDto[];
  rankedMitigations: AggregatedMitigationDto[];
}