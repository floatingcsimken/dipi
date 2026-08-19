import { Driver } from 'neo4j-driver';

export class Neo4jBatchWriter {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

   /**
   * Neo4j-kompatibilis formátumra hozza az objektumokat.
   * A beágyazott objektumokat és objektumtömböket JSON stringgé alakítja.
   */
  private sanitizeItem(item: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        // Ha primitívek tömbje (pl. string[], number[]), a Neo4j simán elfogadja
        const isPrimitiveArray = value.every(
          (el) => typeof el === 'string' || typeof el === 'number' || typeof el === 'boolean'
        );

        if (isPrimitiveArray) {
          sanitized[key] = value;
        } else {
          // Ha objektumok tömbje (pl. external_references: [{...}]), szerializáljuk JSON stringgé
          sanitized[key] = JSON.stringify(value);
        }
      } else if (typeof value === 'object') {
        // Ha beágyazott objektum / Map, szerializáljuk JSON stringgé
        sanitized[key] = JSON.stringify(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Csomópontok kötegelt mentése / frissítése stix_id alapján.
   */
  public async mergeNodes(label: string, items: Record<string, any>[]): Promise<void> {
    if (items.length === 0) return;

    // Minden bejövő elemet átfuttatunk a tisztítón
    const sanitizedBatch = items.map((item) => this.sanitizeItem(item));

    const session = this.driver.session();
    const query = `
      UNWIND $batch AS item
      MERGE (n:${label} { stix_id: item.stix_id })
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