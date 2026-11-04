
const mongoose = require("mongoose");
const Allocation = require("../models/Allocation");
const Room = require("../models/Room");
const Bed = require("../models/Bed");

const ACTIVE_STATUSES = ["Active", "Pending"];

// GET: Get all allocations
const getAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (error) {
    console.error("Get allocations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve allocations",
    });
  }
};

// GET: Get allocation by ID
const getAllocationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation ID",
      });
    }

    const allocation = await Allocation.findById(id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    console.error("Get allocation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve allocation",
    });
  }
};

// POST: Create a new allocation
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

    if (
      typeof registrationId !== "string" ||
      !registrationId.trim() ||
      typeof studentName !== "string" ||
      !studentName.trim() ||
      !roomId ||
      !bedId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student registration ID, student name, room ID, and bed ID are required",
      });
    }

    if (
      !mongoose.isValidObjectId(roomId) ||
      !mongoose.isValidObjectId(bedId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID or bed ID",
      });
    }

    if (!ACTIVE_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Pending",
      });
    }

    if (
      allocationDate !== undefined &&
      Number.isNaN(Date.parse(allocationDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation date",
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

    const bed = await Bed.findOne({
      _id: bedId,
      roomId,
      isActive: true,
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Active bed not found in the selected room",
      });
    }

    if (bed.status !== "Available") {
      return res.status(409).json({
        success: false,
        message: "This bed is not available",
      });
    }

    const existingStudent = await Allocation.findOne({
      studentRegistrationId: registrationId.trim(),
      status: { $in: ACTIVE_STATUSES },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message:
          "Student already has an active or pending allocation",
      });
    }

    const existingBed = await Allocation.findOne({
      bedId,
      status: { $in: ACTIVE_STATUSES },
    });

    if (existingBed) {
      return res.status(409).json({
        success: false,
        message: "This bed is already allocated or reserved",
      });
    }

    const allocation = await Allocation.create({
      studentRegistrationId: registrationId.trim(),
      studentName: studentName.trim(),
      roomId,
      bedId,
      allocationDate: allocationDate || Date.now(),
      status,
      notes,
    });

    bed.status = "Occupied";
    await bed.save();

    // Sync student user profile in database
    try {
      const User = require("../models/User");
      const Building = require("../models/Building");
      const bld = await Building.findById(room.buildingId);
      const bldName = bld?.name || bld?.code || "Hostel";
      await User.updateMany(
        {
          $or: [
            { studentId: registrationId.trim() },
            { registrationNumber: registrationId.trim() },
          ],
        },
        {
          $set: {
            room: room.roomNumber,
            building: bldName,
          },
        }
      );
    } catch (uErr) {
      console.warn("Could not sync user profile in createAllocation:", uErr.message);
    }

    const result = await Allocation.findById(allocation._id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    return res.status(201).json({
      success: true,
      message: "Allocation created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create allocation error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create allocation",
    });
  }
};

// PUT: Update an allocation
const updateAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation ID",
      });
    }

    const allocation = await Allocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    const {
      studentRegistrationId,
      studentName,
      roomId,
      bedId,
      allocationDate,
      status,
      notes,
    } = req.body;

    const registrationId =
      studentRegistrationId ?? allocation.studentRegistrationId;
    const nextStudentName = studentName ?? allocation.studentName;
    const nextRoomId = roomId ?? allocation.roomId.toString();
    const nextBedId = bedId ?? allocation.bedId.toString();
    const nextStatus = status ?? allocation.status;

    if (
      typeof registrationId !== "string" ||
      !registrationId.trim() ||
      typeof nextStudentName !== "string" ||
      !nextStudentName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid student registration ID and name are required",
      });
    }

    if (
      !mongoose.isValidObjectId(nextRoomId) ||
      !mongoose.isValidObjectId(nextBedId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID or bed ID",
      });
    }

    if (!["Active", "Pending", "Checked Out"].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation status",
      });
    }

    if (
      allocationDate !== undefined &&
      Number.isNaN(Date.parse(allocationDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation date",
      });
    }

    const reservesBed = ACTIVE_STATUSES.includes(nextStatus);

    // Prevent duplicate active/pending allocations for a student.
    if (reservesBed) {
      const duplicateStudent = await Allocation.findOne({
        _id: { $ne: allocation._id },
        studentRegistrationId: registrationId.trim(),
        status: { $in: ACTIVE_STATUSES },
      });

      if (duplicateStudent) {
        return res.status(409).json({
          success: false,
          message:
            "Student already has an active or pending allocation",
        });
      }
    }

    const room = await Room.findOne({
      _id: nextRoomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Active room not found",
      });
    }

    const bed = await Bed.findOne({
      _id: nextBedId,
      roomId: nextRoomId,
      isActive: true,
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Active bed not found in the selected room",
      });
    }

    const oldBedId = allocation.bedId.toString();
    const newBedId = bed._id.toString();

    if (reservesBed) {
      if (newBedId !== oldBedId && bed.status !== "Available") {
        return res.status(409).json({
          success: false,
          message: "Selected bed is not available",
        });
      }

      const duplicateBed = await Allocation.findOne({
        _id: { $ne: allocation._id },
        bedId: bed._id,
        status: { $in: ACTIVE_STATUSES },
      });

      if (duplicateBed) {
        return res.status(409).json({
          success: false,
          message: "This bed is already allocated or reserved",
        });
      }
    }

    allocation.studentRegistrationId = registrationId.trim();
    allocation.studentName = nextStudentName.trim();
    allocation.roomId = room._id;
    allocation.bedId = bed._id;
    allocation.status = nextStatus;

    if (allocationDate !== undefined) {
      allocation.allocationDate = allocationDate;
    }

    if (notes !== undefined) {
      allocation.notes = notes;
    }

    await allocation.save();

    // Release the old bed when moved or checked out.
    if (oldBedId !== newBedId || !reservesBed) {
      const oldBed = await Bed.findById(oldBedId);

      if (oldBed) {
        const oldBedReserved = await Allocation.exists({
          _id: { $ne: allocation._id },
          bedId: oldBed._id,
          status: { $in: ACTIVE_STATUSES },
        });

        if (!oldBedReserved) {
          oldBed.status = "Available";
          await oldBed.save();
        }
      }
    }

    // Synchronize the new bed status.
    if (reservesBed) {
      bed.status = "Occupied";
      await bed.save();
    } else {
      const bedReserved = await Allocation.exists({
        _id: { $ne: allocation._id },
        bedId: bed._id,
        status: { $in: ACTIVE_STATUSES },
      });

      if (!bedReserved) {
        bed.status = "Available";
        await bed.save();
      }
    }

    // Sync student user profile in database
    try {
      const User = require("../models/User");
      const Building = require("../models/Building");
      const bld = await Building.findById(room.buildingId);
      const bldName = bld?.name || bld?.code || "Hostel";
      await User.updateMany(
        {
          $or: [
            { studentId: registrationId.trim() },
            { registrationNumber: registrationId.trim() },
          ],
        },
        {
          $set: {
            room: room.roomNumber,
            building: bldName,
          },
        }
      );
    } catch (uErr) {
      console.warn("Could not sync user profile in updateAllocation:", uErr.message);
    }

    const result = await Allocation.findById(id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    return res.status(200).json({
      success: true,
      message: "Allocation updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update allocation error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update allocation",
    });
  }
};

// PATCH: Check out a student
const checkoutAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid allocation ID",
      });
    }

    const allocation = await Allocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    if (allocation.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Only active allocations can be checked out",
      });
    }

    allocation.status = "Checked Out";
    await allocation.save();

    const otherAllocation = await Allocation.findOne({
      _id: { $ne: allocation._id },
      bedId: allocation.bedId,
      status: { $in: ACTIVE_STATUSES },
    });

    if (!otherAllocation) {
      const bed = await Bed.findById(allocation.bedId);

      if (bed) {
        bed.status = "Available";
        await bed.save();
      }
    }

    const result = await Allocation.findById(id)
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    return res.status(200).json({
      success: true,
      message: "Student checked out successfully",
      data: result,
    });
  } catch (error) {
    console.error("Checkout allocation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to check out student",
    });
  }
};

// GET: Get logged in student's active allocation
const getMyAllocation = async (req, res) => {
  try {
    const studentRegId =
      req.query.studentRegistrationId ||
      req.query.studentId ||
      req.user?.studentId ||
      req.user?.registrationNumber;

    if (!studentRegId) {
      return res.status(400).json({
        success: false,
        message: "Student registration ID could not be identified from authentication session.",
      });
    }

    const allocation = await Allocation.findOne({
      studentRegistrationId: studentRegId,
      status: "Active",
    })
      .populate({
        path: "roomId",
        populate: { path: "buildingId" },
      })
      .populate("bedId");

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "No active room allocation found for this student.",
      });
    }

    // Find roommates in the same room
    const roommates = await Allocation.find({
      roomId: allocation.roomId._id,
      _id: { $ne: allocation._id },
      status: "Active",
    }).select("studentName studentRegistrationId");

    return res.status(200).json({
      success: true,
      data: {
        allocation,
        room: allocation.roomId,
        building: allocation.roomId.buildingId,
        bed: allocation.bedId,
        roommates,
      },
    });
  } catch (error) {
    console.error("Get my allocation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student allocation",
      error: error.message,
    });
  }
};

module.exports = {
  getAllocations,
  getAllocationById,
  getMyAllocation,
  createAllocation,
  updateAllocation,
  checkoutAllocation,
};
