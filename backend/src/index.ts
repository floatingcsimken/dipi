/**
 * @file index.ts
 * @description Alkalmazás belépési pont: adatbázis-kapcsolat inicializálása és HTTP szerver indítása.
 */

import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function bootstrap() {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`🚀 [Backend] Szerver fut: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Nem sikerült elindítani a szervert:', error);
    process.exit(1);
  }
}

bootstrap();