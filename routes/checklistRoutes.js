const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');

router.post('/', checklistController.saveChecklist);
router.get('/:clientId', checklistController.getChecklistsByClientId);

module.exports = router;
