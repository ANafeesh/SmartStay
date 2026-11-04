const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  createReading,
  getReadings,
  getLatestReadings,
} = require("../controllers/monitoringController");

// IoT ingest (Maintenance, Admin)
router.post("/", protect, authorizeRole("admin", "maintenance"), createReading);

// Telemetry reading (Maintenance, Admin, Warden, Executive)
router.get("/", protect, authorizeRole("admin", "maintenance", "warden", "executive"), getReadings);
router.get("/latest", protect, authorizeRole("admin", "maintenance", "warden", "executive"), getLatestReadings);

module.exports = router;
