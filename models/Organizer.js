const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  yearOfStudy: { type: Number, required: true },
  department: { type: String, required: true },
  approved: { type: String, required: true,default:false},

  createdAt: { type: Date, default: Date.now }
});

const Organizer = mongoose.model("Organizer", organizerSchema);
module.exports = Organizer;
