const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    allocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Allocation",
      required: true,
    },

    studentRegistrationId: {
      type: String,
      required: true,
      trim: true,
    },

    fromRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    fromBedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
    },

    toRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    toBedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transfer", transferSchema);