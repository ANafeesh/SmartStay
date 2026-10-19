
const express = require("express");

const {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed,
} = require("../controllers/bedController");

const router = express.Router();

// Create a new bed
router.post("/", createBed);

// Get all active beds
router.get("/", getAllBeds);

// Get one bed by ID
router.get("/:id", getBedById);

// Update a bed
router.put("/:id", updateBed);

// Deactivate a bed
router.delete("/:id", deleteBed);

module.exports = router;
