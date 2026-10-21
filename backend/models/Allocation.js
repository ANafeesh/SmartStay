
const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema(
  {
    studentRegistrationId: {
      type: String,
      required: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
    },

    allocationDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Pending", "Checked Out"],
      default: "Active",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Allocation", allocationSchema);
