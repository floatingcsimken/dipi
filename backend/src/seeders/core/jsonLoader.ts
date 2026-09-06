import fs from 'fs';
import { StixBundle, StixObject } from '../../types/stix/stixTypes';

export class JsonLoader {
  // Gyorsítótár a fájl elérési útja alapján, hogy az 50 MB-os JSON-t csak egyszer kelljen parse-olni
  private static cache: Map<string, any[]> = new Map();

  /**
   * Beolvassa a STIX bundle-t, és visszaadja az összes benne lévő nyers objektumot (cache-elve).
   */
  public static loadBundleObjects(filePath: string): any[] {
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath)!;
    }

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ [JsonLoader] A fájl nem található: ${filePath}`);
      return [];
    }

    try {
      console.log(`📂 [JsonLoader] STIX bundle betöltése és feldolgozása a memóriába (${filePath})...`);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const bundle = JSON.parse(rawContent) as StixBundle;
      const objects = bundle.objects || [];

      this.cache.set(filePath, objects);
      console.log(`✅ [JsonLoader] Sikeresen betöltve ${objects.length} nyers STIX objektum.`);
      return objects;
    } catch (error) {
      console.error(`❌ [JsonLoader] Hiba a JSON beolvasásakor (${filePath}):`, error);
      return [];
    }
  }

  /**
   * Típus szerint szűrt, aktív (nem visszavont és nem elavult) STIX objektumok kinyerése.
   * 
   * @param filePath A STIX JSON bundle elérési útja.
   * @param targetType A STIX 'type' mezője (pl. 'attack-pattern', 'malware', 'intrusion-set').
   *                   Több típust is átadhatsz tömbként, pl. ['malware', 'tool'].
   * @param includeRevoked Ha true, megtartja a visszavont/elavult elemeket is (alapértelmezett: false).
   */
  public static loadStixObjects<T = any>(
    filePath: string,
    targetType: string | string[],
    includeRevoked: boolean = false
  ): T[] {
    const allObjects = this.loadBundleObjects(filePath);
    const types = Array.isArray(targetType) ? targetType : [targetType];

    return allObjects.filter((item: any) => {
      // 1. Típus egyezés ellenőrzése
      if (!types.includes(item.type)) {
        return false;
      }

      // 2. Visszavont vagy elavult elemek kizárása
      if (!includeRevoked) {
        if (item.revoked === true) return false;
        if (item.x_mitre_deprecated === true) return false;
      }

      return true;
    }) as T[];
  }

  /**
   * Memória felszabadítása a seedelési folyamat végén.
   */
  public static clearCache(): void {
    this.cache.clear();
  }
}