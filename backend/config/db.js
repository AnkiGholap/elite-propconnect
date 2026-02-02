const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/elite-propconnect";
    console.log("Connecting to MongoDB at:", mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"));

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

  } catch (error) {
    isConnected = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("Please ensure MongoDB is running or update MONGODB_URI in .env");
    console.error("You can:");
    console.error("  1. Start MongoDB locally: mongod");
    console.error("  2. Use MongoDB Atlas (cloud): Update MONGODB_URI in .env");
  }
};

// Export both the function and connection status
module.exports = connectDB;
module.exports.isConnected = () => isConnected;
