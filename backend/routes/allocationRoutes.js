const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  getAllocations,
  getAllocationById,
  getMyAllocation,
  createAllocation,
  updateAllocation,
  checkoutAllocation,
} = require("../controllers/allocationController");

const router = express.Router();

// GET: Get logged in student's active allocation
router.get("/my-allocation", protect, getMyAllocation);

// GET: Get all allocations (Staff, Warden, Admin)
router.get("/", protect, authorizeRole("admin", "warden", "finance"), getAllocations);

// GET: Get allocation by ID (Authenticated users)
router.get("/:id", protect, getAllocationById);

// POST, PUT, PATCH: Administrative allocation management
router.post("/", protect, authorizeRole("admin", "warden"), createAllocation);
router.put("/:id", protect, authorizeRole("admin", "warden"), updateAllocation);
router.patch("/:id/checkout", protect, authorizeRole("admin", "warden"), checkoutAllocation);

module.exports = router;
