import { Driver } from 'neo4j-driver';
import { JsonLoader } from '../core/jsonLoader';
import { DATA_PATHS } from '../../config/paths';
import { StixSRO } from '../../types/stix/stixTypes';

export class RelationshipSeeder {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  public async seed(): Promise<void> {
    const relationships = JsonLoader.loadObjects<StixSRO>(DATA_PATHS.THREATS.RELATIONSHIPS);
    if (relationships.length === 0) return;

    console.log(`⏳ [Seeding] STIX Relationships (${relationships.length} kapcsolat)...`);
    const session = this.driver.session();

    try {
      for (const rel of relationships) {
        const relType = rel.relationship_type.toUpperCase().replace(/-/g, '_');
        const query = `
          MATCH (src { stix_id: $source_ref })
          MATCH (tgt { stix_id: $target_ref })
          MERGE (src)-[r:${relType} { stix_id: $stix_id }]->(tgt)
          ON CREATE SET 
            r.relationship_type = $relationship_type,
            r.description = $description,
            r.created_at = timestamp()
          ON MATCH SET 
            r.description = $description,
            r.updated_at = timestamp()
        `;

        await session.run(query, {
          stix_id: rel.stix_id,
          source_ref: rel.source_ref,
          target_ref: rel.target_ref,
          relationship_type: rel.relationship_type,
          description: rel.description || '',
        });
      }
      console.log(`✅ [OK] STIX Relationships felépítve.`);
    } finally {
      await session.close();
    }
  }
}