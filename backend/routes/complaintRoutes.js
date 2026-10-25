const express = require("express");
const multer = require("multer");
const complaintController = require("../controllers/complaintController");

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

// Upload photos to Cloudinary
router.post("/upload", upload.array("photos", 5), complaintController.uploadPhotos);

// Complaint CRUD routes
router.post("/", complaintController.createComplaint);
router.get("/", complaintController.getComplaints);
router.get("/:id", complaintController.getComplaintById);
router.patch("/:id/status", complaintController.updateComplaintStatus);

module.exports = router;
