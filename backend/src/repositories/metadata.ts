/**
 * @file metadata.ts
 * @description Neo4j adatbázis lekérdezések a rendszerben elérhető STIX metaadatok kinyerésére.
 */

import type { Driver, Session } from 'neo4j-driver';
import type { MetadataDto } from '../types/dtos/metadata';

export class MetadataRepository {
  constructor(private readonly driver: Driver) {}

  public async getAgentMetadata(): Promise<MetadataDto> {
    const session: Session = this.driver.session();

    const query = `
      CALL {
        MATCH (a:AttackPattern)
        WHERE a.x_mitre_platforms IS NOT NULL
        UNWIND a.x_mitre_platforms AS p
        RETURN collect(DISTINCT p) AS platforms
      }
      CALL {
        MATCH (i:Identity)
        WHERE i.name IS NOT NULL
        RETURN collect(DISTINCT i.name) AS sectors
      }
      CALL {
        MATCH (s:Software)
        WHERE s.name IS NOT NULL
        RETURN collect(DISTINCT s.name) AS software
      }
      CALL {
        MATCH (t:AttackPattern)
        WHERE t.name IS NOT NULL
        RETURN collect(DISTINCT {
          id: coalesce(t.externalId, t.stixId),
          name: t.name
        }) AS techniques
      }
      RETURN platforms, sectors, software, techniques
    `;

    try {
      const result = await session.run(query);
      if (result.records.length === 0) {
        return { platforms: [], sectors: [], software: [], techniques: [] };
      }

      const rec = result.records[0];
      return {
        platforms: rec.get('platforms') || [],
        sectors: rec.get('sectors') || [],
        software: rec.get('software') || [],
        techniques: rec.get('techniques') || [],
      };
    } finally {
      await session.close();
    }
  }
}