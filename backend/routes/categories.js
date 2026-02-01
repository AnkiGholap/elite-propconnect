const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected." });
  }
  next();
};

router.use(checkDBConnection);

// Get all categories (public - used by property form)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json({ count: categories.length, categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Category create error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const { name, status } = req.body;
    const update = {};
    if (name) update.name = name;
    if (status) update.status = status;

    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
