/**
 * @file analysis.ts
 * @description Hasonlóság-számítási és döntéstámogató üzleti logika.
 */

import { AnalysisRepository } from '../repositories/analysis';
import { AnalysisRequestDto, AnalysisResponseDto, ThreatActorMatch, PredictedNextStep } from '../types/dtos/analysis';

export class AnalysisService {
  private repository: AnalysisRepository;

  constructor(repository: AnalysisRepository) {
    this.repository = repository;
  }

  /**
   * Lefuttatja a hasonlósági vizsgálatot és előállítja az OODA döntéstámogató riportot.
   */
  public async analyzeIncident(request: AnalysisRequestDto): Promise<AnalysisResponseDto> {
    const actorContexts = await this.repository.getThreatActorContexts();

    const matches: ThreatActorMatch[] = [];

    for (const actor of actorContexts) {
      // 1. Átfedések keresése
      const matchedSectors = request.targetSector 
        ? actor.targetedSectors.filter(s => s.toLowerCase().includes(request.targetSector!.toLowerCase()))
        : [];
      
      const matchedTechniques = request.observedTechniqueIds 
        ? actor.usedTechniques.filter(t => request.observedTechniqueIds!.includes(t))
        : [];

      const matchedMalware = request.observedMalwareNames
        ? actor.usedMalware.filter(m => request.observedMalwareNames!.some(reqM => m.toLowerCase().includes(reqM.toLowerCase())))
        : [];

      // 2. Súlyozott hasonlósági pontszám (Egyszerűsített baseline pontozó)
      // Súlyok: Technika (40%), Malware (35%), Szektor (25%)
      let score = 0;
      let totalWeights = 0;

      if (request.observedTechniqueIds && request.observedTechniqueIds.length > 0) {
        totalWeights += 0.4;
        score += (matchedTechniques.length / request.observedTechniqueIds.length) * 0.4;
      }
      if (request.observedMalwareNames && request.observedMalwareNames.length > 0) {
        totalWeights += 0.35;
        score += (matchedMalware.length / request.observedMalwareNames.length) * 0.35;
      }
      if (request.targetSector) {
        totalWeights += 0.25;
        score += (matchedSectors.length > 0 ? 1 : 0) * 0.25;
      }

      const normalizedScore = totalWeights > 0 ? Number((score / totalWeights).toFixed(2)) : 0;

      if (normalizedScore > 0 || totalWeights === 0) {
        matches.push({
          stixId: actor.stixId,
          name: actor.name,
          aliases: actor.aliases,
          primaryMotivation: actor.motivation,
          similarityScore: normalizedScore,
          matchedTechniques,
          matchedMalware,
          matchedSectors,
        });
      }
    }

    // Csökkenő pontszám szerinti rendezés
    matches.sort((a, b) => b.similarityScore - a.similarityScore);

    // 3. Predikció: A legvalószínűbb támadó további ismert technikái és azok mitigációi
    const predictedSteps: PredictedNextStep[] = [];
    if (matches.length > 0 && matches[0].similarityScore > 0) {
      const topActor = actorContexts.find(a => a.stixId === matches[0].stixId);
      if (topActor) {
        // Olyan technikák, amiket a támadó használ, de a felhasználó még nem észlelt
        const unobservedTechniques = topActor.usedTechniques.filter(
          t => !(request.observedTechniqueIds || []).includes(t)
        );

        for (const techId of unobservedTechniques.slice(0, 3)) {
          const mitigationData = await this.repository.getMitigationsForTechnique(techId);
          if (mitigationData) {
            predictedSteps.push({
              techniqueId: mitigationData.techniqueId,
              techniqueName: mitigationData.techniqueName,
              tactic: mitigationData.tactics[0] || 'unknown',
              confidence: Number((matches[0].similarityScore * 0.85).toFixed(2)),
              recommendedMitigations: mitigationData.mitigations,
            });
          }
        }
      }
    }

    return {
      timestamp: new Date().toISOString(),
      inputSummary: request,
      attributionRanking: matches,
      predictedNextSteps: predictedSteps,
    };
  }
}