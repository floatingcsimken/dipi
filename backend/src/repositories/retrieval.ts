import { Driver } from 'neo4j-driver';
import {
  RetrievalParamsDto,
  TechniqueMitigationResultDto,
} from '../types/dtos/retrieval';

export class RetrievalRepository {
  constructor(private driver: Driver) {}

  /**
   * Determinisztikus mitigáció-lekérdezés technikák, szoftverek és platform-szűrők alapján.
   */
  public async getMitigations(params: RetrievalParamsDto): Promise<TechniqueMitigationResultDto[]> {
    const session = this.driver.session();

    const cypherParams = {
      techniqueIds: params.techniqueIds || [],
      softwareNames: params.softwareNames || [],
      platforms: params.platforms || [],
    };

    const query = `
      // 1. Közvetlen technikák összegyűjtése
      OPTIONAL MATCH (directTech:AttackPattern)
      WHERE directTech.externalId IN $techniqueIds

      // 2. Szoftverekhez kapcsolt technikák összegyűjtése
      OPTIONAL MATCH (s:Software)-[:USES]->(softTech:AttackPattern)
      WHERE s.name IN $softwareNames OR s.externalId IN $softwareNames

      // 3. Egyesítés, null-szűrés és platform-szűrés egyetlen WHERE blokkban
      WITH collect(DISTINCT directTech) + collect(DISTINCT softTech) AS allTechniques
      UNWIND allTechniques AS tech
      WITH DISTINCT tech
      WHERE tech IS NOT NULL
        AND (size($platforms) = 0 OR ANY(p IN coalesce(tech.x_mitre_platforms, []) WHERE p IN $platforms))

      // 4. Mitigációk (:MITIGATES) feloldása
      OPTIONAL MATCH (coa:CourseOfAction)-[:MITIGATES]->(tech)

      RETURN 
        tech.externalId AS techniqueId,
        tech.name AS techniqueName,
        coalesce(tech.x_mitre_platforms, []) AS platforms,
        collect(DISTINCT CASE 
          WHEN coa IS NOT NULL THEN {
            mitigationId: coalesce(coa.externalId, coa.stixId),
            name: coa.name,
            description: coa.description
          } 
          ELSE null 
        END) AS rawMitigations
    `;

    try {
      const result = await session.run(query, cypherParams);

      return result.records.map((record) => {
        const rawMitigations = record.get('rawMitigations') as (any | null)[];
        const mitigations = rawMitigations.filter((m) => m !== null);

        return {
          techniqueId: record.get('techniqueId'),
          techniqueName: record.get('techniqueName'),
          platforms: record.get('platforms'),
          mitigations,
        };
      });
    } finally {
      await session.close();
    }
  }
}