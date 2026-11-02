const Visitor = require("../models/Visitor");
const User = require("../models/User");

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
 * POST /api/visitors
 * Student pre-registers visitor (initial status: Expected) or Security logs visitor at gate (initial status: Checked-In)
 */
exports.registerVisitor = async (req, res) => {
  try {
    const {
      visitorName,
      nicOrPassport,
      contactNumber,
      studentRegistrationId,
      relationship = "Parent",
      purpose,
      gateName = "Main Security Gate",
      remarks = "",
    } = req.body;

    if (!visitorName || !nicOrPassport || !contactNumber || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Please provide visitor name, NIC/Passport number, contact phone, and purpose of visit.",
      });
    }

    let hostStudent;
    const isStudentUser = req.user.role === "student";

    if (isStudentUser) {
      // Host is the authenticated student
      hostStudent = req.user;
    } else {
      // Security or Admin registering guest for a student
      if (!studentRegistrationId) {
        return res.status(400).json({
          success: false,
          message: "Please specify the host student's registration ID.",
        });
      }

      hostStudent = await User.findOne({
        $or: [
          { registrationNumber: studentRegistrationId.trim() },
          { studentId: studentRegistrationId.trim() },
          { email: studentRegistrationId.trim() },
        ],
      });

      if (!hostStudent) {
        return res.status(404).json({
          success: false,
          message: `Host student '${studentRegistrationId}' was not found.`,
        });
      }
    }

    const regNo = hostStudent.registrationNumber || hostStudent.studentId || "SEU-STUDENT";
    const initialStatus = isStudentUser ? "Expected" : "Checked-In";
    const entryTime = isStudentUser ? null : new Date();

    const visitor = await Visitor.create({
      visitorName: visitorName.trim(),
      nicOrPassport: nicOrPassport.trim().toUpperCase(),
      contactNumber: contactNumber.trim(),
      student: hostStudent._id,
      studentRegistrationId: regNo,
      studentName: hostStudent.name,
      relationship,
      purpose: purpose.trim(),
      entryTime: entryTime || new Date(),
      status: initialStatus,
      gateName: gateName.trim(),
      gateOfficer: isStudentUser ? null : req.user._id,
      officerName: isStudentUser ? "" : req.user.name || "Gate Security Officer",
      remarks: remarks.trim(),
    });

    return res.status(201).json({
      success: true,
      message: isStudentUser
        ? "Visitor pre-registered successfully. Security will admit upon arrival."
        : "Visitor checked in and admitted successfully.",
      data: visitor,
    });
  } catch (error) {
    return handleError(res, error, "Failed to register visitor.");
  }
};

/**
 * PATCH /api/visitors/:id/check-in
 * Security Officer or Admin admits pre-registered visitor.
 * Strict Transition: Expected -> Checked-In
 * Terminal states (Checked-Out, Denied) and repeated check-in are rejected.
 */
exports.checkInVisitor = async (req, res) => {
  try {
    const role = req.user?.role || req.user?.roleKey;
    if (role !== "security" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only security officers or administrators can check in visitors.",
      });
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor record not found.",
      });
    }

    // Terminal and invalid state validations
    if (visitor.status === "Checked-Out") {
      return res.status(400).json({
        success: false,
        message: "Invalid action: Visitor has already checked out. Checked-Out is a terminal state.",
      });
    }
    if (visitor.status === "Denied") {
      return res.status(400).json({
        success: false,
        message: "Invalid action: Visitor admission was denied. Denied is a terminal state.",
      });
    }
    if (visitor.status === "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Invalid action: Visitor is already checked in.",
      });
    }
    if (visitor.status !== "Expected") {
      return res.status(400).json({
        success: false,
        message: `Invalid action: Cannot check in visitor with status '${visitor.status}'.`,
      });
    }

    // Atomic database update to prevent race conditions
    const updated = await Visitor.findOneAndUpdate(
      { _id: req.params.id, status: "Expected" },
      {
        $set: {
          status: "Checked-In",
          entryTime: new Date(),
          gateOfficer: req.user._id,
          officerName: req.user.name || "Gate Security Officer",
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Concurrent conflict: Visitor record was already updated by another officer.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Visitor '${updated.visitorName}' checked in successfully.`,
      data: updated,
    });
  } catch (error) {
    return handleError(res, error, "Failed to check in visitor.");
  }
};

/**
 * PATCH /api/visitors/:id/check-out
 * Security Officer or Admin records visitor departure.
 * Strict Transition: Checked-In -> Checked-Out (terminal state)
 */
exports.checkOutVisitor = async (req, res) => {
  try {
    const role = req.user?.role || req.user?.roleKey;
    if (role !== "security" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only security officers or administrators can check out visitors.",
      });
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor record not found.",
      });
    }

    // Terminal and invalid state validations
    if (visitor.status === "Checked-Out") {
      return res.status(400).json({
        success: false,
        message: "Invalid action: Visitor is already checked out. Checked-Out is a terminal state.",
      });
    }
    if (visitor.status === "Denied") {
      return res.status(400).json({
        success: false,
        message: "Invalid action: Visitor was denied admission and cannot be checked out.",
      });
    }
    if (visitor.status === "Expected") {
      return res.status(400).json({
        success: false,
        message: "Invalid action: Visitor has not checked in yet.",
      });
    }
    if (visitor.status !== "Checked-In") {
      return res.status(400).json({
        success: false,
        message: `Invalid action: Cannot check out visitor with status '${visitor.status}'.`,
      });
    }

    // Atomic database update to prevent race conditions
    const updated = await Visitor.findOneAndUpdate(
      { _id: req.params.id, status: "Checked-In" },
      {
        $set: {
          status: "Checked-Out",
          exitTime: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Concurrent conflict: Visitor was already checked out by another officer.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Visitor '${updated.visitorName}' departure recorded successfully.`,
      data: updated,
    });
  } catch (error) {
    return handleError(res, error, "Failed to check out visitor.");
  }
};

/**
 * PATCH /api/visitors/:id/deny
 * Security Officer or Admin denies visitor admission.
 * Strict Transition: Expected -> Denied (terminal state)
 */
exports.denyVisitor = async (req, res) => {
  try {
    const role = req.user?.role || req.user?.roleKey;
    if (role !== "security" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only security officers or administrators can deny visitors.",
      });
    }

    const { remarks = "Admission denied by security." } = req.body;

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor record not found.",
      });
    }

    if (visitor.status !== "Expected") {
      return res.status(400).json({
        success: false,
        message: `Invalid action: Cannot deny visitor with status '${visitor.status}'. Deny applies only to 'Expected' visitors.`,
      });
    }

    const updated = await Visitor.findOneAndUpdate(
      { _id: req.params.id, status: "Expected" },
      {
        $set: {
          status: "Denied",
          remarks: remarks.trim(),
          gateOfficer: req.user._id,
          officerName: req.user.name || "Gate Security Officer",
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Concurrent conflict: Visitor status was already updated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Visitor '${updated.visitorName}' admission has been denied.`,
      data: updated,
    });
  } catch (error) {
    return handleError(res, error, "Failed to deny visitor admission.");
  }
};

/**
 * GET /api/visitors
 * Security / Warden / Admin list visitors with validated pagination and date filters
 */
exports.listVisitors = async (req, res) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 25 } = req.query;

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
      const allowedStatuses = ["Expected", "Checked-In", "Checked-Out", "Denied"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Allowed values: ${allowedStatuses.join(", ")}.`,
        });
      }
      filter.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { visitorName: { $regex: q, $options: "i" } },
        { nicOrPassport: { $regex: q, $options: "i" } },
        { studentRegistrationId: { $regex: q, $options: "i" } },
        { studentName: { $regex: q, $options: "i" } },
        { purpose: { $regex: q, $options: "i" } },
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
      filter.entryTime = filter.entryTime || {};
      filter.entryTime.$gte = s;
    }

    if (endDate) {
      const e = new Date(endDate);
      if (isNaN(e.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endDate format. Use ISO date string.",
        });
      }
      filter.entryTime = filter.entryTime || {};
      filter.entryTime.$lte = e;
    }

    const skip = (safePage - 1) * safeLimit;
    const visitors = await Visitor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("student", "name email phone room building");

    const total = await Visitor.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: visitors.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: visitors,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve visitor log.");
  }
};

/**
 * GET /api/visitors/my-visitors
 * Authenticated student lists personal visitors
 */
exports.getMyVisitors = async (req, res) => {
  try {
    const studentId = req.user._id;

    const visitors = await Visitor.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve personal visitor records.");
  }
};

/**
 * GET /api/visitors/:id
 */
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate(
      "student",
      "name email phone room building registrationNumber"
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor record not found.",
      });
    }

    // Ownership check: If student role, ensure it is their own visitor
    if (req.user.role === "student" && String(visitor.student?._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view this visitor record.",
      });
    }

    return res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch visitor details.");
  }
};
