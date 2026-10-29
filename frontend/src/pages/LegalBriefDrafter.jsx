import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Scale, 
  CheckCircle2, 
  BookOpen, 
  ShieldAlert,
  User,
  Building
} from 'lucide-react';
import { generateCaseBrief } from '../services/api';

export default function LegalBriefDrafter() {
  const [formData, setFormData] = useState({
    title: 'Breach of EPC Milestone Schedule and Bank Guarantee Dispute',
    petitioner: 'Apex Infrastructure Private Limited',
    respondent: 'Metropolitan Urban Transport Corporation',
    jurisdiction: 'High Court Commercial Appellate Division',
    disputeSummary: 'The Respondent terminated the turnkey metro rail EPC contract after an alleged 75-day delay in sub-station installation, and issued a demand letter to encash the unconditional bank guarantee for Rs. 28 Crores without demonstrating actual loss suffered. The Petitioner asserts delay was caused by delayed site handover and force majeure rainfall disruptions.',
  });

  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.disputeSummary) return;

    setLoading(true);
    setBrief(null);

    try {
      const res = await generateCaseBrief(formData);
      if (res.data?.data) {
        setBrief(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating case brief: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" /> Commercial Dispute Briefing
          </div>
          <h1 className="text-3xl font-bold legal-font text-white">Commercial Case Brief & Argument Drafter</h1>
          <p className="text-slate-400 text-sm mt-1">
            Auto-generate formal litigation case briefs complete with facts, statutory issues, petitioner pleadings, and defense rebuttals.
          </p>
        </div>

        {brief && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Print / Export Case Brief
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-5 shadow-xl print:hidden">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Case / Dispute Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Petitioner / Claimant Entity
              </label>
              <input
                type="text"
                value={formData.petitioner}
                onChange={(e) => setFormData({ ...formData, petitioner: e.target.value })}
                className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Respondent / Defense Entity
              </label>
              <input
                type="text"
                value={formData.respondent}
                onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
                className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Judicial Forum
              </label>
              <input
                type="text"
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Factual Matrix & Underlying Commercial Conflict
            </label>
            <textarea
              rows={4}
              value={formData.disputeSummary}
              onChange={(e) => setFormData({ ...formData, disputeSummary: e.target.value })}
              className="w-full bg-[#080D1A] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Legal Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Draft Formal Legal Brief</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Brief Display */}
      {brief && (
        <div className="bg-[#0B132B] border border-amber-500/40 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 animate-fadeIn text-slate-200">
          {/* Brief Header */}
          <div className="text-center border-b border-amber-500/30 pb-6 space-y-2">
            <div className="text-xs uppercase font-bold text-amber-400 tracking-widest font-mono">
              CONFIDENTIAL LEGAL BRIEF • COMMERCIAL DIVISION
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold legal-font text-white">{brief.title}</h2>
            <p className="text-xs text-slate-400">Jurisdiction: {brief.jurisdiction}</p>
          </div>

          {/* Parties Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Petitioner / Claimant</span>
                <span className="font-bold text-white text-sm">{brief.parties.petitioner}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
              <Building className="w-5 h-5 text-amber-400" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Respondent / Defendant</span>
                <span className="font-bold text-white text-sm">{brief.parties.respondent}</span>
              </div>
            </div>
          </div>

          {/* Statement of Facts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              I. Statement of Commercial Facts
            </h3>
            <div className="serif-body p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm leading-relaxed text-slate-200">
              {brief.disputeSummary}
            </div>
          </div>

          {/* Governing Law */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              II. Governing Statutory Framework
            </h3>
            <div className="flex flex-wrap gap-2">
              {brief.governingLaw.map((law, idx) => (
                <span key={idx} className="text-xs px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  ⚖️ {law}
                </span>
              ))}
            </div>
          </div>

          {/* Issues Posed */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              III. Questions of Law & Issues Framed
            </h3>
            <ol className="space-y-2 list-decimal list-inside text-xs text-slate-300">
              {brief.issuesPosed.map((iss, idx) => (
                <li key={idx} className="p-2 rounded bg-slate-950 border border-slate-900">{iss}</li>
              ))}
            </ol>
          </div>

          {/* Pleadings Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                IV. Petitioner / Claimant Pleadings
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {brief.petitionerPleadings.map((p, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">§</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                V. Respondent / Defense Rebuttals
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {brief.respondentRebuttals.map((r, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">§</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Authoritative Precedents */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              VI. Authoritative Precedents Cited (Retrieved from Vector Store)
            </h3>
            <div className="space-y-2">
              {brief.authoritativePrecedents.map((prec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-white">{prec.title}</strong>
                    <span className="text-amber-400 font-mono font-bold">{prec.citation}</span>
                  </div>
                  <p className="text-slate-400">{prec.relevance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Counsel Opinion */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
              VII. Strategic Counsel Opinion
            </h3>
            <p className="serif-body text-slate-200 text-sm leading-relaxed">
              {brief.strategicCounselOpinion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

