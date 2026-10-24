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
    prepTime: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
