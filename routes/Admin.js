const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Organizer = require("../models/Organizer");
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

    const subject = "Admin Registration Successful - Awaiting Approval";
    const message = `Dear ${name},\n\nYou have successfully registered as an admin. Please wait for admin approval. Your login credentials will be sent after approval.\n\nBest regards,\nTeam`;
    await sendMail(email, subject, message);

    res.status(200).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});



router.get("/pending-registrations", async (req, res) => {
  try {
    const students = await Student.find({ approved: false });
    const faculty = await Faculty.find({ approved: false });
    const organizers = await Organizer.find({ approved: false });
    res.status(200).json({ students, faculty, organizers });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});



router.post("/approve-registration", async (req, res) => {
  const { email, role } = req.body;
  const password = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user;
    switch (role) {
      case "Student":
        user = await Student.findOneAndUpdate({ email }, { approved: true, password: hashedPassword });
        break;
      case "Faculty":
        user = await Faculty.findOneAndUpdate({ email }, { approved: true, password: hashedPassword });
        break;
      case "Organizer":
        user = await Organizer.findOneAndUpdate({ email }, { approved: true, password: hashedPassword });
        break;
      default:
        return res.status(400).json({ message: "Invalid role." });
    }
    if (user) {
      await sendMail(email, "Registration Approved", `Your login credentials:\nEmail: ${email}\nPassword: ${password}`);
      res.status(200).json({ message: "User approved." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});


router.post("/decline-registration", async (req, res) => {
  const { email, role } = req.body;
  try {
    let user;
    switch (role) {
      case "Student":
        user = await Student.findOneAndDelete({ email });
        break;
      case "Faculty":
        user = await Faculty.findOneAndDelete({ email });
        break;
      case "Organizer":
        user = await Organizer.findOneAndDelete({ email });
        break;
      default:
        return res.status(400).json({ message: "Invalid role." });
    }
    if (user) {
      await sendMail(email, "Registration Declined", "Your registration has been declined.");
      res.status(200).json({ message: "User declined." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});



module.exports = router;
