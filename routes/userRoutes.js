const express = require('express');
const { getUsers, getEngineers, getAccountants, getAdmins } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/engineers', authMiddleware, getEngineers);
router.get('/accountants', authMiddleware, getAccountants);
router.get('/admins', authMiddleware, getAdmins);

module.exports = router;







// const express = require('express');
// const { getUsers,getEngineers ,getAccountants,getAdmins,getEngineersForAccountant} = require('../controllers/userController');
// const { authMiddleware } = require('../middleware/authMiddleware');
// const router = express.Router();

// router.get('/', authMiddleware, getUsers);
// router.get('/engineers', authMiddleware, getEngineers);

// router.get('/accountants', authMiddleware, getAccountants);
// router.get('/admins', authMiddleware, getAdmins);
// // router.get('/engineers45', authMiddleware, getEngineersForAccountant);


// // router.get('/users/:role', authMiddleware, getUsersByRole);
// module.exports = router;








