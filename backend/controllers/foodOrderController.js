const crypto = require("crypto");
const mongoose = require("mongoose");
const FoodOrder = require("../models/FoodOrder");
const MenuItem = require("../models/MenuItem");
const Vendor = require("../models/Vendor");
const DeliverySlot = require("../models/DeliverySlot");
const PaymentNotification = require("../models/PaymentNotification");

const handleError = (res, error, message) => {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that identifier already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message, error: error.message });
};

const getOrders = async (req, res) => {
  try {
    const filter = {};
    ["studentId", "vendorId", "status"].forEach((field) => {
      if (req.query[field] !== undefined && req.query[field] !== "All") {
        filter[field] = req.query[field];
      }
    });

    let orders = await FoodOrder.find(filter).sort({ createdAt: -1 });

    // Auto-bootstrap realistic orders in MongoDB if DB collection is completely empty
    if (orders.length === 0 && Object.keys(filter).length === 0) {
      try {
        const dummySlotId = new mongoose.Types.ObjectId();
        const initialSeed = [
          {
            orderNo: "ORD-9041",
            studentId: "STD-2026-101",
            studentName: "Ahamed Nafeesh",
            regNo: "STD-2026-101",
            vendorId: "VND-2026-09",
            vendor: "Campus Diner & Cafe",
            deliverySlotId: dummySlotId,
            timeSlot: "12:30 PM - 01:00 PM (Lunch)",
            deliveryLocation: "Hostel Block B - Room 204",
            items: [
              { name: "Chicken Kottu Roti (Full Portion)", qty: 1, price: 850 },
              { name: "Special Egg Fried Rice & Chili Paste", qty: 1, price: 650 },
            ],
            subtotal: 1500,
            deliveryFee: 0,
            convenienceFee: 20,
            totalAmount: 1520,
            paymentMethod: "Charged to Room Bill",
            status: "Placed",
            paymentStatus: "Pending",
          },
          {
            orderNo: "ORD-9038",
            studentId: "STD-2026-112",
            studentName: "M.I.M Izni",
            regNo: "STD-2026-112",
            vendorId: "VND-2026-09",
            vendor: "Campus Diner & Cafe",
            deliverySlotId: dummySlotId,
            timeSlot: "12:30 PM - 01:00 PM (Lunch)",
            deliveryLocation: "Hostel Block A - Foyer",
            items: [{ name: "Crispy Chicken Burger & Fries", qty: 1, price: 950 }],
            subtotal: 950,
            deliveryFee: 80,
            convenienceFee: 20,
            totalAmount: 1050,
            paymentMethod: "Cash at Delivery Gate",
            status: "Preparing",
            paymentStatus: "Pending",
          },
          {
            orderNo: "ORD-9025",
            studentId: "STD-2026-069",
            studentName: "A. Kanesalingam",
            regNo: "STD-2026-069",
            vendorId: "VND-2026-09",
            vendor: "Campus Diner & Cafe",
            deliverySlotId: dummySlotId,
            timeSlot: "01:00 PM - 01:30 PM (Lunch)",
            deliveryLocation: "Hostel Block B - Room 102",
            items: [{ name: "Iced Caramel Macchiato (500ml)", qty: 1, price: 450 }],
            subtotal: 450,
            deliveryFee: 80,
            convenienceFee: 20,
            totalAmount: 550,
            paymentMethod: "Campus Digital Wallet",
            status: "Out for Delivery",
            paymentStatus: "Paid",
          },
          {
            orderNo: "ORD-9011",
            studentId: "STD-2026-102",
            studentName: "M.H.U Hafrath",
            regNo: "STD-2026-102",
            vendorId: "VND-2026-09",
            vendor: "Campus Diner & Cafe",
            deliverySlotId: dummySlotId,
            timeSlot: "11:30 AM - 12:00 PM",
            deliveryLocation: "Campus Gate 01 Hub",
            items: [{ name: "Chicken Kottu Roti (Full Portion)", qty: 1, price: 850 }],
            subtotal: 850,
            deliveryFee: 80,
            convenienceFee: 20,
            totalAmount: 950,
            paymentMethod: "Campus Digital Wallet",
            status: "Delivered",
            paymentStatus: "Paid",
          },
        ];
        orders = await FoodOrder.insertMany(initialSeed);
      } catch (seedErr) {
        console.warn("Could not seed food orders:", seedErr.message);
      }
    }

    return res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return handleError(res, error, "Failed to fetch food orders.");
  }
};

const getOrder = async (req, res) => {
  try {
    let order = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await FoodOrder.findById(req.params.id);
    }
    if (!order) {
      order = await FoodOrder.findOne({ orderNo: req.params.id });
    }
    if (!order) return res.status(404).json({ success: false, message: "Food order not found." });
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return handleError(res, error, "Failed to fetch food order.");
  }
};

const createOrder = async (req, res) => {
  let reservedSlotId;
  try {
    const { studentId, studentName = "", regNo = "", vendorId, deliverySlotId, deliveryLocation, paymentMethod } = req.body;
    const vendor = await Vendor.findOne({ vendorId, status: "Active" });
    if (!vendor) return res.status(404).json({ success: false, message: "Active vendor not found." });

    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: "At least one menu item is required." });
    }
    const requestedItems = req.body.items;
    const normalizedItems = [];
    for (const requested of requestedItems) {
      let item = null;
      if (requested.menuItemId && mongoose.Types.ObjectId.isValid(requested.menuItemId)) {
        item = await MenuItem.findOne({
          _id: requested.menuItemId,
          available: true,
        });
      }
      if (!item) {
        item = await MenuItem.findOne({
          name: new RegExp(requested.name || "", "i"),
          available: true,
        });
      }
      const qty = Number(requested.qty) || 1;
      normalizedItems.push({
        menuItemId: item ? item._id : null,
        name: requested.name || (item ? item.name : "Food Item"),
        qty,
        price: requested.price || (item ? item.price : 500),
      });
    }

    let slot = null;
    if (deliverySlotId && mongoose.Types.ObjectId.isValid(deliverySlotId)) {
      slot = await DeliverySlot.findOneAndUpdate(
        {
          _id: deliverySlotId,
          isActive: true,
          $expr: { $lt: ["$reserved", "$capacity"] },
        },
        { $inc: { reserved: 1 } },
        { new: true },
      );
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = Number(req.body.deliveryFee ?? (subtotal > 1500 ? 0 : 80));
    const convenienceFee = Number(req.body.convenienceFee ?? 20);

    const order = await FoodOrder.create({
      orderNo: `ORD-${Date.now().toString().slice(-4)}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
      studentId: studentId || "STD-2026-101",
      studentName: studentName || "Student Resident",
      regNo: regNo || "STD-2026-101",
      vendorId: vendorId || "VND-2026-09",
      vendor: vendor.name,
      deliverySlotId: slot ? slot._id : new mongoose.Types.ObjectId(),
      timeSlot: slot ? slot.label : "12:30 PM - 01:00 PM (Lunch)",
      deliveryLocation: deliveryLocation || "Hostel Block B - Foyer",
      items: normalizedItems,
      subtotal,
      deliveryFee,
      convenienceFee,
      totalAmount: subtotal + deliveryFee + convenienceFee,
      paymentMethod: paymentMethod || "Charged to Room Bill",
    });

    try {
      await PaymentNotification.create({
        recipientId: String(studentId),
        title: "Food order placed",
        message: `Order ${order.orderNo} has been placed.`,
        type: "info",
        referenceType: "FoodOrder",
        referenceId: String(order._id),
      });
    } catch {}

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (reservedSlotId) {
      await DeliverySlot.updateOne({ _id: reservedSlotId }, { $inc: { reserved: -1 } });
    }
    return handleError(res, error, "Failed to create food order.");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let order = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await FoodOrder.findById(req.params.id);
    }
    if (!order) {
      order = await FoodOrder.findOne({ orderNo: req.params.id });
    }
    if (!order) return res.status(404).json({ success: false, message: "Food order not found." });

    order.status = status;
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }
    await order.save();

    try {
      await PaymentNotification.create({
        recipientId: order.studentId,
        title: "Food order updated",
        message: `Order ${order.orderNo} is now ${status}.`,
        type: status === "Cancelled" ? "warning" : "info",
        referenceType: "FoodOrder",
        referenceId: String(order._id),
      });
    } catch {}

    return res.status(200).json({
      success: true,
      data: order,
      message: `Order status updated to ${status}.`,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update food order.");
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };
