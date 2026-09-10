import { Driver } from 'neo4j-driver';

export class Neo4jSchemaInitializer {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  /**
   * Létrehozza a szükséges egyediségi kényszereket és indexeket.
   * Az `IF NOT EXISTS` záradék biztosítja az idempotenciát (többször is futtatható hiba nélkül).
   */
  public async initializeSchema(): Promise<void> {
    const session = this.driver.session();

    const queries: { name: string; query: string }[] = [
      // --- EGYEDISÉGI KÉNYSZEREK (Unique Constraints) ---
      {
        name: 'Constraint: AttackPattern stixId',
        query: `CREATE CONSTRAINT attack_pattern_stix_id IF NOT EXISTS 
                FOR (n:AttackPattern) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: Malware stixId',
        query: `CREATE CONSTRAINT malware_stix_id IF NOT EXISTS 
                FOR (n:Malware) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: Tool stixId',
        query: `CREATE CONSTRAINT tool_stix_id IF NOT EXISTS 
                FOR (n:Tool) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: ThreatActor stixId',
        query: `CREATE CONSTRAINT threat_actor_stix_id IF NOT EXISTS 
                FOR (n:ThreatActor) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: CourseOfAction stixId',
        query: `CREATE CONSTRAINT course_of_action_stix_id IF NOT EXISTS 
                FOR (n:CourseOfAction) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: Location stixId',
        query: `CREATE CONSTRAINT location_stix_id IF NOT EXISTS 
                FOR (n:Location) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: Identity stixId',
        query: `CREATE CONSTRAINT identity_stix_id IF NOT EXISTS 
                FOR (n:Identity) REQUIRE n.stixId IS UNIQUE`,
      },
      {
        name: 'Constraint: Organization stixId',
        query: `CREATE CONSTRAINT organization_stix_id IF NOT EXISTS 
                FOR (n:Organization) REQUIRE n.stixId IS UNIQUE`,
      },

      // --- KERESÉSI INDEXEK (Indexes) ---
      {
        name: 'Index: AttackPattern externalId',
        query: `CREATE INDEX attack_pattern_external_id IF NOT EXISTS 
                FOR (n:AttackPattern) ON (n.externalId)`,
      },
      {
        name: 'Index: Malware externalId',
        query: `CREATE INDEX malware_external_id IF NOT EXISTS 
                FOR (n:Malware) ON (n.externalId)`,
      },
      {
        name: 'Index: Tool externalId',
        query: `CREATE INDEX tool_external_id IF NOT EXISTS 
                FOR (n:Tool) ON (n.externalId)`,
      },
      {
        name: 'Index: ThreatActor externalId',
        query: `CREATE INDEX threat_actor_external_id IF NOT EXISTS 
                FOR (n:ThreatActor) ON (n.externalId)`,
      },
      {
        name: 'Index: CourseOfAction externalId',
        query: `CREATE INDEX course_of_action_external_id IF NOT EXISTS 
                FOR (n:CourseOfAction) ON (n.externalId)`,
      },
      {
        name: 'Index: ThreatActor name',
        query: `CREATE INDEX threat_actor_name IF NOT EXISTS 
                FOR (n:ThreatActor) ON (n.name)`,
      },
      {
        name: 'Index: AttackPattern name',
        query: `CREATE INDEX attack_pattern_name IF NOT EXISTS 
                FOR (n:AttackPattern) ON (n.name)`,
      },
    ];

    console.log('⚙️ [Schema] Neo4j kényszerek és indexek ellenőrzése / inicializálása...');

    try {
      for (const item of queries) {
        await session.run(item.query);
      }
      console.log('✅ [Schema] Kényszerek és indexek sikeresen beállítva.\n');
    } catch (error) {
      console.error('❌ [Schema] Hiba az indexek/kényszerek létrehozása közben:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}