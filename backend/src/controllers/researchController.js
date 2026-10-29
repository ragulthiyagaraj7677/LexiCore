const ragService = require('../services/ragService');
const ResearchQuery = require('../models/ResearchQuery');

// In-memory query history fallback
let queryHistory = [];

exports.processResearchQuery = async (req, res) => {
  try {
    const { queryText, categoryFilter } = req.body;
    if (!queryText || !queryText.trim()) {
      return res.status(400).json({ success: false, message: 'Dispute query text is required.' });
    }

    const ragResult = await ragService.processLegalQuery(queryText, categoryFilter);

    let savedRecord = {
      _id: `q_${Date.now()}`,
      ...ragResult,
      createdAt: new Date(),
    };

    try {
      const dbSaved = await ResearchQuery.create(ragResult);
      savedRecord = dbSaved.toObject();
    } catch (e) {
      // local memory mode
    }

    queryHistory.unshift(savedRecord);
    if (queryHistory.length > 50) queryHistory.pop();

    return res.json({
      success: true,
      data: savedRecord,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQueryHistory = async (req, res) => {
  try {
    let list = queryHistory;
    try {
      const dbList = await ResearchQuery.find().sort({ createdAt: -1 }).limit(20);
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

