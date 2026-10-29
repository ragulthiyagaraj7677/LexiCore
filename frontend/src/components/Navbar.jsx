import React, { useState, useEffect } from 'react';
import { Scale, Activity, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { getSystemHealth } from '../services/api';

export default function Navbar() {
  const [health, setHealth] = useState({ status: 'Connecting...', mode: 'Live' });

  useEffect(() => {
    getSystemHealth()
      .then(res => {
        setHealth({
          status: 'Online',
          mode: res.data.database?.mode || 'Connected',
          cases: res.data.vectorEngine?.indexedDocuments || 7
        });
      })
      .catch(() => {
        setHealth({ status: 'Standalone Mode', mode: 'Local Vector Store' });
      });
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0B132B]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Scale className="w-5 h-5 text-slate-950 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-lg legal-font text-white">LEXICORE</span>
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              RAG LEGAL AI
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Commercial Disputes Intelligence & Vector Precedents</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Vector DB Engine status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-mono">Vector DB: Cosine Similarity</span>
          <span className="text-amber-400 font-semibold">• 100% Ready</span>
        </div>

        {/* System badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="font-medium hidden md:inline">Commercial Division</span>
        </div>
      </div>
    </header>
  );
}

