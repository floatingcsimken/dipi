/**
 * @file metadata.ts
 * @description Neo4j adatbázis lekérdezések a rendszerben elérhető STIX metaadatok kinyerésére.
 */

import type { Driver, Session } from 'neo4j-driver';

export interface TechniqueMetadata {
  id: string;
  name: string;
}

export class MetadataRepository {
  constructor(private readonly driver: Driver) {}

  /**
   * Lekéri a létező Identity csomópontok egyedi neveit ábécérendben.
   */
  async getAvailableSectors(): Promise<string[]> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (i:Identity)
        WHERE i.name IS NOT NULL
        RETURN DISTINCT i.name AS name
        ORDER BY name ASC
      `);
      return result.records.map((rec) => rec.get('name') as string);
    } finally {
      await session.close();
    }
  }

  /**
   * Lekéri a létező Malware csomópontok egyedi neveit ábécérendben.
   */
  async getAvailableMalware(): Promise<string[]> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (m:Malware)
        WHERE m.name IS NOT NULL
        RETURN DISTINCT m.name AS name
        ORDER BY name ASC
      `);
      return result.records.map((rec) => rec.get('name') as string);
    } finally {
      await session.close();
    }
  }

  /**
   * Lekéri a létező AttackPattern csomópontok azonosítóit és neveit ábécérendben.
   */
  async getAvailableTechniques(): Promise<TechniqueMetadata[]> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (a:AttackPattern)
        WHERE a.name IS NOT NULL
        RETURN coalesce(a.stixId, a.stix_id, a.id, 'N/A') AS id, a.name AS name
        ORDER BY a.name ASC
      `);
      return result.records.map((rec) => ({
        id: rec.get('id') as string,
        name: rec.get('name') as string,
      }));
    } finally {
      await session.close();
    }
  }
}