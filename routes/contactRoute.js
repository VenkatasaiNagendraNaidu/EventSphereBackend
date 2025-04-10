const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const mailContent = `
    📩 New Contact Message Received:
    
    👤 Name: ${name}
    📧 Email: ${email}
    📞 Phone: ${phone || "N/A"}
    📝 Subject: ${subject || "No Subject"}
    💬 Message: ${message}
  `;

  try {
    await sendMail(email, subject || "New Contact Form Message", mailContent);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message.", error });
  }
});

module.exports = router;
