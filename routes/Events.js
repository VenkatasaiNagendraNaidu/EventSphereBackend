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
    amount,
  } = req.body;

  if (
    !eventName || !eventStartDate || !eventEndDate ||
    !location || !category || !department || !description || !imageUrl || !amount
    
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
      amount,
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
      // eventEndDate: { $gte: today }
    }).sort({ eventStartDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming events." });
  }
});



// DELETE event by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
