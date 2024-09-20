// const Appointment = require('../models/Appointment');
// const User = require('../models/User');

// // Accountant creates an appointment
// exports.createAppointment = async (req, res) => {
//   const { engineer, company, machine, appointmentDate } = req.body;
//   const { userId, role } = req.user;

//   if (role !== 'accountant') {
//     return res.status(403).json({ error: 'Access denied' });
//   }

//   try {
//     const appointment = new Appointment({
//       engineer,
//       company,
//       machine,
//       appointmentDate,
//       createdBy: userId,
//     });
//     await appointment.save();
//     res.status(201).json(appointment);
//   } catch (error) {
//     res.status(400).json({ error: 'Error creating appointment' });
//   }
// };

// // Get all appointments (Accountant/Admin)
// exports.getAppointments = async (req, res) => {
//   const { role, userId } = req.user;

//   try {
//     let appointments;

//     if (role === 'accountant' || role === 'admin') {
//       appointments = await Appointment.find().populate('engineer');
//     } else if (role === 'engineer') {
//       appointments = await Appointment.find({ engineer: userId }).populate('createdBy');
//     } else {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching appointments' });
//   }
// };




const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Accountant creates an appointment
exports.createAppointment = async (req, res) => {
  const { clientName, clientAddress, contactPerson, mobileNo, appointmentDate, appointmentAmount, machineName, model, partNo, serialNo, installationDate, serviceFrequency, expectedServiceDate, engineer } = req.body;
  const { userId, role } = req.user;

  if (role !== 'accountant') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
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
      engineer,
      createdBy: userId,
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Error creating appointment' });
  }
};

// Get all appointments (Accountant/Admin)
exports.getAppointments = async (req, res) => {
  const { role, userId } = req.user;

  try {
    let appointments;

    if (role === 'accountant' || role === 'admin') {
      appointments = await Appointment.find().populate('engineer createdBy');
    } else if (role === 'engineer') {
      appointments = await Appointment.find({ engineer: userId }).populate('createdBy');
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
};








