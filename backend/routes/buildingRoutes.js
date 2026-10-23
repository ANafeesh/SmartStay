
const express = require("express");

const {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} = require("../controllers/buildingController");

const router = express.Router();

// Create a building
router.post("/", createBuilding);

// Get all buildings
router.get("/", getAllBuildings);

// Get one building by ID
router.get("/:id", getBuildingById);

// Update a building
router.put("/:id", updateBuilding);

// Delete a building
router.delete("/:id", deleteBuilding);

module.exports = router;
