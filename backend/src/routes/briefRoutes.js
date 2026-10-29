const express = require('express');
const router = express.Router();
const briefController = require('../controllers/briefController');

router.post('/generate', briefController.generateCaseBrief);
router.get('/history', briefController.getBriefHistory);

module.exports = router;

