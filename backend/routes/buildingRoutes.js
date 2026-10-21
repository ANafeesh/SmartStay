
const express = require("express");

const {
  createBuilding,
  getAllBuildings,
  getBuildingById,
} = require("../controllers/buildingController");

const router = express.Router();

router.post("/", createBuilding);
router.get("/", getAllBuildings);
router.get("/:id", getBuildingById);

module.exports = router;
