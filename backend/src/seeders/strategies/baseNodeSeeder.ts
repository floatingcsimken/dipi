import { Driver } from 'neo4j-driver';
import { JsonLoader } from '../core/jsonLoader';
import { Neo4jBatchWriter } from '../core/neo4jBatchWriter';
import { StixSDO } from '../../types/stix/stixTypes';

export class BaseNodeSeeder {
  protected driver: Driver;
  protected writer: Neo4jBatchWriter;
  protected label: string;
  protected filePath: string;
  protected displayName: string;

  constructor(driver: Driver, label: string, filePath: string, displayName: string) {
    this.driver = driver;
    this.writer = new Neo4jBatchWriter(driver);
    this.label = label;
    this.filePath = filePath;
    this.displayName = displayName;
  }

  public async seed(): Promise<void> {
    const items = JsonLoader.loadObjects<StixSDO>(this.filePath);
    if (items.length === 0) return;

    console.log(`⏳ [Seeding] ${this.displayName} (${items.length} elem)...`);
    await this.writer.mergeNodes(this.label, items);
    console.log(`✅ [OK] ${this.displayName} betöltve.`);
  }
}