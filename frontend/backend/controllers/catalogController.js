const Vendor = require("../models/Vendor");
const MenuItem = require("../models/MenuItem");
const DeliverySlot = require("../models/DeliverySlot");

const errorResponse = (res, error, message) => {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that identifier already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message, error: error.message });
};

const createCatalogController = (
  Model,
  fields,
  filterFields = [],
  validateUpdate = null,
  validateDelete = null,
) => ({
  list: async (req, res) => {
    try {
      const filter = {};
      filterFields.forEach((field) => {
        if (req.query[field] !== undefined) filter[field] = req.query[field];
      });
      const records = await Model.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
      return errorResponse(res, error, "Failed to fetch records.");
    }
  },
  get: async (req, res) => {
    try {
      const record = await Model.findById(req.params.id);
      if (!record) return res.status(404).json({ success: false, message: "Record not found." });
      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      return errorResponse(res, error, "Failed to fetch record.");
    }
  },
  create: async (req, res) => {
    try {
      const values = {};
      fields.forEach((field) => {
        if (req.body[field] !== undefined) values[field] = req.body[field];
      });
      const record = await Model.create(values);
      return res.status(201).json({ success: true, data: record });
    } catch (error) {
      return errorResponse(res, error, "Failed to create record.");
    }
  },
  update: async (req, res) => {
    try {
      const values = {};
      fields.forEach((field) => {
        if (req.body[field] !== undefined) values[field] = req.body[field];
      });
      if (validateUpdate) {
        const message = await validateUpdate(req.params.id, values);
        if (message) return res.status(409).json({ success: false, message });
      }
      const record = await Model.findByIdAndUpdate(req.params.id, values, {
        new: true,
        runValidators: true,
      });
      if (!record) return res.status(404).json({ success: false, message: "Record not found." });
      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      return errorResponse(res, error, "Failed to update record.");
    }
  },
  remove: async (req, res) => {
    try {
      if (validateDelete) {
        const message = await validateDelete(req.params.id);
        if (message) return res.status(409).json({ success: false, message });
      }
      const record = await Model.findByIdAndDelete(req.params.id);
      if (!record) return res.status(404).json({ success: false, message: "Record not found." });
      return res.status(200).json({ success: true, message: "Record deleted successfully." });
    } catch (error) {
      return errorResponse(res, error, "Failed to delete record.");
    }
  },
});

const vendors = createCatalogController(
  Vendor,
  ["vendorId", "name", "ownerName", "email", "phone", "categories", "tags", "deliveryTime", "hygieneGrade", "status"],
  ["vendorId", "status"],
);
const menuItems = createCatalogController(
  MenuItem,
  ["itemId", "vendorId", "name", "description", "category", "price", "image", "available", "isHalal", "isSpicy", "isVeg", "prepTime"],
  ["vendorId", "category", "available"],
);
const deliverySlots = createCatalogController(
  DeliverySlot,
  ["vendorId", "label", "startsAt", "endsAt", "capacity", "isActive"],
  ["vendorId", "isActive"],
  async (id, values) => {
    if (values.capacity === undefined) return null;
    const slot = await DeliverySlot.findById(id).select("reserved");
    if (!slot) return null;
    return values.capacity < slot.reserved
      ? "Capacity cannot be lower than existing reservations."
      : null;
  },
  async (id) => {
    const slot = await DeliverySlot.findById(id).select("reserved");
    if (!slot) return null;
    return slot.reserved > 0 ? "A delivery slot with reservations cannot be deleted." : null;
  },
);

module.exports = { vendors, menuItems, deliverySlots };
