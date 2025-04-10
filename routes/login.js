const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Admin = require("../models/Admin");
const Organizer = require("../models/Organizer");

const models = [
  { model: Student, role: "student" },
  { model: Faculty, role: "faculty" },
  { model: Admin, role: "admin" },
  { model: Organizer, role: "organizer" },
];

router.get("/login", async (req, res) => {
    console.log("Login requested with:", req.query);
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    for (const { model, role } of models) {
        const user = await model.findOne({ email });
      
        if (user) {
          console.log(`User found in ${role} model:`, user);
      
          if (user.password !== password) {
            console.log(`Password mismatch: Expected ${user.password}, Received ${password}`);
            continue; // check next model
          }
      
          if (!user.approved) {
            return res.status(403).json({ message: "Your account is not approved yet." });
          }
      
          console.log(`Login success for ${email} as ${role}`);
      
          return res.json({
            name: user.name,
            email: user.email,
            role,
            department: user.department,
            id: user._id
          });
        } else {
          console.log(`No user with email ${email} in ${role} model`);
        }
      }
      

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
