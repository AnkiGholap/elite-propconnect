const express = require("express");
const router = express.Router();
const { upload, cloudinary } = require("../config/cloudinary");

// Single file upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});

// Multiple file upload (max 10)
router.post("/multiple", upload.array("files", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const urls = req.files.map((f) => f.path);
  res.json({ urls });
});

// Delete image by public_id
router.delete("/", async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ message: "public_id is required" });
    }
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
