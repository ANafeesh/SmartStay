
const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Building name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Building code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    floors: {
      type: Number,
      required: [true, "Number of floors is required"],
      min: [1, "A building must have at least one floor"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Building", buildingSchema);
