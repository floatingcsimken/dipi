import fs from 'fs';
import { StixBundle } from '../../types/stix/stixTypes';
export class JsonLoader {
  /**
   * Biztonságosan beolvas egy STIX bundle fájlt és visszaadja a benne lévő objektumokat.
   */
  public static loadObjects<T = any>(filePath: string): T[] {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ [JsonLoader] A fájl nem található: ${filePath}`);
      return [];
    }

    try {
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const bundle: StixBundle = JSON.parse(rawContent);
      return (bundle.objects as T[]) || [];
    } catch (error) {
      console.error(`❌ [JsonLoader] Hiba a JSON beolvasásakor (${filePath}):`, error);
      return [];
    }
  }
}