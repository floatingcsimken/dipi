/**
 * @file reference.ts
 * @description STIX 2.1 Domain Objects (SDO) - Referencia és Keretrendszer entitások.
 * Ezek az objektumok képezik az elemzések alapját (Országok, Szervezetek/Szektorok, MITRE ATT&CK technikák).
 * 
 * @see STIX 2.1 Specification - Section 4 (STIX Domain Objects):
 * https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_4-stix-domain-objects
 */

import { StixBaseObject } from '../common';
import { IdentityClassOV } from '../vocabularies';

/**
 * Location SDO - Földrajzi helyszínt (országot, régiót, várost) ír le.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_47-location
 */
export interface StixLocation extends StixBaseObject {
  type: 'location';
  country: string; // ISO 3166-1 alpha-2 kétbetűs országkód (pl. 'HU', 'RU')
  region?: string; // Földrajzi régió (pl. 'eastern-europe')
  city?: string; // Város (pl. 'Budapest', 'Moscow')
}

/**
 * Identity SDO - Egyént, céget, szervezetet vagy szektort ír le.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_45-identity
 */
export interface StixIdentity extends StixBaseObject {
  type: 'identity';
  identity_class: IdentityClassOV; // Identitás kategóriája az IdentityClassOV szótárból
  sectors?: string[]; // Célágazatok / szektorok (pl. ['healthcare', 'financial-services'])
}

/**
 * Attack Pattern SDO - A támadók által használt taktikát, technikát vagy altechnikát írja le (MITRE ATT&CK).
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_41-attack-pattern
 */
export interface StixAttackPattern extends StixBaseObject {
  type: 'attack-pattern';
  external_id: string; // MITRE ATT&CK kód (pl. 'T1566' vagy 'T1566.001')
  kill_chain_phases: string[]; // Taktikai fázisok (pl. ['initial-access', 'execution'])
  is_subtechnique: boolean; // Jelzi, hogy ez a technika egy altechnika-e
  parent_external_id?: string; // Altechnika esetén a szülő fő technika MITRE kódja
}