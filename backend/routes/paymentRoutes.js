const express = require("express");
const { protect, optionalAuth, authorizeRole } = require("../middleware/authMiddleware");

const {
  requestPaymentOtp,
  verifyOtpAndCompletePayment,
  submitDepositSlip,
  createPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

// Real OTP Generation & Email Dispatch
router.post("/request-otp", optionalAuth, requestPaymentOtp);

// Real OTP Verification, Payment Settlement & Warden Email Notification
router.post("/verify-otp", optionalAuth, verifyOtpAndCompletePayment);

// Bank Deposit Slip Upload & Notification
router.post("/deposit-slip", optionalAuth, submitDepositSlip);

// Students and finance staff can record payments
router.post("/", protect, createPayment);

// Finance staff, Wardens, Admins can view all payments
router.get("/", protect, authorizeRole("admin", "finance", "warden"), getPayments);

// Authenticated users can view payment receipts
router.get("/:id", protect, getPayment);

// Finance staff can verify or update payment status
router.patch("/:id/status", protect, authorizeRole("admin", "finance"), updatePaymentStatus);

module.exports = router;
