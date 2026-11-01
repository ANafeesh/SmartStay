const express = require("express");
const multer = require("multer");
const complaintController = require("../controllers/complaintController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Memory storage for direct streaming to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum per file
    files: 5, // Maximum 5 photos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image formats (JPG, PNG, WebP) are allowed."), false);
    }
  },
});

// Photo upload (Requires authenticated user)
router.post("/upload", protect, upload.array("photos", 5), complaintController.uploadPhotos);

// Complaint submission (Students, Staff, Admin)
router.post("/", protect, complaintController.createComplaint);

// Complaint retrieval (Authenticated)
router.get("/", protect, complaintController.getComplaints);
router.get("/:id", protect, complaintController.getComplaintById);

// Complaint status and technician assignment (Maintenance Staff, Warden, Admin)
router.patch(
  "/:id/status",
  protect,
  authorizeRole("admin", "maintenance", "warden"),
  complaintController.updateComplaintStatus
);

module.exports = router;
