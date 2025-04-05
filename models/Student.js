const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  yearOfStudy: { type: Number, required: true },
  department: { type: String, required: true },
  gender: { type: String, required: true },
  password: { type: String, default: null },
  approved: { type: Boolean, default:false},
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;