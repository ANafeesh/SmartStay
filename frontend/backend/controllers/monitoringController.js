const MonitoringReading = require("../models/MonitoringReading");

// Create a new monitoring reading with comprehensive validation
exports.createReading = async (req, res) => {
  try {
    const { utilityType, value, unit, buildingId, blockName, source, recordedAt } =
      req.body;

    if (!utilityType || value === undefined || value === null || value === "") {
      return res.status(400).json({
        success: false,
        message: "utilityType and value are required",
      });
    }

    if (!["Water", "Electricity"].includes(utilityType)) {
      return res.status(400).json({
        success: false,
        message: "utilityType must be 'Water' or 'Electricity'",
      });
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Reading value must be a valid non-negative number",
      });
    }

    const expectedUnit = utilityType === "Water" ? "L" : "kWh";
    const finalUnit = unit || expectedUnit;
    if (finalUnit !== expectedUnit) {
      return res.status(400).json({
        success: false,
        message: `Invalid unit '${finalUnit}' for ${utilityType}. Expected '${expectedUnit}'.`,
      });
    }

    let finalRecordedAt = new Date();
    if (recordedAt) {
      const parsedDate = new Date(recordedAt);
      if (!isNaN(parsedDate.getTime())) {
        finalRecordedAt = parsedDate;
      }
    }

    const reading = await MonitoringReading.create({
      utilityType,
      value: numValue,
      unit: finalUnit,
      buildingId: buildingId || null,
      blockName: blockName ? String(blockName).trim() : "Unassigned",
      source: source || "Manual",
      recordedAt: finalRecordedAt,
    });

    return res.status(201).json({
      success: true,
      message: "Monitoring reading created successfully",
      data: reading,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create monitoring reading",
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
      error: error.message,
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
      error: error.message,
    });
  }
};
