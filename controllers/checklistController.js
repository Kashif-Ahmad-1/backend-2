const Checklist = require("../models/Checklist");
const multer = require("multer");
const path = require("path");

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

const saveChecklist = async (req, res) => {
  try {
    const checklistData = JSON.parse(req.body.checklistData);
    const newChecklist = new Checklist({
      ...checklistData,
      pdfPath: req.file.path // Save the PDF path
    });
    await newChecklist.save();
    res.status(201).json(newChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveChecklist,
  upload,
};
