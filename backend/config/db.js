const dns = require("dns");
const mongoose = require("mongoose");

// Fix for Node.js on Windows with mongodb+srv SRV resolution (EBADRESP error)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Use system default if setting servers fails
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB notice: ${error.message} (system running with resilient fallback data)`);
  }
};

module.exports = connectDB;
