// backend/src/config/paths.ts
import path from 'path';

// A projekt gyökere a fájlrendszerben a futó modulhoz képest
const DATA_ROOT_DIR = path.resolve(__dirname, '../../data');

// 2. Almappák nevei – HA VÁLTOZIK A STRUKTÚRA, CSAK ITT ÍROD ÁT:
export const SUBDIRS = {
  REFERENCE: 'reference',
} as const;

// 3. Fájlnevek definiálása
export const FILE_NAMES = {
  // Referencia fájlok
  LOCATIONS: 'locations.json',
  SECTORS: 'sectors.json',
  ORGANIZATIONS: 'organizations.json',

} as const;

// 4. Dinamikus segédfüggvény vagy összefűzött registry
export const DATA_PATHS = {
  REFERENCE: {
    LOCATIONS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.LOCATIONS),
    SECTORS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.SECTORS),
    ORGANIZATIONS: path.join(DATA_ROOT_DIR, SUBDIRS.REFERENCE, FILE_NAMES.ORGANIZATIONS),
  },
  MITRE: {
    ENTERPRISE_ATTACK: path.join(DATA_ROOT_DIR, 'mitre/enterprise-attack.json'),
  },
} as const;