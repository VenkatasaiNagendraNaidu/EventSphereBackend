const express = require("express");
const router = express.Router();
const {
  getPendingRegistrations,
  approveRegistration,
  declineRegistration // ✅ newly added
} = require("../Controllers/registrationController");

router.get("/pending", getPendingRegistrations);
router.post("/approve", approveRegistration);
router.post("/decline", declineRegistration); // ✅ new route added

module.exports = router;
 