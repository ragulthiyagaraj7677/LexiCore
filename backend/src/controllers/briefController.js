const CaseBrief = require('../models/CaseBrief');
const vectorEngine = require('../services/vectorEngine');

let briefHistory = [];

exports.generateCaseBrief = async (req, res) => {
  try {
    const { title, petitioner, respondent, disputeSummary, jurisdiction = 'Commercial Court / High Court' } = req.body;

    if (!title || !disputeSummary) {
      return res.status(400).json({ success: false, message: 'Title and Dispute Summary are required.' });
    }

    // Vector retrieval for authoritative precedents
    const matched = vectorEngine.search(disputeSummary, 3);
    const authoritativePrecedents = matched.map(m => ({
      title: m.precedent.title,
      citation: m.precedent.citation,
      relevance: `${m.similarityPercent}% relevance - Ratio: ${m.precedent.ratioDecidendi.slice(0, 140)}...`,
    }));

    const briefData = {
      title,
      parties: {
        petitioner: petitioner || 'Claimant / Aggrieved Enterprise',
        respondent: respondent || 'Respondent / Defaulting Entity',
      },
      disputeSummary,
      jurisdiction,
      governingLaw: [
        'Commercial Courts Act 2015',
        'Indian Contract Act 1872 (Sections 39, 56, 73, 74)',
        'Arbitration and Conciliation Act 1996 (Sections 9, 11, 34)',
        'Specific Relief Act 1963'
      ],
      issuesPosed: [
        'Whether the Respondent’s failure to perform constitutes an anticipatory/repudiatory breach entitling damages.',
        'Whether the defense of commercial impossibility or force majeure is established under the four corners of the contract.',
        'Whether the claimant has fulfilled pre-institution mediation preconditions or is entitled to urgent interim protection.'
      ],
      petitionerPleadings: [
        'Respondent breached strict delivery and milestone schedules agreed under Clause 12 of the Commercial Agreement.',
        'Claimant suffered demonstrable business disruption and financial damages compensable under Section 73.',
        'No valid Force Majeure notice was served within the stipulated contractual period.'
      ],
      respondentRebuttals: [
        'Unprecedented external market impediments disrupted upstream supply chains beyond reasonable mitigation.',
        'Liquidated damages claimed by Petitioner are exorbitant, penal in nature, and unsupported by audited proof of injury under Section 74.',
        'Dispute is subject to mandatory escalation and confidential commercial mediation before curial intervention.'
      ],
      authoritativePrecedents,
      strategicCounselOpinion: `Given the contractual terms and the retrieved judicial precedents, the Petitioner possesses a strong prima facie case for damages. Counsel recommends immediate issuance of a formal Cure-or-Litigate notice, calculation of itemized ledger losses, and exploration of Section 9 interim measures if assets are at risk of dissipation.`
    };

    let record = {
      _id: `cb_${Date.now()}`,
      ...briefData,
      createdAt: new Date(),
    };

    try {
      const dbDoc = await CaseBrief.create(briefData);
      record = dbDoc.toObject();
    } catch (e) {}

    briefHistory.unshift(record);
    if (briefHistory.length > 50) briefHistory.pop();

    return res.status(201).json({
      success: true,
      message: 'Legal Brief generated and formatted successfully.',
      data: record,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBriefHistory = async (req, res) => {
  try {
    let list = briefHistory;
    try {
      const dbList = await CaseBrief.find().sort({ createdAt: -1 }).limit(20);
      if (dbList && dbList.length > 0) list = dbList.map(d => d.toObject());
    } catch (e) {}

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

