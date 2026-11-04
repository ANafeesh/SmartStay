const mongoose = require("mongoose");

const entryLogSchema = new mongoose.Schema(
  {
    scannedAt: { type: Date, default: Date.now },
    gate: { type: String, trim: true, default: "" },
    dropZone: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Granted", "Denied"], required: true },
  },
  { _id: false },
);

const vendorPassSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, trim: true, index: true },
    shopName: { type: String, required: true, trim: true },
    deliveryPerson: { type: String, required: true, trim: true },
    riderNic: { type: String, trim: true, default: "" },
    vehicleNo: { type: String, trim: true, default: "" },
    vehicleType: { type: String, trim: true, default: "" },
    tokenHash: { type: String, required: true, select: false, unique: true },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true, index: true },
    authorizedZones: [{ type: String, trim: true }],
    status: { type: String, enum: ["Active", "Revoked"], default: "Active", index: true },
    entryLogs: { type: [entryLogSchema], default: [] },
  },
  { timestamps: true },
);

vendorPassSchema.pre("validate", function validatePass() {
  if (this.validUntil <= this.validFrom) {
    this.invalidate("validUntil", "Pass expiry must be after its start time.");
  }
});

module.exports = mongoose.model("VendorPass", vendorPassSchema);
