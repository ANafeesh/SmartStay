
const mongoose = require("mongoose");
const Bed = require("../models/Bed");
const Room = require("../models/Room");
const Allocation = require("../models/Allocation");

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

    if (
      typeof bedNumber !== "string" ||
      !bedNumber.trim()
    ) {
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

// Update a bed
const updateBed = async (req, res) => {
  try {
    const { bedNumber, status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bed ID",
      });
    }

    const bed = await Bed.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Active bed not found",
      });
    }

    // Validate bed number if supplied
    if (bedNumber !== undefined) {
      if (
        typeof bedNumber !== "string" ||
        !bedNumber.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Bed number cannot be empty",
        });
      }

      const normalizedBedNumber = bedNumber.trim();

      // Exclude the current bed from the duplicate check
      const existingBed = await Bed.findOne({
        roomId: bed.roomId,
        bedNumber: normalizedBedNumber,
        _id: { $ne: bed._id },
      });

      if (existingBed) {
        return res.status(409).json({
          success: false,
          message: "This bed number already exists in the room",
        });
      }

      bed.bedNumber = normalizedBedNumber;
    }

    // Validate status if supplied
    if (status !== undefined) {
      const validStatuses = [
        "Available",
        "Occupied",
        "Maintenance",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bed status",
        });
      }

      // Check allocations before changing the status
      const activeAllocation = await Allocation.findOne({
        bedId: bed._id,
        status: "Active",
      });

      if (
        activeAllocation &&
        status !== "Occupied"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Cannot change this bed status while it has an active allocation",
        });
      }

      if (
        !activeAllocation &&
        status === "Occupied"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Cannot mark a bed Occupied without an active allocation",
        });
      }

      bed.status = status;
    }

    await bed.save();

    return res.status(200).json({
      success: true,
      message: "Bed updated successfully",
      data: bed,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This bed number already exists in the room",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update bed error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update bed",
    });
  }
};

// Soft-delete (deactivate) a bed
const deleteBed = async (req, res) => {
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
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Active bed not found",
      });
    }

    // Protect beds that have an active allocation
    const activeAllocation = await Allocation.findOne({
      bedId: bed._id,
      status: "Active",
    });

    if (activeAllocation) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot deactivate a bed with an active allocation",
      });
    }

    bed.isActive = false;
    await bed.save();

    return res.status(200).json({
      success: true,
      message: "Bed deactivated successfully",
      data: bed,
    });
  } catch (error) {
    console.error("Delete bed error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate bed",
    });
  }
};

module.exports = {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed,
};
