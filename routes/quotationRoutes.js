const express = require("express");
const { saveQuotation, upload, getAllQuotations,editQuotation,updateQuotationStatus } = require("../controllers/quotationController");
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

// Route to save quotation and upload PDF
router.post("/",authMiddleware, upload.single('pdf') ,saveQuotation);

// Route to get all quotations
router.get("/",authMiddleware, getAllQuotations); // Add this line
router.put('/:id', editQuotation);
router.put('/:id/status', updateQuotationStatus);

module.exports = router;
