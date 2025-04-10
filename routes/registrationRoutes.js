const express = require("express");
const router = express.Router();

const {
  getPendingRegistrations,
  getApprovedUsers,
  approveRegistration,
  declineRegistration,
  getRegistrationsByEventId,
  updateRegistrationStatus,
} = require("../Controllers/registrationController");

// Routes for pending & approved registrations
router.get("/pending", getPendingRegistrations);
router.get("/approved", getApprovedUsers); // ✅ NEW: fetch approved users (students/faculty/organizers/admins)

// Approve or decline user registrations
router.post("/approve", approveRegistration);
router.post("/decline", declineRegistration);

// Event-specific registrations
router.get("/event/:eventId", getRegistrationsByEventId);
router.put("/:eventId/:userId", updateRegistrationStatus);

module.exports = router;
