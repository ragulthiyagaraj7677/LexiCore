const express = require('express');
const router = express.Router();
const clauseController = require('../controllers/clauseController');

router.post('/analyze', clauseController.analyzeContractClause);
router.get('/history', clauseController.getClauseHistory);

module.exports = router;

