const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/", protect, authorizeRole("admin", "finance", "warden"), createNotification);
router.patch("/:id/read", protect, markNotificationRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
