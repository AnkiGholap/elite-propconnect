const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Property = require("../models/Property");

// Check database connection middleware
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database not connected. Please try again later.",
    });
  }
  next();
};

router.use(checkDBConnection);

// GET /api/properties - Get all properties with optional filters
router.get("/", async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, search } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Properties fetched successfully",
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get Properties Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/properties/locations - Get unique locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await Property.distinct("location");
    res.status(200).json({ locations });
  } catch (error) {
    console.error("Get Locations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/properties/:slug - Get single property by slug
router.get("/:slug", async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property fetched successfully",
      property,
    });
  } catch (error) {
    console.error("Get Property Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/properties - Create a new property
router.post("/", async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create Property Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Property with this slug already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/properties/:slug - Update a property
router.put("/:slug", async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/properties/:slug - Delete a property
router.delete("/:slug", async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ slug: req.params.slug });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
