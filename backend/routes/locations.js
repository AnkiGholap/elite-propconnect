const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const connectDB = require("../config/db");

// Ensure database is connected before handling requests
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({ message: "Database not connected." });
  }
});

// Get all locations (public - used by property form & home page dropdown)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const locations = await Location.find(filter).sort({ name: 1 });
    res.json({ count: locations.length, locations });
  } catch (error) {
    console.error("Locations fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create location
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Location name is required" });

    const existing = await Location.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) return res.status(400).json({ message: "Location already exists" });

    const location = await Location.create({ name });
    res.status(201).json({ message: "Location created", location });
  } catch (error) {
    console.error("Location create error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update location
router.put("/:id", async (req, res) => {
  try {
    const { name, status } = req.body;
    const update = {};
    if (name) update.name = name;
    if (status) update.status = status;

    const location = await Location.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location updated", location });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete location
router.delete("/:id", async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
