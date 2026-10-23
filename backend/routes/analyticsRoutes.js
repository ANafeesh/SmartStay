
const express = require("express");
const router = express.Router();

const {
  getMonitoringSummary,
  getBlockSummary,
} = require("../controllers/analyticsController");

router.get("/summary", getMonitoringSummary);
router.get("/blocks", getBlockSummary);

module.exports = router;
