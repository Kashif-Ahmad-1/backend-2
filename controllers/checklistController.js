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
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Save checklist and link it to an existing appointment
const saveChecklist = async (req, res) => {
  try {
    const { appointmentId, checklistData } = JSON.parse(req.body.checklistData);

    const newChecklist = new Checklist({
      ...checklistData,
      pdfPath: req.file ? req.file.path : null,
    });

    const savedChecklist = await newChecklist.save();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.checklists.push(savedChecklist._id);
    await appointment.save();

    res.status(201).json({ checklist: savedChecklist, appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch all checklists
const getChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find().populate('appointmentId'); // Populate appointment details
    res.status(200).json(checklists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveChecklist,
  upload,
  getChecklists,
};
