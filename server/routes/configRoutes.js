const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Configuration routes
router.get('/', configController.getConfig);
router.post('/', configController.updateConfig);

// Criteria routes
router.get('/criteria', configController.getCriteria);
router.post('/criteria', configController.addCriteria);
router.delete('/criteria', configController.removeCriteria);

// Reset route
router.post('/reset', configController.resetAll);

module.exports = router;
