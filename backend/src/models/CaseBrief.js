const mongoose = require('mongoose');

const CaseBriefSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  parties: {
    petitioner: String,
    respondent: String,
  },
  disputeSummary: {
    type: String,
    required: true,
  },
  jurisdiction: String,
  governingLaw: [String],
  issuesPosed: [String],
  petitionerPleadings: [String],
  respondentRebuttals: [String],
  authoritativePrecedents: [
    {
      title: String,
      citation: String,
      relevance: String,
    }
  ],
  strategicCounselOpinion: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('CaseBrief', CaseBriefSchema);

