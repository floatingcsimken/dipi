import dotenv from 'dotenv';
import { getDriver, closeDriver } from '../config/database';
import { DATA_PATHS } from '../config/paths';
import { BaseNodeSeeder } from './strategies/baseNodeSeeder';
import { OrganizationSeeder } from './strategies/organizationSeeder';
import { AttackPatternSeeder } from './strategies/attackPatternSeeder';
import { RelationshipSeeder } from './strategies/relationshipSeeder';

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
    new AttackPatternSeeder(driver),

    // Fenyegetési adatok
    new BaseNodeSeeder(driver, 'ThreatActor', DATA_PATHS.THREATS.THREAT_ACTORS, 'Threat Actors'),
    new BaseNodeSeeder(driver, 'Malware', DATA_PATHS.THREATS.MALWARE, 'Malware & Tools'),
    new BaseNodeSeeder(driver, 'Vulnerability', DATA_PATHS.THREATS.VULNERABILITIES, 'Vulnerabilities (CVE)'),
    new BaseNodeSeeder(driver, 'Indicator', DATA_PATHS.THREATS.INDICATORS, 'Indicators (IoC)'),
    new BaseNodeSeeder(driver, 'CourseOfAction', DATA_PATHS.THREATS.COURSES_OF_ACTION, 'Courses of Action'),

    // STIX Relációk
    new RelationshipSeeder(driver),
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