const mongoose = require("mongoose");

const foodOrderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", default: null },
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const foodOrderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, trim: true, index: true },
    studentName: { type: String, trim: true, default: "" },
    regNo: { type: String, trim: true, default: "" },
    vendorId: { type: String, required: true, trim: true, index: true },
    vendor: { type: String, required: true, trim: true },
    deliverySlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliverySlot",
      required: true,
    },
    timeSlot: { type: String, required: true, trim: true },
    deliveryLocation: { type: String, required: true, trim: true },
    items: { type: [foodOrderItemSchema], required: true, validate: (items) => items.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    convenienceFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["Charged to Room Bill", "Cash at Delivery Gate", "Campus Digital Wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodOrder", foodOrderSchema);
