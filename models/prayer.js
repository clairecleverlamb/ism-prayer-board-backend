const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  ministryGroup:{
    type: String, 
    default:"",
  },
  status: {
    type: String,
  },
  content: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prayedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date, 
    default: Date.now,
  },
});

const Prayer = mongoose.model('Prayer', prayerSchema);
module.exports = Prayer;
