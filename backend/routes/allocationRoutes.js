
const express = require("express");

const {
  getAllocations,
  getAllocationById,
  createAllocation,
  checkoutAllocation,
} = require("../controllers/allocationController");

const router = express.Router();

router.get("/", getAllocations);
router.get("/:id", getAllocationById);
router.post("/", createAllocation);
router.patch("/:id/checkout", checkoutAllocation);

module.exports = router;
