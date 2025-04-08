// routes/eventRegistration.js
const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const Student = require("../models/Student");
const sendMail = require("../utils/sendMail");
router.put("/:registrationId", async (req, res) => {
    const { registrationId } = req.params;
    const { ApprovalStatus } = req.body;
  
    try {
      const registration = await EventRegistration.findById(registrationId).populate("studentId");
  
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
  
      registration.ApprovalStatus = ApprovalStatus;
      await registration.save();
  
      // Send email
      const student = registration.studentId;
      const subject = ApprovalStatus
        ? `Your Event Registration has been Approved`
        : `Your Event Registration has been Declined`;
  
      const message = ApprovalStatus
        ? `Hi ${student.name},\n\nYour registration for the event has been approved. See you at the event!`
        : `Hi ${student.name},\n\nUnfortunately, your registration for the event has been declined.`;
  
      await sendMail(student.email, subject, message);
  
      res.status(200).json({ message: "Status updated and email sent." });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
router.post("/register", async (req, res) => {
  try {
    const { studentId, eventId, paymentScreenshot } = req.body;

    const registration = new EventRegistration({ studentId, eventId, paymentScreenshot });
    await registration.save();

    res.status(201).json({ message: "Registered successfully", registration });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});
// routes/registrations.js
router.get("/event/:eventId", async (req, res) => {
    try {
      const registrations = await EventRegistration.find({ eventId: req.params.eventId })
        .populate("studentId", "name email rollNumber"); // assuming your Student model has these fields
      res.json(registrations);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });
  

module.exports = router;
