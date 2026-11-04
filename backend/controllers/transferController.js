
const mongoose = require("mongoose");

const Transfer = require("../models/Transfer");
const Allocation = require("../models/Allocation");
const Room = require("../models/Room");
const Bed = require("../models/Bed");

// Populate transfer details
const populateTransfer = (query) => {
  return query
    .populate("allocationId")
    .populate("fromRoomId")
    .populate("fromBedId")
    .populate("toRoomId")
    .populate("toBedId");
};

// GET /api/transfers
const getTransfers = async (req, res) => {
  try {
    const transfers = await populateTransfer(
      Transfer.find().sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers,
    });
  } catch (error) {
    console.error("Get transfers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transfers",
      error: error.message,
    });
  }
};

// GET /api/transfers/:id
const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await populateTransfer(
      Transfer.findById(id)
    );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    console.error("Get transfer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transfer",
      error: error.message,
    });
  }
};

// POST /api/transfers
const createTransfer = async (req, res) => {
  try {
    const {
      allocationId,
      toRoomId,
      toBedId,
      reason,
    } = req.body;

    if (!allocationId || !toRoomId || !toBedId || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "allocationId, toRoomId, toBedId and reason are required",
      });
    }

    if (
      !mongoose.isValidObjectId(allocationId) ||
      !mongoose.isValidObjectId(toRoomId) ||
      !mongoose.isValidObjectId(toBedId)
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more IDs are invalid",
      });
    }

    const allocation = await Allocation.findById(allocationId);

    if (!allocation || allocation.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "An active allocation is required",
      });
    }

    const destinationRoom = await Room.findOne({
      _id: toRoomId,
      isActive: true,
    });

    const destinationBed = await Bed.findOne({
      _id: toBedId,
      roomId: toRoomId,
      isActive: true,
    });

    if (!destinationRoom || !destinationBed) {
      return res.status(404).json({
        success: false,
        message: "Active destination room or bed not found",
      });
    }

    if (String(allocation.bedId) === String(toBedId)) {
      return res.status(400).json({
        success: false,
        message: "Destination bed is already the current bed",
      });
    }

    if (destinationBed.status !== "Available") {
      return res.status(409).json({
        success: false,
        message: "Destination bed is not available",
      });
    }

    const existingAllocation = await Allocation.findOne({
      bedId: toBedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (existingAllocation) {
      return res.status(409).json({
        success: false,
        message: "Destination bed is already allocated",
      });
    }

    const existingTransfer = await Transfer.findOne({
      allocationId,
      status: "Pending",
    });

    if (existingTransfer) {
      return res.status(409).json({
        success: false,
        message: "This allocation already has a pending transfer",
      });
    }

    const transfer = await Transfer.create({
      allocationId,
      studentRegistrationId: allocation.studentRegistrationId,
      fromRoomId: allocation.roomId,
      fromBedId: allocation.bedId,
      toRoomId,
      toBedId,
      reason: reason.trim(),
      status: "Pending",
    });

    const result = await populateTransfer(
      Transfer.findById(transfer._id)
    );

    return res.status(201).json({
      success: true,
      message: "Transfer request created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create transfer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create transfer",
      error: error.message,
    });
  }
};

// PATCH /api/transfers/:id/approve
const approveTransfer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await Transfer.findById(id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    if (transfer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending transfers can be approved",
      });
    }

    const allocation = await Allocation.findById(
      transfer.allocationId
    );

    if (
      !allocation ||
      allocation.status !== "Active" ||
      allocation.studentRegistrationId !==
        transfer.studentRegistrationId
    ) {
      return res.status(409).json({
        success: false,
        message: "Student's current allocation has changed or is no longer active",
      });
    }

    // Keep transfer source room and bed in sync with the student's active allocation
    if (
      String(allocation.roomId) !== String(transfer.fromRoomId) ||
      String(allocation.bedId) !== String(transfer.fromBedId)
    ) {
      transfer.fromRoomId = allocation.roomId;
      transfer.fromBedId = allocation.bedId;
      await transfer.save();
    }

    const destinationRoom = await Room.findOne({
      _id: transfer.toRoomId,
      isActive: true,
    });

    const destinationBed = await Bed.findOne({
      _id: transfer.toBedId,
      roomId: transfer.toRoomId,
      isActive: true,
    });

    if (!destinationRoom || !destinationBed) {
      return res.status(404).json({
        success: false,
        message: "Active destination room or bed not found",
      });
    }

    const existingAllocation = await Allocation.findOne({
      _id: { $ne: allocation._id },
      bedId: transfer.toBedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (existingAllocation) {
      return res.status(409).json({
        success: false,
        message: "Destination bed is already allocated to another resident",
      });
    }

    // If destination bed has no active allocation, ensure status is marked Available
    if (destinationBed.status !== "Available") {
      destinationBed.status = "Available";
      await destinationBed.save();
    }

    const oldBed = await Bed.findOne({
      _id: transfer.fromBedId,
      roomId: transfer.fromRoomId,
    });

    if (!oldBed) {
      return res.status(404).json({
        success: false,
        message: "Current bed not found",
      });
    }

    // Move the allocation to the destination.
    allocation.roomId = transfer.toRoomId;
    allocation.bedId = transfer.toBedId;
    await allocation.save();

    // Mark the destination bed as occupied.
    destinationBed.status = "Occupied";
    await destinationBed.save();

    // Release the old bed if no other allocation uses it.
    const oldBedStillUsed = await Allocation.exists({
      _id: { $ne: allocation._id },
      bedId: transfer.fromBedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (!oldBedStillUsed && oldBed.status !== "Maintenance") {
      oldBed.status = "Available";
      await oldBed.save();
    }

    // Update the transfer status.
    transfer.status = "Approved";
    transfer.reviewedAt = new Date();
    await transfer.save();

    const result = await populateTransfer(
      Transfer.findById(transfer._id)
    );

    return res.status(200).json({
      success: true,
      message: "Transfer approved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Approve transfer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve transfer",
      error: error.message,
    });
  }
};

// PATCH /api/transfers/:id/reject
const rejectTransfer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await Transfer.findById(id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    if (transfer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending transfers can be rejected",
      });
    }

    transfer.status = "Rejected";
    transfer.reviewedAt = new Date();

    await transfer.save();

    const result = await populateTransfer(
      Transfer.findById(transfer._id)
    );

    return res.status(200).json({
      success: true,
      message: "Transfer rejected successfully",
      data: result,
    });
  } catch (error) {
    console.error("Reject transfer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject transfer",
      error: error.message,
    });
  }
};

module.exports = {
  getTransfers,
  getTransferById,
  createTransfer,
  approveTransfer,
  rejectTransfer,
};
