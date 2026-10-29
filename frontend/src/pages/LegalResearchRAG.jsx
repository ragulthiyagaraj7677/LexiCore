import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Scale, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle, 
  Copy, 
  Check, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  History,
  FileCheck
} from 'lucide-react';
import { runResearchQuery, getResearchHistory } from '../services/api';

const sampleQueries = [
  {
    title: 'Force Majeure in Gas Supply',
    text: 'Buyer in a long-term Take-or-Pay gas sale agreement failed to lift contracted volume citing 300% price escalation and supply chain disruption. Can they claim frustration under Section 56?',
    category: 'Breach of Contract'
  },
  {
    title: 'Liquidated Damages without Loss',
    text: 'Government authority terminated an EPC highway construction project after 60 days delay and forfeited the bank guarantee claiming liquidated damages without proving actual loss.',
    category: 'Liquidated Damages & Construction'
  },
  {
    title: 'Injunction on Bank Guarantee',
    text: 'Can a contractor obtain an ad-interim injunction restraining the project owner from encashing an unconditional irrevocable bank guarantee on grounds of milestone disagreement?',
    category: 'Banking & Financial Debt'
  },
  {
    title: 'Arbitral Award Consequential Loss',
    text: 'Challenging an international commercial arbitral award under Section 34 where the arbitrator awarded consequential loss despite an explicit contractual exclusion clause.',
    category: 'Commercial Arbitration'
  }
];

export default function LegalResearchRAG() {
  const [queryText, setQueryText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('research'); // 'research' | 'history'
  const [history, setHistory] = useState([]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!queryText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await runResearchQuery({
        queryText,
        categoryFilter: categoryFilter === 'All' ? null : categoryFilter,
      });
      if (res.data?.data) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Error querying legal intelligence engine: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setActiveTab('history');
    try {
      const res = await getResearchHistory();
      if (res.data?.data) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" /> RAG & Vector Engine
          </div>
          <h1 className="text-3xl font-bold legal-font text-white">
            AI Legal Research Assistant (Commercial RAG)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze commercial dispute scenarios with automated high-dimensional vector search and precedent synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'research'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Research Studio
          </button>
          <button
            onClick={loadHistory}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Past Inquiries
          </button>
        </div>
      </div>

      {activeTab === 'research' ? (
        <>
          {/* Query Input Section */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-5 shadow-xl">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Dispute Scenario / Legal Research Fact Pattern
                  </label>
                  <textarea
                    rows={4}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="E.g., Our supplier delayed shipment of raw materials by 90 days citing supply chain disruption, then claimed Force Majeure and refuses to refund our advance. Can we terminate and claim damages under Section 73 of the Contract Act?"
                    className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400">Category Filter:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="All">All Commercial Categories</option>
                    <option value="Breach of Contract">Breach of Contract</option>
                    <option value="Commercial Arbitration">Commercial Arbitration</option>
                    <option value="Liquidated Damages & Construction">Liquidated Damages & Construction</option>
                    <option value="Banking & Financial Debt">Banking & Financial Debt</option>
                    <option value="IP & Trade Secrets">IP & Trade Secrets</option>
                    <option value="Insolvency & Bankruptcy">Insolvency & Bankruptcy</option>
                    <option value="Shareholder & Corporate">Shareholder & Corporate</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !queryText.trim()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving & Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Vector RAG Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Sample Prompts */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Select Pre-Configured Commercial Dispute Test Cases:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQueryText(sample.text);
                      setCategoryFilter(sample.category);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:text-amber-300 text-slate-300 transition-all text-left"
                  >
                    ⚡ {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RAG Results Display */}
          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Vector Retrieval Stats Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
                    Dispute: {result.disputeCategory}
                  </div>
                  <span className="text-slate-400">
                    Highest Cosine Match: <strong className="text-emerald-400">{result.vectorMetrics?.topMatchScore}%</strong>
                  </span>
                  <span className="hidden md:inline text-slate-500">|</span>
                  <span className="hidden md:inline text-slate-400">
                    Precedents Indexed: <strong>{result.vectorMetrics?.totalIndexedCases}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Litigation Risk Exposure:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] ${
                    result.settlementRiskLevel === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    result.settlementRiskLevel === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {result.settlementRiskLevel} Exposure
                  </span>
                </div>
              </div>

              {/* Top Precedent Cards from Vector DB */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Top Matching Commercial Precedents (Retrieved by Vector Cosine Similarity)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.retrievedPrecedents.map((prec, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400 font-mono">
                              {prec.citation}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                              {prec.year}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1">{prec.title}</h4>
                          <p className="text-xs text-slate-400">{prec.court}</p>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold shrink-0">
                          {prec.similarityPercent}% Match
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-amber-300 block mb-1">Ratio Decidendi:</strong>
                        {prec.ratioDecidendi}
                      </div>

                      {prec.statutesCited && prec.statutesCited.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prec.statutesCited.map((st, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-400">
                              📜 {st}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Synthesized Legal Opinion */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">Synthesized Commercial Legal Opinion</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.synthesizedOpinion)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors px-2 py-1 rounded bg-slate-800/60"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Opinion'}</span>
                  </button>
                </div>
                <div className="serif-body text-slate-200 text-sm leading-relaxed p-4 rounded-xl bg-[#080D1A]/80 border border-slate-800/80 whitespace-pre-line">
                  {result.synthesizedOpinion}
                </div>
              </div>

              {/* Legal Issues & Applicable Statutes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Core Legal Issues Formulated
                  </h4>
                  <ul className="space-y-2">
                    {result.keyLegalIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="font-bold text-amber-400 font-mono mt-0.5">{idx + 1}.</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <FileCheck className="w-4 h-4" /> Governing Statutes & Sections
                  </h4>
                  <div className="space-y-2">
                    {result.statutesApplicable.map((st, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                        <span className="text-amber-400">⚖️</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Petitioner vs Respondent Pleadings Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      Petitioner / Claimant Strongest Arguments
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                      Claimant Pleadings
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {result.petitionerArguments.map((arg, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/70 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                      Respondent / Defense Rebuttals
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                      Defense Strategy
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {result.respondentArguments.map((arg, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Next Steps */}
              {result.recommendedNextSteps && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>⚡ Strategic Counsel Action Items</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.recommendedNextSteps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Query History View */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Past Research Queries</h3>
          {history.length === 0 ? (
            <p className="text-sm text-slate-400">No past inquiries recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
                      {item.disputeCategory}
                    </span>
                    <span className="text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{item.queryText}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{item.synthesizedOpinion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

