
const mongoose = require("mongoose");

const monitoringReadingSchema = new mongoose.Schema(
  {
    utilityType: {
      type: String,
      enum: ["Water", "Electricity"],
      required: [true, "Utility type is required"],
    },

    value: {
      type: Number,
      required: [true, "Reading value is required"],
      min: [0, "Reading cannot be negative"],
    },

    unit: {
      type: String,
      enum: ["L", "kWh"],
      required: [true, "Unit is required"],
    },

    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },

    blockName: {
      type: String,
      trim: true,
      default: "",
    },

    source: {
      type: String,
      enum: ["Manual", "Sensor", "Simulated"],
      default: "Manual",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Keep the utility type and unit consistent.
monitoringReadingSchema.pre("validate", function () {
  if (
    (this.utilityType === "Water" && this.unit !== "L") ||
    (this.utilityType === "Electricity" && this.unit !== "kWh")
  ) {
    this.invalidate(
      "unit",
      "Water readings must use L and electricity readings must use kWh"
    );
  }
});

monitoringReadingSchema.index({
  utilityType: 1,
  recordedAt: -1,
});

module.exports = mongoose.model(
  "MonitoringReading",
  monitoringReadingSchema
);
