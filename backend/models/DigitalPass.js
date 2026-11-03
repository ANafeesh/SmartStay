const mongoose = require("mongoose");

const digitalPassSchema = new mongoose.Schema(
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
    passNumber: {
      type: String,
      required: [true, "Pass number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, "Token hash is required"],
      unique: true,
      select: false,
    },
    qrToken: {
      type: String,
      select: false,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: [true, "Valid until date is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Suspended", "Revoked", "OnLeave"],
      default: "Active",
      index: true,
    },
    room: {
      type: String,
      trim: true,
      default: "",
    },
    building: {
      type: String,
      trim: true,
      default: "",
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastScannedAt: {
      type: Date,
    },
    lastMovementDirection: {
      type: String,
      enum: ["IN", "OUT", "NONE"],
      default: "NONE",
    },
    lastOperationId: {
      type: String,
      trim: true,
      default: null,
    },
    hasInconsistency: {
      type: Boolean,
      default: false,
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

digitalPassSchema.pre("validate", function () {
  if (this.validUntil && this.validFrom && this.validUntil <= this.validFrom) {
    this.invalidate("validUntil", "Pass expiry must be after its validFrom date.");
  }
});

module.exports = mongoose.model("DigitalPass", digitalPassSchema);
