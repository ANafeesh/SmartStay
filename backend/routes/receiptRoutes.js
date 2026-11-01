const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getReceipts,
  getReceipt,
  verifyReceipt,
} = require("../controllers/paymentController");

const router = express.Router();

// List receipts (Finance, Admin, Student)
router.get("/", protect, getReceipts);

// Public verification for anti-tamper QR stamp on physical/digital receipts
router.post("/:receiptNo/verify", verifyReceipt);

// View receipt details
router.get("/:receiptNo", protect, getReceipt);

module.exports = router;
