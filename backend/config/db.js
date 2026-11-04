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
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Automatically ensure all 4 blocks and 96 rooms are seeded
    try {
      const { ensureHostelDataSeeded } = require("../scripts/seedHostelData");
      await ensureHostelDataSeeded();
    } catch (seedErr) {
      console.warn("Hostel auto-seed notice:", seedErr.message);
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
