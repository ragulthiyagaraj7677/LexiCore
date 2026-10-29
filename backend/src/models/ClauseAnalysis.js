const mongoose = require('mongoose');

const ClauseAnalysisSchema = new mongoose.Schema({
  clauseType: {
    type: String,
    required: true,
  },
  clauseText: {
    type: String,
    required: true,
  },
  riskScore: {
    type: Number, // 0 - 100
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ['Low Risk', 'Moderate Risk', 'High Risk', 'Severe Dispute Vulnerability'],
    required: true,
  },
  vulnerabilities: [String],
  recommendations: [String],
  renegotiatedDraft: String,
  relevantLegalPrecedent: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ClauseAnalysis', ClauseAnalysisSchema);

