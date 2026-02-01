const mongoose = require("mongoose");

const floorPlanSchema = new mongoose.Schema({
  type: { type: String, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, default: "" },
}, { _id: false });

const propertySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["apartment", "villa", "penthouse", "plot"],
    },
    price: {
      type: Number,
      required: true,
    },
    priceText: {
      type: String,
      required: true,
    },
    bhk: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    amenitiesCount: {
      type: Number,
      default: 0,
    },
    reraApproved: {
      type: Boolean,
      default: false,
    },
    developer: {
      type: String,
      default: "",
    },
    possession: {
      type: String,
      default: "",
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    floorPlans: {
      type: [floorPlanSchema],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);
