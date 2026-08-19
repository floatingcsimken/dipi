import neo4j, { Driver } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'secretpassword';

let driver: Driver | null = null;

export const getDriver = (): Driver => {
  if (!driver) {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
};

export const closeDriver = async (): Promise<void> => {
  if (driver) {
    await driver.close();
    driver = null;
  }
};