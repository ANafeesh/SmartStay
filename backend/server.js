
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const billRoutes = require("./routes/billRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bedRoutes = require("./routes/bedRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const transferRoutes = require("./routes/transferRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/bills", billRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/transfers", transferRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartStay Backend API is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`SmartStay backend running on port ${PORT}`);
});
