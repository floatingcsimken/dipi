/**
 * @file OrientSection.tsx
 * @description 2. Orient fázis: Támadói hasonlósági profilok és rangsor megjelenítése.
 */

import { Cpu } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { ThreatActorMatch } from '../../types/threatIntel';
import type { JSX } from 'react/jsx-runtime';

export interface OrientSectionProps {
  ranking: ThreatActorMatch[] | undefined;
  hasRunAnalysis: boolean;
}

export function OrientSection({
  ranking,
  hasRunAnalysis,
}: OrientSectionProps): JSX.Element {
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-5 text-emerald-400 font-semibold border-b border-slate-800 pb-3">
        <Cpu className="w-5 h-5" />
        <h2 className="text-sm tracking-wide uppercase">2. Orient (Támadói Profilok)</h2>
      </div>

      {!hasRunAnalysis ? (
        <p className="text-slate-500 text-sm italic">
          Indíts el egy elemzést a megfigyelt incidens alapján a támadói profilok illesztéséhez.
        </p>
      ) : !ranking || ranking.length === 0 ? (
        <p className="text-amber-400/80 text-sm">
          Nem található ismert támadói profil a megadott attribútumok alapján az adatbázisban.
        </p>
      ) : (
        <div className="space-y-3">
          {ranking.map((actor) => (
            <div
              key={actor.stixId}
              className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition hover:border-slate-700"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-100 text-base">{actor.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500">{actor.stixId}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aliasok: {actor.aliases.length > 0 ? actor.aliases.join(', ') : 'Nincs rögzítve'}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {actor.matchedMalware.map((malware) => (
                    <Badge key={malware} variant="danger">
                      Malware: {malware}
                    </Badge>
                  ))}
                  {actor.matchedSectors.map((sec) => (
                    <Badge key={sec} variant="info">
                      Szektor: {sec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {Math.round(actor.similarityScore * 100)}%
                </div>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium">
                  Hasonlóság
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}