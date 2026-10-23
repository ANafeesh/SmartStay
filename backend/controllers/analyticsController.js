
const MonitoringReading = require("../models/MonitoringReading");

const DAILY_LIMITS = {
  Water: 3000,
  Electricity: 2000,
};

const getMonitoringSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const readings = await MonitoringReading.find({
      recordedAt: { $gte: startOfDay },
    });

    const summary = ["Water", "Electricity"].map((type) => {
      const filtered = readings.filter(
        (reading) => reading.utilityType === type
      );

      const total = filtered.reduce(
        (sum, reading) => sum + reading.value,
        0
      );

      const limit = DAILY_LIMITS[type];
      const percentage = limit ? (total / limit) * 100 : 0;

      return {
        utilityType: type,
        total,
        unit: type === "Water" ? "L" : "kWh",
        dailyLimit: limit,
        percentage: Number(percentage.toFixed(2)),
        status:
          percentage >= 100
            ? "Exceeded"
            : percentage >= 80
              ? "Warning"
              : "Normal",
        readingCount: filtered.length,
      };
    });

    res.status(200).json({
      success: true,
      date: startOfDay,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve monitoring summary",
      error: error.message,
    });
  }
};

const getBlockSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const readings = await MonitoringReading.find({
      recordedAt: { $gte: startOfDay },
    });

    const blocks = {};

    readings.forEach((reading) => {
      const blockName = reading.blockName || "Unassigned";

      if (!blocks[blockName]) {
        blocks[blockName] = {
          blockName,
          water: 0,
          electricity: 0,
          waterLimit: 1000,
          electricityLimit: 900,
        };
      }

      if (reading.utilityType === "Water") {
        blocks[blockName].water += reading.value;
      }

      if (reading.utilityType === "Electricity") {
        blocks[blockName].electricity += reading.value;
      }
    });

    const data = Object.values(blocks).map((block) => ({
      ...block,
      status:
        block.water >= block.waterLimit ||
        block.electricity >= block.electricityLimit
          ? "Warning"
          : "Normal",
    }));

    res.status(200).json({
      success: true,
      date: startOfDay,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve block summary",
      error: error.message,
    });
  }
};

module.exports = {
  getMonitoringSummary,
  getBlockSummary,
};
