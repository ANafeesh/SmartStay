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

// In-memory 30-second cache middleware for high-cost telemetry/analytics aggregates
const cacheStore = new Map();
const CACHE_TTL_MS = 30 * 1000;

const analyticsCache = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== "GET") return next();

  const cacheKey = req.originalUrl || req.url;
  const cached = cacheStore.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    res.setHeader("X-Cache", "HIT");
    return res.status(cached.status).json(cached.body);
  }

  // Intercept json()
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cacheStore.set(cacheKey, {
        timestamp: Date.now(),
        status: res.statusCode,
        body,
      });
    }
    return originalJson(body);
  };

  next();
};

// Module 5 Analytics: Protected and restricted to Administrative & Executive & Maintenance roles
router.use(protect, authorizeRole("admin", "warden", "executive", "finance", "maintenance"));
router.use(analyticsCache);

router.get("/summary", getMonitoringSummary);
router.get("/blocks", getBlockSummary);
router.get("/occupancy", getOccupancyAnalytics);
router.get("/financial", getFinancialAnalytics);
router.get("/complaints", getComplaintAnalytics);
router.get("/telemetry-trend", getTelemetryTrend);
router.get("/alerts", getMonitoringAlerts);
router.get("/food-orders", getFoodOrderAnalytics);

module.exports = router;
