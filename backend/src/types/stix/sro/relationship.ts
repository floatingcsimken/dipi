/**
 * @file relationship.ts
 * @description STIX 2.1 Relationship Objects (SRO) - Irányított kapcsolatok a gráfban.
 * A STIX 2.1-ben a csomópontok közötti viszonyok önálló, saját azonosítóval rendelkező objektumok.
 * 
 * @see STIX 2.1 Specification - Section 5.1 (Relationship):
 * https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_51-relationship
 */

/**
 * StixRelationship SRO - Irányított kapcsolat két tetszőleges STIX objektum között.
 */
export interface StixRelationship {
  stix_id: string; // Szabványos kapcsolat azonosító (pl. "relationship--9000...")
  type: 'relationship';
  relationship_type:
    | 'uses' // Pl. ThreatActor -> Malware / AttackPattern
    | 'targets' // Pl. ThreatActor -> Identity / Sector
    | 'located-at' // Pl. Identity -> Location
    | 'part-of' // Pl. Identity -> Identity (Sector)
    | 'subtechnique-of' // Pl. AttackPattern (sub) -> AttackPattern (parent)
    | 'mitigates' // Pl. CourseOfAction -> AttackPattern
    | 'indicates'; // Pl. Indicator -> ThreatActor / Malware
  source_ref: string; // Forrás objektum STIX ID-ja
  target_ref: string; // Cél objektum STIX ID-ja
  description?: string;
  created?: string;
  modified?: string;
}