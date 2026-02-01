const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/elite-propconnect";

// User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  rememberProjectAppointment: Boolean,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function resetPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Set new password here
    const newPassword = "admin123"; // CHANGE THIS TO YOUR DESIRED PASSWORD

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin user
    const result = await User.updateOne(
      { username: "admin" },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log("\n✓ Password reset successful!");
      console.log(`Username: admin`);
      console.log(`New password: ${newPassword}`);
      console.log("\nIMPORTANT: Change the password in this script before running again for security.");
    } else {
      console.log("No user found with username 'admin'");
    }

  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
  }
}

resetPassword();
