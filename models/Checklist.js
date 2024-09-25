const mongoose = require("mongoose");

// Checklist Document Model
const checklistSchema = new mongoose.Schema({
  clientInfo: {
    name: String,
    contactPerson: String,
    phone: String,
    address: String,
    engineer: String,
  },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  checklist: Array,
  refrigeratorList: Array,
  invoiceNo: String,
  pdfPath: String, // Path to the uploaded PDF
  generatedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Checklist", checklistSchema);






// const mongoose = require("mongoose");

// // Checklist Document Model
// const checklistSchema = new mongoose.Schema({
//   clientInfo: {
//     name: String,
//     contactPerson: String,
//     phone: String,
//     address: String,
//     engineer: String,
//   },
//   appointmentId: String,
//   checklist: Array,
//   refrigeratorList: Array,
//   pdfPath: String, // Path to the uploaded PDF
//   generatedOn: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Checklist", checklistSchema);
