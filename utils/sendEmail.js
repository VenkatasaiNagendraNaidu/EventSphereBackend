
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const sendCredentialsEmail = async (email, password) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "EventHub Credentials Approved",
      text: `Your registration has been approved!\nUsername: ${email}\nPassword: ${password}`,
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  module.exports = sendCredentialsEmail;
  