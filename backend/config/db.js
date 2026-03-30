const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/elite-propconnect";
      console.log("Connecting to MongoDB at:", mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"));

      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 30000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        connectionPromise = null;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
        connectionPromise = null;
      });

    } catch (error) {
      connectionPromise = null;
      console.error(`MongoDB Connection Error: ${error.message}`);
      throw error;
    }
  })();

  return connectionPromise;
};

module.exports = connectDB;
