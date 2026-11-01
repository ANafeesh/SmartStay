const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed,
} = require("../controllers/bedController");

const router = express.Router();

// Read active beds
router.get("/", getAllBeds);
router.get("/:id", getBedById);

// Administrative mutations
router.post("/", protect, authorizeRole("admin", "warden"), createBed);
router.put("/:id", protect, authorizeRole("admin", "warden"), updateBed);
router.delete("/:id", protect, authorizeRole("admin"), deleteBed);

module.exports = router;
