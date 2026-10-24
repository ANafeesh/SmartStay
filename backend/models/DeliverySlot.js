const mongoose = require("mongoose");

const deliverySlotSchema = new mongoose.Schema(
  {
    vendorId: { type: String, trim: true, default: "", index: true },
    label: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    reserved: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

deliverySlotSchema.pre("validate", function validateSlot() {
  if (this.endsAt <= this.startsAt) {
    this.invalidate("endsAt", "Delivery slot end must be after its start.");
  }
  if (this.reserved > this.capacity) {
    this.invalidate("capacity", "Capacity cannot be lower than existing reservations.");
  }
});

module.exports = mongoose.model("DeliverySlot", deliverySlotSchema);
