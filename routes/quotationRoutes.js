const express = require('express');
const { createQuotation, getQuotationsForAppointment, upload } = require('../controllers/quotationController');

const router = express.Router();

// Route to create a quotation
router.post('/', upload.single('fileField'), createQuotation);

// Route to get all quotations for a specific appointment
router.get('/:appointmentId', getQuotationsForAppointment);

module.exports = router;
