const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    categories: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    deliveryTime: { type: String, trim: true, default: "" },
    hygieneGrade: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Active", "Suspended", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Vendor", vendorSchema);
