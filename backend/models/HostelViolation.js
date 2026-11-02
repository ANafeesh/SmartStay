const mongoose = require("mongoose");

const hostelViolationSchema = new mongoose.Schema(
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
    violationType: {
      type: String,
      enum: [
        "Curfew Breach",
        "Unauthorized Visitor",
        "Noise Disturbance",
        "Property Damage",
        "Prohibited Items",
        "Sub-letting",
        "Other",
      ],
      required: [true, "Violation category type is required"],
      index: true,
    },
    severity: {
      type: String,
      enum: ["Minor", "Moderate", "Major", "Critical"],
      default: "Minor",
    },
    description: {
      type: String,
      required: [true, "Incident description is required"],
      trim: true,
    },
    incidentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    location: {
      type: String,
      trim: true,
      default: "Hostel Main Gate / Grounds",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporting officer reference is required"],
    },
    reporterName: {
      type: String,
      trim: true,
      default: "Security Officer",
    },
    reportedByRole: {
      type: String,
      default: "security",
    },
    fineAmount: {
      type: Number,
      default: 0,
      min: [0, "Fine amount cannot be negative"],
    },
    fineStatus: {
      type: String,
      enum: ["None", "Pending", "Paid", "Waived"],
      default: "None",
    },
    status: {
      type: String,
      enum: ["Open", "Under Review", "Resolved", "Dismissed"],
      default: "Open",
      index: true,
    },
    actionTaken: {
      type: String,
      trim: true,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HostelViolation", hostelViolationSchema);

