import { Driver } from 'neo4j-driver';

export class Neo4jBatchWriter {
  private driver: Driver;
  private batchSize: number;

  constructor(driver: Driver, batchSize: number = 500) {
    this.driver = driver;
    this.batchSize = batchSize;
  }

  private extractExternalId(item: Record<string, any>): string | null {
    if (!Array.isArray(item.external_references)) {
      return item.externalId || item.external_id || null;
    }

    const mitreRef = item.external_references.find(
      (ref: any) => ref.source_name === 'mitre-attack' || ref.source_name === 'mitre-enterprise-attack'
    );

    return mitreRef?.external_id || item.externalId || item.external_id || null;
  }

  private sanitizeItem(item: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    const stixId = item.id || item.stixId || item.stix_id;
    if (stixId) {
      sanitized.stixId = stixId;
    }

    const externalId = this.extractExternalId(item);
    if (externalId) {
      sanitized.externalId = externalId;
    }

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
   * Csomópontok kötegelt mentése / frissítése stixId alapján, beállítható darabolással.
   */
  public async mergeNodes(label: string, items: Record<string, any>[]): Promise<void> {
    if (items.length === 0) return;

    const sanitizedBatch = items.map((item) => this.sanitizeItem(item));

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

    // 500-as darabokban dolgozzuk fel a tételeket
    for (let i = 0; i < sanitizedBatch.length; i += this.batchSize) {
      const chunk = sanitizedBatch.slice(i, i + this.batchSize);
      const session = this.driver.session();

      try {
        await session.run(query, { batch: chunk });
      } finally {
        await session.close();
      }
    }
  }

  /**
   * STIX kapcsolatok kötegelt mentése a forrás és cél stixId alapján.
   */
  public async mergeRelationships(relationships: Record<string, any>[]): Promise<void> {
    if (relationships.length === 0) return;

    // 1. Csak a teljes kapcsolatokat tartjuk meg
    const validRels = relationships.filter(
      (rel) => rel.source_ref && rel.target_ref && rel.relationship_type
    );

    // 2. Csoportosítás relationship_type szerint (hogy tiszta Neo4j éltípusok legyenek: :USES, :MITIGATES, stb.)
    const groupedByType: Record<string, any[]> = {};
    for (const rel of validRels) {
      const relType = rel.relationship_type.toUpperCase().replace(/-/g, '_');
      if (!groupedByType[relType]) {
        groupedByType[relType] = [];
      }
      groupedByType[relType].push({
        stixId: rel.id,
        source_ref: rel.source_ref,
        target_ref: rel.target_ref,
        description: rel.description || null,
      });
    }

    // 3. Írás típusonként, kötegelve
    for (const [type, rels] of Object.entries(groupedByType)) {
      const query = `
        UNWIND $batch AS rel
        MATCH (src) WHERE src.stixId = rel.source_ref
        MATCH (tgt) WHERE tgt.stixId = rel.target_ref
        MERGE (src)-[r:${type}]->(tgt)
        ON CREATE SET 
          r.stixId = rel.stixId,
          r.description = rel.description,
          r.created_at = timestamp()
      `;

      for (let i = 0; i < rels.length; i += this.batchSize) {
        const chunk = rels.slice(i, i + this.batchSize);
        const session = this.driver.session();
        try {
          await session.run(query, { batch: chunk });
        } finally {
          await session.close();
        }
      }
    }
  }
}