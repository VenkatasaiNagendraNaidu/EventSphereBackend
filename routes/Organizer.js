// routes/organizer.js
const express = require("express");
const router = express.Router();
const Organizer = require("../models/Organizer");
const sendMail = require("../utils/sendMail");

router.post("/register-organizer", async (req, res) => {
  const { name, email, rollNumber, yearOfStudy, department } = req.body;

  if (!name || !email || !rollNumber || !yearOfStudy || !department) {
    return res.status(400).json({ message: "Please fill out all fields!" });
  }

  try {
    const newOrganizer = new Organizer({
      name,
      email,
      rollNumber,
      yearOfStudy,
      department,
    });

    await newOrganizer.save();

    // Send confirmation email
    const subject = "Organizer Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as an organizer. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;
    await sendMail(email, subject, message);

    res.status(200).json({ message: "Organizer registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
