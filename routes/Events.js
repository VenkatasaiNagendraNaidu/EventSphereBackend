const express = require("express");
const router = express.Router();
const Event = require("../models/Events");
const Organizer = require("../models/Organizer");


router.post("/add-event", async (req, res) => {
    const { eventName, eventDate, eventTime, location, category, department, description, imageUrl, organizerId } = req.body;
  
    if (!eventName || !eventDate || !eventTime || !location || !category || !department || !description || !imageUrl || !organizerId) {
      return res.status(400).json({ message: "All fields are required!" });
    }
  
    try {
      const newEvent = new Event({ 
        eventName, 
        eventDate, 
        eventTime, 
        location, 
        category, 
        department, 
        description, 
        imageUrl, 
        organizer: organizerId 
      });
  
      await newEvent.save();
      res.status(201).json({ message: "Event added successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error adding event." });
    }
  });
  

// View Events Route
router.get("/view-events", async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email"); // Fetch Organizer's name & email

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events." });
  }
});

module.exports = router;
