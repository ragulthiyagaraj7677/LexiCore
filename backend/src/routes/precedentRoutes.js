const express = require('express');
const router = express.Router();
const precedentController = require('../controllers/precedentController');

router.get('/', precedentController.getAllPrecedents);
router.get('/stats', precedentController.getStats);
router.post('/vector-search', precedentController.searchPrecedentsVector);
router.get('/:id', precedentController.getPrecedentById);
router.post('/', precedentController.createPrecedent);

module.exports = router;

