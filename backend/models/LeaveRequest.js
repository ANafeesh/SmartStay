const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
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
    departureDate: {
      type: Date,
      required: [true, "Departure date is required"],
    },
    expectedReturnDate: {
      type: Date,
      required: [true, "Expected return date is required"],
    },
    actualReturnDate: {
      type: Date,
    },
    reason: {
      type: String,
      enum: ["Home Visit", "Medical", "Academic", "Emergency", "Other"],
      default: "Home Visit",
      required: [true, "Leave reason category is required"],
    },
    destination: {
      type: String,
      required: [true, "Destination address is required"],
      trim: true,
    },
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact phone is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approverName: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedAt: {
      type: Date,
    },
    wardenRemarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

leaveRequestSchema.pre("validate", function () {
  if (
    this.departureDate &&
    this.expectedReturnDate &&
    this.expectedReturnDate <= this.departureDate
  ) {
    this.invalidate("expectedReturnDate", "Return date must be after departure date.");
  }
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);

