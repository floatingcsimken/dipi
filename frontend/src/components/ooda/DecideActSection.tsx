/**
 * @file DecideActSection.tsx
 * @description 3. Decide & Act fázis: Támadási lépések predikciója és elhárítási javaslatok.
 */

import { CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import type { PredictedStep } from '../../types/threatIntel';
import type { JSX } from 'react/jsx-runtime';

export interface DecideActSectionProps {
  predictedSteps: PredictedStep[] | undefined;
  hasRunAnalysis: boolean;
}

export function DecideActSection({
  predictedSteps,
  hasRunAnalysis,
}: DecideActSectionProps): JSX.Element {
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-5 text-amber-400 font-semibold border-b border-slate-800 pb-3">
        <CheckCircle2 className="w-5 h-5" />
        <h2 className="text-sm tracking-wide uppercase">3. Decide & Act (Predikció és Mitigáció)</h2>
      </div>

      {!hasRunAnalysis ? (
        <p className="text-slate-500 text-sm italic">
          Az elhárítási javaslatok az incidens elemzése után válnak elérhetővé.
        </p>
      ) : !predictedSteps || predictedSteps.length === 0 ? (
        <p className="text-slate-500 text-sm italic">
          Nincsenek aktív predikciós és mitigációs javaslatok a jelenlegi modellben.
        </p>
      ) : (
        <div className="space-y-4">
          {predictedSteps.map((step) => (
            <div key={step.techniqueId} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <span className="text-sm font-semibold text-slate-200">{step.techniqueName}</span>
                  <span className="ml-2 text-xs font-mono text-indigo-400">({step.techniqueId})</span>
                </div>
                <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full capitalize font-medium">
                  {step.phaseName}
                </span>
              </div>

              <div className="space-y-2 mt-2">
                {step.mitigations.map((mitigation) => (
                  <div
                    key={mitigation.mitigationId}
                    className="text-xs bg-slate-900/90 border border-slate-800/80 p-3 rounded-md"
                  >
                    <strong className="text-indigo-300 font-medium">{mitigation.name}: </strong>
                    <span className="text-slate-300 leading-relaxed">{mitigation.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}