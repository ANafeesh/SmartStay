const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: [true, "Visitor name is required"],
      trim: true,
    },
    nicOrPassport: {
      type: String,
      required: [true, "National Identity or Passport number is required"],
      trim: true,
      index: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact telephone number is required"],
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host student reference is required"],
      index: true,
    },
    studentRegistrationId: {
      type: String,
      required: [true, "Host student registration ID is required"],
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      required: [true, "Host student name is required"],
      trim: true,
    },
    relationship: {
      type: String,
      enum: ["Parent", "Guardian", "Sibling", "Academic Colleague", "Other"],
      default: "Parent",
      required: [true, "Relationship to student is required"],
    },
    purpose: {
      type: String,
      required: [true, "Purpose of visit is required"],
      trim: true,
    },
    entryTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    exitTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Expected", "Checked-In", "Checked-Out", "Denied"],
      default: "Checked-In",
      index: true,
    },
    gateName: {
      type: String,
      trim: true,
      default: "Main Security Gate",
    },
    gateOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    officerName: {
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

module.exports = mongoose.model("Visitor", visitorSchema);

