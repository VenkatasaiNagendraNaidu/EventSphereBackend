const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

// @route   POST /api/certificates
// @desc    Create a new certificate entry
// @access  Organizer/Admin
router.post("/", async (req, res) => {
  const { studentId, eventId, certificateUrl } = req.body;

  if (!studentId || !eventId || !certificateUrl) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newCertificate = new Certificate({
      studentId,
      eventId,
      certificateUrl,
    });

    const saved = await newCertificate.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving certificate:", err);
    res.status(500).json({ message: "Server error while saving certificate." });
  }
});

// @route   GET /api/certificates/event/:eventId
// @desc    Get all certificates for a specific event
// @access  Organizer/Admin
router.get("/event/:eventId", async (req, res) => {
  try {
    const certificates = await Certificate.find({ eventId: req.params.eventId })
      .populate("studentId", "name rollNumber email")
      .populate("eventId", "eventName eventStartDate eventEndDate eventImage");

    res.status(200).json(certificates);
  } catch (err) {
    console.error("Error fetching event certificates:", err);
    res.status(500).json({ message: "Failed to fetch certificates." });
  }
});

// @route   GET /api/certificates/student/:studentId
// @desc    Get all certificates for a specific student
// @access  Private
router.get("/student/:studentId", async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.params.studentId })
      .populate("eventId", "eventName eventStartDate eventEndDate eventImage");

    res.status(200).json(certificates);
  } catch (err) {
    console.error("Error fetching student certificates:", err);
    res.status(500).json({ message: "Failed to fetch student certificates." });
  }
});

module.exports = router;
