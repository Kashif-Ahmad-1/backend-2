const multer = require('multer');
const path = require('path');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Company = require('../models/Company');

// Create an instance of multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Accountant creates an appointment
exports.createAppointment = async (req, res) => {
  const {
    clientName,
    clientAddress,
    contactPerson,
    mobileNo,
    appointmentDate,
    appointmentAmount,
    machineName,
    model,
    partNo,
    serialNo,
    installationDate,
    serviceFrequency,
    expectedServiceDate,
    engineer
  } = req.body;
  
  const { userId, role } = req.user;

  if (role !== 'accountant' && role !== 'engineer') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Check if the company already exists
    let company = await Company.findOne({ clientName, mobileNo });

    // If it doesn't exist, create a new company
    if (!company) {
      company = new Company({
        clientName,
        contactPerson,
        mobileNo,
        clientAddress
      });
      await company.save();
    }

    // Create the appointment using the company details
    const appointment = new Appointment({
      clientName,
      clientAddress,
      contactPerson,
      mobileNo,
      appointmentDate,
      appointmentAmount,
      machineName,
      model,
      partNo,
      serialNo,
      installationDate,
      serviceFrequency,
      expectedServiceDate,
      engineer: userId,
      createdBy: userId,
      document: req.file ? req.file.path : null, // Store file path if uploaded
      checklistDocument: req.checklistFile ? req.checklistFile.path : null
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: 'Error creating appointment' });
  }
};

// Get all appointments (Accountant/Admin)
// exports.getAppointments = async (req, res) => {
//   const { role, userId } = req.user;

//   try {
//     let appointments;

//     if (role === 'accountant' || role === 'admin') {
//       appointments = await Appointment.find().populate('engineer createdBy');
//     } else if (role === 'engineer') {
//       appointments = await Appointment.find({ engineer: userId }).populate('createdBy engineer');
//     } else {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     res.json(appointments);
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ error: 'Error fetching appointments' });
//   }
// };




// Get all appointments (Accountant/Admin)
exports.getAppointments = async (req, res) => {
  const { role, userId } = req.user;

  try {
    let appointments;

    if (role === 'accountant' || role === 'admin') {
      appointments = await Appointment.find().populate('engineer createdBy');
    } else if (role === 'engineer') {
      appointments = await Appointment.find({ engineer: userId }).populate('createdBy engineer');
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Transform appointments to only show required fields
    const transformedAppointments = appointments.map(appointment => {
      return {
        ...appointment.toObject(),
        engineer: {
          name: appointment.engineer.name,
          email: appointment.engineer.email
        },
        createdBy: {
          name: appointment.createdBy.name,
          email: appointment.createdBy.email
        },
        // Remove other fields if needed
        // You can also choose to exclude document fields here if necessary
        document: undefined,
        checklistDocument: undefined
      };
    });

    res.json(transformedAppointments);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error fetching appointments' });
  }
};


// Export the multer upload instance for use in routes
exports.upload = upload;
