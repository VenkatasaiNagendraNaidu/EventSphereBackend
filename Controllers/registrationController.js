const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Organizer = require("../models/Organizer");
const generatePassword = require("../utils/generatePassword");
const sendCredentialsEmail = require("../utils/sendMail");

// Get all pending registrations
const getPendingRegistrations = async (req, res) => {
  try {
    const students = await Student.find({ approved: false });
    const faculty = await Faculty.find({ approved: false });
    const organizers = await Organizer.find({ approved: false });

    res.json({ students, faculty, organizers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve user
const approveRegistration = async (req, res) => {
  const { id, role } = req.body;
  const password = generatePassword();

  try {
    let model;

    if (role === "student") model = Student;
    else if (role === "faculty") model = Faculty;
    else if (role === "organizer") model = Organizer;
    else return res.status(400).json({ message: "Invalid role" });

    const user = await model.findByIdAndUpdate(
      id,
      { approved: true, password },
      { new: true }
    );

    await sendCredentialsEmail(user.email, password);

    res.json({ message: "User approved and email sent." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Decline user
const declineRegistration = async (req, res) => {
  const { id, role } = req.body;

  try {
    let model;

    if (role === "student") model = Student;
    else if (role === "faculty") model = Faculty;
    else if (role === "organizer") model = Organizer;
    else return res.status(400).json({ message: "Invalid role" });

    await model.findByIdAndDelete(id);

    res.json({ message: "User declined and removed from pending list." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPendingRegistrations,
  approveRegistration,
  declineRegistration, // ✅ added to exports
};
