
const mongoose = require("mongoose");
const Room = require("../models/Room");
const Building = require("../models/Building");

// Create a room
const createRoom = async (req, res) => {
  try {
    const { buildingId, roomNumber, floor, capacity, roomType } = req.body;

    if (!mongoose.isValidObjectId(buildingId)) {
      return res.status(400).json({
        success: false,
        message: "A valid building ID is required",
      });
    }

    const building = await Building.findById(buildingId);

    if (!building || !building.isActive) {
      return res.status(404).json({
        success: false,
        message: "Active building not found",
      });
    }

    if (
      !Number.isInteger(floor) ||
      floor < 1 ||
      floor > building.floors
    ) {
      return res.status(400).json({
        success: false,
        message: "Floor must be within the building's floor range",
      });
    }

    const room = await Room.create({
      buildingId,
      roomNumber,
      floor,
      capacity,
      roomType,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This room number already exists on that floor",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

// Get all active rooms
const getAllRooms = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.buildingId) {
      if (!mongoose.isValidObjectId(req.query.buildingId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid building ID",
        });
      }

      filter.buildingId = req.query.buildingId;
    }

    if (req.query.floor !== undefined) {
      const floor = Number(req.query.floor);

      if (!Number.isInteger(floor) || floor < 1) {
        return res.status(400).json({
          success: false,
          message: "Floor must be a positive integer",
        });
      }

      filter.floor = floor;
    }

    const rooms = await Room.find(filter)
      .populate("buildingId", "name code")
      .sort({ floor: 1, roomNumber: 1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// Get one active room by ID
const getRoomById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await Room.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("buildingId", "name code");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch room",
    });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
};
