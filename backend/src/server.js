require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');
const vectorEngine = require('./services/vectorEngine');

const precedentRoutes = require('./routes/precedentRoutes');
const researchRoutes = require('./routes/researchRoutes');
const clauseRoutes = require('./routes/clauseRoutes');
const briefRoutes = require('./routes/briefRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'LexiCore AI - Commercial Legal Research Assistant',
    database: getDBStatus(),
    vectorEngine: {
      indexedDocuments: vectorEngine.documents.length,
      vocabularySize: vectorEngine.vocabulary.size,
      status: 'Ready',
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/precedents', precedentRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/clauses', clauseRoutes);
app.use('/api/briefs', briefRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error in Legal Intelligence Engine',
  });
});

app.listen(PORT, () => {
  console.log(`=====================================================`);
  console.log(`⚖️  LexiCore Legal AI Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Precedents:  http://localhost:${PORT}/api/precedents`);
  console.log(`🔍 Vector RAG:   http://localhost:${PORT}/api/research/query`);
  console.log(`=====================================================`);
});

