const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Events");
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

    console.log("New Student:", newStudent);

    await newStudent.save();
    console.log("Student saved to DB:", newStudent);

    const subject = "Student Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as a student. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;

    await sendMail(email, subject, message);

    res.status(200).json({ message: "Student registered successfully!" });
  } catch (error) {
    console.error("Error registering student:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Get Events Registered by Student
router.get("/my-events/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const registrations = await EventRegistration.find({ studentId })
      .populate("eventId")
      .sort({ registeredAt: -1 });

    res.status(200).json({ events: registrations });
  } catch (error) {
    console.error("Error fetching registered events:", error.message);
    res.status(500).json({ message: "Failed to fetch registered events." });
  }
});

// Update Student Profile
router.put("/update-profile/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, department, bio, photo } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid or missing email address" });
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, department, bio, photo },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
