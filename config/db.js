const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
<<<<<<< HEAD
// console.log(process.env.MONGO);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
=======
console.log(process.env.MONGO_URI);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
>>>>>>> 7f83ec6aa850c3934811daf72dff267988a7e45a
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
