const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const cors = require('cors'); 
const studentRoutes = require('./routes/Student'); 
const facultyRoutes = require('./routes/Faculty'); 
const organizerRoutes = require('./routes/Organizer');
const EvventRoutes = require('./routes/Events');
const adminRoutes = require('./routes/Admin');
const registerRoutes = require('./routes/registrationRoutes');
const eventRoutes = require("./routes/Events"); // Import the event routes
const registrationRoutes = require("./routes/registrationRoutes");// view details
const loginRoutes = require("./routes/login"); // Import the login routes
const eventregister = require("./routes/eventRegistration"); // Import the registration routes
const contactRoute = require("./routes/contactRoute");
const galleryRoutes = require("./routes/gallery");
const certificateRoutes = require("./routes/certificates");

dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors()); 
app.use("/api/gallery", galleryRoutes);
app.use('/api/event-registration',eventregister);
app.use('/api/registrations', registerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', EvventRoutes);
app.use('/api/contact',contactRoute);
app.use("/api/events", eventRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/certificates", certificateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});