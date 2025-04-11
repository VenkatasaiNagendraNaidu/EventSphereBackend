const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const Student = require("../models/Student");
const sendEmailEvent = require("../utils/sendRegistrationMail");

// Approve or Decline Registration & Send Email
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

    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString("en-GB");

    if (ApprovalStatus) {
      // Approval email
      const subject = `🎉 You're Approved for ${event.eventName}!`;
      const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Hi ${student.name},</h2>
          <p>You have <strong>successfully registered</strong> for the event 
          <strong>${event.eventName}</strong> on <strong>${eventDateFormatted}</strong>.</p>

          <p style="color: green;"><strong>Your participation has been approved!</strong></p>

          <div style="border: 2px dashed #4CAF50; padding: 20px; margin: 20px auto; width: fit-content; text-align: center; background: #f0fff0;">
            <h3>🎫 Event Pass</h3>
            <p><strong>Event:</strong> ${event.eventName}</p>
            <p><strong>Date:</strong> ${eventDateFormatted}</p>
            <p><strong>Participant:</strong> ${student.name}</p>
            <p><strong>Registration ID:</strong> ${registration._id}</p>
          </div>

          <p>See you at the event! 🚀</p>
          <p style="color: #777;">- BITS EventSphere Team</p>
        </div>
      `;
      await sendEmailEvent(student.email, subject, message);
    } else {
      // Decline email
      const subject = `⚠️ Registration Declined for ${event.eventName}`;
      const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #D32F2F;">Hi ${student.name},</h2>
          <p>We're sorry to inform you that your registration for 
          <strong>${event.eventName}</strong> on <strong>${eventDateFormatted}</strong> has been declined.</p>
          <p>If you believe this is a mistake, kindly reach out to the organizers.</p>
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

// Register for an event
router.post("/register", async (req, res) => {
  try {
    const { studentId, eventId, paymentScreenshot } = req.body;

    const registration = new EventRegistration({
      studentId,
      eventId,
      paymentScreenshot,
      ApprovalStatus: false,
      selected: false,
      roundStatus: "Not Selected",
    });

    await registration.save();

    res.status(201).json({ message: "Registered successfully", registration });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Get all registrations for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ eventId })
      .populate({
        path: "studentId",
        select: "name email rollNumber yearOfStudy department"
      })
      .populate({
        path: "eventId",
        select: "eventName eventStartDate eventEndDate location category department description amount imageUrl organizer organizerName registrationCount tags organizer1Name organizer1Phone"
      })
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Error fetching registrations", error: error.message });
  }
});
// Update Round Status (Selected / Eliminated)
router.put("/updateround/:registrationId", async (req, res) => {
  const { registrationId } = req.params;
  const { selected } = req.body;

  try {
    const registration = await EventRegistration.findById(registrationId)
      .populate("studentId")
      .populate("eventId");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.selected = selected;
    registration.roundStatus = selected ? "Round 2" : "Eliminated";

    await registration.save();

    res.status(200).json({ message: "Round status updated successfully", registration });
  } catch (error) {
    console.error("Error updating round status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
