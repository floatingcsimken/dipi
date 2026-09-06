/**
 * @file useMetadata.ts
 * @description Egyedi React hook a STIX metaadatok automatikus betöltésére és állapotuk kezelésére.
 */

import { useState, useEffect } from 'react';
import { fetchAllMetadata } from '../api/metadata';
import type { MetadataResponseDTO } from '../types/api';

/**
 * A `useMetadata` hook visszatérési értékeinek típusa.
 */
export interface UseMetadataReturn {
  /** A betöltött metaadatok objektuma, vagy null, ha még nincs adat. */
  metadata: MetadataResponseDTO | null;
  /** Jelzi, hogy a metaadatok aszinkron lekérése folyamatban van-e. */
  isLoading: boolean;
  /** Hiba esetén a formázott hibaüzenet szövege. */
  error: string | null;
}

/**
 * Kezeli a metaadatok inicializálását az alkalmazás indulásakor.
 *
 * @returns {UseMetadataReturn} Az állapotokat tartalmazó objektum.
 */
export function useMetadata(): UseMetadataReturn {
  const [metadata, setMetadata] = useState<MetadataResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    /**
     * Belső aszinkron betöltő függvény a race-condition-ök elkerülésére.
     */
    async function loadData(): Promise<void> {
      try {
        const data = await fetchAllMetadata();
        if (isMounted) {
          setMetadata(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Nem sikerült betölteni a metaadatokat.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { metadata, isLoading, error };
}