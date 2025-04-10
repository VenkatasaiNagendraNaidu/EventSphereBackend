const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Will be set after approval
  adminCode: { type: String, required: true }, // Specific to Admins
  department: { type: String, required: true },
  approved: { type: Boolean, default: false },
  phone: { type: String }, // Optional contact
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
