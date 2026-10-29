const mongoose = require('mongoose');

const PrecedentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  citation: {
    type: String,
    required: true,
    trim: true,
  },
  court: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  disputeCategory: {
    type: String,
    required: true,
    enum: [
      'Breach of Contract',
      'Commercial Arbitration',
      'Insolvency & Bankruptcy',
      'IP & Trade Secrets',
      'Shareholder & Corporate',
      'Banking & Financial Debt',
      'Liquidated Damages & Construction'
    ],
  },
  facts: {
    type: String,
    required: true,
  },
  keyIssues: [
    {
      type: String,
    }
  ],
  ratioDecidendi: {
    type: String,
    required: true,
  },
  statutesCited: [
    {
      type: String,
    }
  ],
  rulingOutcome: {
    type: String, // e.g. "Allowed", "Dismissed", "Referred to Arbitration"
    required: true,
  },
  commercialPrinciples: [
    {
      type: String,
    }
  ],
  embedding: {
    type: [Number],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Precedent', PrecedentSchema);

