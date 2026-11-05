const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const path = require("path");
dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

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
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Serverless resilient DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {}
  next();
});

// Authentication APIs
app.use(["/api/auth", "/auth"], authRoutes);

// Core Modules APIs
app.use(["/api/bills", "/bills"], billRoutes);
app.use(["/api/payments", "/payments"], paymentRoutes);
app.use(["/api/receipts", "/receipts"], receiptRoutes);
app.use(["/api/payment-notifications", "/payment-notifications"], paymentNotificationRoutes);
app.use(["/api/vendors", "/vendors"], vendorRoutes);
app.use(["/api/menus", "/menus"], menuRoutes);
app.use(["/api/food-orders", "/food-orders"], foodOrderRoutes);
app.use(["/api/delivery-slots", "/delivery-slots"], deliverySlotRoutes);
app.use(["/api/vendor-passes", "/vendor-passes"], vendorPassRoutes);
app.use(["/api/buildings", "/buildings"], buildingRoutes);
app.use(["/api/rooms", "/rooms"], roomRoutes);
app.use(["/api/beds", "/beds"], bedRoutes);
app.use(["/api/allocations", "/allocations"], allocationRoutes);
app.use(["/api/transfers", "/transfers"], transferRoutes);
app.use(["/api/complaints", "/complaints"], complaintRoutes);

// Module 2: Student Security & Digital Pass APIs
app.use(["/api/digital-passes", "/digital-passes"], digitalPassRoutes);
app.use(["/api/gate-logs", "/gate-logs"], gateLogRoutes);
app.use(["/api/leave-requests", "/leave-requests"], leaveRequestRoutes);
app.use(["/api/visitors", "/visitors"], visitorRoutes);
app.use(["/api/violations", "/violations"], violationRoutes);


// Module 5: Monitoring and Analytics APIs
app.use(["/api/monitoring", "/monitoring"], monitoringRoutes);
app.use(["/api/analytics", "/analytics"], analyticsRoutes);

// Home route
app.get(["/", "/api", "/api/health"], (req, res) => {
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

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SmartStay backend running on port ${PORT}`);
  });
}

module.exports = app;
