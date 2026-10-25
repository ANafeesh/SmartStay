const Complaint = require("../models/Complaint");
const { uploadBufferToCloudinary } = require("../config/cloudinary");

/**
 * Handle photo uploads to Cloudinary for complaints
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
      message: `${uploaded.length} photo(s) uploaded successfully to Cloudinary.`,
      data: uploaded,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload photo to Cloudinary.",
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

    const complaint = new Complaint({
      complaintId,
      studentId: studentId || "SEU/IS/22/ICT/090",
      studentName: studentName || "Ahamed Nafeesh",
      title: title.trim(),
      category: category ? String(category).trim() : "Plumbing",
      priority: normPriority,
      description: description.trim(),
      building: building.trim(),
      floor: floor.trim(),
      room: room.trim(),
      images: Array.isArray(images) ? images : [],
      status: "Pending",
    });

    const saved = await complaint.save();

    return res.status(201).json({
      success: true,
      message: `Complaint ${complaintId} has been successfully logged with the maintenance office.`,
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
    const { studentId, status, category } = req.query;
    const filter = {};

    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (category) filter.category = category;

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
 * Update complaint status
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
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (assignedTo) complaint.assignedTo = assignedTo;

    const updated = await complaint.save();

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
