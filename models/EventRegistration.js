// models/EventRegistration.js
const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  paymentScreenshot: { type: String, required: true }, // Cloudinary URL
  registeredAt: { type: Date, default: Date.now },
  ApprovalStatus: { type: Boolean, default: "False" },
});

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
module.exports = EventRegistration;
