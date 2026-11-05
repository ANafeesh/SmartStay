const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    billId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    studentName: { type: String, default: "" },
    studentRegNo: { type: String, default: "" },
    studentEmail: { type: String, default: "" },
    hostelRoom: { type: String, default: "" },
    billTitle: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    lateFee: { type: Number, default: 0 },
    method: {
      type: String,
      required: true,
    },
    reference: { type: String, trim: true, default: "" },
    receiptNo: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },
    failureReason: { type: String, trim: true, default: "" },
    receiptId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
