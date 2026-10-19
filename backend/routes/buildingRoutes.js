
const express = require("express");

const {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
} = require("../controllers/buildingController");

const router = express.Router();

// Create a building
router.post("/", createBuilding);

// Get all buildings
router.get("/", getAllBuildings);

// Get one building
router.get("/:id", getBuildingById);

// Update a building
router.put("/:id", updateBuilding);

module.exports = router;
