/**
 * @file ObserveSection.tsx
 * @description 1. Observe fázis: Incidens bemeneti paraméterek beküldése.
 */

import { useState, useCallback, type FormEvent, type JSX } from 'react';
import { Crosshair, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { AnalysisRequestDTO } from '../../types/api';

export interface ObserveSectionProps {
  isLoading: boolean;
  errorMessage: string | null;
  onSubmit: (payload: AnalysisRequestDTO) => Promise<void>;
}

export function ObserveSection({
  isLoading,
  errorMessage,
  onSubmit,
}: ObserveSectionProps): JSX.Element {
  const [targetSector, setTargetSector] = useState<string>('financial-services');
  const [malwareInput, setMalwareInput] = useState<string>('Carbanak');

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      const parsedMalware = malwareInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const payload: AnalysisRequestDTO = {
        targetSector: targetSector.trim() || undefined,
        observedMalwareNames: parsedMalware.length > 0 ? parsedMalware : undefined,
      };

      await onSubmit(payload);
    },
    [targetSector, malwareInput, onSubmit]
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
          <input
            id="targetSector"
            type="text"
            value={targetSector}
            onChange={(e) => setTargetSector(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            placeholder="pl. financial-services"
          />
        </div>

        <div>
          <label htmlFor="observedMalware" className="block text-xs font-medium text-slate-300 mb-1.5">
            Észlelt Kártevők (vesszővel elválasztva)
          </label>
          <input
            id="observedMalware"
            type="text"
            value={malwareInput}
            onChange={(e) => setMalwareInput(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            placeholder="pl. Carbanak, Cobalt Strike"
          />
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