const express = require("express");
const router = express.Router();

const {
  getMonitoringSummary,
  getBlockSummary,
  getOccupancyAnalytics,
  getFinancialAnalytics,
  getComplaintAnalytics,
  getTelemetryTrend,
  getMonitoringAlerts,
  getFoodOrderAnalytics,
} = require("../controllers/analyticsController");

// Preserved existing monitoring endpoints
router.get("/summary", getMonitoringSummary);
router.get("/blocks", getBlockSummary);

// Module 5 Analytics endpoints
router.get("/occupancy", getOccupancyAnalytics);
router.get("/financial", getFinancialAnalytics);
router.get("/complaints", getComplaintAnalytics);
router.get("/telemetry-trend", getTelemetryTrend);
router.get("/alerts", getMonitoringAlerts);
router.get("/food-orders", getFoodOrderAnalytics);

module.exports = router;
