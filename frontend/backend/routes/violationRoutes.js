const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  logViolation,
  listViolations,
  getMyViolations,
  getViolationById,
  updateViolationStatus,
} = require("../controllers/violationController");

const router = express.Router();

// Record disciplinary incident (Security Officer, Warden, Admin)
router.post("/", protect, authorizeRole("security", "warden", "admin"), logViolation);

// List disciplinary violations (Warden, Security, Admin)
router.get("/", protect, authorizeRole("warden", "security", "admin"), listViolations);

// Authenticated student views personal violation notices
router.get("/my-violations", protect, authorizeRole("student", "admin"), getMyViolations);

// View single violation details
router.get("/:id", protect, authorizeRole("student", "warden", "security", "admin"), getViolationById);

// Warden or Admin updates resolution status and fine status
router.patch("/:id/status", protect, authorizeRole("warden", "admin"), updateViolationStatus);

module.exports = router;

