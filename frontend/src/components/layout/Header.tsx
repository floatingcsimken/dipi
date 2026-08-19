/**
 * @file Header.tsx
 * @description Globális alkalmazásfejléc állapotjelzővel.
 */

import { ShieldAlert } from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';

export function Header(): JSX.Element {
  return (
    <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between border-b border-slate-800 pb-5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
          <ShieldAlert className="w-7 h-7 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Threat Intelligence Decision Support
          </h1>
          <p className="text-xs text-slate-400">OODA-Loop Graph Engine (STIX 2.1 & Neo4j)</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono text-slate-400">API: Port 4000</span>
      </div>
    </header>
  );
}