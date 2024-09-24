const multer = require('multer');
const path = require('path');
const Quotation = require('../models/Quotation');
const Appointment = require('../models/Appointment');


// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a quotation
exports.createQuotation = async (req, res) => {
  try {
    if (!req.body.quotationData) {
      return res.status(400).json({ error: 'Quotation data is required' });
    }

    const { appointmentId, quotationData } = JSON.parse(req.body.quotationData);
    const pdfPath = req.file.path;

    // Check if the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const newQuotation = new Quotation({
      appointmentId,
      quotationData,
      pdfPath,
    });

    await newQuotation.save();
    res.status(201).json({ message: 'Quotation created successfully', quotation: newQuotation });
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all quotations for an appointment
exports.getQuotationsForAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const quotations = await Quotation.find({ appointmentId });
    res.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the multer upload instance for use in routes
exports.upload = upload;
