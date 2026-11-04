
const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room ID is required"],
    },

    bedNumber: {
      type: String,
      required: [true, "Bed number is required"],
      trim: true,
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

// Bed numbers must be unique within each room
bedSchema.index(
  { roomId: 1, bedNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Bed", bedSchema);
