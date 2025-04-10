// routes/eventRegistration.js
const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const Student = require("../models/Student");
const sendMail = require("../utils/sendMail");
const sendEmailEvent = require ("../utils/sendRegistrationMail")
router.put("/:registrationId", async (req, res) => {
  const { registrationId } = req.params;
  const { ApprovalStatus } = req.body;

  try {
    const registration = await EventRegistration.findById(registrationId)
      .populate("studentId")
      .populate("eventId");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.ApprovalStatus = ApprovalStatus;
    await registration.save();

    const student = registration.studentId;
    const event = registration.eventId;

    if (ApprovalStatus) {
      const subject = `🎉 You're Approved for ${event.eventName}!`;

      const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Hi ${student.name},</h2>
          <p>You have <strong>successfully registered</strong> for the event 
          <strong>${event.eventName}</strong> happening on 
          <strong>${new Date(event.eventDate).toLocaleDateString("en-GB")}</strong>.</p>

          <p style="color: green;"><strong>Your participation has been approved!</strong></p>

          <p>Below is your event pass. Kindly present it at the event entrance.</p>

          <div style="border: 2px dashed #4CAF50; padding: 20px; margin: 20px auto; width: fit-content; text-align: center; background: #f0fff0;">
            <h3 style="margin-top: 0;">🎫 Event Pass</h3>
            <p><strong>Event:</strong> ${event.eventName}</p>
            <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString("en-GB")}</p>
            <p><strong>Participant:</strong> ${student.name}</p>
            <p><strong>Registration ID:</strong> ${registration._id}</p>
          </div>

          <p>We look forward to seeing you at the event. Thank you!</p>
          <p style="color: #777;">- BITS EventSphere Team</p>
        </div>
      `;

      await sendEmailEvent(student.email, subject, message);
    } else {
      const subject = `⚠️ Registration Declined for ${event.eventName}`;
      const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #D32F2F;">Hi ${student.name},</h2>
          <p>We regret to inform you that your registration for 
          <strong>${event.eventName}</strong> on 
          <strong>${new Date(event.eventDate).toLocaleDateString("en-GB")}</strong> has been declined.</p>

          <p>If you think this is a mistake, please contact the event organizers.</p>

          <p style="color: #777;">- BITS EventSphere Team</p>
        </div>
      `;

      await sendEmailEvent(student.email, subject, message);
    }

    res.status(200).json({ message: "Status updated and email sent." });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

  
router.post("/register", async (req, res) => {
  try {
    const { studentId, eventId, paymentScreenshot } = req.body;
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
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
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ eventId })
      .populate("studentId", "name email rollNumber"); // populate only needed fields

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Error fetching registrations", error: error.message });
  }
});
  

module.exports = router;
