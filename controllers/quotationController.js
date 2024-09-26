const Quotation = require("../models/Quotation");
const multer = require("multer");
const path = require("path");
const Appointment = require("../models/Appointment");

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

const upload = multer({ storage });

// Save quotation and link it to an existing appointment
const saveQuotation = async (req, res) => {
  try {
    if (!req.body.quotationData) {
      console.log('Quotation data is missing.');
      return res.status(400).json({ message: 'Quotation data is required.' });
    }

    let appointmentId, clientInfo, quotationNo, quotationAmount;

    // Attempt to parse quotationData
    try {
      const { appointmentId: id, clientInfo: info, quotationNo: string, quotationAmount: amount } = JSON.parse(req.body.quotationData);
      appointmentId = id;
      clientInfo = info;
      quotationNo = string;
      quotationAmount = amount; // Assign quotationAmount
    } catch (jsonError) {
      console.log('JSON parsing error:', jsonError);
      return res.status(400).json({ message: 'Invalid JSON format for quotation data.' });
    }

    // Create a new Quotation instance, with the `createdBy` set to the authenticated engineer's ID
    const newQuotation = new Quotation({
      clientInfo,
      appointmentId,
      quotationNo,
      quotationAmount, // Include quotationAmount here
      pdfPath: req.file ? req.file.path : null,
      status: false, 
      createdBy: req.user.userId // Assuming userId is stored in the JWT
    });

    const savedQuotation = await newQuotation.save();
    console.log('Saved quotation:', savedQuotation);

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log('Appointment not found for ID:', appointmentId);
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.quotations.push(savedQuotation._id);
    await appointment.save();

    res.status(201).json({ quotation: savedQuotation, appointment });
  } catch (error) {
    console.error('Error saving quotation:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ createdBy: req.user.userId }).populate('appointmentId');
    res.status(200).json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ message: error.message });
  }
};

const editQuotation = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    const { clientInfo, appointmentId, quotationNo, quotationAmount } = req.body; // Extract data from the request body

    // Find the quotation by ID and update it
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      id,
      { clientInfo, appointmentId, quotationNo, quotationAmount }, // Include quotationAmount in update
      { new: true } // Return the updated document
    );

    if (!updatedQuotation) {
      return res.status(404).json({ message: 'Quotation not found.' });
    }

    res.status(200).json({ quotation: updatedQuotation });
  } catch (error) {
    console.error('Error editing quotation:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found.' });
    }

    // Toggle the status
    quotation.status = !quotation.status; 
    await quotation.save();

    res.status(200).json({ message: 'Quotation status updated.', quotation });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveQuotation,
  upload,
  getAllQuotations,
  editQuotation,
  updateQuotationStatus // Add this line to export the new function
};
