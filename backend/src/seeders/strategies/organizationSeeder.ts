import { Driver } from 'neo4j-driver';
import { BaseNodeSeeder } from './baseNodeSeeder';
import { DATA_PATHS } from '../../config/paths';

// 1. Organization Seeder: csomópontok + szektorhoz kapcsolás
export class OrganizationSeeder extends BaseNodeSeeder {
  constructor(driver: Driver) {
    super(driver, 'Identity', DATA_PATHS.REFERENCE.ORGANIZATIONS, 'Organizations');
  }

  public override async seed(): Promise<void> {
    await super.seed();

    const session = this.driver.session();
    try {
      const query = `
        MATCH (org:Identity { identity_class: 'organization' })
        WHERE org.sectors IS NOT NULL
        UNWIND org.sectors AS secName
        MATCH (sec:Identity { identity_class: 'sector' })
        WHERE secName IN sec.sectors
        MERGE (org)-[r:PART_OF]->(sec)
      `;
      await session.run(query);
    } finally {
      await session.close();
    }
  }
}