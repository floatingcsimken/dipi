/**
 * @file ObserveSection.tsx
 * @description Az OODA-ciklus 1. fázisa (Observe): Az incidens megfigyelt paramétereinek kiválasztása.
 */

import { useState, useCallback, type FormEvent } from 'react';
import { Crosshair, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useMetadata } from '../../hooks/useMetadata';
import type { AnalysisRequestDTO } from '../../types/api';
import type { JSX } from 'react/jsx-runtime';


/**
 * Az ObserveSection komponens bemeneti tulajdonságai.
 */
export interface ObserveSectionProps {
  isLoading: boolean;
  errorMessage: string | null;
  onSubmit: (payload: AnalysisRequestDTO) => Promise<void>;
}

/**
 * Űrlap-komponens, amely lehetővé teszi a felhasználó számára a célpont szektor
 * és az észlelt kártevők kiválasztását a gráfadatbázisból származó opciók alapján.
 *
 * @param {ObserveSectionProps} props - A komponens tulajdonságai.
 * @returns {JSX.Element} A kirajzolt űrlap kártya.
 */
export function ObserveSection({
  isLoading,
  errorMessage,
  onSubmit,
}: ObserveSectionProps): JSX.Element {
  const { metadata, isLoading: isMetadataLoading } = useMetadata();
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedMalware, setSelectedMalware] = useState<string>('');

  // Származtatott tényleges értékek (ha még nem választott manuálisan, az 1. elemet vesszük alapértelmezettnek)
  const activeSector = selectedSector || (metadata?.sectors[0] ?? '');
  const activeMalware = selectedMalware || (metadata?.malware[0] ?? '');

  /**
   * Kezeli az űrlap beküldését és összeállítja az AnalysisRequestDTO objektumot.
   */
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      const payload: AnalysisRequestDTO = {
        targetSector: activeSector.trim() || undefined,
        observedMalwareNames: activeMalware ? [activeMalware] : undefined,
      };

      await onSubmit(payload);
    },
    [activeSector, activeMalware, onSubmit]
  );

  return (
    <Card className="h-fit">
      <div className="flex items-center gap-2.5 mb-5 text-indigo-400 font-semibold border-b border-slate-800 pb-3">
        <Crosshair className="w-5 h-5" />
        <h2 className="text-sm tracking-wide uppercase">1. Observe (Incidens Bemenet)</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetSector" className="block text-xs font-medium text-slate-300 mb-1.5">
            Célpont Ágazat / Szektor
          </label>
          <select
            id="targetSector"
            value={activeSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            disabled={isLoading || isMetadataLoading}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          >
            {isMetadataLoading ? (
              <option value="">Szektorok betöltése...</option>
            ) : (
              metadata?.sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="observedMalware" className="block text-xs font-medium text-slate-300 mb-1.5">
            Észlelt Kártevő
          </label>
          <select
            id="observedMalware"
            value={activeMalware}
            onChange={(e) => setSelectedMalware(e.target.value)}
            disabled={isLoading || isMetadataLoading}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          >
            {isMetadataLoading ? (
              <option value="">Kártevők betöltése...</option>
            ) : (
              metadata?.malware.map((mal) => (
                <option key={mal} value={mal}>
                  {mal}
                </option>
              ))
            )}
          </select>
        </div>

        <Button type="submit" isLoading={isLoading} loadingText="Incidens Elemzése...">
          Incidens Elemzése
        </Button>
      </form>

      {errorMessage && (
        <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </Card>
  );
}