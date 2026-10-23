
const express = require("express");

const router = express.Router();

const {
  createReading,
  getReadings,
  getLatestReadings,
} = require("../controllers/monitoringController");

router.post("/", createReading);
router.get("/", getReadings);
router.get("/latest", getLatestReadings);

module.exports = router;
