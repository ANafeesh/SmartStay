
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const billRoutes = require("./routes/billRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const paymentNotificationRoutes = require("./routes/paymentNotificationRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const menuRoutes = require("./routes/menuRoutes");
const foodOrderRoutes = require("./routes/foodOrderRoutes");
const deliverySlotRoutes = require("./routes/deliverySlotRoutes");
const vendorPassRoutes = require("./routes/vendorPassRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bedRoutes = require("./routes/bedRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const transferRoutes = require("./routes/transferRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/payment-notifications", paymentNotificationRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/food-orders", foodOrderRoutes);
app.use("/api/delivery-slots", deliverySlotRoutes);
app.use("/api/vendor-passes", vendorPassRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/complaints", complaintRoutes);

// Your Module 5: Monitoring and Analytics APIs
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/analytics", analyticsRoutes);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartStay Backend API is running",
  });
});

// Handle unknown routes
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