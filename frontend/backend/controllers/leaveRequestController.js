const LeaveRequest = require("../models/LeaveRequest");
const DigitalPass = require("../models/DigitalPass");

const handleError = (res, error, defaultMessage = "Server error occurred.") => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  const isProd = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    message: defaultMessage,
    ...(isProd ? {} : { error: error.message }),
  });
};

/**
 * POST /api/leave-requests
 * Student applies for hostel leave.
 * Strictly verifies departure and return dates and prevents concurrent pending duplicates.
 */
exports.submitLeaveRequest = async (req, res) => {
  try {
    const {
      departureDate,
      expectedReturnDate,
      reason = "Home Visit",
      destination,
      emergencyContact,
    } = req.body;

    if (!departureDate || !expectedReturnDate || !destination || !emergencyContact) {
      return res.status(400).json({
        success: false,
        message: "Please provide departure date, expected return date, destination, and emergency contact.",
      });
    }

    const dep = new Date(departureDate);
    const ret = new Date(expectedReturnDate);

    if (isNaN(dep.getTime()) || isNaN(ret.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid departure or return date format. Use ISO date strings.",
      });
    }

    if (ret <= dep) {
      return res.status(400).json({
        success: false,
        message: "Expected return date must be strictly after the departure date.",
      });
    }

    // Check for existing pending leave request to prevent duplicates
    const existingPending = await LeaveRequest.findOne({
      student: req.user._id,
      status: "Pending",
    });

    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending leave request awaiting warden approval.",
        data: existingPending,
      });
    }

    const regNo = req.user.registrationNumber || req.user.studentId || "SEU-STUDENT";

    const leave = await LeaveRequest.create({
      student: req.user._id,
      studentRegistrationId: regNo,
      studentName: req.user.name,
      departureDate: dep,
      expectedReturnDate: ret,
      reason,
      destination: destination.trim(),
      emergencyContact: emergencyContact.trim(),
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully. Awaiting warden approval.",
      data: leave,
    });
  } catch (error) {
    return handleError(res, error, "Failed to submit leave request.");
  }
};

/**
 * GET /api/leave-requests/my-requests
 * Student retrieves their personal leave applications
 */
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const studentId = req.user._id;

    const leaves = await LeaveRequest.find({ student: studentId })
      .sort({ createdAt: -1 })
      .populate("approvedBy", "name email");

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve personal leave requests.");
  }
};

/**
 * GET /api/leave-requests
 * Warden / Admin / Security lists all leave requests with validated pagination and search
 */
exports.listLeaveRequests = async (req, res) => {
  try {
    const { status, reason, search, startDate, endDate, page = 1, limit = 25 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer greater than or equal to 1.",
      });
    }
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive integer greater than or equal to 1.",
      });
    }

    const safeLimit = Math.min(100, parsedLimit);
    const safePage = parsedPage;
    const filter = {};

    if (status && status !== "All") {
      const allowedStatuses = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Allowed values: ${allowedStatuses.join(", ")}.`,
        });
      }
      filter.status = status;
    }

    if (reason && reason !== "All") {
      const allowedReasons = ["Home Visit", "Medical", "Academic", "Emergency", "Other"];
      if (!allowedReasons.includes(reason)) {
        return res.status(400).json({
          success: false,
          message: `Invalid reason filter. Allowed values: ${allowedReasons.join(", ")}.`,
        });
      }
      filter.reason = reason;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { studentRegistrationId: { $regex: q, $options: "i" } },
        { studentName: { $regex: q, $options: "i" } },
        { destination: { $regex: q, $options: "i" } },
      ];
    }

    if (startDate) {
      const s = new Date(startDate);
      if (isNaN(s.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid startDate format. Use ISO date string.",
        });
      }
      filter.departureDate = filter.departureDate || {};
      filter.departureDate.$gte = s;
    }

    if (endDate) {
      const e = new Date(endDate);
      if (isNaN(e.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endDate format. Use ISO date string.",
        });
      }
      filter.expectedReturnDate = filter.expectedReturnDate || {};
      filter.expectedReturnDate.$lte = e;
    }

    const skip = (safePage - 1) * safeLimit;
    const leaves = await LeaveRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("student", "name email phone room building")
      .populate("approvedBy", "name email");

    const total = await LeaveRequest.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: leaves.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: leaves,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch student leave requests.");
  }
};

/**
 * GET /api/leave-requests/:id
 */
exports.getLeaveRequestById = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate("student", "name email phone room building registrationNumber")
      .populate("approvedBy", "name email");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    // Ownership check for student role
    if (req.user.role === "student" && String(leave.student?._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot view another student's leave application.",
      });
    }

    return res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch leave request details.");
  }
};

/**
 * PATCH /api/leave-requests/:id/status
 * Warden / Admin approves or rejects leave.
 * Uses atomic conditional update to eliminate race conditions between wardens.
 */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, wardenRemarks = "" } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'.",
      });
    }

    // Atomic update: only update if currently 'Pending'
    const updated = await LeaveRequest.findOneAndUpdate(
      { _id: req.params.id, status: "Pending" },
      {
        $set: {
          status,
          approvedBy: req.user._id,
          approverName: req.user.name || "Hostel Warden",
          reviewedAt: new Date(),
          wardenRemarks: wardenRemarks.trim(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      const existing = await LeaveRequest.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found.",
        });
      }
      return res.status(409).json({
        success: false,
        message: `Leave request has already been ${existing.status.toLowerCase()} by ${existing.approverName || "another authority"}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Leave request has been ${status.toLowerCase()} by ${updated.approverName}.`,
      data: updated,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update leave request status.");
  }
};

/**
 * PATCH /api/leave-requests/:id/cancel
 * Student cancels their own pending leave request.
 * Uses atomic conditional update to eliminate race conditions.
 */
exports.cancelLeaveRequest = async (req, res) => {
  try {
    const filter = { _id: req.params.id, status: "Pending" };
    if (req.user.role === "student") {
      filter.student = req.user._id;
    }

    const cancelled = await LeaveRequest.findOneAndUpdate(
      filter,
      { $set: { status: "Cancelled" } },
      { returnDocument: "after" }
    );

    if (!cancelled) {
      const existing = await LeaveRequest.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found.",
        });
      }
      if (req.user.role === "student" && String(existing.student) !== String(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You cannot cancel another student's leave request.",
        });
      }
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a leave request that is already ${existing.status.toLowerCase()}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave request cancelled successfully.",
      data: cancelled,
    });
  } catch (error) {
    return handleError(res, error, "Failed to cancel leave request.");
  }
};
