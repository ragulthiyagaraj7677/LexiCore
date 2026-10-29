import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
import { createPrecedent } from '../services/api';

export default function AddPrecedent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    citation: '',
    court: 'Supreme Court of India (Commercial Division)',
    year: 2024,
    disputeCategory: 'Breach of Contract',
    facts: '',
    ratioDecidendi: '',
    keyIssues: '',
    statutesCited: '',
    rulingOutcome: 'Allowed',
    commercialPrinciples: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        keyIssues: formData.keyIssues.split('\n').filter(s => s.trim()),
        statutesCited: formData.statutesCited.split('\n').filter(s => s.trim()),
        commercialPrinciples: formData.commercialPrinciples.split('\n').filter(s => s.trim()),
      };

      await createPrecedent(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/precedents');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Error ingesting precedent: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <PlusCircle className="w-3.5 h-3.5" /> Vector Data Ingestion
        </div>
        <h1 className="text-3xl font-bold legal-font text-white">Ingest New Commercial Precedent</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add high-court judgments to the vector embedding database for instant semantic search and RAG synthesis.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">Precedent vectorized and added to repository! Redirecting...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900/70 border border-slate-800 p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Case Title / Parties
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E.g., Bharat Aluminum Co v. Kaiser Aluminium Technical Services"
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Citation
            </label>
            <input
              type="text"
              required
              value={formData.citation}
              onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
              placeholder="E.g., (2024) 2 SCC 112"
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Dispute Category
            </label>
            <select
              value={formData.disputeCategory}
              onChange={(e) => setFormData({ ...formData, disputeCategory: e.target.value })}
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="Breach of Contract">Breach of Contract</option>
              <option value="Commercial Arbitration">Commercial Arbitration</option>
              <option value="Liquidated Damages & Construction">Liquidated Damages & Construction</option>
              <option value="Banking & Financial Debt">Banking & Financial Debt</option>
              <option value="IP & Trade Secrets">IP & Trade Secrets</option>
              <option value="Insolvency & Bankruptcy">Insolvency & Bankruptcy</option>
              <option value="Shareholder & Corporate">Shareholder & Corporate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Court / Forum
            </label>
            <input
              type="text"
              required
              value={formData.court}
              onChange={(e) => setFormData({ ...formData, court: e.target.value })}
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Judgment Year
            </label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Factual Background
          </label>
          <textarea
            rows={3}
            required
            value={formData.facts}
            onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
            placeholder="Key facts of the commercial controversy..."
            className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Ratio Decidendi (Legal Principle Established)
          </label>
          <textarea
            rows={3}
            required
            value={formData.ratioDecidendi}
            onChange={(e) => setFormData({ ...formData, ratioDecidendi: e.target.value })}
            placeholder="Core holding and commercial rule laid down by the court..."
            className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Statutes & Sections Cited (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.statutesCited}
              onChange={(e) => setFormData({ ...formData, statutesCited: e.target.value })}
              placeholder="E.g., Arbitration Act 1996 - Section 34&#10;Commercial Courts Act 2015"
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Commercial Principles / Tags (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.commercialPrinciples}
              onChange={(e) => setFormData({ ...formData, commercialPrinciples: e.target.value })}
              placeholder="E.g., Patent Illegality&#10;Public Policy Threshold"
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Vector Indexing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ingest & Compute Vector Embedding</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

