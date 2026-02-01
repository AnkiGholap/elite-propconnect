const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const User = require("../models/User");
const Property = require("../models/Property");

const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected." });
  }
  next();
};

router.use(checkDBConnection);

// Dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [totalLeads, brochureLeads, visitLeads, newLeads, totalProperties, totalUsers] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ type: "brochure" }),
      Lead.countDocuments({ type: "visit" }),
      Lead.countDocuments({ status: "new" }),
      Property.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      newLeads,
      siteVisits: visitLeads,
      totalLeads,
      brochureLeads,
      totalProperties,
      totalUsers,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all leads
router.get("/leads", async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json({ count: leads.length, leads });
  } catch (error) {
    console.error("Leads fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update lead status
router.put("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead updated", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete lead
router.delete("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
