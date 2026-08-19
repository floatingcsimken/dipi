/**
 * @file useIncidentAnalysis.ts
 * @description Egyedi React hook az incidenselemzés aszinkron állapotainak kezelésére.
 */

import { useState, useCallback } from 'react';
import { executeIncidentAnalysis } from '../api/analysisApi';
import type { AnalysisRequestDTO, AnalysisResponseDTO } from '../types/api';

export interface UseIncidentAnalysisReturn {
  data: AnalysisResponseDTO | null;
  isLoading: boolean;
  errorMessage: string | null;
  triggerAnalysis: (payload: AnalysisRequestDTO) => Promise<void>;
  resetAnalysis: () => void;
}

/**
 * Kezeli az incidenselemzés indítását, betöltési és hibaállapotait.
 */
export function useIncidentAnalysis(): UseIncidentAnalysisReturn {
  const [data, setData] = useState<AnalysisResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerAnalysis = useCallback(async (payload: AnalysisRequestDTO): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await executeIncidentAnalysis(payload);
      setData(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Ismeretlen hiba történt az elemzés során.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetAnalysis = useCallback((): void => {
    setData(null);
    setErrorMessage(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    errorMessage,
    triggerAnalysis,
    resetAnalysis,
  };
}