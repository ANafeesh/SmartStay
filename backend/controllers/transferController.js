const mongoose = require("mongoose");
const Transfer = require("../models/Transfer");
const Allocation = require("../models/Allocation");
const Room = require("../models/Room");
const Bed = require("../models/Bed");

// Populate transfer details for API responses
const populateTransfer = (query) =>
  query
    .populate("allocationId")
    .populate("fromRoomId")
    .populate("fromBedId")
    .populate("toRoomId")
    .populate("toBedId");

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
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve transfers",
      error: error.message,
    });
  }
};

// GET /api/transfers/:id
const getTransferById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await populateTransfer(
      Transfer.findById(req.params.id)
    );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve transfer",
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
          "Allocation ID, destination room ID, destination bed ID, and reason are required",
      });
    }

    const ids = [allocationId, toRoomId, toBedId];

    if (!ids.every((id) => mongoose.isValidObjectId(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation, room, or bed ID",
      });
    }

    const allocation = await Allocation.findById(allocationId);

    if (!allocation || allocation.status !== "Active") {
      return res.status(404).json({
        success: false,
        message: "Active student allocation not found",
      });
    }

    if (
      String(allocation.roomId) === String(toRoomId) &&
      String(allocation.bedId) === String(toBedId)
    ) {
      return res.status(400).json({
        success: false,
        message: "The destination is already the student's current bed",
      });
    }

    const destinationRoom = await Room.findOne({
      _id: toRoomId,
      isActive: true,
    });

    if (!destinationRoom) {
      return res.status(404).json({
        success: false,
        message: "Active destination room not found",
      });
    }

    const destinationBed = await Bed.findOne({
      _id: toBedId,
      roomId: toRoomId,
      isActive: true,
    });

    if (!destinationBed) {
      return res.status(404).json({
        success: false,
        message: "Active destination bed not found in that room",
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
        message: "Destination bed is already allocated or reserved",
      });
    }

    const existingRequest = await Transfer.findOne({
      allocationId,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "This student already has a pending transfer request",
      });
    }

    const transfer = await Transfer.create({
      allocationId: allocation._id,
      studentRegistrationId: allocation.studentRegistrationId,
      fromRoomId: allocation.roomId,
      fromBedId: allocation.bedId,
      toRoomId,
      toBedId,
      reason: reason.trim(),
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
    return res.status(500).json({
      success: false,
      message: "Failed to create transfer request",
      error: error.message,
    });
  }
};

// PATCH /api/transfers/:id/approve
const approveTransfer = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer request not found",
      });
    }

    if (transfer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending transfer requests can be approved",
      });
    }

    const allocation = await Allocation.findById(transfer.allocationId);

    if (
      !allocation ||
      allocation.status !== "Active" ||
      String(allocation.studentRegistrationId) !==
        String(transfer.studentRegistrationId) ||
      String(allocation.roomId) !== String(transfer.fromRoomId) ||
      String(allocation.bedId) !== String(transfer.fromBedId)
    ) {
      return res.status(409).json({
        success: false,
        message:
          "The student's current allocation has changed. This transfer cannot be approved.",
      });
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

    if (destinationBed.status !== "Available") {
      return res.status(409).json({
        success: false,
        message: "Destination bed is no longer available",
      });
    }

    const destinationAllocation = await Allocation.findOne({
      bedId: transfer.toBedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (destinationAllocation) {
      return res.status(409).json({
        success: false,
        message: "Destination bed is already allocated or reserved",
      });
    }

    const oldBed = await Bed.findOne({
      _id: transfer.fromBedId,
      roomId: transfer.fromRoomId,
    });

    if (!oldBed) {
      return res.status(409).json({
        success: false,
        message: "The student's current bed could not be found",
      });
    }

    // Move the existing allocation to the destination.
    allocation.roomId = transfer.toRoomId;
    allocation.bedId = transfer.toBedId;
    await allocation.save();

    // Mark the destination bed occupied.
    destinationBed.status = "Occupied";
    await destinationBed.save();

    // Release the old bed only if no other active/pending allocation uses it.
    const oldBedStillUsed = await Allocation.exists({
      _id: { $ne: allocation._id },
      bedId: transfer.fromBedId,
      status: { $in: ["Active", "Pending"] },
    });

    if (!oldBedStillUsed && oldBed.status !== "Maintenance") {
      oldBed.status = "Available";
      await oldBed.save();
    }

    transfer.status = "Approved";
    transfer.reviewedAt = new Date();
    await transfer.save();

    const result = await populateTransfer(
      Transfer.findById(transfer._id)
    );

    return res.status(200).json({
      success: true,
      message: "Transfer approved and allocation updated successfully",
      data: result,
    });
  } catch (error) {
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer request not found",
      });
    }

    if (transfer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending transfer requests can be rejected",
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
      message: "Transfer request rejected successfully",
      data: result,
    });
  } catch (error) {
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