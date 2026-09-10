import dotenv from 'dotenv';
import { getDriver, closeDriver } from '../config/database';
import { DATA_PATHS } from '../config/paths';
import { BaseNodeSeeder } from './strategies/baseNodeSeeder';
import { OrganizationSeeder } from './strategies/custom/organizationSeeder';
import { Neo4jSchemaInitializer } from '../config/schema'; 

dotenv.config();

async function runSeed() {
  console.log('🚀 [CTI Seeder] Adatbázis inicializálása...\n');
  const driver = getDriver();

  // 1. Indexek és kényszerek létrehozása/ellenőrzése
  const schemaInitializer = new Neo4jSchemaInitializer(driver);
  await schemaInitializer.initializeSchema();

  // 2. Definiáljuk a betöltési sorrendet
  const seeders = [
    // Referencia adatok
    new BaseNodeSeeder(driver, 'Location', DATA_PATHS.REFERENCE.LOCATIONS, 'Locations'),
    new BaseNodeSeeder(driver, 'Identity', DATA_PATHS.REFERENCE.SECTORS, 'Sectors'),
    new OrganizationSeeder(driver),
    new BaseNodeSeeder(
        driver,
        'AttackPattern',
        DATA_PATHS.MITRE.ENTERPRISE_ATTACK,
        'MITRE Attack Patterns (Techniques)',
        'attack-pattern'
      ),
      new BaseNodeSeeder(
        driver,
        'ThreatActor',
        DATA_PATHS.MITRE.ENTERPRISE_ATTACK,
        'MITRE Threat Actors (Intrusion Sets)',
        'intrusion-set'
      ),
      new BaseNodeSeeder(
        driver,
        'Software',
        DATA_PATHS.MITRE.ENTERPRISE_ATTACK,
        'MITRE Software (Malware & Tools)',
        ['malware', 'tool']
      ),
      new BaseNodeSeeder(
        driver,
        'CourseOfAction',
        DATA_PATHS.MITRE.ENTERPRISE_ATTACK,
        'MITRE Mitigations (Courses of Action)',
        'course-of-action'
      )

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