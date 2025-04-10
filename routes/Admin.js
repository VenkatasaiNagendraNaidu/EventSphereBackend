const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Organizer = require("../models/Organizer");
const sendMail = require("../utils/sendMail");

// Register a new Admin
router.post("/register-admin", async (req, res) => {
  const { name, email, adminCode, department } = req.body;

  if (!name || !email || !adminCode || !department) {
    return res.status(400).json({ message: "Please fill out all fields!" });
  }

  try {
    const newAdmin = new Admin({ name, email, adminCode, department });
    await newAdmin.save();

    const subject = "Admin Registration Successful - Awaiting Approval";
    const mailMessage = `Dear ${name},\n\nYou have successfully registered as an admin. Please wait for approval. Your credentials will be sent after approval.\n\nBest regards,\nEventHub Team`;
    await sendMail(email, subject, mailMessage);

    res.status(200).json({ message: "Admin registered successfully!" });
  } catch (error) {
    console.error("Error in /register-admin:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Get Pending Registrations
router.get("/pending", async (req, res) => {
  try {
    const students = await Student.find({ approved: false });
    const faculty = await Faculty.find({ approved: false });
    const organizers = await Organizer.find({ approved: false });
    res.status(200).json({ students, faculty, organizers });
  } catch (error) {
    console.error("Error fetching pending registrations:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Get Approved Registrations
router.get("/approved", async (req, res) => {
  try {
    const students = await Student.find({ approved: true });
    const faculty = await Faculty.find({ approved: true });
    const organizers = await Organizer.find({ approved: true });
    res.status(200).json({ students, faculty, organizers });
  } catch (error) {
    console.error("Error fetching approved registrations:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Approve a Registration
router.post("/approve", async (req, res) => {
  const { email, role } = req.body;
  const password = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user;
    const normalizedRole = role.toLowerCase();

    switch (normalizedRole) {
      case "student":
        user = await Student.findOneAndUpdate({ email }, { approved: true, password: hashedPassword });
        break;
      case "faculty":
        user = await Faculty.findOneAndUpdate({ email }, { approved: true, password: hashedPassword });
        break;
      case "organizer":
        user = await Organizer.findOneAndUpdate({ email }, { approved: true, password: hashedPassword });
        break;
      default:
        return res.status(400).json({ message: "Invalid role." });
    }

    if (user) {
      await sendMail(email, "Registration Approved", `Your login credentials:\nEmail: ${email}\nPassword: ${password}`);
      res.status(200).json({ message: "User approved." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error in approving user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Decline a Registration
router.post("/decline", async (req, res) => {
  const { email, role } = req.body;

  try {
    let user;
    const normalizedRole = role.toLowerCase();

    switch (normalizedRole) {
      case "student":
        user = await Student.findOneAndDelete({ email });
        break;
      case "faculty":
        user = await Faculty.findOneAndDelete({ email });
        break;
      case "organizer":
        user = await Organizer.findOneAndDelete({ email });
        break;
      default:
        return res.status(400).json({ message: "Invalid role." });
    }

    if (user) {
      await sendMail(email, "Registration Declined", "Your registration has been declined.");
      res.status(200).json({ message: "User declined." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error in declining user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
