const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  createPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

// Students and finance staff can record payments
router.post("/", protect, createPayment);

// Finance staff, Wardens, Admins can view all payments
router.get("/", protect, authorizeRole("admin", "finance", "warden"), getPayments);

// Authenticated users can view payment receipts
router.get("/:id", protect, getPayment);

// Finance staff can verify or update payment status
router.patch("/:id/status", protect, authorizeRole("admin", "finance"), updatePaymentStatus);

module.exports = router;
