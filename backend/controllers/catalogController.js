const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const MenuItem = require("../models/MenuItem");
const DeliverySlot = require("../models/DeliverySlot");

const errorResponse = (res, error, defaultMessage) => {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that identifier already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message: defaultMessage, error: error.message });
};

const createCatalogController = (
  Model,
  fields,
  filterFields,
  validateUpdate = null,
  validateDelete = null,
) => ({
  list: async (req, res) => {
    try {
      const filter = {};
      filterFields.forEach((field) => {
        if (req.query[field] !== undefined && req.query[field] !== "All") {
          filter[field] = req.query[field];
        }
      });
      let records = await Model.find(filter).sort({ createdAt: -1 });

      if (Model.modelName === "MenuItem" && records.length === 0 && Object.keys(filter).length === 0) {
        try {
          const defaults = [
            {
              itemId: "ITEM-01",
              vendorId: "VND-2026-09",
              name: "Chicken Kottu Roti (Full Portion)",
              category: "Main Dishes",
              price: 850,
              available: true,
              prepTime: "15 mins",
              calories: "620 kcal",
              isHalal: true,
              isVeg: false,
              isSpicy: true,
              description: "Chopped flatbread mixed with seasoned chicken, scrambled farm eggs, leeks, and spiced gravy.",
              image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400",
            },
            {
              itemId: "ITEM-02",
              vendorId: "VND-2026-09",
              name: "Special Egg Fried Rice & Chili Paste",
              category: "Main Dishes",
              price: 650,
              available: true,
              prepTime: "10 mins",
              calories: "510 kcal",
              isHalal: true,
              isVeg: false,
              isSpicy: true,
              description: "Basmati rice wok-tossed with fresh farm eggs, green scallions, and Sri Lankan chili sambol.",
              image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400",
            },
            {
              itemId: "ITEM-03",
              vendorId: "VND-2026-09",
              name: "Crispy Chicken Burger & Fries",
              category: "Fast Food",
              price: 950,
              available: true,
              prepTime: "12 mins",
              calories: "680 kcal",
              isHalal: true,
              isVeg: false,
              isSpicy: false,
              description: "Fried chicken breast fillet layered with cheese, fresh lettuce, spicy mayo, and golden salted fries.",
              image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
            },
            {
              itemId: "ITEM-04",
              vendorId: "VND-2026-09",
              name: "Iced Caramel Macchiato (500ml)",
              category: "Beverages",
              price: 450,
              available: false,
              prepTime: "5 mins",
              calories: "210 kcal",
              isHalal: true,
              isVeg: true,
              isSpicy: false,
              description: "Cold brewed espresso blended with sweetened creamy milk, vanilla, and salted caramel swirl.",
              image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
            },
            {
              itemId: "ITEM-05",
              vendorId: "VND-2026-09",
              name: "Vegetable Roti & Creamy Dhal",
              category: "Snacks",
              price: 320,
              available: true,
              prepTime: "8 mins",
              calories: "340 kcal",
              isHalal: true,
              isVeg: true,
              isSpicy: true,
              description: "Freshly roasted wheat triangles served with seasoned coconut milk lentils and lunu miris.",
              image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400",
            },
          ];
          records = await MenuItem.insertMany(defaults);
        } catch (e) {
          console.warn("Could not seed menu items:", e.message);
        }
      }

      return res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
      return errorResponse(res, error, "Failed to fetch records.");
    }
  },
  get: async (req, res) => {
    try {
      let record = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        record = await Model.findById(req.params.id);
      }
      if (!record && Model.modelName === "MenuItem") {
        record = await Model.findOne({ itemId: req.params.id });
      }
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

      let record = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        record = await Model.findByIdAndUpdate(req.params.id, values, {
          new: true,
          runValidators: true,
        });
      }
      if (!record && Model.modelName === "MenuItem") {
        record = await Model.findOneAndUpdate({ itemId: req.params.id }, values, {
          new: true,
          runValidators: true,
        });
      }

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
      let record = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        record = await Model.findByIdAndDelete(req.params.id);
      }
      if (!record && Model.modelName === "MenuItem") {
        record = await Model.findOneAndDelete({ itemId: req.params.id });
      }
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
  ["itemId", "vendorId", "name", "description", "category", "price", "image", "available", "isHalal", "isSpicy", "isVeg", "prepTime", "calories"],
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
