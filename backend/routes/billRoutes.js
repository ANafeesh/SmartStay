const express = require("express");

const {
  createBill,
  getAllBills,
  getStudentBills,
  getBillById,
  updateBillStatus,
} = require("../controllers/billController");

const router = express.Router();

// Create a new bill
router.post("/", createBill);

// Get all bills
router.get("/", getAllBills);

// Get bills for a specific student
router.get("/student/:studentId", getStudentBills);

// Get one bill
router.get("/:id", getBillById);

// Update bill status
router.patch("/:id", updateBillStatus);

module.exports = router;
