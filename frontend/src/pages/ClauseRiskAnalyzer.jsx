import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight,
  BookOpen,
  FileCheck2
} from 'lucide-react';
import { analyzeClause } from '../services/api';

const sampleClauses = [
  {
    type: 'Force Majeure',
    title: 'Vague Force Majeure (High Dispute Risk)',
    text: 'Neither party shall be liable for any delay or failure in performance due to acts of God, strikes, pandemics, or any other commercial or market difficulty whatsoever without limitation.'
  },
  {
    type: 'Indemnification',
    title: 'Uncapped One-Sided Indemnity',
    text: 'Client shall unconditionally defend, indemnify, and hold harmless Provider from and against any and all claims, damages, liabilities, costs, and expenses arising out of any breach or alleged breach of this agreement without any financial ceiling.'
  },
  {
    type: 'Non-Compete',
    title: 'Post-Term Non-Compete (Void under Sec 27)',
    text: 'For a period of three (3) years following termination of this Agreement, Contractor shall not directly or indirectly engage in, advise, or operate any business competing with the Company anywhere in the territory.'
  },
  {
    type: 'Termination',
    title: 'Arbitrary Immediate Termination for Convenience',
    text: 'Company may terminate this agreement at any time in its sole discretion immediately upon electronic mail notice without cause and without any obligation to pay for work in progress.'
  }
];

export default function ClauseRiskAnalyzer() {
  const [clauseText, setClauseText] = useState('');
  const [clauseType, setClauseType] = useState('General');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!clauseText.trim()) return;

    setLoading(true);
    setAnalysis(null);

    try {
      const res = await analyzeClause({
        clauseText,
        clauseType: clauseType === 'General' ? null : clauseType,
      });
      if (res.data?.data) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Error analyzing clause: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" /> Contract Vulnerability Engine
        </div>
        <h1 className="text-3xl font-bold legal-font text-white">Commercial Clause Risk Analyzer</h1>
        <p className="text-slate-400 text-sm mt-1">
          Detect one-sided exposures, statutory invalidity (e.g. Sec 27 Contract Act), and generate balanced renegotiation drafts.
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-5 shadow-xl">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Paste Commercial Contract Clause
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Clause Category:</span>
              <select
                value={clauseType}
                onChange={(e) => setClauseType(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="General">Auto-Detect Type</option>
                <option value="Force Majeure">Force Majeure</option>
                <option value="Indemnification">Indemnification</option>
                <option value="Limitation of Liability">Limitation of Liability</option>
                <option value="Termination">Termination</option>
                <option value="Non-Compete">Non-Compete & Restraint</option>
                <option value="Liquidated Damages">Liquidated Damages</option>
              </select>
            </div>
          </div>

          <textarea
            rows={4}
            value={clauseText}
            onChange={(e) => setClauseText(e.target.value)}
            placeholder="Paste your contract clause here (e.g. indemnity, limitation of liability, termination, or force majeure clause)..."
            className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">
              Evaluated against Commercial Courts jurisprudence and Indian Contract Act.
            </span>
            <button
              type="submit"
              disabled={loading || !clauseText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Legal Risk...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Clause Vulnerability</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Clause Buttons */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Load Pre-Engineered Risky Clauses to Test:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleClauses.map((sc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setClauseText(sc.text);
                  setClauseType(sc.type);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-red-500/40 hover:text-red-300 text-slate-300 transition-all"
              >
                ⚠️ {sc.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Risk Score Summary Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {analysis.clauseType}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  analysis.riskScore >= 70 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  analysis.riskScore >= 45 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {analysis.riskLevel}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Dispute Vulnerability Assessment</h3>
              <p className="text-xs text-slate-400">
                {analysis.relevantLegalPrecedent}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-black font-mono text-amber-400">{analysis.riskScore} / 100</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Score</div>
              </div>
            </div>
          </div>

          {/* Vulnerabilities & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-red-500/30 space-y-3">
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Identified Legal Vulnerabilities
              </h4>
              <ul className="space-y-2">
                {analysis.vulnerabilities.map((vuln, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/30 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Counsel Recommendations
              </h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Side-by-Side: Original vs Renegotiated Replacement Draft */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Original Submitted Clause
              </h4>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                {analysis.clauseText}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#101F33] border border-amber-500/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  Recommended Renegotiated Draft
                </h4>
                <button
                  onClick={() => copyToClipboard(analysis.renegotiatedDraft)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-slate-100 leading-relaxed serif-body text-sm">
                "{analysis.renegotiatedDraft}"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

