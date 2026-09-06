/**
 * @file metadata.ts
 * @description Üzleti logika a metaadatok párhuzamos lekérésére és aggregálására.
 */

import type { MetadataRepository, TechniqueMetadata } from '../repositories/metadata';

export interface AllMetadataResponse {
  sectors: string[];
  malware: string[];
  techniques: TechniqueMetadata[];
}

export class MetadataService {
  constructor(private readonly repository: MetadataRepository) {}

  /**
   * Lekéri az összes elérhető szektort, kártevőt és technikát egyetlen aggregált válaszban.
   */
  async getAllMetadata(): Promise<AllMetadataResponse> {
    const [sectors, malware, techniques] = await Promise.all([
      this.repository.getAvailableSectors(),
      this.repository.getAvailableMalware(),
      this.repository.getAvailableTechniques(),
    ]);

    return { sectors, malware, techniques };
  }
}