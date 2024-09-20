// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//   engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   company: { type: String, required: true },
//   machine: { type: String, required: true },
//   appointmentDate: { type: Date, required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Appointment', appointmentSchema);




const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

  clientName: { type: String, required: true },
  clientAddress: { type: String, required: true },
  contactPerson: { type: String, required: true },
  mobileNo: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentAmount: { type: Number, required: true },
  machineName: { type: String, required: true },
  model: { type: String, required: true },
  partNo: { type: String, required: true },
  serialNo: { type: String, required: true },
  installationDate: { type: Date, required: true },
  serviceFrequency: { type: Number, required: true },
  expectedServiceDate: { type: Date, required: true },
  engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);