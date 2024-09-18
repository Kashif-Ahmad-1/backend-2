const express = require('express');
const { getUsers, getEngineers, getAccountants, getAdmins } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/engineers', authMiddleware, getEngineers);
router.get('/accountants', authMiddleware, getAccountants);
router.get('/admins', authMiddleware, getAdmins);

module.exports = router;









