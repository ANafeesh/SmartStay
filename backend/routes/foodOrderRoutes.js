const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} = require("../controllers/foodOrderController");

const router = express.Router();

// List and view food orders (Students, Vendors, Admins)
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);

// Place an order (Students)
router.post("/", protect, authorizeRole("student", "admin"), createOrder);

// Update order status (Vendors, Delivery associates, Admins)
router.patch(
  "/:id/status",
  protect,
  authorizeRole("vendor", "delivery", "admin"),
  updateOrderStatus
);
router.put(
  "/:id/status",
  protect,
  authorizeRole("vendor", "delivery", "admin"),
  updateOrderStatus
);

module.exports = router;
