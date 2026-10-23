
const MonitoringReading = require("../models/MonitoringReading");

// Create a new monitoring reading
exports.createReading = async (req, res) => {
  try {
    const { utilityType, value, unit, buildingId, blockName, source, recordedAt } =
      req.body;

    if (!utilityType || value === undefined || !unit) {
      return res.status(400).json({
        success: false,
        message: "utilityType, value, and unit are required",
      });
    }

    const reading = await MonitoringReading.create({
      utilityType,
      value,
      unit,
      buildingId: buildingId || null,
      blockName: blockName || "",
      source: source || "Manual",
      recordedAt: recordedAt || new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Monitoring reading created successfully",
      data: reading,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get monitoring readings, optionally filtered by utility type
exports.getReadings = async (req, res) => {
  try {
    const filter = {};

    if (req.query.utilityType) {
      if (!["Water", "Electricity"].includes(req.query.utilityType)) {
        return res.status(400).json({
          success: false,
          message: "utilityType must be Water or Electricity",
        });
      }

      filter.utilityType = req.query.utilityType;
    }

    const readings = await MonitoringReading.find(filter)
      .sort({ recordedAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve monitoring readings",
    });
  }
};

// Get the latest reading for each utility
exports.getLatestReadings = async (req, res) => {
  try {
    const water = await MonitoringReading.findOne({
      utilityType: "Water",
    }).sort({ recordedAt: -1 });

    const electricity = await MonitoringReading.findOne({
      utilityType: "Electricity",
    }).sort({ recordedAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        water,
        electricity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve latest readings",
    });
  }
};
