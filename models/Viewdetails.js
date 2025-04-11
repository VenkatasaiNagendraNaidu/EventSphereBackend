const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  email: String,
  rollNumber: String,
  phoneNumber: String,
  college: String,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
    default: "Pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Registration", registrationSchema);
