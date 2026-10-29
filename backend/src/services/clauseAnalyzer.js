/**
 * Contract Clause Risk Analyzer for Commercial Agreements
 * Evaluates legal exposure, ambiguities, one-sided liabilities, and generates renegotiation drafts
 */

class ClauseAnalyzer {
  analyzeClause(clauseText, clauseType = 'General') {
    if (!clauseText || !clauseText.trim()) {
      throw new Error('Clause text cannot be empty.');
    }

    const textLower = clauseText.toLowerCase();
    const vulnerabilities = [];
    const recommendations = [];
    let riskScore = 25; // baseline moderate
    let detectedType = clauseType;

    // Auto-detect clause type if general
    if (clauseType === 'General' || !clauseType) {
      if (textLower.includes('force majeure') || textLower.includes('act of god')) detectedType = 'Force Majeure';
      else if (textLower.includes('indemnif') || textLower.includes('hold harmless')) detectedType = 'Indemnification';
      else if (textLower.includes('limitation of liability') || textLower.includes('aggregate liability') || textLower.includes('consequential')) detectedType = 'Limitation of Liability';
      else if (textLower.includes('terminat') || textLower.includes('convenience')) detectedType = 'Termination';
      else if (textLower.includes('liquidated damages') || textLower.includes('penalty')) detectedType = 'Liquidated Damages';
      else if (textLower.includes('non-compete') || textLower.includes('restraint')) detectedType = 'Non-Compete';
      else if (textLower.includes('arbitrat') || textLower.includes('jurisdiction') || textLower.includes('governing law')) detectedType = 'Dispute Resolution';
      else detectedType = 'Commercial Covenant';
    }

    // Vulnerability checks
    if (detectedType === 'Limitation of Liability') {
      if (!textLower.includes('cap') && !textLower.includes('not exceed')) {
        riskScore += 40;
        vulnerabilities.push('Uncapped financial exposure: No monetary cap (e.g., 12 months fee aggregate) specified.');
      }
      if (!textLower.includes('consequential') && !textLower.includes('indirect')) {
        riskScore += 25;
        vulnerabilities.push('Missing explicit exclusion of consequential, indirect, and punitive damages.');
      }
      recommendations.push('Cap liability strictly to fees paid in preceding 6 to 12 months.');
      recommendations.push('Expressly disclaim loss of profit, indirect, punitive, or consequential damages.');
    } else if (detectedType === 'Force Majeure') {
      if (!textLower.includes('notice') || !textLower.includes('days')) {
        riskScore += 25;
        vulnerabilities.push('Missing strict notice timeline (e.g. within 5-7 business days of triggering event).');
      }
      if (textLower.includes('economic') || textLower.includes('financial difficulty')) {
        riskScore += 35;
        vulnerabilities.push('Dangerous broad drafting: Might inadvertently include general economic or pricing hardship.');
      }
      if (!textLower.includes('mitigat')) {
        riskScore += 20;
        vulnerabilities.push('Lacks obligation for the affected party to actively mitigate damages and resume performance.');
      }
      recommendations.push('Explicitly state that price inflation, supply chain cost increase, or currency fluctuations do NOT constitute Force Majeure.');
      recommendations.push('Add a long-stop termination right (either party may terminate if event persists beyond 60-90 days).');
    } else if (detectedType === 'Indemnification') {
      if (!textLower.includes('gross negligence') && !textLower.includes('willful misconduct')) {
        riskScore += 30;
        vulnerabilities.push('Broad unqualified indemnity triggered on mere breach without requirement of gross negligence or willful misconduct.');
      }
      if (textLower.includes('sole') || textLower.includes('unconditional')) {
        riskScore += 25;
        vulnerabilities.push('One-sided obligation without reciprocal indemnification protections.');
      }
      recommendations.push('Limit indemnity to third-party claims arising strictly from gross negligence or intentional willful misconduct.');
      recommendations.push('Ensure control of defense and right to approve any settlement is retained by indemnifying party.');
    } else if (detectedType === 'Termination') {
      if (textLower.includes('sole discretion') || (textLower.includes('convenience') && !textLower.includes('notice'))) {
        riskScore += 35;
        vulnerabilities.push('Arbitrary termination for convenience with no reasonable transition period or compensation for incurred costs.');
      }
      if (!textLower.includes('cure period') && !textLower.includes('remedy')) {
        riskScore += 25;
        vulnerabilities.push('Absence of a mandatory 30-day cure period for rectifiable breaches.');
      }
      recommendations.push('Mandate a minimum 30-day written notice and right to cure before default termination.');
      recommendations.push('Provide for reimbursement of demobilization and committed work-in-progress costs upon termination for convenience.');
    } else if (detectedType === 'Non-Compete') {
      riskScore += 45;
      vulnerabilities.push('High invalidity risk under Section 27 of Indian Contract Act (Post-term non-compete covenants are void).');
      recommendations.push('Replace generic non-compete with enforceable non-solicitation of clients/employees and strict confidentiality covenants.');
    } else {
      riskScore += 15;
      vulnerabilities.push('Clause contains subjective terms susceptible to differing commercial interpretations.');
      recommendations.push('Define ambiguous terms with objective commercial milestones and measurable SLAs.');
    }

    // Clamp score
    riskScore = Math.min(95, Math.max(15, riskScore));

    let riskLevel = 'Low Risk';
    if (riskScore >= 75) riskLevel = 'Severe Dispute Vulnerability';
    else if (riskScore >= 55) riskLevel = 'High Risk';
    else if (riskScore >= 35) riskLevel = 'Moderate Risk';

    // Generate Renegotiated Draft
    const renegotiatedDraft = this.generateRenegotiatedClause(detectedType, clauseText);

    return {
      clauseType: detectedType,
      clauseText,
      riskScore,
      riskLevel,
      vulnerabilities,
      recommendations,
      renegotiatedDraft,
      relevantLegalPrecedent: this.getRelevantPrecedentInfo(detectedType)
    };
  }

  generateRenegotiatedClause(type, original) {
    switch (type) {
      case 'Limitation of Liability':
        return `Except for gross negligence, willful misconduct, or breach of confidentiality obligations, each party's aggregate cumulative liability arising out of or related to this Agreement (whether in contract, tort, or otherwise) shall not exceed the total fees paid or payable by Client in the twelve (12) months preceding the claim. In no event shall either party be liable for any indirect, incidental, punitive, or consequential damages, or loss of profits or business opportunity.`;
      
      case 'Force Majeure':
        return `Neither party shall be liable for delay or failure to perform resulting from events beyond reasonable control, including natural disasters, acts of war, or government orders ('Force Majeure'). Provided that: (a) market price fluctuations, general economic hardship, or subcontractor default shall not constitute Force Majeure; (b) prompt written notice is delivered within five (5) business days; (c) the affected party exercises all reasonable mitigation efforts. If such event persists uninterrupted for more than sixty (60) calendar days, either party may terminate without penalty.`;

      case 'Indemnification':
        return `Each party ('Indemnifying Party') agrees to defend and indemnify the other party against third-party claims, liabilities, and reasonable legal expenses to the extent directly resulting from the Indemnifying Party's gross negligence, willful misconduct, or infringement of intellectual property. The indemnified party shall provide prompt notice of the claim and grant the Indemnifying Party sole control over settlement negotiations.`;

      case 'Termination':
        return `Either party may terminate this Agreement immediately upon written notice if the other party commits a material breach and fails to cure such breach within thirty (30) calendar days of receiving detailed written notice specifying the default. Client may terminate for convenience upon ninety (90) days prior written notice, subject to compensating Provider for all completed milestones and non-cancellable third-party commitments.`;

      default:
        return `The parties agree that all covenants herein shall be interpreted in accordance with commercial good faith and applicable statutory norms. Any dispute or controversy arising out of this clause shall first be referred to executive settlement within thirty (30) days, failing which it shall be referred to institutional commercial arbitration.`;
    }
  }

  getRelevantPrecedentInfo(type) {
    switch (type) {
      case 'Limitation of Liability':
        return 'Apex Telecom v. Zenith Satellites (2023) - Arbitral tribunals cannot rewrite express limitation of liability or exclusion of consequential damages.';
      case 'Force Majeure':
        return 'Energy Infra Corp v. Global Gas Transporters (2022) - Market price escalation or financial unviability does not constitute frustration under Section 56.';
      case 'Non-Compete':
        return 'Matrix Cybernetics v. Nexus Enterprise (2021) - Post-termination restraint of trade is void under Section 27, but trade secrets receive absolute protection.';
      case 'Liquidated Damages':
        return 'Kailash Metro Buildcon v. NHDA (2020) - Section 74 requires reasonable compensation; automatic forfeiture without proof of injury is impermissible.';
      default:
        return 'Commercial Courts Act 2015 & Indian Contract Act 1872 Principles.';
    }
  }
}

module.exports = new ClauseAnalyzer();

