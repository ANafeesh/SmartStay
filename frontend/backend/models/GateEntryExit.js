const mongoose = require("mongoose");

const gateEntryExitSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
      index: true,
    },
    studentRegistrationId: {
      type: String,
      required: [true, "Student registration ID is required"],
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
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
    direction: {
      type: String,
      enum: ["IN", "OUT"],
      required: [true, "Movement direction is required"],
      index: true,
    },
    gateName: {
      type: String,
      required: [true, "Gate checkpoint name is required"],
      trim: true,
      default: "Main Campus Gate",
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Scanning security officer reference is required"],
    },
    officerName: {
      type: String,
      trim: true,
      default: "Campus Security Officer",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isCurfewBreach: {
      type: Boolean,
      default: false,
      index: true,
    },
    leaveRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveRequest",
    },
    operationId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    leaveCompletionStatus: {
      type: String,
      enum: ["NONE", "PENDING", "COMPLETED", "FAILED"],
      default: "NONE",
      index: true,
    },
    curfewViolationStatus: {
      type: String,
      enum: ["NONE", "PENDING", "CREATED", "FAILED"],
      default: "NONE",
      index: true,
    },
    reconciliationNotes: {
      type: String,
      trim: true,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GateEntryExit", gateEntryExitSchema);

