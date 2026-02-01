const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    propertySlug: { type: String, required: true },
    propertyName: { type: String, required: true },
    type: { type: String, enum: ["brochure", "visit"], required: true },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: ["new", "contacted", "converted"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
