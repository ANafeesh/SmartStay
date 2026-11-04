const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");

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

// Module 5 Analytics: Protected and restricted to Administrative & Executive roles
router.use(protect, authorizeRole("admin", "warden", "executive", "finance"));

router.get("/summary", getMonitoringSummary);
router.get("/blocks", getBlockSummary);
router.get("/occupancy", getOccupancyAnalytics);
router.get("/financial", getFinancialAnalytics);
router.get("/complaints", getComplaintAnalytics);
router.get("/telemetry-trend", getTelemetryTrend);
router.get("/alerts", getMonitoringAlerts);
router.get("/food-orders", getFoodOrderAnalytics);

module.exports = router;
