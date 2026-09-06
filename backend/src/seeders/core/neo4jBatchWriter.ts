import { Driver } from 'neo4j-driver';

export class Neo4jBatchWriter {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  /**
   * Kinyeri az ATT&CK azonosítót (pl. T1059, G0018) az external_references tömbből.
   */
  private extractExternalId(item: Record<string, any>): string | null {
    if (!Array.isArray(item.external_references)) {
      return item.externalId || item.external_id || null;
    }

    const mitreRef = item.external_references.find(
      (ref: any) => ref.source_name === 'mitre-attack' || ref.source_name === 'mitre-enterprise-attack'
    );

    return mitreRef?.external_id || item.externalId || item.external_id || null;
  }

  /**
   * Neo4j-kompatibilis formátumra hozza az objektumokat.
   * A beágyazott objektumokat és objektumtömböket JSON stringgé alakítja,
   * és normalizálja a stixId / externalId mezőket.
   */
  private sanitizeItem(item: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    // 1. Azonosítók egységesítése
    const stixId = item.id || item.stixId || item.stix_id;
    if (stixId) {
      sanitized.stixId = stixId;
    }

    const externalId = this.extractExternalId(item);
    if (externalId) {
      sanitized.externalId = externalId;
    }

    // 2. Mezők átmásolása és típus-tisztítása
    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (key === 'id' || key === 'stix_id') {
        continue;
      }

      if (Array.isArray(value)) {
        const isPrimitiveArray = value.every(
          (el) => typeof el === 'string' || typeof el === 'number' || typeof el === 'boolean'
        );

        if (isPrimitiveArray) {
          sanitized[key] = value;
        } else {
          sanitized[key] = JSON.stringify(value);
        }
      } else if (typeof value === 'object') {
        sanitized[key] = JSON.stringify(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Csomópontok kötegelt mentése / frissítése stixId alapján.
   */
  public async mergeNodes(label: string, items: Record<string, any>[]): Promise<void> {
    if (items.length === 0) return;

    const sanitizedBatch = items.map((item) => this.sanitizeItem(item));

    const session = this.driver.session();
    const query = `
      UNWIND $batch AS item
      MERGE (n:${label} { stixId: item.stixId })
      ON CREATE SET 
        n += item,
        n.created_at = timestamp()
      ON MATCH SET 
        n += item,
        n.updated_at = timestamp()
    `;

    try {
      await session.run(query, { batch: sanitizedBatch });
    } finally {
      await session.close();
    }
  }
}