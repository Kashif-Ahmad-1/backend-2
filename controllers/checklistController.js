const Checklist = require("../models/Checklist");
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

// Save checklist and link it to an existing appointment
const saveChecklist = async (req, res) => {
  try {
    if (!req.body.checklistData) {
      return res.status(400).json({ message: 'Checklist data is required.' });
    }

    let appointmentId, clientInfo,invoiceNo;

    // Attempt to parse checklistData
    try {
      const { appointmentId: id, clientInfo: info, invoiceNo:string } = JSON.parse(req.body.checklistData);
      appointmentId = id;
      clientInfo = info;
      invoiceNo = string;
    } catch (jsonError) {
      console.log('JSON parsing error:', jsonError);
      return res.status(400).json({ message: 'Invalid JSON format for checklist data.' });
    }

    // Create a new Checklist instance
    const newChecklist = new Checklist({
      clientInfo,
      appointmentId,
      invoiceNo,
      pdfPath: req.file ? req.file.path : null,
      createdBy: req.user.userId,
    });

    // Save the checklist to the database
    const savedChecklist = await newChecklist.save();

    // Update the appointment to link the checklist
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.checklists.push(savedChecklist._id); // Add checklist ID to appointment
    await appointment.save();

    res.status(201).json({ checklist: savedChecklist, appointment });
  } catch (error) {
    console.error('Error saving checklist:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find({ createdBy: req.user.userId }).populate('appointmentId'); // Optionally populate appointment data
    res.status(200).json(checklists);
  } catch (error) {
    console.error('Error fetching checklists:', error);
    res.status(500).json({ message: error.message });
  }
};

const editChecklist = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    const { clientInfo, appointmentId } = req.body; // Extract data from the request body

    // Find the checklist by ID and update it
    const updatedChecklist = await Checklist.findByIdAndUpdate(
      id,
      { clientInfo, appointmentId,invoiceNo },
      { new: true } // Return the updated document
    );

    if (!updatedChecklist) {
      return res.status(404).json({ message: 'Checklist not found.' });
    }

    res.status(200).json({ checklist: updatedChecklist });
  } catch (error) {
    console.error('Error editing checklist:', error);
    res.status(500).json({ message: error.message });
  }
};

// New delete function
const deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters

    // Find and delete the checklist by ID
    const deletedChecklist = await Checklist.findByIdAndDelete(id);
    if (!deletedChecklist) {
      return res.status(404).json({ message: 'Checklist not found.' });
    }

    // Optionally, update the related appointment
    const appointment = await Appointment.findById(deletedChecklist.appointmentId);
    if (appointment) {
      appointment.checklists.pull(deletedChecklist._id);
      await appointment.save();
    }

    res.status(200).json({ message: 'Checklist deleted successfully.' });
  } catch (error) {
    console.error('Error deleting checklist:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveChecklist,
  upload,
  getAllChecklists,
  editChecklist,
  deleteChecklist, // Export the new function
};
