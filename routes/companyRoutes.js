const express = require('express');
const {
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanies
} = require('../controllers/companyController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addCompany);
router.put('/:id', authMiddleware, updateCompany);
router.delete('/:id', authMiddleware, deleteCompany);
router.get('/', authMiddleware, getCompanies); 

// Add this line to your existing companyRoutes.js
// router.get('/search', authMiddleware, searchCompanies);

module.exports = router;
