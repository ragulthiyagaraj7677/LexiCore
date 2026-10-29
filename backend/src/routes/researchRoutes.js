const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');

router.post('/query', researchController.processResearchQuery);
router.get('/history', researchController.getQueryHistory);

module.exports = router;

