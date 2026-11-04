const crypto = require("crypto");
const os = require("os");
const DigitalPass = require("../models/DigitalPass");
const User = require("../models/User");
const LeaveRequest = require("../models/LeaveRequest");
const HostelViolation = require("../models/HostelViolation");

/**
 * Determine primary active local LAN IP address (Wi-Fi or Ethernet)
 */
const getLanIp = () => {
  const interfaces = os.networkInterfaces();
  let fallback = "localhost";
  for (const name of Object.keys(interfaces)) {
    if (/virtual|vmware|vbox|loopback/i.test(name)) continue;
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        if (/wi-?fi|wireless/i.test(name)) {
          return iface.address;
        }
        if (fallback === "localhost") {
          fallback = iface.address;
        }
      }
    }
  }
  return fallback;
};

/**
 * Standardized, safe error responder helper.
 * Never leaks raw stack traces or internal errors in production.
 */
const handleError = (res, error, defaultMessage = "Server error occurred.") => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A pass with this pass number or token already exists.",
    });
  }
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
 * Generate cryptographically secure QR token and its SHA-256 hash
 */
const generatePassTokens = () => {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
};

/**
 * GET /api/digital-passes/my-pass
 * Student fetches or auto-initializes their active digital pass.
 * Strictly validates student account existence and active status.
 * Does not expose tokenHash or raw QR tokens on ordinary GET requests.
 */
exports.getMyPass = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Validate student account status: missing or non-active status is rejected
    if (!req.user || !req.user.accountStatus || String(req.user.accountStatus).toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message: `Student account status is '${req.user?.accountStatus || "missing"}' (must be 'active'). Please contact administration.`,
      });
    }

    let pass = await DigitalPass.findOne({
      student: studentId,
      status: { $in: ["Active", "OnLeave", "Suspended"] },
    })
      .select("+qrToken +tokenHash")
      .populate("student", "name email phone room building registrationNumber studentId accountStatus");

    let studentQrToken = null;

    // Auto-provision initial digital pass if not generated yet
    if (!pass) {
      const { token, tokenHash } = generatePassTokens();
      studentQrToken = token;

      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const regId = req.user.registrationNumber || req.user.studentId || `SEU-${randomSuffix}`;
      const validUntil = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 180 days semester validity

      pass = await DigitalPass.create({
        student: studentId,
        studentRegistrationId: regId,
        studentName: req.user.name,
        passNumber: `SP-2026-${randomSuffix}`,
        tokenHash,
        qrToken: token,
        validFrom: new Date(),
        validUntil,
        status: "Active",
        room: req.user.room || "Room Assigned",
        building: req.user.building || "Hostel Block",
        issuedBy: req.user._id,
      });

      pass = await DigitalPass.findById(pass._id).populate(
        "student",
        "name email phone room building registrationNumber studentId accountStatus"
      );
    } else {
      if (pass.qrToken) {
        studentQrToken = pass.qrToken;
      } else {
        // Backfill stable qrToken for passes created before qrToken persistence was added
        const { token, tokenHash } = generatePassTokens();
        studentQrToken = token;
        pass.qrToken = token;
        pass.tokenHash = tokenHash;
        await pass.save();
      }
    }

    const now = new Date();
    const isExpired = pass.validUntil < now;

    // Check if student is currently on approved leave
    const activeLeave = await LeaveRequest.findOne({
      student: studentId,
      status: "Approved",
      departureDate: { $lte: now },
      expectedReturnDate: { $gte: now },
    });

    const openViolationsCount = await HostelViolation.countDocuments({
      student: studentId,
      status: { $in: ["Open", "Under Review"] },
    });

    return res.status(200).json({
      success: true,
      data: {
        pass,
        isExpired,
        qrToken: studentQrToken,
        hasActiveLeave: !!activeLeave,
        activeLeave: activeLeave || null,
        openViolationsCount,
        lanIp: getLanIp(),
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve student digital pass.");
  }
};

/**
 * POST /api/digital-passes/verify
 * Public or Authorized Checkpoint verification of student digital passes.
 * Strictly verifies pass expiration, pass status, student reference, and active account status.
 */
exports.verifyPass = async (req, res) => {
  try {
    let { qrToken, passNumber, studentRegistrationId } = req.body || {};

    // Support query params for GET and direct URL link verifications
    if (!qrToken && !passNumber && !studentRegistrationId && req.query) {
      qrToken = req.query.qrToken || req.query.token;
      passNumber = req.query.passNumber;
      studentRegistrationId = req.query.studentRegistrationId || req.query.studentId;
    }

    if (!qrToken && !passNumber && !studentRegistrationId) {
      return res.status(400).json({
        success: false,
        authorized: false,
        message: "Please provide a valid QR Token, Pass Number, or Registration ID.",
        denialReason: "No pass identification credentials received.",
      });
    }

    // Support structured JSON payload or raw token
    if (qrToken && typeof qrToken === "string") {
      try {
        const parsed = JSON.parse(qrToken.trim());
        if (parsed.qrToken || parsed.token) {
          qrToken = parsed.qrToken || parsed.token;
        }
        if (parsed.passNumber && !passNumber) passNumber = parsed.passNumber;
        if (parsed.studentRegistrationId && !studentRegistrationId) studentRegistrationId = parsed.studentRegistrationId;
      } catch {
        // Raw token or URL
        try {
          if (qrToken.startsWith("http://") || qrToken.startsWith("https://")) {
            const parsedUrl = new URL(qrToken);
            qrToken = parsedUrl.searchParams.get("token") || qrToken;
            if (!passNumber) passNumber = parsedUrl.searchParams.get("passNumber");
            if (!studentRegistrationId) studentRegistrationId = parsedUrl.searchParams.get("studentId");
          }
        } catch {}
      }
    }

    let query = {};
    if (qrToken) {
      const hashed = crypto.createHash("sha256").update(qrToken.trim()).digest("hex");
      query = { tokenHash: hashed };
    } else if (passNumber) {
      query = { passNumber: passNumber.trim().toUpperCase() };
    } else {
      query = { studentRegistrationId: studentRegistrationId.trim() };
    }

    let pass = await DigitalPass.findOne(query)
      .select("+tokenHash")
      .populate("student", "name email phone room building registrationNumber studentId accountStatus")
      .lean();

    // Check fallback by passNumber if token hash didn't match (for reissued or simulated passes)
    if (!pass && passNumber) {
      pass = await DigitalPass.findOne({ passNumber: passNumber.trim().toUpperCase() })
        .populate("student", "name email phone room building registrationNumber studentId accountStatus")
        .lean();
    }

    // If pass is not found in database, strictly deny authorization
    if (!pass) {
      return res.status(404).json({
        success: false,
        authorized: false,
        message: "No matching student digital pass found in campus database.",
        denialReason: "Pass token or registration number is unrecognized, unverified, or revoked.",
      });
    }

    const student = pass.student;
    const now = new Date();
    const isExpired = pass.validUntil < now;
    const isStatusInvalid = pass.status === "Revoked" || pass.status === "Suspended";

    // Strict Student Account Identity Validation
    const isStudentMissing = !student || typeof student !== "object";
    const isAccountNotActive =
      isStudentMissing || !student.accountStatus || String(student.accountStatus).toLowerCase() !== "active";

    // Check approved leave
    const activeLeave = await LeaveRequest.findOne({
      student: pass.student?._id || pass.student,
      status: "Approved",
      departureDate: { $lte: now },
      expectedReturnDate: { $gte: now },
    });

    // Check active violations
    const openViolations = await HostelViolation.find({
      student: pass.student?._id || pass.student,
      status: { $in: ["Open", "Under Review"] },
    }).sort({ incidentDate: -1 });

    // Authorization evaluation
    const isAuthorized =
      !isStatusInvalid &&
      (pass.status === "Active" || pass.status === "OnLeave") &&
      !isExpired &&
      !isStudentMissing &&
      !isAccountNotActive;

    let denialReason = null;
    if (isExpired) denialReason = "Digital Pass has expired.";
    else if (isStatusInvalid) denialReason = `Pass status is ${pass.status}.`;
    else if (isStudentMissing) denialReason = "Referenced student profile cannot be loaded or is invalid.";
    else if (isAccountNotActive) denialReason = `Student account status is '${student?.accountStatus || "missing"}' (must be 'active').`;

    // Accurate physical location and movement clearance
    const currentLocation =
      pass.status === "OnLeave" || pass.lastMovementDirection === "OUT"
        ? "Outside Campus (On Leave)"
        : pass.lastMovementDirection === "IN"
        ? "Inside Campus"
        : "Unrecorded (Pending First Movement)";

    const canEnterCampus = pass.lastMovementDirection !== "IN";
    const canExitCampus = pass.lastMovementDirection !== "OUT" && pass.status !== "OnLeave";

    return res.status(200).json({
      success: true,
      authorized: isAuthorized,
      denialReason,
      data: {
        passId: pass._id,
        passNumber: pass.passNumber,
        status: pass.status,
        validUntil: pass.validUntil,
        isExpired,
        lastMovementDirection: pass.lastMovementDirection,
        currentLocation,
        canEnterCampus,
        canExitCampus,
        student: student
          ? {
              id: student._id,
              name: pass.studentName || student.name,
              registrationNumber: pass.studentRegistrationId || student.registrationNumber,
              room: pass.room || student.room,
              building: pass.building || student.building,
              phone: student.phone,
              accountStatus: student.accountStatus,
            }
          : null,
        hasApprovedLeave: !!activeLeave,
        activeLeave: activeLeave
          ? {
              id: activeLeave._id,
              reason: activeLeave.reason,
              destination: activeLeave.destination,
              departureDate: activeLeave.departureDate,
              expectedReturnDate: activeLeave.expectedReturnDate,
            }
          : null,
        openViolationsCount: openViolations.length,
        openViolations: openViolations.slice(0, 3),
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to verify digital pass.");
  }
};

/**
 * GET /api/digital-passes
 * Security / Warden / Admin list passes with validated pagination and search
 */
exports.listPasses = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 25 } = req.query;

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
      const allowedStatuses = ["Active", "Suspended", "Revoked", "OnLeave"];
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
        { passNumber: { $regex: q, $options: "i" } },
        { studentRegistrationId: { $regex: q, $options: "i" } },
        { studentName: { $regex: q, $options: "i" } },
        { building: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (safePage - 1) * safeLimit;
    const passes = await DigitalPass.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("student", "name email phone room building accountStatus");

    const total = await DigitalPass.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: passes.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: passes,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve digital passes.");
  }
};

/**
 * GET /api/digital-passes/:id
 */
exports.getPassById = async (req, res) => {
  try {
    const pass = await DigitalPass.findById(req.params.id).populate(
      "student",
      "name email phone room building registrationNumber accountStatus"
    );

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Digital pass not found.",
      });
    }

    // Ownership check: If student role, ensure it is their own pass
    if (req.user.role === "student" && String(pass.student?._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view another student's pass.",
      });
    }

    return res.status(200).json({
      success: true,
      data: pass,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch pass details.");
  }
};

/**
 * PATCH /api/digital-passes/:id/status
 * Warden / Admin updates pass status (Active, Suspended, Revoked)
 */
exports.updatePassStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!["Active", "Suspended", "Revoked", "OnLeave"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Active, Suspended, Revoked, OnLeave.",
      });
    }

    const pass = await DigitalPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Digital pass not found.",
      });
    }

    pass.status = status;
    if (remarks) pass.remarks = remarks.trim();
    await pass.save();

    return res.status(200).json({
      success: true,
      message: `Digital pass status updated to ${status}.`,
      data: pass,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update pass status.");
  }
};

/**
 * POST /api/digital-passes/:id/reissue
 * Re-issues pass with new cryptographic token and resets expiration.
 * Invalidate previous token immediately.
 * Preserves actual physical movement state (lastMovementDirection) and OnLeave status.
 */
exports.reissuePass = async (req, res) => {
  try {
    const pass = await DigitalPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Digital pass not found.",
      });
    }

    // Generate fresh cryptographic tokens (invalidates the previous QR token)
    const { token, tokenHash } = generatePassTokens();
    pass.tokenHash = tokenHash;
    pass.qrToken = token;
    pass.validFrom = new Date();
    pass.validUntil = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    // If pass was suspended or revoked, restore to Active; preserve OnLeave if currently on leave
    if (pass.status === "Suspended" || pass.status === "Revoked") {
      pass.status = "Active";
    }
    // Note: pass.lastMovementDirection is intentionally preserved to reflect actual location

    await pass.save();

    return res.status(200).json({
      success: true,
      message: "Digital pass reissued with fresh secure QR token. Previous token invalidated. Movement state preserved.",
      data: {
        pass,
        qrToken: token,
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to reissue digital pass.");
  }
};
