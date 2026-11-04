const HostelViolation = require("../models/HostelViolation");
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
 * POST /api/violations
 * Security Officer or Warden logs a disciplinary violation.
 * Validates non-negative numeric fine amounts.
 */
exports.logViolation = async (req, res) => {
  try {
    const {
      studentRegistrationId,
      violationType,
      severity = "Minor",
      description,
      location = "Hostel Premises",
      fineAmount = 0,
    } = req.body;

    if (!studentRegistrationId || !violationType || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide student registration ID, violation type, and incident description.",
      });
    }

    // Validate numeric fine amount
    const parsedFine = parseFloat(fineAmount);
    if (isNaN(parsedFine) || parsedFine < 0) {
      return res.status(400).json({
        success: false,
        message: "Fine amount must be a valid non-negative number.",
      });
    }

    const student = await User.findOne({
      $or: [
        { registrationNumber: studentRegistrationId.trim() },
        { studentId: studentRegistrationId.trim() },
        { email: studentRegistrationId.trim() },
      ],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier '${studentRegistrationId}' was not found.`,
      });
    }

    const fineStatus = parsedFine > 0 ? "Pending" : "None";
    const regNo = student.registrationNumber || student.studentId || studentRegistrationId.trim();

    const violation = await HostelViolation.create({
      student: student._id,
      studentRegistrationId: regNo,
      studentName: student.name,
      violationType,
      severity,
      description: description.trim(),
      location: location.trim(),
      incidentDate: new Date(),
      reportedBy: req.user._id,
      reporterName: req.user.name || "Reporting Officer",
      reportedByRole: req.user.role || "security",
      fineAmount: parsedFine,
      fineStatus,
      status: "Open",
    });

    return res.status(201).json({
      success: true,
      message: `Disciplinary violation record created for student ${student.name}.`,
      data: violation,
    });
  } catch (error) {
    return handleError(res, error, "Failed to log disciplinary violation.");
  }
};

/**
 * GET /api/violations
 * Warden / Security / Admin list all disciplinary records with validated pagination
 */
exports.listViolations = async (req, res) => {
  try {
    const {
      violationType,
      severity,
      status,
      fineStatus,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 25,
    } = req.query;

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

    if (violationType && violationType !== "All") {
      filter.violationType = violationType;
    }
    if (severity && severity !== "All") {
      filter.severity = severity;
    }
    if (status && status !== "All") {
      const allowedStatuses = ["Open", "Under Review", "Resolved", "Dismissed"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Allowed values: ${allowedStatuses.join(", ")}.`,
        });
      }
      filter.status = status;
    }
    if (fineStatus && fineStatus !== "All") {
      const allowedFineStatuses = ["None", "Pending", "Paid", "Waived"];
      if (!allowedFineStatuses.includes(fineStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid fineStatus filter. Allowed values: ${allowedFineStatuses.join(", ")}.`,
        });
      }
      filter.fineStatus = fineStatus;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { studentRegistrationId: { $regex: q, $options: "i" } },
        { studentName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
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
      filter.incidentDate = filter.incidentDate || {};
      filter.incidentDate.$gte = s;
    }

    if (endDate) {
      const e = new Date(endDate);
      if (isNaN(e.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endDate format. Use ISO date string.",
        });
      }
      filter.incidentDate = filter.incidentDate || {};
      filter.incidentDate.$lte = e;
    }

    const skip = (safePage - 1) * safeLimit;
    const violations = await HostelViolation.find(filter)
      .sort({ incidentDate: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("student", "name email phone room building");

    const total = await HostelViolation.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: violations.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: violations,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch violation records.");
  }
};

/**
 * GET /api/violations/my-violations
 * Authenticated student views their own disciplinary records
 */
exports.getMyViolations = async (req, res) => {
  try {
    const studentId = req.user._id;

    const violations = await HostelViolation.find({ student: studentId })
      .sort({ incidentDate: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: violations.length,
      data: violations,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch personal disciplinary notices.");
  }
};

/**
 * GET /api/violations/:id
 */
exports.getViolationById = async (req, res) => {
  try {
    const violation = await HostelViolation.findById(req.params.id)
      .populate("student", "name email phone room building registrationNumber")
      .populate("reportedBy", "name email");

    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation record not found.",
      });
    }

    // Ownership check for student
    if (req.user.role === "student" && String(violation.student?._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view another student's violation record.",
      });
    }

    return res.status(200).json({
      success: true,
      data: violation,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch violation details.");
  }
};

/**
 * PATCH /api/violations/:id/status
 * Warden / Admin updates resolution, action taken, and fine status.
 * Strictly validates status, fine amount, and fineStatus.
 */
exports.updateViolationStatus = async (req, res) => {
  try {
    const { status, actionTaken = "", fineStatus, fineAmount } = req.body;

    const violation = await HostelViolation.findById(req.params.id);
    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation record not found.",
      });
    }

    if (fineAmount !== undefined) {
      const parsedFine = parseFloat(fineAmount);
      if (isNaN(parsedFine) || parsedFine < 0) {
        return res.status(400).json({
          success: false,
          message: "Fine amount must be a valid non-negative number.",
        });
      }
      violation.fineAmount = parsedFine;
    }

    if (status) {
      const allowedStatuses = ["Open", "Under Review", "Resolved", "Dismissed"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
        });
      }
      violation.status = status;
      if (status === "Resolved" || status === "Dismissed") {
        violation.resolvedAt = new Date();
        violation.resolvedBy = req.user._id;
      }
    }

    if (fineStatus) {
      const allowedFineStatuses = ["None", "Pending", "Paid", "Waived"];
      if (!allowedFineStatuses.includes(fineStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid fineStatus. Allowed values: ${allowedFineStatuses.join(", ")}.`,
        });
      }
      violation.fineStatus = fineStatus;
    }

    if (actionTaken) {
      violation.actionTaken = actionTaken.trim();
    }

    await violation.save();

    return res.status(200).json({
      success: true,
      message: "Violation record updated successfully.",
      data: violation,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update violation status.");
  }
};
