const vectorEngine = require('./vectorEngine');

/**
 * Retrieval-Augmented Generation (RAG) Service for Commercial Disputes
 * Retrieves top matching precedents from Vector Engine and synthesizes actionable legal intelligence
 */

class RAGService {
  async processLegalQuery(queryText, categoryFilter = null) {
    if (!queryText || !queryText.trim()) {
      throw new Error('Query text is required for legal analysis.');
    }

    // 1. Vector Search: Retrieve Top Precedents via Cosine Similarity
    const retrievedMatches = vectorEngine.search(queryText, 4, categoryFilter);

    // 2. Extract context from matched precedents
    const topPrecedents = retrievedMatches.map(m => ({
      precedentId: m.precedent._id || m.precedent.citation,
      title: m.precedent.title,
      citation: m.precedent.citation,
      court: m.precedent.court,
      year: m.precedent.year,
      disputeCategory: m.precedent.disputeCategory,
      similarityScore: m.similarityScore,
      similarityPercent: m.similarityPercent,
      ratioDecidendi: m.precedent.ratioDecidendi,
      statutesCited: m.precedent.statutesCited || [],
      commercialPrinciples: m.precedent.commercialPrinciples || [],
      rulingOutcome: m.precedent.rulingOutcome,
    }));

    // 3. Determine applicable statutory provisions and legal issues
    const allStatutes = new Set();
    const allPrinciples = new Set();
    topPrecedents.forEach(p => {
      (p.statutesCited || []).forEach(s => allStatutes.add(s));
      (p.commercialPrinciples || []).forEach(cp => allPrinciples.add(cp));
    });

    const statutesApplicable = Array.from(allStatutes).slice(0, 5);
    if (statutesApplicable.length === 0) {
      statutesApplicable.push(
        'Indian Contract Act 1872 - Section 73 (Compensation for breach of contract)',
        'Commercial Courts Act 2015 - Section 2(1)(c) (Commercial Dispute Definition)',
        'Specific Relief Act 1963 - Section 10 & 14 (Specific Performance)'
      );
    }

    // 4. Synthesize Legal Opinion & Arguments
    const primaryPrecedent = topPrecedents[0] || null;
    const synthesized = this.generateSynthesizedAnalysis(queryText, topPrecedents, primaryPrecedent);

    return {
      queryText,
      disputeCategory: primaryPrecedent ? primaryPrecedent.disputeCategory : 'Commercial Dispute',
      retrievedPrecedents: topPrecedents,
      synthesizedOpinion: synthesized.opinion,
      keyLegalIssues: synthesized.issues,
      statutesApplicable,
      petitionerArguments: synthesized.petitionerArgs,
      respondentArguments: synthesized.respondentArgs,
      settlementRiskLevel: synthesized.riskLevel,
      recommendedNextSteps: synthesized.nextSteps,
      vectorMetrics: {
        totalIndexedCases: vectorEngine.documents.length,
        topMatchScore: topPrecedents[0] ? topPrecedents[0].similarityPercent : 0,
        retrievalMethod: 'High-Dimensional Cosine Similarity (TF-IDF + Legal N-Grams)'
      }
    };
  }

  generateSynthesizedAnalysis(query, matches, primary) {
    const qLower = query.toLowerCase();

    // Determine core legal subject
    let subject = 'Breach of Commercial Agreement & Contractual Obligations';
    let riskLevel = 'Moderate';

    if (qLower.includes('force majeure') || qLower.includes('frustrat') || qLower.includes('impossib')) {
      subject = 'Force Majeure & Doctrine of Frustration (Section 56 Contract Act)';
      riskLevel = 'High';
    } else if (qLower.includes('arbitrat') || qLower.includes('award') || qLower.includes('section 34') || qLower.includes('section 9')) {
      subject = 'Arbitral Tribunal Jurisdiction & Setting Aside of Award (Section 34)';
      riskLevel = 'Moderate';
    } else if (qLower.includes('bank guarantee') || qLower.includes('guarantee') || qLower.includes('encash')) {
      subject = 'Interim Injunction against Unconditional Bank Guarantee Invocation';
      riskLevel = 'Critical';
    } else if (qLower.includes('liquidated damages') || qLower.includes('penalty') || qLower.includes('delay')) {
      subject = 'Enforceability of Liquidated Damages & Section 74 Proof of Loss';
      riskLevel = 'Moderate';
    } else if (qLower.includes('trade secret') || qLower.includes('non-compete') || qLower.includes('confidential')) {
      subject = 'Misuse of Proprietary Trade Secrets vs Section 27 Restraint of Trade';
      riskLevel = 'High';
    } else if (qLower.includes('insolven') || qLower.includes('ibc') || qLower.includes('nclt') || qLower.includes('operational debt')) {
      subject = 'Corporate Insolvency under IBC vs Pre-Existing Commercial Dispute';
      riskLevel = 'High';
    }

    // Synthesized opinion based on precedents
    const primaryRatio = primary 
      ? `Guided by the landmark ruling in "${primary.title}" (${primary.citation}), where the court held that "${primary.ratioDecidendi}".`
      : 'Applying the foundational principles of commercial certainty and strict contractual adherence.';

    const opinion = `
Based on an automated vector retrieval across indexed commercial dispute precedents, the dispute primarily centers on ${subject}.

${primaryRatio}

Commercial courts consistently scrutinize whether the obligations were absolute or contingent. If performance has become economically onerous or delayed due to market supply fluctuations, settled precedent dictates that commercial hardship alone does not excuse performance. However, if genuine impossibility or arbitrary forfeiture without demonstrable loss is proven, relief may be granted under Section 73/74. Parties are strongly advised to preserve all contemporaneous email correspondence, milestone logs, and breach notices.
    `.trim();

    // Issues
    const issues = [
      `Whether the alleged default constitutes an incurable repudiatory breach of the commercial contract.`,
      `Whether the aggrieved party has established measurable actual loss or is confined to reasonable liquidated compensation.`,
      `Whether statutory preconditions (e.g., cure notice periods, pre-institution mediation under Commercial Courts Act) were adhered to before initiating litigation.`,
      `Applicability of judicial precedent regarding "${primary ? primary.commercialPrinciples[0] || 'Sanctity of Contracts' : 'Contractual Good Faith'}".`
    ];

    // Petitioner / Claimant Pleadings
    const petitionerArgs = [
      `The Respondent committed an unequivocal breach of their core contractual commitments, causing direct financial disruption and supply chain damages.`,
      `Under Section 73 of the Indian Contract Act, the Claimant is entitled to restitution and compensation for losses naturally arising in the ordinary course of business.`,
      `The defence of Force Majeure or commercial difficulty is legally unsustainable, as market price volatility and operational hurdles are standard commercial risks.`,
      `Contemporaneous communications demonstrate repeated extensions and formal notices issued to the Respondent with zero remediation.`
    ];

    // Respondent / Defense Rebuttals
    const respondentArgs = [
      `The Claimant failed to establish actual demonstrable financial injury, rendering automatic liquidated damage claims an illegal penalty under Section 74.`,
      `External regulatory, logistical, or unforeseen impediments created an objective frustration of performance under Section 56 beyond reasonable control.`,
      `The Claimant failed in its statutory duty to mitigate losses as required under the explanation to Section 73 of the Contract Act.`,
      `The dispute contains complex factual controversies requiring reference to arbitration or commercial trial rather than summary determination.`
    ];

    const nextSteps = [
      'Issue formal Legal Notice detailing specific breach clauses and setting a 15-day cure timeline.',
      'Collate audited financial ledgers, purchase orders, and delivery logs to satisfy Section 73 proof-of-loss requirements.',
      'Check if mandatory Pre-Institution Mediation under Section 12A of the Commercial Courts Act 2015 is required prior to filing.',
      'Assess potential for interim protective relief under Section 9 of the Arbitration Act or Order 39 CPC.'
    ];

    return {
      opinion,
      issues,
      petitionerArgs,
      respondentArgs,
      riskLevel,
      nextSteps
    };
  }
}

module.exports = new RAGService();

