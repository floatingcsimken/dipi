/**
 * @file metadata.ts
 * @description HTTP kliens függvények a STIX metaadatok kinyeréséhez a backendről.
 */

import { apiClient, formatApiError } from './client';
import type { MetadataResponseDTO } from '../types/api';

/**
 * Lekéri az összes elérhető STIX metaadatot (szektorok, kártevők, technikák) az adatbázisból.
 *
 * @returns {Promise<MetadataResponseDTO>} A metaadatokat tartalmazó Promise.
 * @throws {Error} Hiba esetén standardizált hibaüzenetet dob a kiváltó okkal.
 */
export async function fetchAllMetadata(): Promise<MetadataResponseDTO> {
  try {
    const response = await apiClient.get<MetadataResponseDTO>('/metadata');
    return response.data;
  } catch (error) {
    throw new Error(formatApiError(error), { cause: error });
  }
}