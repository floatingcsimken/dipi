import { Driver } from 'neo4j-driver';
import { JsonLoader } from '../../core/jsonLoader';
import { Neo4jBatchWriter } from '../../core/neo4jBatchWriter';

export class RelationshipSeeder {
  private writer: Neo4jBatchWriter;
  private filePath: string;

  constructor(driver: Driver, filePath: string) {
    this.writer = new Neo4jBatchWriter(driver);
    this.filePath = filePath;
  }

  public async seed(): Promise<void> {
    console.log('⏳ [Seeding] MITRE STIX kapcsolatok betöltése...');

    // Csak a relationship típusú objektumokat kérjük le
    const relationships = JsonLoader.loadStixObjects<any>(this.filePath, 'relationship');

    console.log(`🔍 [Seeding] Talált kapcsolatok száma: ${relationships.length}`);

    if (relationships.length === 0) {
      console.log('⚠️ [Seeding] Nem található kapcsolat.');
      return;
    }

    await this.writer.mergeRelationships(relationships);
    console.log('✅ [OK] MITRE STIX kapcsolatok sikeresen felépítve a gráfban.');
  }
}