const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
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

// Module 2: Student Security & Digital Pass Routes
const digitalPassRoutes = require("./routes/digitalPassRoutes");
const gateLogRoutes = require("./routes/gateLogRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const violationRoutes = require("./routes/violationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Authentication APIs
app.use("/api/auth", authRoutes);

// Core Modules APIs
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

// Module 2: Student Security & Digital Pass APIs
app.use("/api/digital-passes", digitalPassRoutes);
app.use("/api/gate-logs", gateLogRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/violations", violationRoutes);


// Module 5: Monitoring and Analytics APIs
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

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`SmartStay backend running on port ${PORT}`);
  });
}

module.exports = app;
