
const mongoose = require("mongoose");
const Bed = require("../models/Bed");
const Room = require("../models/Room");

// Create a bed
const createBed = async (req, res) => {
  try {
    const { roomId, bedNumber } = req.body;

    if (!mongoose.isValidObjectId(roomId)) {
      return res.status(400).json({
        success: false,
        message: "A valid room ID is required",
      });
    }

    if (!bedNumber || !bedNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bed number is required",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Active room not found",
      });
    }

    const existingBeds = await Bed.countDocuments({
      roomId,
      isActive: true,
    });

    if (existingBeds >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: "Room bed capacity has been reached",
      });
    }

    const bed = await Bed.create({
      roomId,
      bedNumber: bedNumber.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Bed created successfully",
      data: bed,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This bed number already exists in this room",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create bed error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create bed",
    });
  }
};

// Get all active beds
const getAllBeds = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.roomId) {
      if (!mongoose.isValidObjectId(req.query.roomId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid room ID",
        });
      }

      filter.roomId = req.query.roomId;
    }

    if (req.query.status) {
      const validStatuses = [
        "Available",
        "Occupied",
        "Maintenance",
      ];

      if (!validStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bed status",
        });
      }

      filter.status = req.query.status;
    }

    const beds = await Bed.find(filter)
      .populate({
        path: "roomId",
        select: "roomNumber floor capacity buildingId",
        populate: {
          path: "buildingId",
          select: "name code",
        },
      })
      .sort({ bedNumber: 1 });

    return res.status(200).json({
      success: true,
      count: beds.length,
      data: beds,
    });
  } catch (error) {
    console.error("Get beds error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch beds",
    });
  }
};

// Get one active bed by ID
const getBedById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bed ID",
      });
    }

    const bed = await Bed.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate({
      path: "roomId",
      select: "roomNumber floor capacity buildingId",
      populate: {
        path: "buildingId",
        select: "name code",
      },
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: bed,
    });
  } catch (error) {
    console.error("Get bed error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bed",
    });
  }
};

module.exports = {
  createBed,
  getAllBeds,
  getBedById,
};
