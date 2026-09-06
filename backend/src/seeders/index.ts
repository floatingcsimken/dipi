import dotenv from 'dotenv';
import { getDriver, closeDriver } from '../config/database';
import { DATA_PATHS } from '../config/paths';
import { BaseNodeSeeder } from './strategies/baseNodeSeeder';
import { OrganizationSeeder } from './strategies/custom/organizationSeeder';

dotenv.config();

async function runSeed() {
  console.log('🚀 [CTI Seeder] Adatbázis inicializálása...\n');
  const driver = getDriver();

  // 1. Definiáljuk a betöltési sorrendet
  const seeders = [
    // Referencia adatok
    new BaseNodeSeeder(driver, 'Location', DATA_PATHS.REFERENCE.LOCATIONS, 'Locations'),
    new BaseNodeSeeder(driver, 'Identity', DATA_PATHS.REFERENCE.SECTORS, 'Sectors'),
    new OrganizationSeeder(driver),

  ];

  try {
    for (const seeder of seeders) {
      await seeder.seed();
    }
    console.log('\n🎉 [SUCCESS] A teljes STIX 2.1 tudásgráf sikeresen felépült a Neo4j-ben!');
  } catch (error) {
    console.error('\n💥 [ERROR] Hiba történt a seedelés közben:', error);
    process.exit(1);
  } finally {
    await closeDriver();
  }
}

runSeed();