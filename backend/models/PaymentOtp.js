const mongoose = require("mongoose");

const paymentOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    billId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    studentName: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentOtp", paymentOtpSchema);

