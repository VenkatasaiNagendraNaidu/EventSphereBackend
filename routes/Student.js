// routes/student.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const sendMail = require("../utils/sendMail");

router.post("/register-student", async (req, res) => {
  const { name, email, rollNumber, yearOfStudy, department, gender } = req.body;

  if (!name || !email || !rollNumber || !yearOfStudy || !department || !gender) {
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

    // Send confirmation email
    const subject = "Student Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as a student. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;
    await sendMail(email, subject, message);

    res.status(200).json({ message: "Student registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
