import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Search, 
  Filter, 
  Sparkles, 
  Scale, 
  ChevronRight, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getPrecedents, searchPrecedentsVector } from '../services/api';

const categories = [
  'All',
  'Breach of Contract',
  'Commercial Arbitration',
  'Liquidated Damages & Construction',
  'Banking & Financial Debt',
  'IP & Trade Secrets',
  'Insolvency & Bankruptcy',
  'Shareholder & Corporate'
];

export default function PrecedentLibrary() {
  const [precedents, setPrecedents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVectorSearch, setIsVectorSearch] = useState(false);
  const [selectedPrecedent, setSelectedPrecedent] = useState(null);

  useEffect(() => {
    fetchPrecedents();
  }, [selectedCategory]);

  const fetchPrecedents = async () => {
    setLoading(true);
    setIsVectorSearch(false);
    try {
      const res = await getPrecedents({
        category: selectedCategory,
        search: searchTerm,
      });
      if (res.data?.data) {
        setPrecedents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVectorSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      fetchPrecedents();
      return;
    }

    setLoading(true);
    try {
      const res = await searchPrecedentsVector({
        query: searchTerm,
        category: selectedCategory === 'All' ? null : selectedCategory,
        topK: 6,
      });
      if (res.data?.data) {
        // Map vector results
        const mapped = res.data.data.map(item => ({
          ...item.precedent,
          similarityPercent: item.similarityPercent,
        }));
        setPrecedents(mapped);
        setIsVectorSearch(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookMarked className="w-3.5 h-3.5" /> High-Court Precedents Repository
          </div>
          <h1 className="text-3xl font-bold legal-font text-white">Commercial Precedent Library</h1>
          <p className="text-slate-400 text-sm mt-1">
            Authoritative case laws indexed with full factual matrices, ratios, and statutory interpretations.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-amber-400 block font-semibold">
            {precedents.length} Cases Retrieved
          </span>
          <span className="text-[11px] text-slate-500">
            {isVectorSearch ? 'Vector Semantic Ranking' : 'Standard Ingestion View'}
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <form onSubmit={handleVectorSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by legal issue, clause type, or factual pattern (e.g., 'price escalation frustration', 'bank guarantee fraud', 'patent illegality')..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Vector Search
            </button>
            <button
              type="button"
              onClick={fetchPrecedents}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Precedents Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Querying Vector Index...</p>
        </div>
      ) : precedents.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 space-y-2">
          <Scale className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No matching commercial precedents found</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or switching the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {precedents.map((item, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all hover:bg-slate-900/95 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-amber-500/5 cursor-pointer"
              onClick={() => setSelectedPrecedent(item)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{item.citation}</span>
                  {item.similarityPercent !== undefined ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      {item.similarityPercent}% Match
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                      {item.year}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 font-medium">{item.court}</p>

                <div className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                  {item.disputeCategory}
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  <strong className="text-slate-400">Ratio: </strong>
                  {item.ratioDecidendi}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-400 transition-colors">
                <span>View Full Case & Principles</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Precedent Detail Modal */}
      {selectedPrecedent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-amber-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPrecedent(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                  {selectedPrecedent.citation}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedPrecedent.year} • {selectedPrecedent.court}
                </span>
              </div>
              <h2 className="text-2xl font-bold legal-font text-white">{selectedPrecedent.title}</h2>
              <div className="mt-2 text-xs font-semibold px-3 py-1 rounded-md bg-slate-900 inline-block text-amber-300 border border-slate-800">
                Dispute: {selectedPrecedent.disputeCategory}
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Factual Matrix</h4>
                <p className="leading-relaxed">{selectedPrecedent.facts}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Ratio Decidendi</h4>
                <p className="leading-relaxed serif-body text-slate-200 text-sm">{selectedPrecedent.ratioDecidendi}</p>
              </div>

              {selectedPrecedent.keyIssues && selectedPrecedent.keyIssues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Key Legal Questions Posed</h4>
                  <ul className="space-y-1.5 list-disc list-inside">
                    {selectedPrecedent.keyIssues.map((iss, i) => (
                      <li key={i} className="text-slate-300">{iss}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPrecedent.statutesCited && selectedPrecedent.statutesCited.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Statutes & Provisions Cited</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrecedent.statutesCited.map((st, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-900 text-slate-200 border border-slate-800">
                        ⚖️ {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-emerald-400">Final Outcome</span>
                  <span className="font-bold text-sm">{selectedPrecedent.rulingOutcome}</span>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

