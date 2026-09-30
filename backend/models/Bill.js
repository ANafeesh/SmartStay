const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    billType: {
      type: String,
      enum: [
        "Monthly Fee",
        "Semester Fee",
        "Utility Charge",
        "Damage Charge",
        "Late Fee",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    billingPeriod: {
      type: String,
      required: true,
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
