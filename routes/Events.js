const express = require("express");
const router = express.Router();
const Event = require("../models/Events");

// Add Event Route
router.post("/add-event", async (req, res) => {
  const {
    eventName,
    eventStartDate,
    eventEndDate,
    location,
    category,
    department,
    description,
    imageUrl,
  } = req.body;

  if (
    !eventName || !eventStartDate || !eventEndDate ||
    !location || !category || !department || !description || !imageUrl
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const newEvent = new Event({
      eventName,
      eventStartDate,
      eventEndDate,
      location,
      category,
      department,
      description,
      imageUrl,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error adding event." });
  }
});

// Get All Upcoming Events
router.get("/ucevents", async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({
      eventEndDate: { $gte: today }
    }).sort({ eventStartDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming events." });
  }
});

module.exports = router;
