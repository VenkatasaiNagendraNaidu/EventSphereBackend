const express = require("express");
const router = express.Router();
const {
  getPendingRegistrations,
  approveRegistration,
  declineRegistration,
  getRegistrationsByEventId,
  updateRegistrationStatus,
} = require("../Controllers/registrationController");

// Existing routes
router.get("/pending", getPendingRegistrations);
router.post("/approve", approveRegistration);
router.post("/decline", declineRegistration);

// New routes to support frontend needs
router.get("/event/:eventId", getRegistrationsByEventId); // Fetch all registrations for an event
router.put("/:eventId/:userId", updateRegistrationStatus); // Approve or Decline a registration

module.exports = router;
