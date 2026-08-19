import { Driver } from 'neo4j-driver';
import { BaseNodeSeeder } from './baseNodeSeeder';
import { DATA_PATHS } from '../../config/paths';

export class AttackPatternSeeder extends BaseNodeSeeder {
  constructor(driver: Driver) {
    super(driver, 'AttackPattern', DATA_PATHS.REFERENCE.ATTACK_PATTERNS, 'Attack Patterns (MITRE)');
  }

  public override async seed(): Promise<void> {
    await super.seed();

    const session = this.driver.session();
    try {
      const query = `
        MATCH (sub:AttackPattern)
        WHERE sub.is_subtechnique = true AND sub.parent_external_id IS NOT NULL
        MATCH (parent:AttackPattern { external_id: sub.parent_external_id })
        MERGE (sub)-[r:SUBTECHNIQUE_OF]->(parent)
      `;
      await session.run(query);
    } finally {
      await session.close();
    }
  }
}