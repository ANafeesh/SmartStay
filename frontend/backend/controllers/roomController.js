
const mongoose = require("mongoose");
const Room = require("../models/Room");
const Building = require("../models/Building");
const Bed = require("../models/Bed");

// Create a room
const createRoom = async (req, res) => {
  try {
    const {
      buildingId,
      roomNumber,
      floor,
      capacity,
      roomType,
      status,
    } = req.body;

    if (
      !buildingId ||
      !roomNumber ||
      floor == null ||
      capacity == null ||
      !roomType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Building ID, room number, floor, capacity, and room type are required",
      });
    }

    if (!mongoose.isValidObjectId(buildingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid building ID",
      });
    }

    const building = await Building.findById(buildingId);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    if (
      !Number.isInteger(Number(floor)) ||
      Number(floor) < 1 ||
      Number(floor) > building.floors
    ) {
      return res.status(400).json({
        success: false,
        message: `Floor must be between 1 and ${building.floors}`,
      });
    }

    if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive integer",
      });
    }

    const existingRoom = await Room.findOne({
      buildingId,
      roomNumber: String(roomNumber).trim(),
    });

    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "Room number already exists in this building",
      });
    }

    const room = await Room.create({
      buildingId,
      roomNumber: String(roomNumber).trim(),
      floor: Number(floor),
      capacity: Number(capacity),
      roomType,
      ...(status !== undefined ? { status } : {}),
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
        message: "Room number already exists in this building",
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
      error: error.message,
    });
  }
};

// Get all rooms, with optional filters
const getAllRooms = async (req, res) => {
  try {
    const filter = {};

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

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const rooms = await Room.find(filter)
      .populate("buildingId", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

// Get one room by ID
const getRoomById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await Room.findById(req.params.id).populate(
      "buildingId",
      "name code"
    );

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
      error: error.message,
    });
  }
};

// Update a room
const updateRoom = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const {
      buildingId,
      roomNumber,
      floor,
      capacity,
      roomType,
      status,
    } = req.body;

    const nextBuildingId = buildingId ?? room.buildingId;
    const nextRoomNumber = roomNumber ?? room.roomNumber;
    const nextFloor = floor ?? room.floor;
    const nextCapacity = capacity ?? room.capacity;

    if (!mongoose.isValidObjectId(String(nextBuildingId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid building ID",
      });
    }

    const building = await Building.findById(nextBuildingId);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    if (
      !Number.isInteger(Number(nextFloor)) ||
      Number(nextFloor) < 1 ||
      Number(nextFloor) > building.floors
    ) {
      return res.status(400).json({
        success: false,
        message: `Floor must be between 1 and ${building.floors}`,
      });
    }

    if (
      !Number.isInteger(Number(nextCapacity)) ||
      Number(nextCapacity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive integer",
      });
    }

    const duplicateRoom = await Room.findOne({
      _id: { $ne: room._id },
      buildingId: nextBuildingId,
      roomNumber: String(nextRoomNumber).trim(),
    });

    if (duplicateRoom) {
      return res.status(409).json({
        success: false,
        message: "Room number already exists in this building",
      });
    }

    room.buildingId = nextBuildingId;
    room.roomNumber = String(nextRoomNumber).trim();
    room.floor = Number(nextFloor);
    room.capacity = Number(nextCapacity);

    if (roomType !== undefined) room.roomType = roomType;
    if (status !== undefined) room.status = status;

    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Room number already exists in this building",
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
      message: "Failed to update room",
      error: error.message,
    });
  }
};

// Delete a room
const deleteRoom = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Do not delete a room that still contains beds.
    const bedExists = await Bed.exists({ roomId: room._id });

    if (bedExists) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete this room because it contains beds",
      });
    }

    await room.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete room",
      error: error.message,
    });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
