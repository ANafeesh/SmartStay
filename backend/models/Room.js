
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: [true, "Building ID is required"],
    },

    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },

    floor: {
      type: Number,
      required: [true, "Floor number is required"],
      min: [1, "Floor must be at least 1"],
    },

    capacity: {
      type: Number,
      required: [true, "Room capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    roomType: {
      type: String,
      enum: ["Standard", "Deluxe", "Shared", "Single"],
      default: "Shared",
    },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate room numbers within the same
// floor of the same building.
roomSchema.index(
  { buildingId: 1, floor: 1, roomNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Room", roomSchema);
