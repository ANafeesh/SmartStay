const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

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

// Financial staff and administrators can list all bills
router.get("/", protect, authorizeRole("admin", "finance", "warden"), getAllBills);

// Students can fetch their own bills; Staff can fetch any student's bills
router.get("/student/:studentId", protect, getStudentBills);

// Get single bill by ID
router.get("/:id", protect, getBillById);

// Update bill status (Finance, Admin)
router.patch("/:id", protect, authorizeRole("admin", "finance"), updateBillStatus);

module.exports = router;
