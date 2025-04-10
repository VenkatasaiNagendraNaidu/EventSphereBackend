const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  department: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Gallery", gallerySchema);
