import { RetrievalRepository } from '../repositories/retrieval';
import {
  RetrievalParamsDto,
  TechniqueMitigationResultDto,
} from '../types/dtos/retrieval';

export class RetrievalService {
  constructor(private repository: RetrievalRepository) {}

  /**
   * Tisztítja a bemeneti paramétereket és lekéri a mitigációkat a repository-ból.
   */
  public async getMitigations(params: RetrievalParamsDto): Promise<TechniqueMitigationResultDto[]> {
    // 1. Normalizálás: szóközök levágása, üres elemek és duplikációk kiszűrése
    const sanitizedTechniques = this.sanitizeArray(params.techniqueIds);
    const sanitizedSoftware = this.sanitizeArray(params.softwareNames);
    const sanitizedPlatforms = this.sanitizeArray(params.platforms);

    // 2. Rövidzár: ha se technika, se szoftver nincs megadva, felesleges a gráfhoz fordulni
    if (sanitizedTechniques.length === 0 && sanitizedSoftware.length === 0) {
      return [];
    }

    // 3. Adatlekérés a DAL-on keresztül
    return await this.repository.getMitigations({
      techniqueIds: sanitizedTechniques,
      softwareNames: sanitizedSoftware,
      platforms: sanitizedPlatforms,
    });
  }

  private sanitizeArray(items?: string[]): string[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return Array.from(
      new Set(
        items
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item) => item.length > 0)
      )
    );
  }
}