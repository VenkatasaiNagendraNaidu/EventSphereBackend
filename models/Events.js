const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventStartDate: { type: Date, required: true },
  eventEndDate: { type: Date, required: true }, // e.g., "14:30 PM"
  location: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // URL from Cloudinary
  // organizer: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: "Organizer",
  //   required: true 
  // },
  // organizerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
  
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
