const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Organizer = require("../models/Organizer");
const Admin = require("../models/Admin");
const Registration = require("../models/Viewdetails");
const generatePassword = require("../utils/generatePassword");
const sendCredentialsEmail = require("../utils/sendMail");

// Utility to get model by role
const getModelByRole = (role) => {
  switch (role.toLowerCase()) {
    case "student":
      return Student;
    case "faculty":
      return Faculty;
    case "organizer":
      return Organizer;
    default:
      return null;
  }
};

// GET: Pending registrations
const getPendingRegistrations = async (req, res) => {
  try {
    const students = await Student.find({ approved: false });
    const faculty = await Faculty.find({ approved: false });
    const organizers = await Organizer.find({ approved: false });

    res.status(200).json({ students, faculty, organizers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending users", error: err.message });
  }
};

// GET: Approved users (for 'View Data' page)
const getApprovedUsers = async (req, res) => {
  try {
    const students = await Student.find({ approved: true }).select("-password");
    const faculty = await Faculty.find({ approved: true }).select("-password");
    const organizers = await Organizer.find({ approved: true }).select("-password");
    const admins = await Admin.find({ approved: true }).select("-password");

    res.status(200).json({ students, faculty, organizers, admins });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch approved users", error: err.message });
  }
};

// POST: Approve a registration
const approveRegistration = async (req, res) => {
  const { id, role } = req.body;

  const model = getModelByRole(role);
  if (!model) return res.status(400).json({ message: "Invalid role provided" });

  const password = generatePassword();

  try {
    const user = await model.findByIdAndUpdate(
      id,
      { approved: true, password },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await sendCredentialsEmail(user.email, password);

    res.status(200).json({ message: "User approved and credentials sent via email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve user", error: err.message });
  }
};

// POST: Decline a registration
const declineRegistration = async (req, res) => {
  const { id, role } = req.body;

  const model = getModelByRole(role);
  if (!model) return res.status(400).json({ message: "Invalid role provided" });

  try {
    const user = await model.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User declined and removed from system." });
  } catch (err) {
    res.status(500).json({ message: "Failed to decline user", error: err.message });
  }
};

// GET: Registrations for a specific event
const getRegistrationsByEventId = async (req, res) => {
  const { eventId } = req.params;

  try {
    const registrations = await Registration.find({ eventId });

    const detailed = await Promise.all(
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

    res.status(200).json(detailed);
  } catch (err) {
    res.status(500).json({ message: "Failed to get registrations", error: err.message });
  }
};

// PUT: Update registration status
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

    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};

module.exports = {
  getPendingRegistrations,
  getApprovedUsers,
  approveRegistration,
  declineRegistration,
  getRegistrationsByEventId,
  updateRegistrationStatus,
};
