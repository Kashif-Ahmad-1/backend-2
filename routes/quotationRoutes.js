const express = require("express");
const { saveQuotation, upload, getAllQuotations,editQuotation,updateQuotationStatus } = require("../controllers/quotationController");

const router = express.Router();

// Route to save quotation and upload PDF
router.post("/", upload.single('pdf'), saveQuotation);

// Route to get all quotations
router.get("/", getAllQuotations); // Add this line
router.put('/:id', editQuotation);
router.put('/:id/status', updateQuotationStatus);

module.exports = router;
