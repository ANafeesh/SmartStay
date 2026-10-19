
const express = require("express");

const {
  getAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  checkoutAllocation,
} = require("../controllers/allocationController");

const router = express.Router();

// GET: Get all allocations
router.get("/", getAllocations);

// GET: Get allocation by ID
router.get("/:id", getAllocationById);

// POST: Create a new allocation
router.post("/", createAllocation);

// PUT: Update an allocation
router.put("/:id", updateAllocation);

// PATCH: Check out a student
router.patch("/:id/checkout", checkoutAllocation);

module.exports = router;
