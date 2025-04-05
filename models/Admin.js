const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  adminCode: { type: String, required: true }, // Specific to Admins
  department: { type: String, required: true },
  approved: { type: Boolean, required: true,default:false},
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
