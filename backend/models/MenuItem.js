const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true, trim: true, index: true },
    vendorId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true, default: "" },
    available: { type: Boolean, default: true, index: true },
    isHalal: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isVeg: { type: Boolean, default: false },
    prepTime: { type: String, trim: true, default: "15 mins" },
    calories: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

menuItemSchema.pre("validate", function () {
  if (!this.itemId) {
    this.itemId = `FD-${Math.floor(100 + Math.random() * 900)}`;
  }
  if (!this.vendorId) {
    this.vendorId = "VND-2026-09";
  }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
