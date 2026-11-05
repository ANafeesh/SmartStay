const mongoose = require("mongoose");

const entryLogSchema = new mongoose.Schema(
  {
    logId: { type: String, trim: true },
    scannedAt: { type: Date, default: Date.now },
    direction: { type: String, enum: ["IN", "OUT", "ENTRY", "EXIT"], default: "IN" },
    gate: { type: String, trim: true, default: "Gate 01 Security Viewport" },
    dropZone: { type: String, trim: true, default: "Hostel Block B" },
    status: { type: String, enum: ["Granted", "Denied"], required: true },
    deliveryPerson: { type: String, trim: true, default: "" },
    vehicleNo: { type: String, trim: true, default: "" },
    officer: { type: String, trim: true, default: "" },
    remarks: { type: String, trim: true, default: "" },
  },
  { _id: true, timestamps: true },
);

const vendorPassSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, trim: true, index: true },
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true, default: "" },
    regNo: { type: String, trim: true, default: "" },
    deliveryPerson: { type: String, required: true, trim: true },
    riderNic: { type: String, trim: true, default: "" },
    vehicleNo: { type: String, trim: true, default: "" },
    vehicleType: { type: String, trim: true, default: "" },
    qrToken: { type: String, trim: true, index: true },
    tokenHash: { type: String, select: false },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true, index: true },
    authorizedZones: [{ type: String, trim: true }],
    status: { type: String, enum: ["Active", "Revoked"], default: "Active", index: true },
    currentLocation: { type: String, enum: ["Inside", "Outside"], default: "Outside" },
    lastMovement: { type: Date },
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
