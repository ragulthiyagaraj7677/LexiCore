const clauseAnalyzer = require('../services/clauseAnalyzer');
const ClauseAnalysis = require('../models/ClauseAnalysis');

let clauseHistory = [];

exports.analyzeContractClause = async (req, res) => {
  try {
    const { clauseText, clauseType } = req.body;
    if (!clauseText || !clauseText.trim()) {
      return res.status(400).json({ success: false, message: 'Contract clause text is required.' });
    }

    const analysisResult = clauseAnalyzer.analyzeClause(clauseText, clauseType);

    let record = {
      _id: `ca_${Date.now()}`,
      ...analysisResult,
      createdAt: new Date(),
    };

    try {
      const dbDoc = await ClauseAnalysis.create(analysisResult);
      record = dbDoc.toObject();
    } catch (e) {}

    clauseHistory.unshift(record);
    if (clauseHistory.length > 50) clauseHistory.pop();

    return res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClauseHistory = async (req, res) => {
  try {
    let list = clauseHistory;
    try {
      const dbList = await ClauseAnalysis.find().sort({ createdAt: -1 }).limit(20);
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

