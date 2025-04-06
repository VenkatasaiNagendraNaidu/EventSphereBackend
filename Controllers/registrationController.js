const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Organizer = require("../models/Organizer");
const Registration = require("../models/Viewdetails");
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

// Get registrations by event ID
const getRegistrationsByEventId = async (req, res) => {
  const { eventId } = req.params;

  try {
    const registrations = await Registration.find({ eventId });

    const detailedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const student = await Student.findById(reg.userId);
        return {
          userId: reg.userId,
          status: reg.status,
          name: student?.name,
          email: student?.email,
          rollNumber: student?.rollNumber,
        };
      })
    );

    res.json(detailedRegistrations);
  } catch (err) {
    res.status(500).json({ message: "Failed to get registrations", error: err });
  }
};

// Update registration status (approve/decline)
const updateRegistrationStatus = async (req, res) => {
  const { eventId, userId } = req.params;
  const { status } = req.body;

  try {
    const updated = await Registration.findOneAndUpdate(
      { eventId, userId },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Registration not found" });

    res.json({ message: `User ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err });
  }
};

module.exports = {
  getPendingRegistrations,
  approveRegistration,
  declineRegistration,
  getRegistrationsByEventId,
  updateRegistrationStatus,
};