const mongoose = require("mongoose");

const paymentNotificationSchema = new mongoose.Schema(
  {
    recipientId: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "danger"],
      default: "info",
    },
    referenceType: { type: String, trim: true, default: "" },
    referenceId: { type: String, trim: true, default: "" },
    eventKey: { type: String, unique: true, sparse: true, select: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentNotification", paymentNotificationSchema);
