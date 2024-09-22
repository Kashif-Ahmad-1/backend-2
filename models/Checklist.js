const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  clientInfo: {
    name: String,
    phone: String,
    address: String,
  },
  checklist: Array,
  authorizedSignature: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Checklist', checklistSchema);
