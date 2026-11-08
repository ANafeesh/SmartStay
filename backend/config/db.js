const dns = require("dns");
const mongoose = require("mongoose");

// Fix for Node.js on Windows with mongodb+srv SRV resolution (EBADRESP error)
if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // Use system default if setting servers fails
  }
}

// Disable Mongoose command buffering when disconnected to prevent 10s query hangs
mongoose.set("bufferCommands", false);

let isConnected = false;
let lastAttemptTime = 0;
const RETRY_COOLDOWN_MS = 20000; // 20s cooldown after failure to avoid stalling serverless requests

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  // If a connection attempt recently failed, skip without blocking
  if (Date.now() - lastAttemptTime < RETRY_COOLDOWN_MS) {
    return;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MongoDB notice: MONGO_URI is not set in environment (system running with fallback data)");
    return;
  }

  try {
    lastAttemptTime = Date.now();
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });

    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Automatically ensure all 4 blocks and 96 rooms are seeded
    try {
      const { ensureHostelDataSeeded } = require("../scripts/seedHostelData");
      await ensureHostelDataSeeded();
    } catch (seedErr) {
      console.warn("Hostel auto-seed notice:", seedErr.message);
    }
  } catch (error) {
    isConnected = false;
    lastAttemptTime = Date.now();
    console.warn(`MongoDB notice: ${error.message} (system running with resilient fallback data)`);
  }
};

module.exports = connectDB;
