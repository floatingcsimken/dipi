// backend/src/config/paths.ts
import path from 'path';

// A projekt gyökere a fájlrendszerben a futó modulhoz képest
const DATA_ROOT_DIR = path.resolve(__dirname, '../../data');

// 2. Almappák nevei – HA VÁLTOZIK A STRUKTÚRA, CSAK ITT ÍROD ÁT:
export const SUBDIRS = {
  REFERENCE: 'reference',
  THREATS: 'threat-intelligence',
} as const;

// 3. Fájlnevek definiálása
export const FILE_NAMES = {
  // Referencia fájlok
  LOCATIONS: 'locations.json',
  SECTORS: 'sectors.json',
  ORGANIZATIONS: 'organizations.json',
  ATTACK_PATTERNS: 'attackPatterns.json',

  // Fenyegetési fájlok
  THREAT_ACTORS: 'threatActors.json',
  MALWARE: 'malware.json',
  VULNERABILITIES: 'vulnerabilities.json',
  INDICATORS: 'indicators.json',
  COURSES_OF_ACTION: 'coursesOfAction.json',
  RELATIONSHIPS: 'relationships.json',
} as const;

// 4. Dinamikus segédfüggvény vagy összefűzött registry
export const DATA_PATHS = {
  REFERENCE: {
    LOCATIONS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.LOCATIONS),
    SECTORS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.SECTORS),
    ORGANIZATIONS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.ORGANIZATIONS),
    ATTACK_PATTERNS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.ATTACK_PATTERNS),
  },
  THREATS: {
    THREAT_ACTORS: path.join(DATA_ROOT_DIR, SUBDIRS.THREATS, FILE_NAMES.THREAT_ACTORS),
    MALWARE: path.join(DATA_ROOT_DIR, SUBDIRS.THREATS, FILE_NAMES.MALWARE),
    VULNERABILITIES: path.join(DATA_ROOT_DIR, SUBDIRS.THREATS, FILE_NAMES.VULNERABILITIES),
    INDICATORS: path.join(DATA_ROOT_DIR, SUBDIRS.THREATS, FILE_NAMES.INDICATORS),
    COURSES_OF_ACTION: path.join(DATA_ROOT_DIR, SUBDIRS.THREATS, FILE_NAMES.COURSES_OF_ACTION),
    RELATIONSHIPS: path.join(DATA_ROOT_DIR, SUBDIRS.THREATS, FILE_NAMES.RELATIONSHIPS),
  },
} as const;