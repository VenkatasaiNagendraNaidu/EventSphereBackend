const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const sendMail = require("../utils/sendMail");

router.post("/register-admin", async (req, res) => {
  const { name, email, adminCode, department } = req.body;

  if (!name || !email || !adminCode || !department) {
    return res.status(400).json({ message: "Please fill out all fields!" });
  }

  try {
    const newAdmin = new Admin({
      name,
      email,
      adminCode,
      department,
    });

    await newAdmin.save();

    // Send confirmation email
    const subject = "Admin Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as an admin. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;
    await sendMail(email, subject, message);

    res.status(200).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
