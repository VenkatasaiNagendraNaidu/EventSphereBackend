const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const EventRegistration = require("../models/EventRegistration"); // Import the registration model
const Event = require("../models/Events");
 // Assuming this is your event model
const sendMail = require("../utils/sendMail");

// Register Student Route
router.post("/register-student", async (req, res) => {
  console.log("Received request:", req.body);

  const { name, email, rollNumber, yearOfStudy, department, gender } = req.body;

  if (!name || !email || !rollNumber || !yearOfStudy || !department || !gender) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "Please fill out all fields!" });
  }

  try {
    const newStudent = new Student({
      name,
      email,
      rollNumber,
      yearOfStudy,
      department,
      gender,
    });

    await newStudent.save();
    console.log(newStudent);

    const subject = "Student Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as a student. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;
    await sendMail(email, subject, message);

    res.status(200).json({ message: "Student registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Get Events Registered by Student
router.get("/my-events/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const registrations = await EventRegistration.find({ studentId })
      .populate("eventId") // Populates event details like name, date, etc.
      .sort({ registeredAt: -1 });

    res.status(200).json({ events: registrations });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ message: "Failed to fetch registered events." });
  }
});

module.exports = router;
