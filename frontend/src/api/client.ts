/**
 * @file client.ts
 * @description Központi Axios kliens alapértelmezett beállításokkal és interceptorokkal.
 */

import type { AxiosInstance } from 'axios';
import axios, { AxiosError } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Standardizált hibakezelő segédfüggvény API válaszokhoz.
 *
 * @param error - Az elkapott Axios vagy általános hiba.
 * @returns Strukturált hibaüzenet szövege.
 */
export function formatApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ error?: string; message?: string }>;
    return (
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Nem sikerült kapcsolatot létesíteni a backend szerverrel.'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Váratlan hiba történt a hálózati kérés során.';
}