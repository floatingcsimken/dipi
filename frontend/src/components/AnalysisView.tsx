import React from 'react';
import type { InvestigateResponseDto } from '../types/agent';

interface AnalysisViewProps {
  data: InvestigateResponseDto;
}

export default function AnalysisView({ data }: AnalysisViewProps) {
  const { progression, mitigations, totalTechniques } = data;

  // Biztonsági ellenőrzés: ha a progression véletlenül tömbként érkezne, alakítsuk át vagy kezeljük le
  const isProgressionArray = Array.isArray(progression);

  return (
    <div className="flex flex-col space-y-6 pb-12">
      {/* 1. Eredeti prompt és Összegzés */}
      <div className="bg-slate-800/80 border border-cyan-500/30 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <span>🛡️</span> Elemzési Jelentés (Threat Summary)
          </h2>
          <span className="text-xs bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-800">
            Összesen {totalTechniques} technika azonosítva
          </span>
        </div>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {!isProgressionArray ? progression.analystSummary : "Részletes elemzési összefoglaló a fázisokról."}
        </p>

        {!isProgressionArray && progression.threatProfile && (
          <div className="bg-slate-900/80 border border-cyan-900/50 rounded-xl p-4 mt-2">
            <h4 className="text-xs uppercase font-mono text-cyan-400 mb-1">Azonosított Fenyegetési Profil</h4>
            <div className="font-semibold text-slate-100 text-sm mb-1">{progression.threatProfile.patternName}</div>
            <p className="text-xs text-slate-400">{progression.threatProfile.reasoning}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Támadási Progresszió */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg space-y-6">
          <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
            <span>⚡</span> Támadási Útvonal (Progression)
          </h3>

          {/* Ha a backend mégis tömbként küldené a progressiót (régi formátum) */}
          {isProgressionArray ? (
            <div className="space-y-3">
              {(progression as any[]).map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                      {item.techniqueId || 'N/A'}
                    </span>
                    <span className="text-xs text-slate-400">{item.phase}</span>
                  </div>
                  <h4 className="font-medium text-slate-100 text-sm mb-1">{item.techniqueName || item.name}</h4>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Új, objektum alapú struktúra */
            <>
              {progression.origin && progression.origin.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Kiinduló Jelek (Origin)</h4>
                  <div className="space-y-2">
                    {progression.origin.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
                        <div className="font-medium text-slate-100 text-xs mb-1">{item.name}</div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {progression.currentTechniques && progression.currentTechniques.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Aktív Technikák</h4>
                  <div className="flex flex-wrap gap-2">
                    {progression.currentTechniques.map((tech, idx) => (
                      <span key={idx} className="bg-slate-900 text-cyan-300 font-mono text-xs px-2.5 py-1 rounded-lg border border-cyan-900">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {progression.predictedNext && progression.predictedNext.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Várható Következő Lépések (Predicted)</h4>
                  <div className="space-y-2">
                    {progression.predictedNext.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-amber-900/40 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-amber-300">{item.techniqueId}</span>
                          <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                        </div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 3. Neo4j Rangsorolt Mitigációk */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-md font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>🛡️</span> Javasolt Mitigációk (Neo4j Graph)
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {mitigations && mitigations.map((mit, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-emerald-900/40 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    {mit.mitigationId}
                  </span>
                  <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
                    Lefedettség: {mit.coverageScore !== undefined ? (mit.coverageScore * 100).toFixed(0) : 100}%
                  </span>
                </div>
                <h4 className="font-medium text-slate-100 text-sm mb-1">{mit.name}</h4>
                <p className="text-xs text-slate-400 leading-normal mb-2">{mit.description}</p>
                
                {mit.mitigatedTechniqueIds && mit.mitigatedTechniqueIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 self-center mr-1">Védi:</span>
                    {mit.mitigatedTechniqueIds.map((tId, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                        {tId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}