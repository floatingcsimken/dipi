/**
 * @file App.tsx
 * @description Az OODA Döntéstámogató Alkalmazás fő belépési és kompozíciós komponense.
 */

import { Header } from './components/layout/Header';
import { ObserveSection } from './components/ooda/ObserveSection';
import { OrientSection } from './components/ooda/OrientSection';
import { DecideActSection } from './components/ooda/DecideActSection';
import { useIncidentAnalysis } from './hooks/useIncidentAnalysis';
import type { JSX } from 'react/jsx-runtime';

export default function App(): JSX.Element {
  const { data, isLoading, errorMessage, triggerAnalysis } = useIncidentAnalysis();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans antialiased">
      <Header />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bal oldali sáv: 1. Observe (Bemenet) */}
        <div className="lg:col-span-4">
          <ObserveSection
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={triggerAnalysis}
          />
        </div>

        {/* Jobb oldali sáv: 2. Orient & 3. Decide/Act */}
        <div className="lg:col-span-8 space-y-6">
          <OrientSection
            ranking={data?.attributionRanking}
            hasRunAnalysis={data !== null}
          />

          <DecideActSection
            predictedSteps={data?.predictedNextSteps}
            hasRunAnalysis={data !== null}
          />
        </div>
      </main>
    </div>
  );
}