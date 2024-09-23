const Checklist = require("../models/Checklist");
const multer = require("multer");
const path = require("path");
const Appointment = require("../models/Appointment"); // Import the Appointment model

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
    const { appointmentId, checklistData } = JSON.parse(req.body.checklistData); // Expect appointmentId in checklistData
    const newChecklist = new Checklist({
      ...checklistData,
      pdfPath: req.file ? req.file.path : null // Save the PDF path if file uploaded
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
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveChecklist,
  upload,
};


// const Checklist = require("../models/Checklist");
// const multer = require("multer");
// const path = require("path");

// // File storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
//   },
// });

// const upload = multer({ storage });

// const saveChecklist = async (req, res) => {
//   try {
//     const checklistData = JSON.parse(req.body.checklistData);
//     const newChecklist = new Checklist({
//       ...checklistData,
//       pdfPath: req.file.path // Save the PDF path
//     });
//     await newChecklist.save();
//     res.status(201).json(newChecklist);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   saveChecklist,
//   upload,
// };



