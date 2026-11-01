const express = require("express");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} = require("../controllers/buildingController");

const router = express.Router();

// Read building directory
router.get("/", getAllBuildings);
router.get("/:id", getBuildingById);

// Administrative mutations
router.post("/", protect, authorizeRole("admin", "warden"), createBuilding);
router.put("/:id", protect, authorizeRole("admin", "warden"), updateBuilding);
router.delete("/:id", protect, authorizeRole("admin"), deleteBuilding);

module.exports = router;
