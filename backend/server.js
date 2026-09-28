const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const billRoutes = require("./routes/billRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/bills", billRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartStay Backend API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SmartStay backend running on port ${PORT}`);
});
