/**
 * @file threatIntel.ts
 * @description STIX 2.1 és MITRE ATT&CK domén entitás típusdefiníciók.
 */

/**
 * Rangsorolt fenyegető szereplő (Threat Actor) profilja és illesztési adatai.
 */
export interface ThreatActorMatch {
  /** A Threat Actor egyedi STIX 2.1 azonosítója */
  stixId: string;
  /** A csoport elsődleges elnevezése */
  name: string;
  /** Ismert alternatív elnevezések */
  aliases: string[];
  /** Normalizált hasonlósági egyezési pontszám [0.0 - 1.0] */
  similarityScore: number;
  /** Az incidens bemenetével megegyező támadási technikák */
  matchedTechniques: string[];
  /** Az incidens bemenetével megegyező kártevők */
  matchedMalware: string[];
  /** Az incidens bemenetével megegyező ágazati célpontok */
  matchedSectors: string[];
}

/**
 * Javasolt elhárítási intézkedés (Course of Action).
 */
export interface MitigationAction {
  /** A mitigációs entitás STIX azonosítója */
  mitigationId: string;
  /** Az elhárítási javaslat megnevezése */
  name: string;
  /** Az intézkedés részletes leírása */
  description: string;
}

/**
 * Gráfalapú modell által előrejelzett MITRE ATT&CK támadási lépés és mitigációi.
 */
export interface PredictedStep {
  /** A prediktált MITRE ATT&CK technika azonosítója (pl. 'T1059.001') */
  techniqueId: string;
  /** A prediktált technika neve */
  techniqueName: string;
  /** A Kill Chain fázis neve */
  phaseName: string;
  /** A predikció megbízhatósági pontszáma [0.0 - 1.0] */
  confidenceScore: number;
  /** A technikához rendelt elhárítási javaslatok */
  mitigations: MitigationAction[];
}