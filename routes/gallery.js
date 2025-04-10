const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");

router.post("/upload", async (req, res) => {
    try {
      const { imageUrl, department } = req.body;
      const image = new Gallery({ imageUrl, department });
      await image.save();
      res.status(201).json({ message: "Image saved" });
    } catch (err) {
      res.status(500).json({ error: "Failed to save image" });
    }
  });
  

router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = router;
