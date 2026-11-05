const express = require("express");
const { protect, optionalAuth, authorizeRole } = require("../middleware/authMiddleware");

const {
  createBill,
  getAllBills,
  getStudentBills,
  getBillById,
  updateBillStatus,
} = require("../controllers/billController");

const router = express.Router();

// Financial staff and administrators can create bills
router.post("/", protect, authorizeRole("admin", "finance", "warden"), createBill);

// List bills (Admin, Finance, Warden or general view with optionalAuth)
router.get("/", optionalAuth, getAllBills);

// Students can fetch their own bills
router.get("/student/:studentId", optionalAuth, getStudentBills);

// Get single bill by ID
router.get("/:id", optionalAuth, getBillById);

// Update bill status (Finance, Admin)
router.patch("/:id", optionalAuth, updateBillStatus);

module.exports = router;
