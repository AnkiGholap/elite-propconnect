const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
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

// Submit a lead (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, propertySlug, propertyName, type, date, time, message } = req.body;

    if (!name || !email || !phone || !propertySlug || !propertyName || !type) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const lead = await Lead.create({ name, email, phone, propertySlug, propertyName, type, date, time, message });
    res.status(201).json({ message: "Lead submitted successfully", lead });
  } catch (error) {
    console.error("Lead submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
