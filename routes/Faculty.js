// routes/faculty.js
const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");
const sendMail = require("../utils/sendMail");

router.post("/register-faculty", async (req, res) => {
  const { name, email, department, gender } = req.body;

  if (!name || !email || !department || !gender) {
    return res.status(400).json({ message: "Please fill out all fields!" });
  }

  try {
    const newFaculty = new Faculty({
      name,
      email,
      department,
      gender,
    });

    await newFaculty.save();

    // Send confirmation email
    const subject = "Faculty Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as a faculty member. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;
    await sendMail(email, subject, message);
    res.status(200).json({ message: "Faculty registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
