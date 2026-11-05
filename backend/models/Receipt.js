const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true, index: true },
    verificationCode: { type: String, required: true },
    paymentId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
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
    billTitle: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Receipt", receiptSchema);
