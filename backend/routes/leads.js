const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lead = require("../models/Lead");

const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected." });
  }
  next();
};

router.use(checkDBConnection);

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
