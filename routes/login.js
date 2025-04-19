const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Admin = require("../models/Admin");
const Organizer = require("../models/Organizer");

router.get("/login", async (req, res) => {
  const { email, password } = req.query;
  console.log("Login requested with:", req.query);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Student login
    const student = await Student.findOne({ email });
    if (student) {
      console.log("User found in student model:", student);
      if (student.password === password) {
        if (!student.approved) {
          return res.status(403).json({ message: "Your account is not approved yet." });
        }
        console.log(`✅ Login success for ${email} as student`);
        return res.json({ name: student.name, email, role: "student", department: student.department, id: student._id });
      } else {
        console.log(`❌ Password mismatch for student: Expected ${student.password}, Received ${password}`);
      }
    }

    // Faculty login
    const faculty = await Faculty.findOne({ email });
    if (faculty) {
      console.log("User found in faculty model:", faculty);
      if (faculty.password === password) {
        if (!faculty.approved) {
          return res.status(403).json({ message: "Your account is not approved yet." });
        }
        console.log(`✅ Login success for ${email} as faculty`);
        return res.json({ name: faculty.name, email, role: "faculty", department: faculty.department, id: faculty._id });
      } else {
        console.log(`❌ Password mismatch for faculty: Expected ${faculty.password}, Received ${password}`);
      }
    }

    // Admin login — uses adminCode instead of password
    const admin = await Admin.findOne({ email });
    if (admin) {
      console.log("User found in admin model:", admin);
      if (admin.adminCode === password) {
        if (!admin.approved) {
          return res.status(403).json({ message: "Your admin account is not approved yet." });
        }
        console.log(`✅ Login success for ${email} as admin`);
        return res.json({ name: admin.name, email, role: "admin", department: admin.department, id: admin._id });
      } else {
        console.log(`❌ Admin code mismatch: Expected ${admin.adminCode}, Received ${password}`);
      }
    }

    // Organizer login
    const organizer = await Organizer.findOne({ email });
    if (organizer) {
      console.log("User found in organizer model:", organizer);
      if (organizer.password === password) {
        if (!organizer.approved) {
          return res.status(403).json({ message: "Your account is not approved yet." });
        }
        console.log(`✅ Login success for ${email} as organizer`);
        return res.json({ name: organizer.name, email, role: "organizer", department: organizer.department, id: organizer._id });
      } else {
        console.log(`❌ Password mismatch for organizer: Expected ${organizer.password}, Received ${password}`);
      }
    }

    // No match
    return res.status(401).json({ message: "Invalid credentials. Please check your email or password." });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
