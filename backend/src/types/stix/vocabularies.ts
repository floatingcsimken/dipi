/**
 * @file vocabularies.ts
 * @description STIX 2.1 Open Vocabulary (OV) típusdefiníciók.
 * Az Open Vocabulary-k olyan előre definiált értékek gyűjteményei, amelyek biztosítják
 * a szabványosított kiberfenyegetettségi adateszcserét a rendszerek között.
 * 
 * @see STIX 2.1 Specification - Section 10 (Open Vocabularies):
 * https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_3v9937xws13e
 */

/** 
 * Identity Class OV - Az identitás típusát (osztályát) írja le.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_vocab-identity-class
 */
export type IdentityClassOV =
  | 'individual'
  | 'group'
  | 'organization'
  | 'class'
  | 'sector'
  | 'unknown';

/** 
 * Threat Actor Type OV - A fenyegetési szereplő (támadó csoport) indíttatását/típusát írja le.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_vocab-threat-actor-type
 */
export type ThreatActorTypeOV =
  | 'activist'
  | 'competitor'
  | 'crime-syndicate'
  | 'criminal'
  | 'hacker'
  | 'hacktivist'
  | 'insider-accidental'
  | 'insider-disgruntled'
  | 'nation-state'
  | 'sensationalist'
  | 'spy'
  | 'terrorist'
  | 'unknown';

/** 
 * Malware Type OV - A kártékony szoftver (kártékony kód) működési kategóriája.
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_vocab-malware-type
 */
export type MalwareTypeOV =
  | 'adware'
  | 'backdoor'
  | 'bot'
  | 'ddos'
  | 'dropper'
  | 'exploit-kit'
  | 'keylogger'
  | 'ransomware'
  | 'remote-access-trojan'
  | 'resource-exploitation'
  | 'rogue-security-software'
  | 'rootkit'
  | 'screen-capture'
  | 'spyware'
  | 'trojan'
  | 'unknown'
  | 'virus'
  | 'wiper'
  | 'worm';

/** 
 * Pattern Type OV - Az indikátorokban használt mintaleíró nyelv típusa (pl. STIX Pattern, YARA, Sigma).
 * @see https://docs.oasis-open.org/cti/stix/v2.1/cs02/stix-v2.1-cs02.html#_vocab-pattern-type
 */
export type PatternTypeOV =
  | 'stix'
  | 'pcre'
  | 'sigma'
  | 'snort'
  | 'suricata'
  | 'yara';