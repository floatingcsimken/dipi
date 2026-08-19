/**
 * @file bundle.ts
 * @description STIX 2.1 Csomagoló és Aggregációs típusdefiníciók.
 * 
 * Ez a modul definiálja a STIX tartományi (SDO) és relációs (SRO) entitások
 * diszkriminált unióit (Discriminated Unions), valamint a szabványos STIX Bundle konténert,
 * amely az adatok fájlrendszerbeli és hálózati cseréjének alapegysége.
 * 
 * @see STIX 2.1 Specification - Section 2.1 (STIX Bundle Objects):
 * https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_21-stix-bundle-object
 */

import { 
  StixLocation, 
  StixIdentity, 
  StixAttackPattern 
} from './sdo/reference';

import { 
  StixThreatActor, 
  StixMalware, 
  StixVulnerability, 
  StixIndicator, 
  StixCourseOfAction, 
  StixCampaign 
} from './sdo/threats';

import { StixRelationship } from './sro/relationship';

/**
 * StixSDO - STIX Domain Objects Discriminated Union.
 * 
 * Az összes támogatott STIX 2.1 tartományi entitást összefogó unió típus.
 * A `type` mező alapján a TypeScript fordító automatikusan szűkíti a típust
 * a konkrét interfészre (pl. `type === 'threat-actor'` esetén `StixThreatActor`).
 */
export type StixSDO = 
  | StixLocation
  | StixIdentity
  | StixAttackPattern
  | StixThreatActor
  | StixMalware
  | StixVulnerability
  | StixIndicator
  | StixCourseOfAction
  | StixCampaign;

/**
 * StixSRO - STIX Relationship Objects Union.
 * 
 * A STIX 2.1 kapcsolati objektumokat összefogó típus.
 * Jelenleg a szabványos `StixRelationship` entitást fedi le, de későbbi bővítéskor
 * ide tartozhat például a `StixSighting` is.
 */
export type StixSRO = StixRelationship;

/**
 * StixObject - Univerzális STIX Objektum Unió.
 * 
 * Bármilyen érvényes STIX 2.1 entitást reprezentál, legyen az tartományi csomópont (SDO)
 * vagy gráfbeli élkapcsolat (SRO).
 */
export type StixObject = StixSDO | StixSRO;

/**
 * StixBundle - A STIX 2.1 JSON csomagoló konténere.
 * 
 * Nem önálló STIX Domain Object, hanem egy burkoló struktúra, amely egyetlen
 * fájlban vagy API válaszban több STIX objektumot és azok relációit továbbítja.
 * 
 * @property type Mindig 'bundle' literál érték.
 * @property id Egyedi csomagazonosító (pl. "bundle--00000000-0000-0000-0000-000000000000").
 * @property objects A csomagban található STIX entitások (SDO és SRO) tömbje.
 */
export interface StixBundle {
  type: 'bundle' | string;
  id: string;
  objects: StixObject[];
}