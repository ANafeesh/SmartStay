const mongoose = require("mongoose");

const gateInconsistencySchema = new mongoose.Schema(
  {
    pass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DigitalPass",
      required: [true, "Pass reference is required"],
      index: true,
    },
    passNumber: {
      type: String,
      required: [true, "Pass number is required"],
      trim: true,
      uppercase: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    operationId: {
      type: String,
      required: [true, "Operation identifier is required"],
      index: true,
    },
    failedOperation: {
      type: String,
      required: [true, "Failed operation descriptor is required"],
    },
    attemptedDirection: {
      type: String,
      enum: ["IN", "OUT"],
    },
    reason: {
      type: String,
      required: [true, "Inconsistency reason is required"],
    },
    passStateAtFailure: {
      type: mongoose.Schema.Types.Mixed,
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GateInconsistency", gateInconsistencySchema);

