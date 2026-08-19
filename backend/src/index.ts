/**
 * @file index.ts
 * @description Alkalmazás belépési pont: adatbázis-kapcsolat inicializálása és HTTP szerver indítása.
 */

import dotenv from 'dotenv';
import { getDriver } from './config/database';
import { createApp } from './app';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function bootstrap() {
  try {
    const driver = getDriver();
    const app = createApp(driver);

    app.listen(PORT, () => {
      console.log(`🚀 [Backend] Szerver fut: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Nem sikerült elindítani a szervert:', error);
    process.exit(1);
  }
}

bootstrap();