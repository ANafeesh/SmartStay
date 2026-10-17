
const mongoose = require("mongoose");
const Allocation = require("../models/Allocation");
const Room = require("../models/Room");
const Bed = require("../models/Bed");

// GET /api/allocations
const getAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId")
      .sort({ createdAt: -1 });

    res.status(200).json(allocations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve allocations",
      error: error.message,
    });
  }
};

// GET /api/allocations/:id
const getAllocationById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid allocation ID" });
    }

    const allocation = await Allocation.findById(req.params.id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    res.status(200).json(allocation);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve allocation",
      error: error.message,
    });
  }
};

// POST /api/allocations
const createAllocation = async (req, res) => {
  try {
    const {
      studentRegistrationId,
      studentId,
      studentName,
      roomId,
      bedId,
      allocationDate,
      status = "Active",
      notes = "",
    } = req.body;

    const registrationId = studentRegistrationId || studentId;

    if (!registrationId || !studentName || !roomId || !bedId) {
      return res.status(400).json({
        message:
          "Student registration ID, student name, room ID, and bed ID are required",
      });
    }

    if (
      !mongoose.isValidObjectId(roomId) ||
      !mongoose.isValidObjectId(bedId)
    ) {
      return res.status(400).json({
        message: "Invalid room ID or bed ID",
      });
    }

    if (!["Active", "Pending"].includes(status)) {
      return res.status(400).json({
        message: "New allocation status must be Active or Pending",
      });
    }

    if (
      allocationDate !== undefined &&
      Number.isNaN(Date.parse(allocationDate))
    ) {
      return res.status(400).json({
        message: "Invalid allocation date",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        message: "Active room not found",
      });
    }

    const bed = await Bed.findOne({
      _id: bedId,
      roomId,
      isActive: true,
    });

    if (!bed) {
      return res.status(404).json({
        message: "Active bed not found in the selected room",
      });
    }

    if (bed.status !== "Available") {
      return res.status(409).json({
        message: "This bed is not available",
      });
    }

    const existingStudentAllocation = await Allocation.findOne({
      studentRegistrationId: registrationId.trim(),
      status: { $in: ["Active", "Pending"] },
    });

    if (existingStudentAllocation) {
      return res.status(409).json({
        message: "This student already has an active or pending allocation",
      });
    }

    const existingBedAllocation = await Allocation.findOne({
      bedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (existingBedAllocation) {
      return res.status(409).json({
        message: "This bed is already allocated or reserved",
      });
    }

    const allocation = await Allocation.create({
      studentRegistrationId: registrationId.trim(),
      studentName,
      roomId,
      bedId,
      allocationDate: allocationDate || Date.now(),
      status,
      notes,
    });

    // Active and Pending allocations both reserve the bed.
    bed.status = "Occupied";
    await bed.save();

    const result = await Allocation.findById(allocation._id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    res.status(201).json({
      message: "Allocation created successfully",
      allocation: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create allocation",
      error: error.message,
    });
  }
};

// PATCH /api/allocations/:id/checkout
const checkoutAllocation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid allocation ID" });
    }

    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    if (allocation.status !== "Active") {
      return res.status(400).json({
        message: "Only active allocations can be checked out",
      });
    }

    allocation.status = "Checked Out";
    await allocation.save();

    // Release the bed only if no other active/pending allocation uses it.
    const otherAllocation = await Allocation.findOne({
      _id: { $ne: allocation._id },
      bedId: allocation.bedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (!otherAllocation) {
      await Bed.findByIdAndUpdate(allocation.bedId, {
        status: "Available",
      });
    }

    const result = await Allocation.findById(allocation._id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    res.status(200).json({
      message: "Student checked out successfully",
      allocation: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check out student",
      error: error.message,
    });
  }
};

module.exports = {
  getAllocations,
  getAllocationById,
  createAllocation,
  checkoutAllocation,
};
