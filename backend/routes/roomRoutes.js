const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const router = express.Router();

// Read room inventory
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Administrative mutations
router.post("/", protect, authorizeRole("admin", "warden"), createRoom);
router.put("/:id", protect, authorizeRole("admin", "warden"), updateRoom);
router.delete("/:id", protect, authorizeRole("admin"), deleteRoom);

module.exports = router;
