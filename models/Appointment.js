const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  machine: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
