const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: [
        "Card",
        "Bank Transfer",
        "Wallet",
        "Cash",
        "Other",
        "Credit / Debit Card (Visa)",
        "LankaPay Online Banking",
        "Bank Transfer / Slip",
        "SmartStay Campus Wallet",
      ],
      required: true,
    },
    reference: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },
    failureReason: { type: String, trim: true, default: "" },
    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
