const Quotation = require("../models/Quotation");
const multer = require("multer");
const path = require("path");
const Appointment = require("../models/Appointment");
const cloudinary = require("cloudinary").v2;
// File storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
//   },
// });
// 
// const upload = multer({ storage });



// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Use memory storage to handle uploads directly
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



    // Upload file to Cloudinary
    let pdfPath = null;
    if (req.file) {
      // Use a promise to wait for the upload to complete
      pdfPath = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result.secure_url); // Get the uploaded file's URL
            }
          }
        );

        stream.end(req.file.buffer); // Send the file buffer to Cloudinary
      });
    }


    // Create a new Quotation instance, with the `createdBy` set to the authenticated engineer's ID
    const newQuotation = new Quotation({
      clientInfo,
      appointmentId,
      quotationNo,
      quotationAmount, // Include quotationAmount here
      pdfPath,
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
    const isAdmin = req.user.role === 'admin';
    const quotations = await Quotation.find(isAdmin ? {} : { createdBy: req.user.userId }).populate('appointmentId');
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

    const isAdmin = req.user.role === 'admin';
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found.' });
    }

    // Check if the user is an admin or the creator of the quotation
    if (!isAdmin && quotation.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this quotation.' });
    }

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

    // Check if the user is an admin or the creator of the quotation
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && quotation.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to update this quotation status.' });
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

const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found.' });
    }

    // Check if the user is an admin or the creator of the quotation
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && quotation.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this quotation.' });
    }

    // Delete the quotation
    await Quotation.findByIdAndDelete(id);

    // Optionally, update the related appointment
    const appointment = await Appointment.findById(quotation.appointmentId);
    if (appointment) {
      appointment.quotations.pull(quotation._id);
      await appointment.save();
    }

    res.status(200).json({ message: 'Quotation deleted successfully.' });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    res.status(500).json({ message: error.message });
  }
};

const getQuotationSummary = async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the request
    const quotations = await Quotation.find({ createdBy: userId });

    // Calculate total, pending, and completed amounts
    let totalAmount = 0;
    let pendingAmount = 0;
    let completedAmount = 0;

    quotations.forEach(quotation => {
      totalAmount += quotation.quotationAmount || 0;
      if (quotation.status) {
        completedAmount += quotation.quotationAmount || 0;
      } else {
        pendingAmount += quotation.quotationAmount || 0;
      }
    });

    res.status(200).json({
      totalAmount,
      pendingAmount,
      completedAmount,
      totalQuotations: quotations.length,
    });
  } catch (error) {
    console.error('Error fetching quotation summary:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAdminQuotationSummary = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Fetch all quotations
    const quotations = await Quotation.find();

    // Calculate totals
    const totalAmount = quotations.reduce((sum, q) => sum + (q.quotationAmount || 0), 0);
    const pendingAmount = quotations
      .filter(q => !q.status)
      .reduce((sum, q) => sum + (q.quotationAmount || 0), 0);
    const completedAmount = totalAmount - pendingAmount;

    // Group quotations by user
    const userSummary = quotations.reduce((acc, q) => {
      const userId = q.createdBy.toString();
      if (!acc[userId]) {
        acc[userId] = {
          totalAmount: 0,
          pendingAmount: 0,
          completedAmount: 0,
          totalQuotations: 0,
        };
      }
      acc[userId].totalAmount += q.quotationAmount || 0;
      acc[userId].totalQuotations += 1;
      if (!q.status) {
        acc[userId].pendingAmount += q.quotationAmount || 0;
      } else {
        acc[userId].completedAmount += q.quotationAmount || 0;
      }
      return acc;
    }, {});

    res.status(200).json({ 
      totalAmount, 
      pendingAmount, 
      completedAmount, 
      userSummary 
    });
  } catch (error) {
    console.error('Error fetching admin quotation summary:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveQuotation,
  upload,
  getAllQuotations,
  editQuotation,
  updateQuotationStatus,
  deleteQuotation,
  getQuotationSummary,
  getAdminQuotationSummary // Export the delete function
};
