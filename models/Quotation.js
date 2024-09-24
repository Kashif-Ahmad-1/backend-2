const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  quotationData: { type: Object, required: true },
  pdfPath: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
