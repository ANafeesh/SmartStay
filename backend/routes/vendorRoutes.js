const express = require("express");
const { vendors } = require("../controllers/catalogController");
const Vendor = require("../models/Vendor");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Specific routes first before /:id parameter matching
// Vendor Profile: Get and Update logged in vendor profile
router.get("/profile", protect, authorizeRole("vendor", "admin"), async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase().trim();
    let vendor = await Vendor.findOne({
      $or: [
        { email: userEmail },
        { vendorId: "VND-2026-09" },
        { vendorId: "VND-2026-01" },
      ],
    });

    if (!vendor) {
      // Auto-provision realistic vendor in MongoDB
      vendor = await Vendor.create({
        vendorId: "VND-2026-09",
        name: "Campus Diner & Cafe",
        ownerName: req.user?.name || "Campus Canteen Staff",
        email: userEmail || "vendor@smartstay.com",
        phone: req.user?.phone || "+94 71 892 4110",
        categories: ["Hot Meals", "Beverages", "Snacks", "Late Night Study Meals"],
        tags: ["Halal Certified", "Vegetarian Options", "Campus Delivery", "Eco Packaging"],
        deliveryTime: "15-25 mins",
        hygieneGrade: "A+ (Campus Public Health Clearance)",
        status: "Active",
      });
    }

    return res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch vendor profile.", error: err.message });
  }
});

router.put("/profile", protect, authorizeRole("vendor", "admin"), async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase().trim();
    let vendor = await Vendor.findOne({
      $or: [
        { email: userEmail },
        { vendorId: "VND-2026-09" },
        { vendorId: "VND-2026-01" },
      ],
    });

    const updateFields = ["name", "ownerName", "phone", "categories", "tags", "deliveryTime", "hygieneGrade"];
    const updates = {};
    updateFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (!vendor) {
      vendor = await Vendor.create({
        vendorId: "VND-2026-09",
        name: req.body.name || "Campus Diner & Cafe",
        ownerName: req.body.ownerName || req.user?.name || "Campus Canteen Staff",
        email: userEmail || "vendor@smartstay.com",
        phone: req.body.phone || "+94 71 892 4110",
        categories: req.body.categories || ["Hot Meals", "Beverages", "Snacks"],
        tags: req.body.tags || ["Halal Certified", "Campus Delivery"],
        deliveryTime: req.body.deliveryTime || "15-25 mins",
        hygieneGrade: req.body.hygieneGrade || "A+ (Campus Public Health Clearance)",
        status: "Active",
      });
    } else {
      Object.assign(vendor, updates);
      await vendor.save();
    }

    // Also update logged-in user record if relevant
    if (req.user) {
      if (req.body.ownerName) req.user.name = req.body.ownerName;
      if (req.body.phone) req.user.phone = req.body.phone;
      if (req.body.building) req.user.building = req.body.building;
      await req.user.save();
    }

    return res.status(200).json({
      success: true,
      data: vendor,
      message: "Vendor profile updated successfully.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update vendor profile.", error: err.message });
  }
});

// Public/student list of approved vendors
router.get("/", vendors.list);
router.get("/:id", vendors.get);

// Submit vendor registration application
router.post("/", vendors.create);

// Vendor update / remove (Vendor owner, Admin)
router.put("/:id", protect, authorizeRole("vendor", "admin"), vendors.update);
router.delete("/:id", protect, authorizeRole("admin"), vendors.remove);

module.exports = router;
