import { Driver } from 'neo4j-driver';
import { JsonLoader } from '../core/jsonLoader';
import { Neo4jBatchWriter } from '../core/neo4jBatchWriter';
import { StixSDO } from '../../types/stix/stixTypes';
import { EmbeddingService } from '../../services/embedding';

export class BaseNodeSeeder {
  protected driver: Driver;
  protected writer: Neo4jBatchWriter;
  protected label: string;
  protected filePath: string;
  protected displayName: string;
  protected stixType?: string | string[];
  protected enableEmbedding: boolean;
  protected embeddingService: EmbeddingService;

  constructor(
    driver: Driver, 
    label: string, 
    filePath: string, 
    displayName: string, 
    stixType?: string | string[],
    enableEmbedding: boolean = false
  ) {
    this.driver = driver;
    this.writer = new Neo4jBatchWriter(driver);
    this.label = label;
    this.filePath = filePath;
    this.displayName = displayName;
    this.stixType = stixType;
    this.enableEmbedding = enableEmbedding;
    this.embeddingService = new EmbeddingService();
  }

  public async seed(): Promise<void> {
    let items: StixSDO[] = [];
    if (this.stixType) {
      items = JsonLoader.loadStixObjects<StixSDO>(this.filePath, this.stixType);
    } else {
      items = JsonLoader.loadBundleObjects(this.filePath);
    }
    if (items.length === 0) return;

    console.log(`⏳ [Seeding] ${this.displayName} (${items.length} elem)...`);

    // Ha be van kapcsolva az embedding (pl. AttackPattern-eknél)
    if (this.enableEmbedding && this.label === 'AttackPattern') {
      console.log(`🧠 [Embedding] Vektorok generálása az Ollama (nomic-embed-text) segítségével...`);
      for (const item of items) {
        if (item.description) {
          const textToEmbed = `${item.name}: ${item.description}`;
          try {
            // Hozzáadjuk dinamikusan az embedding tulajdonságot az objektumhoz
            (item as any).embedding = await this.embeddingService.generateEmbedding(textToEmbed);
          } catch (e) {
            console.warn(`⚠️ Nem sikerült embeddinget generálni ehhez: ${item.name}`);
          }
        }
      }
    }

    await this.writer.mergeNodes(this.label, items);
    console.log(`✅ [OK] ${this.displayName} betöltve.`);
  }
}