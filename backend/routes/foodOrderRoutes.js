const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} = require("../controllers/foodOrderController");

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrder);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
