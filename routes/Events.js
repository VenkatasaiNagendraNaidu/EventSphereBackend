const express = require("express");
const router = express.Router();
const Event = require("../models/Events");

// Add Event
router.put("/update/:id", async (req, res) => {
  const eventId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error during event update" });
  }
});

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
    organizer1Name,
    organizer1Phone,
    organizer2Name,
    organizer2Phone
  } = req.body;

  
  if (
    !eventName || !eventStartDate || !eventEndDate ||
    !location || !category || !department ||
    !description || !imageUrl || !amount
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
    organizer1Name,
    organizer1Phone,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully", event: newEvent });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Server error while adding event." });
  }
});

// Get All Upcoming Events
router.get("/ucevents", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ eventStartDate: 1 }); // no filter
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error while fetching events." });
  }
});


// Get Single Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Event by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error while deleting event" });
  }
});

module.exports = router;
