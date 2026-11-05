const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },

    billCode: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    billType: {
      type: String,
      default: "Room Fee",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    billingPeriod: {
      type: String,
      default: "",
    },

    lateFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue", "Cancelled"],
      default: "Pending",
      index: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Bill", billSchema);
