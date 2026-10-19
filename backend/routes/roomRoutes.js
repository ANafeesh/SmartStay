
const express = require("express");

const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const router = express.Router();

// Create a room
router.post("/", createRoom);

// Get all rooms
router.get("/", getAllRooms);

// Get one room by ID
router.get("/:id", getRoomById);

// Update a room
router.put("/:id", updateRoom);

// Delete a room
router.delete("/:id", deleteRoom);

module.exports = router;
