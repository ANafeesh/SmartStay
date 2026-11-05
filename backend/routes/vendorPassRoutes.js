const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getActivePass,
  verifyAndRecordMovement,
  listPasses,
  getPass,
  createPass,
  verifyPass,
  revokePass,
} = require("../controllers/vendorPassController");

const router = express.Router();

// Specific routes first to avoid route collisions with :id
router.get("/active", protect, getActivePass);
router.post(
  "/verify-movement",
  protect,
  authorizeRole("vendor", "security", "admin", "warden"),
  verifyAndRecordMovement,
);
router.post(
  "/scan",
  protect,
  authorizeRole("vendor", "security", "admin", "warden"),
  verifyAndRecordMovement,
);

// Standard collection and pass-specific routes
router.get("/", protect, authorizeRole("vendor", "security", "admin"), listPasses);
router.post("/", protect, authorizeRole("vendor", "admin"), createPass);
router.get("/:id", protect, getPass);
router.post("/:id/verify", protect, authorizeRole("security", "admin", "warden"), verifyPass);
router.patch("/:id/revoke", protect, authorizeRole("security", "admin", "warden"), revokePass);

module.exports = router;
