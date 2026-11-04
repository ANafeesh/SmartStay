const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  listPasses,
  getPass,
  createPass,
  verifyPass,
  revokePass,
} = require("../controllers/vendorPassController");

const router = express.Router();

router.get("/", protect, authorizeRole("vendor", "security", "admin"), listPasses);
router.post("/", protect, authorizeRole("vendor", "admin"), createPass);
router.get("/:id", protect, getPass);
router.post("/:id/verify", protect, authorizeRole("security", "admin", "warden"), verifyPass);
router.patch("/:id/revoke", protect, authorizeRole("security", "admin", "warden"), revokePass);

module.exports = router;
