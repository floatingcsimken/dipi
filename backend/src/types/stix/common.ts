/**
 * @file common.ts
 * @description STIX 2.1 közös alaptulajdonságok és külső hivatkozási struktúrák.
 * Minden STIX Domain Object (SDO) és Relationship Object (SRO) ezekre az alapokra épül.
 * 
 * @see STIX 2.1 Specification - Section 3.1 (Common Properties):
 * https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_31-common-properties
 */

/**
 * Külső hivatkozási objektum (pl. CVE azonosító vagy MITRE ATT&CK technika kód).
 * A STIX 2.1-ben a külső szabványazonosítókat nem dedikált mezőkben, hanem ebben a tömbben tároljuk.
 * 
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_type-external-reference
 */
export interface StixExternalReference {
  source_name: string; // Hivatkozott forrás neve, pl. "cve" vagy "mitre-attack"
  description?: string; // Opcionális szöveges magyarázat
  url?: string; // Hivatalos dokumentációs hivatkozás
  external_id?: string; // Szabványos azonosító kód (pl. "CVE-2026-1234" vagy "T1566")
}

/**
 * Közös STIX Alapobjektum (StixBaseObject).
 * Ezt az interfészt terjeszti ki az összes konkrét STIX Domain Object (SDO).
 */
export interface StixBaseObject {
  stix_id: string; // STIX szabványos azonosító (pl. "location--3a8f...")
  type: string; // Az objektum STIX típusa (pl. "location", "threat-actor")
  name: string; // Az objektum ember által olvasható elnevezése
  description?: string; // Részletes leírás
  created?: string; // ISO 8601 formátumú időbélyeg a létrehozásról
  modified?: string; // ISO 8601 formátumú időbélyeg az utolsó módosításról
  external_references?: StixExternalReference[]; // Külső szabványhivatkozások tömbje
}