const mongoose = require("mongoose");

// Checklist Document Model
const quotationSchema = new mongoose.Schema({
  clientInfo: {
    name: String,
    contactPerson: String,
    phone: String,
    address: String,
    engineer: String,
  },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  quotationNo: String,
  quotationAmount: Number, // New field for quotation amount
  pdfPath: String, // Path to the uploaded PDF
  status: { type: Boolean, default: false },
  generatedOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  generatedOn: { type: Date, default: Date.now },
  statusChangedOn: { type: Date }, 
});

module.exports = mongoose.model("Quotation", quotationSchema);

