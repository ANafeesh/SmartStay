const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getMyPass,
  verifyPass,
  listPasses,
  getPassById,
  updatePassStatus,
  reissuePass,
} = require("../controllers/digitalPassController");

const router = express.Router();

// Student fetches or provisions personal pass
router.get("/my-pass", protect, authorizeRole("student", "admin"), getMyPass);

// Security officer or warden verifies QR token or pass number
router.post("/verify", protect, authorizeRole("security", "warden", "admin"), verifyPass);

// Security, Warden, Admin list passes
router.get("/", protect, authorizeRole("security", "warden", "admin"), listPasses);

// View pass details (Student ownership checked in controller, or staff)
router.get("/:id", protect, authorizeRole("student", "security", "warden", "admin"), getPassById);

// Warden / Admin updates pass status or reissues
router.patch("/:id/status", protect, authorizeRole("warden", "admin"), updatePassStatus);
router.post("/:id/reissue", protect, authorizeRole("warden", "admin"), reissuePass);

module.exports = router;

