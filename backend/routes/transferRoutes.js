const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  getTransfers,
  getTransferById,
  createTransfer,
  approveTransfer,
  rejectTransfer,
} = require("../controllers/transferController");

const router = express.Router();

// Authenticated users can list and view transfers
router.get("/", protect, getTransfers);
router.get("/:id", protect, getTransferById);

// Students can apply for transfers
router.post("/", protect, authorizeRole("student", "admin"), createTransfer);

// Wardens and Admins approve or reject transfers
router.patch("/:id/approve", protect, authorizeRole("admin", "warden"), approveTransfer);
router.patch("/:id/reject", protect, authorizeRole("admin", "warden"), rejectTransfer);

module.exports = router;
