const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

// Check database connection middleware
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database not connected. Please try again later.",
      error: "SERVICE_UNAVAILABLE",
    });
  }
  next();
};

// Apply to all routes
router.use(checkDBConnection);

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create user
    const user = await User.create({ username, password });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password, rememberProjectAppointment } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Update remember preference
    user.rememberProjectAppointment = rememberProjectAppointment || false;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        rememberProjectAppointment: user.rememberProjectAppointment,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
