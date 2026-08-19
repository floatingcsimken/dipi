/**
 * @file analysis.ts
 * @description Cypher lekérdezések a fenyegetési adatok és kapcsolatok kinyerésére a Neo4j-ből.
 */

import { Driver } from 'neo4j-driver';

export interface ThreatActorGraphContext {
  stixId: string;
  name: string;
  aliases: string[];
  motivation?: string;
  targetedSectors: string[];
  usedMalware: string[];
  usedTechniques: string[];
}

export class AnalysisRepository {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  /**
   * Kinyeri az összes Threat Actor teljes profilját és összefüggés-hálóját a gráfból.
   */
  public async getThreatActorContexts(): Promise<ThreatActorGraphContext[]> {
    const session = this.driver.session();
    const query = `
      MATCH (ta:ThreatActor)
      OPTIONAL MATCH (ta)-[:TARGETS]->(target:Identity)
      OPTIONAL MATCH (ta)-[:USES]->(m:Malware)
      OPTIONAL MATCH (ta)-[:USES]->(apDirect:AttackPattern)
      OPTIONAL MATCH (m)-[:USES]->(apIndirect:AttackPattern)
      
      RETURN 
        ta.stix_id AS stixId,
        ta.name AS name,
        coalesce(ta.aliases, []) AS aliases,
        ta.primary_motivation AS motivation,
        collect(DISTINCT target.name) AS targetedSectors,
        collect(DISTINCT m.name) AS usedMalware,
        collect(DISTINCT coalesce(apDirect.external_id, apIndirect.external_id)) AS usedTechniques
    `;

    try {
      const result = await session.run(query);
      return result.records.map((record) => ({
        stixId: record.get('stixId'),
        name: record.get('name'),
        aliases: record.get('aliases'),
        motivation: record.get('motivation') || undefined,
        targetedSectors: record.get('targetedSectors').filter(Boolean),
        usedMalware: record.get('usedMalware').filter(Boolean),
        usedTechniques: record.get('usedTechniques').filter(Boolean),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Egy MITRE technikaazonosítóhoz lekéri a technikát és a hozzátartozó védekezési lépéseket (CourseOfAction).
   */
  public async getMitigationsForTechnique(techniqueId: string) {
    const session = this.driver.session();
    const query = `
      MATCH (ap:AttackPattern)
      WHERE ap.external_id = $techniqueId OR ap.name = $techniqueId
      OPTIONAL MATCH (coa:CourseOfAction)-[:MITIGATES]->(ap)
      RETURN 
        ap.external_id AS techniqueId,
        ap.name AS techniqueName,
        ap.kill_chain_phases AS tactics,
        collect(DISTINCT {
          stixId: coa.stix_id,
          name: coa.name,
          description: coa.description
        }) AS mitigations
    `;

    try {
      const result = await session.run(query, { techniqueId });
      if (result.records.length === 0) return null;
      
      const record = result.records[0];
      return {
        techniqueId: record.get('techniqueId') || techniqueId,
        techniqueName: record.get('techniqueName') || 'Ismeretlen technika',
        tactics: record.get('tactics') || [],
        mitigations: record.get('mitigations').filter((m: any) => m.stixId !== null),
      };
    } finally {
      await session.close();
    }
  }
}