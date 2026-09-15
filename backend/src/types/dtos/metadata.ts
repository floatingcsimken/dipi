import type { Driver, Session } from 'neo4j-driver';

export interface MetadataDto {
  platforms: string[];
  sectors: string[];
  software: string[];
  techniques: { id: string; name: string }[];
}
