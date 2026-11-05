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

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MongoDB notice: MONGO_URI is not set in environment (system running with fallback data)");
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB notice: ${error.message} (system running with resilient fallback data)`);
  }
};

module.exports = connectDB;
