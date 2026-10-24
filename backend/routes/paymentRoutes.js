const express = require("express");
const {
  createPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/:id", getPayment);
router.patch("/:id/status", updatePaymentStatus);

module.exports = router;
