const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  submitLeaveRequest,
  getMyLeaveRequests,
  listLeaveRequests,
  getLeaveRequestById,
  updateLeaveStatus,
  cancelLeaveRequest,
} = require("../controllers/leaveRequestController");

const router = express.Router();

// Student applies for hostel leave
router.post("/", protect, authorizeRole("student", "admin"), submitLeaveRequest);

// Student retrieves own leave applications
router.get("/my-requests", protect, authorizeRole("student", "admin"), getMyLeaveRequests);

// Warden, Security, Admin view all leave applications
router.get("/", protect, authorizeRole("warden", "admin", "security"), listLeaveRequests);

// View leave request details (Student ownership checked in controller, or staff)
router.get("/:id", protect, authorizeRole("student", "warden", "admin", "security"), getLeaveRequestById);

// Warden or Admin approves or rejects leave
router.patch("/:id/status", protect, authorizeRole("warden", "admin"), updateLeaveStatus);

// Student cancels own pending leave
router.patch("/:id/cancel", protect, authorizeRole("student", "admin"), cancelLeaveRequest);

module.exports = router;

