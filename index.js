const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const studentRoutes = require('./routes/Student'); 
const facultyRoutes = require('./routes/Faculty'); 
const organizerRoutes = require('./routes/Organizer');
const EvventRoutes = require('./routes/Events');
const adminRoutes = require('./routes/Admin');
const contactRoute = require("./routes/contactRoute");
const cors = require('cors'); 

dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors()); 

app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', EvventRoutes);
app.use("/api/contact", contactRoute);

// app.get('/', (req, res) => {
//   res.send('Welcome to the Event Registration Backend!');
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});