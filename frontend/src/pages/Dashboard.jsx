import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  BookMarked, 
  ShieldAlert, 
  FileText, 
  Layers, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Scale
} from 'lucide-react';
import { getPrecedentStats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCases: 7,
    vocabularyDimension: 1249,
    categoryCounts: {},
    recentCases: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrecedentStats()
      .then(res => {
        if (res.data?.data) {
          setStats(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111A33] via-[#0D152B] to-[#080D1A] border border-amber-500/20 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Scale className="w-96 h-96 text-amber-300" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Legal Intelligence & Retrieval-Augmented Generation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold legal-font tracking-wide text-white">
            AI-Based Legal Research Assistant for Commercial Disputes
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Accelerate commercial dispute preparation. Perform sub-second semantic searches across high-court precedents, analyze contract clause liability exposure, and synthesize citation-backed pleadings with our Vector Database RAG pipeline.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/research"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4" />
              Launch RAG Research Assistant
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/clause-analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Analyze Contract Risk
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Indexed Precedents</span>
            <BookMarked className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white font-mono">{stats.totalCases}</div>
          <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Fully Vector Embedded
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Vector Vocabulary</span>
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white font-mono">{stats.vocabularyDimension}</div>
          <p className="mt-1 text-xs text-slate-400">High-dimensional terms & n-grams</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Similarity Metric</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white">Cosine L2</div>
          <p className="mt-1 text-xs text-slate-400">Sub-second dense matching</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Dispute Coverage</span>
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white">7 Categories</div>
          <p className="mt-1 text-xs text-slate-400">Commercial & Arbitration Courts</p>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>Core Legal-Tech Workflows</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/research"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all hover:bg-slate-900/90 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                RAG Precedent Search & Chat
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Describe complex commercial dispute scenarios in natural language. Automatically retrieve top-K judgments, applicable statutes, and draft petitioner & respondent arguments.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
              Start Legal Inquiry <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/clause-analyzer"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all hover:bg-slate-900/90 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Contract Clause Risk Analyzer
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Evaluate indemnity, force majeure, non-compete, or termination clauses for dispute vulnerabilities. Generates risk scores and renegotiation replacement text.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
              Analyze Contract Risk <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/brief-drafter"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all hover:bg-slate-900/90 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Case Brief & Argument Drafter
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Draft formal commercial litigation briefs formatted with facts, statutory issues, petitioner pleadings, respondent defenses, and authoritative precedents.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
              Draft Legal Brief <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Precedent Quick Showcase */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Indexed Commercial Precedents</h2>
            <p className="text-xs text-slate-400">Landmark judgments indexed in the vector similarity store</p>
          </div>
          <Link to="/precedents" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
            View all cases <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(stats.recentCases || []).map((caseItem, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400">{caseItem.citation}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {caseItem.disputeCategory}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">{caseItem.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{caseItem.ratioDecidendi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

