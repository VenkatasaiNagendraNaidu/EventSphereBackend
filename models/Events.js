const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventStartDate: { type: Date, required: true }, // Full ISO date-time format
  eventEndDate: { type: Date, required: true },   // Full ISO date-time format
  location: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // Cloudinary image URL

  // Optional: Organizer Reference
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
    required: false
  },

  // Optional: Organizer name for display even if user is deleted
  organizerName: { type: String, required: false },

  // Optional: Track how many people registered
  registrationCount: { type: Number, default: 0 },

  // Optional: Tags for filtering/search
  tags: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  organizer1Name:{ type: String, required: false },
    organizer1Phone: { type: String, required: false },
});

module.exports = mongoose.model("Event", eventSchema);
