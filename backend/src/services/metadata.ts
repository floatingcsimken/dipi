import { MetadataRepository } from '../repositories/metadata';
import type { MetadataDto } from '../types/dtos/metadata';

export class MetadataService {
  constructor(private repository: MetadataRepository) {}

  public async getMetadata(): Promise<MetadataDto> {
    const data = await this.repository.getAgentMetadata();

    return {
      platforms: data.platforms.sort(),
      sectors: data.sectors.sort(),
      software: data.software.sort(),
      techniques: data.techniques.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }
}