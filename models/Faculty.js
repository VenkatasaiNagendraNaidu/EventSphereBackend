const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  gender: { type: String, required: true },
  password: { type: String, default: null },
  approved: { type: Boolean, default:false},
  createdAt: { type: Date, default: Date.now }
});

const Faculty = mongoose.model("Faculty", facultySchema);
module.exports = Faculty;
