
const express = require("express");

const {
  createBed,
  getAllBeds,
  getBedById,
} = require("../controllers/bedController");

const router = express.Router();

router.post("/", createBed);
router.get("/", getAllBeds);
router.get("/:id", getBedById);

module.exports = router;
