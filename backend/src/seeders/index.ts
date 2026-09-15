import dotenv from 'dotenv';
import { getDriver, closeDriver } from '../config/database';
import { DATA_PATHS } from '../config/paths';
import { BaseNodeSeeder } from './strategies/baseNodeSeeder';
import { OrganizationSeeder } from './strategies/custom/organizationSeeder';
import { Neo4jSchemaInitializer } from '../config/schema'; 
import { RelationshipSeeder } from './strategies/custom/relationshipSeedet';

dotenv.config();

async function runSeed() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--all';

  console.log(`🚀 [CTI Seeder] Futás indítása mód: ${mode}\n`);
  const driver = getDriver();

  try {
    // 1. Lépés: Séma és indexek mindig inicializálódnak
    const schemaInitializer = new Neo4jSchemaInitializer(driver);
    await schemaInitializer.initializeSchema();

    // 2. Lépés: Custom reference adatok (ha --custom vagy --all)
    if (mode === '--custom' || mode === '--all') {
      console.log('\n📦 [Custom Data] Belső referenciák betöltése...');
      const customSeeders = [
        new BaseNodeSeeder(driver, 'Location', DATA_PATHS.REFERENCE.LOCATIONS, 'Locations'),
        new BaseNodeSeeder(driver, 'Identity', DATA_PATHS.REFERENCE.SECTORS, 'Sectors'),
        new OrganizationSeeder(driver),
      ];
      for (const seeder of customSeeders) {
        await seeder.seed();
      }
    }

    // 3. Lépés: MITRE csomópontok és kapcsolatok (ha --mitre vagy --all)
    if (mode === '--mitre' || mode === '--all') {
      console.log('\n🛡️ [MITRE ATT&CK] Csomópontok betöltése...');
      const mitreNodeSeeders = [
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

      for (const seeder of mitreNodeSeeders) {
        await seeder.seed();
      }

      console.log('\n🔗 [MITRE ATT&CK] Kapcsolatok behúzása...');
      const relSeeder = new RelationshipSeeder(driver, DATA_PATHS.MITRE.ENTERPRISE_ATTACK);
      await relSeeder.seed();
    }

    console.log(`\n🎉 [SUCCESS] A seeding sikeresen befejeződött (${mode})!`);
  } catch (error) {
    console.error('\n💥 [ERROR] Hiba történt a seedelés közben:', error);
    process.exit(1);
  } finally {
    await closeDriver();
  }
}

runSeed();