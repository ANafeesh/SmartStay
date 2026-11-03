const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  recordMovement,
  getGateLogs,
  getMyLogs,
  getCampusOccupancyStatus,
  reconcilePendingSideEffects,
  getGateInconsistencies,
} = require("../controllers/gateLogController");

const router = express.Router();

// Record campus gate entry or exit (Security Officer, Warden, or Admin)
router.post("/", protect, authorizeRole("security", "admin", "warden"), recordMovement);

// Reconcile pending or failed post-log side effects (Security Officer or Admin)
router.post("/reconcile", protect, authorizeRole("security", "admin"), reconcilePendingSideEffects);

// Retrieve recorded gate inconsistencies (Security Officer or Admin)
router.get("/inconsistencies", protect, authorizeRole("security", "admin"), getGateInconsistencies);

// Query gate movement logs (Security, Warden, Admin, Executive)
router.get("/", protect, authorizeRole("security", "warden", "admin", "executive"), getGateLogs);

// Authenticated student views personal gate movement history
router.get("/my-logs", protect, authorizeRole("student", "admin"), getMyLogs);

// Aggregated live inside/outside campus headcount
router.get(
  "/occupancy-status",
  protect,
  authorizeRole("security", "warden", "admin", "executive"),
  getCampusOccupancyStatus
);

module.exports = router;
