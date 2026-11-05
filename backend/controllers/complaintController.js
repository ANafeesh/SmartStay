const Complaint = require("../models/Complaint");
const PaymentNotification = require("../models/PaymentNotification");
const User = require("../models/User");
const { uploadBufferToCloudinary } = require("../config/cloudinary");
const { sendWardenComplaintAlert } = require("../services/emailService");

/**
 * Handle photo uploads to Cloudinary (or base64 fallback) for complaints
 * POST /api/complaints/upload
 */
exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No photo files provided for upload.",
      });
    }

    const uploadPromises = req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, "smartstay/complaints", file.originalname)
    );

    const uploaded = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: `${uploaded.length} photo(s) uploaded successfully.`,
      data: uploaded,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload photo.",
      error: error.message,
    });
  }
};

/**
 * Submit a new complaint to MongoDB
 * POST /api/complaints
 */
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      category,
      priority,
      description,
      building,
      floor,
      room,
      images,
      studentId,
      studentName,
    } = req.body;

    if (!title || !description || !building || !floor || !room) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required complaint fields.",
      });
    }

    // Generate unique Complaint Reference (e.g. CMP-2026-4821)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-2026-${randomSuffix}`;
    
    // Normalize priority
    const normPriority = (() => {
      const p = String(priority || "Medium").toLowerCase();
      if (p === "low") return "Low";
      if (p === "high") return "High";
      if (p === "critical") return "Critical";
      return "Medium";
    })();

    const studentIdVal = studentId || (req.user?.studentId || req.user?.registrationNumber || "STD-2026-101");
    const studentNameVal = studentName || (req.user?.name || "Student Resident");

    const complaint = new Complaint({
      complaintId,
      studentId: studentIdVal,
      studentName: studentNameVal,
      title: title.trim(),
      category: category ? String(category).trim() : "Plumbing",
      priority: normPriority,
      description: description.trim(),
      building: building.trim(),
      floor: floor.trim(),
      room: room.trim(),
      images: Array.isArray(images) ? images : [],
      status: "Pending",
      assignedTo: "Hostel Maintenance Division",
    });

    const saved = await complaint.save();

    // 1. Dynamically query all Wardens, Admins, and Maintenance Staff from MongoDB (No hardcoding)
    let staffRecipients = [];
    try {
      staffRecipients = await User.find(
        { role: { $in: ["warden", "admin", "hostel_admin", "maintenance"] } },
        { _id: 1, name: 1, email: 1, role: 1 }
      );
    } catch (dbErr) {
      console.warn("Could not query staff recipients from DB:", dbErr.message);
    }

    // Collect emails for email notification
    const wardenEmails = Array.from(
      new Set(
        [
          ...staffRecipients.map((u) => u.email),
          process.env.WARDEN_EMAIL,
          process.env.ADMIN_EMAIL,
        ].filter(Boolean)
      )
    );

    // 2. Dispatch Email Alert to Wardens & Admins
    try {
      if (wardenEmails.length > 0) {
        await sendWardenComplaintAlert({
          wardenEmails,
          student: {
            name: studentNameVal,
            studentId: studentIdVal,
            regNo: studentIdVal,
          },
          complaint: {
            complaintId,
            title: title.trim(),
            category: category ? String(category).trim() : "Plumbing",
            priority: normPriority,
            description: description.trim(),
            building: building.trim(),
            floor: floor.trim(),
            room: room.trim(),
          },
        });
      }
    } catch (mailErr) {
      console.warn("Could not send email alert to wardens:", mailErr.message);
    }

    // 3. Dispatch in-app system notifications to all Wardens and Staff
    try {
      for (const staff of staffRecipients) {
        await PaymentNotification.create({
          recipientId: String(staff._id),
          title: `New Student Complaint: ${normPriority} Priority`,
          message: `Complaint #${complaintId} logged by ${studentNameVal} (${building.trim()}, Room ${room.trim()}): "${title.trim()}". Category: ${category || "General"}.`,
          type: normPriority === "Critical" || normPriority === "High" ? "urgent" : "info",
          referenceType: "Complaint",
          referenceId: complaintId,
        });
      }

      // 4. Dispatch notification to the Student
      const targetStudent =
        studentIdVal ||
        String(req.user?._id || "");
      if (targetStudent) {
        await PaymentNotification.create({
          recipientId: String(targetStudent),
          title: "Complaint Received",
          message: `Your maintenance request #${complaintId} ("${title.trim()}") has been sent to the warden and maintenance office.`,
          type: "info",
          referenceType: "Complaint",
          referenceId: complaintId,
        });
      }
    } catch (notifErr) {
      console.warn("Could not dispatch complaint notifications:", notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: `Complaint ${complaintId} has been successfully logged with the hostel maintenance office.`,
      data: saved,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record complaint in database.",
      error: error.message,
    });
  }
};

/**
 * Get all complaints from MongoDB
 * GET /api/complaints
 */
exports.getComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
      error: error.message,
    });
  }
};

/**
 * Get single complaint by ID or complaintId
 * GET /api/complaints/:id
 */
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    let complaint;

    if (id.startsWith("CMP-")) {
      complaint = await Complaint.findOne({ complaintId: id });
    } else {
      complaint = await Complaint.findById(id);
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve complaint details.",
      error: error.message,
    });
  }
};

/**
 * Update complaint status (Handled by Warden / Maintenance)
 * PATCH /api/complaints/:id/status
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, assignedTo } = req.body;

    const complaint = await Complaint.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { complaintId: id }],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (status) complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;

    const updated = await complaint.save();

    // Notify the student that their ticket was handled/updated by Warden
    try {
      if (complaint.studentId) {
        await PaymentNotification.create({
          recipientId: String(complaint.studentId),
          title: `Complaint ${status || "Updated"}`,
          message: `Complaint #${complaint.complaintId} ("${complaint.title}") status has been updated to "${status}".${resolutionNotes ? ` Remark: "${resolutionNotes}"` : ""}`,
          type: status === "Resolved" ? "success" : status === "In Progress" ? "info" : "warning",
          referenceType: "Complaint",
          referenceId: complaint.complaintId,
        });
      }
    } catch (notifErr) {
      console.warn("Could not dispatch complaint update notification:", notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Complaint ${complaint.complaintId} status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
      error: error.message,
    });
  }
};
