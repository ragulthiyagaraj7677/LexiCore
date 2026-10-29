const mongoose = require('mongoose');

const ResearchQuerySchema = new mongoose.Schema({
  queryText: {
    type: String,
    required: true,
  },
  disputeCategory: {
    type: String,
    default: 'General Commercial Dispute',
  },
  retrievedPrecedents: [
    {
      precedentId: String,
      title: String,
      citation: String,
      court: String,
      year: Number,
      disputeCategory: String,
      similarityScore: Number,
      similarityPercent: Number,
      ratioDecidendi: String,
      statutesCited: [String],
      commercialPrinciples: [String],
      rulingOutcome: String,
    }
  ],
  synthesizedOpinion: {
    type: String,
    required: true,
  },
  keyLegalIssues: [String],
  statutesApplicable: [String],
  petitionerArguments: [String],
  respondentArguments: [String],
  recommendedNextSteps: [String],
  settlementRiskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate',
  },
  vectorMetrics: {
    totalIndexedCases: Number,
    topMatchScore: Number,
    retrievalMethod: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ResearchQuery', ResearchQuerySchema);

