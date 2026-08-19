/**
 * @file threats.ts
 * @description STIX 2.1 Domain Objects (SDO) - Operatív Fenyegetési és Reagálási entitások.
 * Az OODA / F3EAD műveleti hurok elemeit (APT csoportok, Kártevők, Sérülékenységek, Indikátorok, Válaszlépések) írja le.
 * 
 * @see STIX 2.1 Specification - Section 4 (STIX Domain Objects):
 * https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_4-stix-domain-objects
 */

import { StixBaseObject } from '../common';
import { ThreatActorTypeOV, MalwareTypeOV, PatternTypeOV } from '../vocabularies';

/**
 * Threat Actor SDO - Kiberfenyegetési szereplő, APT csoport vagy hacktivista entitás.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_415-threat-actor
 */
export interface StixThreatActor extends StixBaseObject {
  type: 'threat-actor';
  threat_actor_types: ThreatActorTypeOV[]; // Támadó típusa a ThreatActorTypeOV szótárból
  aliases?: string[]; // Ismert álnevek / egyéb megnevezések (pl. ['Cozy Bear', 'NOBELIUM'])
}

/**
 * Malware SDO - Kártékony kód, zsarolóvírus vagy támadói eszköz.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_48-malware
 */
export interface StixMalware extends StixBaseObject {
  type: 'malware';
  malware_types: MalwareTypeOV[]; // Kártevő típusa a MalwareTypeOV szótárból
  is_family: boolean; // Jelzi, hogy kártevőcsaládról vagy konkrét példányról van-e szó
}

/**
 * Vulnerability SDO - Szoftveres vagy hardveres sérülékenység (CVE).
 * A pontos CVE-azonosítót az external_references mezőben tároljuk ("cve" source_name-mel).
 * 
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_417-vulnerability
 */
export interface StixVulnerability extends StixBaseObject {
  type: 'vulnerability';
}

/**
 * Indicator SDO - Észlelt gyanús jel vagy hálózati adatminta (OODA - Observe fázis).
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_46-indicator
 */
export interface StixIndicator extends StixBaseObject {
  type: 'indicator';
  pattern_type: PatternTypeOV; // Mintaleíró nyelv típusa a PatternTypeOV szótárból
  pattern: string; // Szabályos STIX/YARA/Sigma keresési minta (pl. "[domain-name:value = 'bad.com']")
}

/**
 * Course of Action SDO - Meghozott védelmi döntés vagy válaszlépés (OODA - Decide / Act fázis).
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_43-course-of-action
 */
export interface StixCourseOfAction extends StixBaseObject {
  type: 'course-of-action';
  action_type?: string; // Intézkedés típusa (pl. 'remediation', 'prevention')
}

/**
 * Campaign SDO - Egy adott fenyegetési kampányt ír le, amelyhez több támadó, kártevő és sérülékenység is kapcsolódhat.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_414-campaign
 */
export interface StixCampaign extends StixBaseObject {
    type: 'campaign';
    aliases?: string[]; // Ismert kampánynevek / álnevek
    first_seen?: string; // ISO 8601 formátumú időbélyeg a kampány első észleléséről
    last_seen?: string; // ISO 8601 formátumú időbélyeg a kampány utolsó észleléséről
    objective: string; // A kampány célja vagy motivációja (pl. 'espionage', 'financial gain')
}