const crypto = require("crypto");
const GateEntryExit = require("../models/GateEntryExit");
const DigitalPass = require("../models/DigitalPass");
const LeaveRequest = require("../models/LeaveRequest");
const HostelViolation = require("../models/HostelViolation");
const GateInconsistency = require("../models/GateInconsistency");

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
 * Curfew checker helper using Asia/Colombo (Sri Lanka) local time.
 * University curfew applies between 10:00 PM (22:00) and 06:00 AM (06:00).
 */
const getColomboHour = (date = new Date()) => {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Colombo",
      hour: "numeric",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((p) => p.type === "hour");
    return hourPart ? parseInt(hourPart.value, 10) : date.getUTCHours();
  } catch {
    // Fallback if system locale lacks Asia/Colombo: UTC+5:30 offset
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const colomboTime = new Date(utcTime + 5.5 * 3600000);
    return colomboTime.getHours();
  }
};

const checkCurfewCondition = (date = new Date()) => {
  const hour = getColomboHour(date);
  return hour >= 22 || hour < 6;
};

/**
 * POST /api/gate-logs
 * Security Officer or Admin logs a student's campus entry or exit.
 *
 * Consistency & Ordering Strategy:
 * 1. Strict pre-validation of pass expiry, pass status, student reference, active account status,
 *    and duplicate movement state.
 * 2. Pre-calculates leave matching and curfew conditions without modifying any records.
 * 3. Atomic optimistic conditional update on DigitalPass (fails with 409 on concurrent movement).
 * 4. Creates the audit GateEntryExit log. If log creation fails, executes an immediate compensating
 *    rollback on DigitalPass to restore its previous movement state.
 * 5. ONLY AFTER the gate log is successfully confirmed:
 *    - Updates matched LeaveRequest to 'Completed' (return only).
 *    - Creates HostelViolation incident (curfew breach only).
 *    A failed or conflicting movement can NEVER create a false violation or complete a leave request.
 */
exports.recordMovement = async (req, res) => {
  try {
    const {
      passNumber,
      qrToken,
      studentRegistrationId,
      direction,
      gateName = "Main Campus Gate",
      remarks = "",
    } = req.body;

    if (!direction || !["IN", "OUT"].includes(direction.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Valid movement direction ('IN' or 'OUT') is required.",
      });
    }

    const cleanDirection = direction.toUpperCase();

    // 1. Locate student digital pass (QR token, passNumber, or registration ID)
    let query = {};
    if (qrToken) {
      query = { tokenHash: hashed };
    } else if (passNumber) {
      query = { passNumber: passNumber.trim().toUpperCase() };
    } else if (studentRegistrationId) {
      query = { studentRegistrationId: studentRegistrationId.trim() };
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide either qrToken, passNumber, or studentRegistrationId.",
      });
    }

    const pass = await DigitalPass.findOne(query).populate("student").lean();

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Digital pass not found for the provided identifier.",
      });
    }

    const now = new Date();

    // 2. Strict Pass Validity Checks (cannot be bypassed by using passNumber / regId)
    if (pass.validUntil < now) {
      return res.status(403).json({
        success: false,
        message: "Campus gate movement denied. Digital pass has expired.",
      });
    }

    if (pass.status === "Revoked" || pass.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: `Campus gate movement denied. Pass is currently ${pass.status}.`,
      });
    }

    // 3. Strict Student Account Identity Validation
    const student = pass.student;
    if (!student || typeof student !== "object") {
      return res.status(403).json({
        success: false,
        message: "Campus gate movement denied. Referenced student profile cannot be loaded or is invalid.",
      });
    }

    if (!student.accountStatus || String(student.accountStatus).toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message: `Campus gate movement denied. Student account status is '${student.accountStatus || "missing"}' (must be 'active').`,
      });
    }

    // 4. Movement State Integrity Checks (Prevent consecutive duplicates)
    if (cleanDirection === "OUT") {
      if (pass.lastMovementDirection === "OUT") {
        return res.status(400).json({
          success: false,
          message: "Duplicate movement detected: Student is already recorded as OUT of campus.",
        });
      }
      if (pass.status === "OnLeave") {
        return res.status(400).json({
          success: false,
          message: "Duplicate movement detected: Student is already marked OnLeave and outside campus.",
        });
      }
    } else if (cleanDirection === "IN") {
      if (pass.lastMovementDirection === "IN") {
        return res.status(400).json({
          success: false,
          message: "Duplicate movement detected: Student is already recorded as IN campus.",
        });
      }
    }

    let isCurfewBreach = false;
    let finalRemarks = remarks.trim();
    let matchedLeaveRequest = null;
    let targetStatus = "Active";

    // 5. Pre-calculate Leave & Curfew Logic (without modifying any database records yet)
    if (cleanDirection === "OUT") {
      // Strictly match approved leave only within its valid window: departureDate <= now <= expectedReturnDate
      // (Do NOT authorize early departure before departureDate)
      const validLeaveDeparture = await LeaveRequest.findOne({
        student: student._id,
        status: "Approved",
        departureDate: { $lte: now },
        expectedReturnDate: { $gte: now },
      });

      if (validLeaveDeparture) {
        matchedLeaveRequest = validLeaveDeparture;
        targetStatus = "OnLeave";
        finalRemarks = finalRemarks
          ? `${finalRemarks} | Approved leave departure (Leave Ref: ${validLeaveDeparture._id})`
          : `Approved leave departure (Leave Ref: ${validLeaveDeparture._id})`;
      } else {
        targetStatus = "Active";
      }
    } else if (cleanDirection === "IN") {
      targetStatus = "Active";
      const isNightHoursInColombo = checkCurfewCondition(now);

      // Check if student has an active approved leave currently covering this return time
      // An expired leave request (expectedReturnDate < now) must NEVER authorize a late return.
      const validApprovedLeave = await LeaveRequest.findOne({
        student: student._id,
        status: "Approved",
        departureDate: { $lte: now },
        expectedReturnDate: { $gte: now },
      });

      if (validApprovedLeave) {
        // Return is within approved leave period: Authorized return
        isCurfewBreach = false;
        matchedLeaveRequest = validApprovedLeave;
        finalRemarks = finalRemarks
          ? `${finalRemarks} | Approved leave return (Leave Ref: ${validApprovedLeave._id})`
          : `Approved leave return (Leave Ref: ${validApprovedLeave._id})`;
      } else {
        // No valid approved leave covers this time
        if (isNightHoursInColombo) {
          isCurfewBreach = true;
          finalRemarks = finalRemarks
            ? `${finalRemarks} | Late entry during Colombo curfew hours (10 PM - 6 AM) without valid approved leave`
            : "Late entry during Colombo curfew hours (10 PM - 6 AM) without valid approved leave";
        }
      }
    }

    // 6. Capture previous pass state and operationId for concurrency control
    const operationId = crypto.randomUUID();
    const previousPassState = {
      status: pass.status,
      lastMovementDirection: pass.lastMovementDirection,
      lastScannedAt: pass.lastScannedAt,
      lastOperationId: pass.lastOperationId || null,
    };

    // 7. Atomic State Transition on DigitalPass with Operation CAS
    const atomicCondition = {
      _id: pass._id,
      lastMovementDirection: { $ne: cleanDirection },
      validUntil: { $gte: now },
      status: { $in: ["Active", "OnLeave"] },
    };

    const updatedPass = await DigitalPass.findOneAndUpdate(
      atomicCondition,
      {
        $set: {
          lastScannedAt: now,
          lastMovementDirection: cleanDirection,
          status: targetStatus,
          lastOperationId: operationId,
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedPass) {
      return res.status(409).json({
        success: false,
        message: "Movement conflict: A concurrent scan for this pass is already being processed or state changed.",
      });
    }

    // 8. Record Gate Movement Log with Safe CAS Compensating Recovery
    let log;
    try {
      log = await GateEntryExit.create({
        student: student._id,
        studentRegistrationId: pass.studentRegistrationId,
        studentName: pass.studentName,
        pass: pass._id,
        passNumber: pass.passNumber,
        direction: cleanDirection,
        gateName: gateName.trim(),
        scannedBy: req.user._id,
        officerName: req.user.name || "Security Officer",
        timestamp: now,
        isCurfewBreach,
        leaveRequest: matchedLeaveRequest ? matchedLeaveRequest._id : null,
        remarks: finalRemarks,
        operationId,
        leaveCompletionStatus: matchedLeaveRequest ? "PENDING" : "NONE",
        curfewViolationStatus: isCurfewBreach ? "PENDING" : "NONE",
      });
    } catch (logCreationError) {
      // SAFE CAS COMPENSATING ROLLBACK:
      // A rollback MUST ONLY restore the pass if it is still in the exact state written by THIS operation.
      // If another operation succeeded in between, CAS will match 0 documents and skip restoration.
      const casRollbackCondition = {
        _id: pass._id,
        lastOperationId: operationId,
        lastMovementDirection: cleanDirection,
        status: targetStatus,
      };

      const rollbackResult = await DigitalPass.findOneAndUpdate(
        casRollbackCondition,
        {
          $set: {
            status: previousPassState.status,
            lastMovementDirection: previousPassState.lastMovementDirection,
            lastScannedAt: previousPassState.lastScannedAt,
            lastOperationId: previousPassState.lastOperationId || null,
          },
        },
        { returnDocument: "after" }
      );

      if (!rollbackResult) {
        // Safe restoration is IMPOSSIBLE: pass has advanced to a newer state.
        // Never overwrite newer data. Record the inconsistency for audit & reconciliation.
        console.warn(`[CONCURRENCY] CAS rollback skipped for pass ${pass.passNumber}. Newer movement detected.`);
        try {
          await GateInconsistency.create({
            pass: pass._id,
            passNumber: pass.passNumber,
            student: student._id,
            operationId,
            failedOperation: "GATE_LOG_CREATION_FAILED",
            attemptedDirection: cleanDirection,
            reason: `Gate log creation failed (${logCreationError.message}), but CAS rollback was skipped because the pass was modified by a newer operation.`,
            passStateAtFailure: {
              attemptedTargetStatus: targetStatus,
              attemptedDirection: cleanDirection,
              previousPassState,
            },
          });
          await DigitalPass.findByIdAndUpdate(pass._id, { $set: { hasInconsistency: true } });
        } catch (incError) {
          console.error("Failed to persist gate inconsistency record:", incError.message);
        }

        return res.status(500).json({
          success: false,
          message: "Failed to record gate log. Pass state has already progressed in a subsequent operation; rollback skipped to prevent overwriting newer movement. Inconsistency flagged for audit.",
          inconsistencyFlagged: true,
          operationId,
        });
      }

      return handleError(res, logCreationError, "Failed to record gate entry/exit event. Pass state reverted safely.");
    }

    // 9. Apply Side Effects ONLY AFTER Gate Movement is Confirmed (with reliable tracking)
    let leaveCompletionError = null;
    let violationCreationError = null;

    if (cleanDirection === "IN" && matchedLeaveRequest) {
      try {
        await LeaveRequest.findByIdAndUpdate(matchedLeaveRequest._id, {
          $set: {
            status: "Completed",
            actualReturnDate: now,
          },
        });
        await GateEntryExit.findByIdAndUpdate(log._id, {
          $set: { leaveCompletionStatus: "COMPLETED" },
        });
      } catch (leaveErr) {
        leaveCompletionError = leaveErr;
        console.error("Leave completion failed after log confirmation:", leaveErr.message);
        await GateEntryExit.findByIdAndUpdate(log._id, {
          $set: {
            leaveCompletionStatus: "FAILED",
            reconciliationNotes: `Leave completion failed: ${leaveErr.message}`,
          },
        });
      }
    }

    if (cleanDirection === "IN" && isCurfewBreach) {
      try {
        await HostelViolation.create({
          student: student._id,
          studentRegistrationId: pass.studentRegistrationId,
          studentName: pass.studentName,
          violationType: "Curfew Breach",
          severity: "Minor",
          description: `Student entered through ${gateName} at ${now.toLocaleTimeString()} during curfew hours (Asia/Colombo) without a valid approved leave request. Gate movement ref: ${log._id}.`,
          location: gateName,
          reportedBy: req.user._id,
          reporterName: req.user.name || "Gate Security Officer",
          reportedByRole: "security",
          incidentDate: now,
          fineAmount: 500,
          fineStatus: "Pending",
          status: "Open",
        });
        await GateEntryExit.findByIdAndUpdate(log._id, {
          $set: { curfewViolationStatus: "CREATED" },
        });
      } catch (violErr) {
        violationCreationError = violErr;
        console.error("Curfew violation creation failed after log confirmation:", violErr.message);
        await GateEntryExit.findByIdAndUpdate(log._id, {
          $set: {
            curfewViolationStatus: "FAILED",
            reconciliationNotes: `Curfew violation creation failed: ${violErr.message}`,
          },
        });
      }
    }

    const postLogWarnings = [];
    if (leaveCompletionError) postLogWarnings.push("Leave completion failed and is marked for reconciliation.");
    if (violationCreationError) postLogWarnings.push("Curfew violation creation failed and is marked for reconciliation.");

    return res.status(201).json({
      success: true,
      message: `Student movement (${cleanDirection}) logged successfully.${postLogWarnings.length > 0 ? " Pending reconciliation: " + postLogWarnings.join(" ") : ""}`,
      isCurfewBreach,
      leaveCompletionStatus: matchedLeaveRequest ? (leaveCompletionError ? "FAILED" : "COMPLETED") : "NONE",
      curfewViolationStatus: isCurfewBreach ? (violationCreationError ? "FAILED" : "CREATED") : "NONE",
      data: log,
    });
  } catch (error) {
    return handleError(res, error, "Failed to record gate entry/exit event.");
  }
};

/**
 * GET /api/gate-logs
 * Security / Warden / Admin / Executive query movement history with validated filters
 */
exports.getGateLogs = async (req, res) => {
  try {
    const {
      direction,
      gateName,
      isCurfewBreach,
      studentRegistrationId,
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

    if (direction && ["IN", "OUT"].includes(direction.toUpperCase())) {
      filter.direction = direction.toUpperCase();
    }
    if (gateName && gateName !== "All") {
      filter.gateName = gateName;
    }
    if (isCurfewBreach !== undefined) {
      filter.isCurfewBreach = isCurfewBreach === "true" || isCurfewBreach === true;
    }
    if (studentRegistrationId) {
      filter.studentRegistrationId = studentRegistrationId.trim();
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { studentRegistrationId: { $regex: q, $options: "i" } },
        { studentName: { $regex: q, $options: "i" } },
        { passNumber: { $regex: q, $options: "i" } },
        { gateName: { $regex: q, $options: "i" } },
      ];
    }

    // Date Filter Validation
    if (startDate) {
      const s = new Date(startDate);
      if (isNaN(s.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid startDate format. Please provide a valid ISO date string.",
        });
      }
      filter.timestamp = filter.timestamp || {};
      filter.timestamp.$gte = s;
    }

    if (endDate) {
      const e = new Date(endDate);
      if (isNaN(e.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endDate format. Please provide a valid ISO date string.",
        });
      }
      filter.timestamp = filter.timestamp || {};
      filter.timestamp.$lte = e;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "startDate cannot be after endDate.",
      });
    }

    const skip = (safePage - 1) * safeLimit;
    const logs = await GateEntryExit.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("scannedBy", "name email");

    const total = await GateEntryExit.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: logs,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch gate movement history.");
  }
};

/**
 * GET /api/gate-logs/my-logs
 * Authenticated student queries their personal movement history
 */
exports.getMyLogs = async (req, res) => {
  try {
    const studentId = req.user._id;

    const logs = await GateEntryExit.find({ student: studentId })
      .sort({ timestamp: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return handleError(res, error, "Failed to fetch personal movement history.");
  }
};

/**
 * GET /api/gate-logs/occupancy-status
 * Live aggregated headcount strictly consistent with current pass and movement states
 */
exports.getCampusOccupancyStatus = async (req, res) => {
  try {
    // Total eligible students in residence
    const totalActiveStudents = await DigitalPass.countDocuments({
      status: { $in: ["Active", "OnLeave"] },
    });

    // Students currently outside campus
    const studentsOutsideCount = await DigitalPass.countDocuments({
      status: { $in: ["Active", "OnLeave"] },
      lastMovementDirection: "OUT",
    });

    // Students currently on formal approved leave
    const studentsOnLeaveCount = await DigitalPass.countDocuments({
      status: "OnLeave",
    });

    // Strictly consistent headcount: inside + outside = totalActive
    const studentsInsideCount = Math.max(0, totalActiveStudents - studentsOutsideCount);

    // Today's total movements in Colombo timezone
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const todayExits = await GateEntryExit.countDocuments({
      direction: "OUT",
      timestamp: { $gte: startOfToday },
    });

    const todayEntries = await GateEntryExit.countDocuments({
      direction: "IN",
      timestamp: { $gte: startOfToday },
    });

    const todayCurfewBreaches = await GateEntryExit.countDocuments({
      isCurfewBreach: true,
      timestamp: { $gte: startOfToday },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalActiveStudents,
        currentlyInsideCampus: studentsInsideCount,
        currentlyOutsideCampus: studentsOutsideCount,
        currentlyOnLeave: studentsOnLeaveCount,
        todayExits,
        todayEntries,
        todayCurfewBreaches,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to calculate campus occupancy status.");
  }
};

/**
 * POST /api/gate-logs/reconcile
 * Security Officer or Admin triggers reconciliation of pending/failed post-log side effects
 * (leave completion and curfew violations).
 */
exports.reconcilePendingSideEffects = async (req, res) => {
  try {
    const { logId } = req.body || {};
    const query = logId
      ? { _id: logId }
      : {
          $or: [
            { leaveCompletionStatus: { $in: ["PENDING", "FAILED"] } },
            { curfewViolationStatus: { $in: ["PENDING", "FAILED"] } },
          ],
        };

    const pendingLogs = await GateEntryExit.find(query);
    const results = {
      inspectedCount: pendingLogs.length,
      reconciledLeaves: 0,
      reconciledViolations: 0,
      errors: [],
    };

    for (const log of pendingLogs) {
      // 1. Reconcile Leave Request Completion
      if (
        (log.leaveCompletionStatus === "PENDING" || log.leaveCompletionStatus === "FAILED") &&
        log.leaveRequest
      ) {
        try {
          const leave = await LeaveRequest.findById(log.leaveRequest);
          if (leave && leave.status !== "Completed") {
            await LeaveRequest.findByIdAndUpdate(leave._id, {
              $set: {
                status: "Completed",
                actualReturnDate: log.timestamp || new Date(),
              },
            });
          }
          await GateEntryExit.findByIdAndUpdate(log._id, {
            $set: { leaveCompletionStatus: "COMPLETED" },
          });
          results.reconciledLeaves += 1;
        } catch (err) {
          results.errors.push(`Log ${log._id} leave reconciliation failed: ${err.message}`);
        }
      }

      // 2. Reconcile Curfew Violation Creation
      if (
        (log.curfewViolationStatus === "PENDING" || log.curfewViolationStatus === "FAILED") &&
        log.isCurfewBreach
      ) {
        try {
          const existingViolation = await HostelViolation.findOne({
            student: log.student,
            violationType: "Curfew Breach",
            incidentDate: {
              $gte: new Date(log.timestamp.getTime() - 60000),
              $lte: new Date(log.timestamp.getTime() + 60000),
            },
          });

          if (!existingViolation) {
            await HostelViolation.create({
              student: log.student,
              studentRegistrationId: log.studentRegistrationId,
              studentName: log.studentName,
              violationType: "Curfew Breach",
              severity: "Minor",
              description: `Student entered through ${log.gateName} at ${new Date(log.timestamp).toLocaleTimeString()} during curfew hours (Asia/Colombo) without a valid approved leave request. Gate movement ref: ${log._id}. [Reconciled]`,
              location: log.gateName,
              reportedBy: log.scannedBy,
              reporterName: log.officerName || "Reconciliation Worker",
              reportedByRole: "security",
              incidentDate: log.timestamp,
              fineAmount: 500,
              fineStatus: "Pending",
              status: "Open",
            });
          }
          await GateEntryExit.findByIdAndUpdate(log._id, {
            $set: { curfewViolationStatus: "CREATED" },
          });
          results.reconciledViolations += 1;
        } catch (err) {
          results.errors.push(`Log ${log._id} violation reconciliation failed: ${err.message}`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Reconciliation processed ${results.inspectedCount} gate logs.`,
      data: results,
    });
  } catch (error) {
    return handleError(res, error, "Failed to execute gate log reconciliation.");
  }
};

/**
 * GET /api/gate-logs/inconsistencies
 * Security Officer or Admin inspects flagged movement inconsistencies
 */
exports.getGateInconsistencies = async (req, res) => {
  try {
    const inconsistencies = await GateInconsistency.find({ resolved: false })
      .sort({ createdAt: -1 })
      .populate("student", "name email registrationNumber studentId")
      .populate("pass", "passNumber status lastMovementDirection");

    return res.status(200).json({
      success: true,
      count: inconsistencies.length,
      data: inconsistencies,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve gate inconsistencies.");
  }
};
