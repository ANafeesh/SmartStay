const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  registerVisitor,
  checkInVisitor,
  checkOutVisitor,
  denyVisitor,
  listVisitors,
  getMyVisitors,
  getVisitorById,
} = require("../controllers/visitorController");

const router = express.Router();

// Register a visitor (Student pre-registers; Security or Admin logs gate admission)
router.post("/", protect, authorizeRole("student", "security", "admin"), registerVisitor);

// Security or Admin lists visitor log
router.get("/", protect, authorizeRole("security", "warden", "admin"), listVisitors);

// Student views personal visitor requests
router.get("/my-visitors", protect, authorizeRole("student", "admin"), getMyVisitors);

// View visitor details
router.get("/:id", protect, authorizeRole("student", "security", "warden", "admin"), getVisitorById);

// Security checks in, checks out, or denies visitor
router.patch("/:id/check-in", protect, authorizeRole("security", "admin"), checkInVisitor);
router.patch("/:id/check-out", protect, authorizeRole("security", "admin"), checkOutVisitor);
router.patch("/:id/deny", protect, authorizeRole("security", "admin"), denyVisitor);

module.exports = router;
