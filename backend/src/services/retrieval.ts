
import { RetrievalRepository } from '../repositories/retrieval';
import {
  RetrievalParamsDto,
  RetrievalResponseDto,
} from '../types/dtos/retrieval';
import { CoverageScoreService } from './coverageScore';

export class RetrievalService {
  constructor(
    private repository: RetrievalRepository,
    private scoreService: CoverageScoreService
  ) {}
  
  public async getMitigations(params: RetrievalParamsDto): Promise<RetrievalResponseDto> {
    const rawTechniques = Array.isArray(params.techniqueIds) ? params.techniqueIds : [];
    const rawSoftware = Array.isArray(params.softwareNames) ? params.softwareNames : [];
    const rawPlatforms = Array.isArray(params.platforms) ? params.platforms : [];

    const sanitizedParams: RetrievalParamsDto = {
      techniqueIds: Array.from(new Set(rawTechniques.map((id) => id.trim()).filter((id) => id.length > 0))),
      softwareNames: Array.from(new Set(rawSoftware.map((s) => s.trim()).filter((s) => s.length > 0))),
      platforms: Array.from(new Set(rawPlatforms.map((p) => p.trim()).filter((p) => p.length > 0))),
    };

    // Ha nincs mit lekérdezni, 500 helyett üres lista tér vissza azonnal
    if (sanitizedParams.techniqueIds!.length === 0 && sanitizedParams.softwareNames!.length === 0) {
      return {
        totalTechniques: 0,
        byTechnique: [],
        rankedMitigations: [],
      };
    }

    const byTechnique = await this.repository.getMitigations(sanitizedParams);

    // Meghatározzuk a megtalált egyedi technikák számát
    const uniqueFoundTechniqueIds = new Set(byTechnique.map((t) => t.techniqueId));
    const totalTechniques = Math.max(sanitizedParams.techniqueIds!.length, uniqueFoundTechniqueIds.size);

    const rankedMitigations = this.scoreService.calculateCoverage(
      byTechnique,
      totalTechniques
    );

    return {
      totalTechniques,
      byTechnique,
      rankedMitigations,
    };
  }
}