
const express = require("express");

const {
  createRoom,
  getAllRooms,
  getRoomById,
} = require("../controllers/roomController");

const router = express.Router();

// Create a room
router.post("/", createRoom);

// Get all rooms, with optional filters
router.get("/", getAllRooms);

// Get one room by ID
router.get("/:id", getRoomById);

module.exports = router;
