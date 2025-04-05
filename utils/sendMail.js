// utils/sendMail.js
const nodemailer = require("nodemailer");

const sendMail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // Your email here
        pass: process.env.EMAIL_PASS,  // Your email password here
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender address
      to: email,                     // List of receivers
      subject: subject,              // Subject line
      text: message,                 // Plain text body
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};






module.exports = sendMail;
