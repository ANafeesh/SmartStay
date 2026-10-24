const express = require("express");
const {
  getReceipts,
  getReceipt,
  verifyReceipt,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/", getReceipts);
router.post("/:receiptNo/verify", verifyReceipt);
router.get("/:receiptNo", getReceipt);

module.exports = router;
