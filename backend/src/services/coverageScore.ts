import {
  TechniqueMitigationResultDto,
  AggregatedMitigationDto,
} from '../types/dtos/retrieval';

export class CoverageScoreService {
  /**
   * Kiszámolja a mitigációk lefedettségi pontszámát és csökkenő sorrendbe állítja őket.
   * @param techniqueResults A repóból kapott technikánkénti mitigációk.
   * @param targetTechniqueCount Az összes vizsgált egyedi technika darabszáma.
   */
  public calculateCoverage(
    techniqueResults: TechniqueMitigationResultDto[],
    targetTechniqueCount: number
  ): AggregatedMitigationDto[] {
    if (targetTechniqueCount === 0 || techniqueResults.length === 0) {
      return [];
    }

    const mitigationMap = new Map<
      string,
      {
        name: string;
        description: string;
        techniqueIds: Set<string>;
      }
    >();

    for (const tech of techniqueResults) {
      for (const mit of tech.mitigations) {
        if (!mit.mitigationId) continue;

        if (!mitigationMap.has(mit.mitigationId)) {
          mitigationMap.set(mit.mitigationId, {
            name: mit.name,
            description: mit.description || '',
            techniqueIds: new Set<string>(),
          });
        }

        mitigationMap.get(mit.mitigationId)!.techniqueIds.add(tech.techniqueId);
      }
    }

    const aggregated: AggregatedMitigationDto[] = [];

    mitigationMap.forEach((data, mitigationId) => {
      const coveredCount = data.techniqueIds.size;
      const rawScore = coveredCount / targetTechniqueCount;
      const coverageScore = Math.round(rawScore * 100) / 100;

      aggregated.push({
        mitigationId,
        name: data.name,
        description: data.description,
        mitigatedTechniqueIds: Array.from(data.techniqueIds),
        coverageScore,
      });
    });

    // Rendezés lefedettség szerint csökkenő, majd név szerint növekvő sorrendbe
    return aggregated.sort((a, b) => {
      if (b.coverageScore !== a.coverageScore) {
        return b.coverageScore - a.coverageScore;
      }
      return a.name.localeCompare(b.name);
    });
  }
}