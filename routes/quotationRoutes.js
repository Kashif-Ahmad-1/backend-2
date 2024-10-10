const express = require("express");
const { saveQuotation, upload, getAllQuotations,editQuotation,updateQuotationStatus,deleteQuotation,getQuotationSummary,getQuotationById,getAdminQuotationSummary,getQuotationsByEngineer } = require("../controllers/quotationController");
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

// Route to save quotation and upload PDF
router.post("/",authMiddleware, upload.single('pdf') ,saveQuotation);

// Route to get all quotations
router.get("/",authMiddleware, getAllQuotations); // Add this line
router.put('/:id', authMiddleware,editQuotation);
router.put('/:id/status',authMiddleware, updateQuotationStatus);
router.delete("/:id",authMiddleware, deleteQuotation);
router.get('/summary', authMiddleware,getQuotationSummary);
router.get('/admin/summary', authMiddleware,getAdminQuotationSummary);
router.get('/engineer/:engineerId', authMiddleware, getQuotationsByEngineer);
router.get('/edit/:id', getQuotationById);

module.exports = router;
