const Precedent = require('../models/Precedent');
const vectorEngine = require('../services/vectorEngine');
const seedPrecedents = require('../seed/commercialPrecedents.json');

// In-memory cache synced with Vector Engine
let inMemoryStore = [...seedPrecedents.map((p, idx) => ({ ...p, _id: `prec_${idx + 1}` }))];

const initPrecedents = async () => {
  try {
    const count = await Precedent.countDocuments();
    if (count > 0) {
      const docs = await Precedent.find();
      inMemoryStore = docs.map(d => d.toObject());
    }
  } catch (err) {
    // MongoDB offline, use seedPrecedents
    inMemoryStore = seedPrecedents.map((p, idx) => ({ ...p, _id: `prec_${idx + 1}` }));
  }
  vectorEngine.buildVocabulary(inMemoryStore);
};

// Initialize index on startup
initPrecedents();

exports.getAllPrecedents = async (req, res) => {
  try {
    const { category, search, court, year } = req.query;
    let list = inMemoryStore;

    try {
      const dbDocs = await Precedent.find();
      if (dbDocs && dbDocs.length > 0) {
        list = dbDocs.map(d => d.toObject());
      }
    } catch (e) {
      // fallback to inMemoryStore
    }

    if (category && category !== 'All') {
      list = list.filter(p => p.disputeCategory === category);
    }
    if (court && court !== 'All') {
      list = list.filter(p => p.court.toLowerCase().includes(court.toLowerCase()));
    }
    if (year) {
      list = list.filter(p => p.year.toString() === year.toString());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.citation.toLowerCase().includes(q) ||
        p.facts.toLowerCase().includes(q) ||
        p.ratioDecidendi.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPrecedentById = async (req, res) => {
  try {
    const { id } = req.params;
    let found = inMemoryStore.find(p => p._id.toString() === id.toString() || p.citation === id);

    try {
      const dbDoc = await Precedent.findById(id);
      if (dbDoc) found = dbDoc.toObject();
    } catch (e) {}

    if (!found) {
      return res.status(404).json({ success: false, message: 'Precedent not found' });
    }

    return res.json({ success: true, data: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchPrecedentsVector = async (req, res) => {
  try {
    const { query, category, topK = 4 } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required for vector search' });
    }

    const results = vectorEngine.search(query, parseInt(topK), category);
    return res.json({
      success: true,
      query,
      resultsCount: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPrecedent = async (req, res) => {
  try {
    const precedentData = req.body;
    let newDoc = {
      ...precedentData,
      _id: `prec_${Date.now()}`,
      createdAt: new Date(),
    };

    try {
      const dbCreated = await Precedent.create(precedentData);
      newDoc = dbCreated.toObject();
    } catch (e) {
      // local fallback
    }

    inMemoryStore.push(newDoc);
    vectorEngine.buildVocabulary(inMemoryStore);

    return res.status(201).json({
      success: true,
      message: 'Commercial precedent ingested and indexed into Vector DB successfully',
      data: newDoc,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = inMemoryStore.length;
    const categoryCounts = {};
    inMemoryStore.forEach(p => {
      categoryCounts[p.disputeCategory] = (categoryCounts[p.disputeCategory] || 0) + 1;
    });

    return res.json({
      success: true,
      data: {
        totalCases: total,
        vocabularyDimension: vectorEngine.vocabulary.size,
        categoryCounts,
        recentCases: inMemoryStore.slice(-3),
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

