/**
 * @file analysisApi.ts
 * @description Az incidenselemzéshez tartozó specifikus végpont-hívások.
 */

import { apiClient, formatApiError } from './client';
import type { AnalysisRequestDTO, AnalysisResponseDTO } from '../types/api';

/**
 * Incidens elemzés indítása a backend motoron keresztül.
 *
 * @param payload - A megfigyelt incidens paraméterei.
 * @returns Az OODA kiértékelés eredménye.
 */
export async function executeIncidentAnalysis(
  payload: AnalysisRequestDTO
): Promise<AnalysisResponseDTO> {
  try {
    const response = await apiClient.post<AnalysisResponseDTO>('/analysis/analyze', payload);
    return response.data;
  } catch (error) {
    throw new Error(formatApiError(error), { cause: error });
  }
}