const crypto = require("crypto");
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
      if (req.query[field] !== undefined) filter[field] = req.query[field];
    });
    const orders = await FoodOrder.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return handleError(res, error, "Failed to fetch food orders.");
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id);
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
      const item = await MenuItem.findOne({
        _id: requested.menuItemId,
        vendorId,
        available: true,
      });
      const qty = Number(requested.qty);
      if (!item || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ success: false, message: "Each order item must be available and have a positive integer quantity." });
      }
      normalizedItems.push({
        menuItemId: item._id,
        name: item.name,
        qty,
        price: item.price,
      });
    }

    const slot = await DeliverySlot.findOneAndUpdate(
      {
        _id: deliverySlotId,
        isActive: true,
        startsAt: { $gt: new Date() },
        $expr: { $lt: ["$reserved", "$capacity"] },
        $or: [{ vendorId: "" }, { vendorId }],
      },
      { $inc: { reserved: 1 } },
      { new: true },
    );
    if (!slot) {
      return res.status(409).json({ success: false, message: "Delivery slot is unavailable or at capacity." });
    }
    reservedSlotId = slot._id;

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = Number(req.body.deliveryFee ?? (subtotal > 1500 ? 0 : 80));
    const convenienceFee = Number(req.body.convenienceFee ?? 20);
    if (![deliveryFee, convenienceFee].every((fee) => Number.isFinite(fee) && fee >= 0)) {
      await DeliverySlot.updateOne({ _id: reservedSlotId }, { $inc: { reserved: -1 } });
      reservedSlotId = null;
      return res.status(400).json({ success: false, message: "Fees must be non-negative numbers." });
    }

    const order = await FoodOrder.create({
      orderNo: `ORD-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
      studentId,
      studentName,
      regNo,
      vendorId,
      vendor: vendor.name,
      deliverySlotId: slot._id,
      timeSlot: slot.label,
      deliveryLocation,
      items: normalizedItems,
      subtotal,
      deliveryFee,
      convenienceFee,
      totalAmount: subtotal + deliveryFee + convenienceFee,
      paymentMethod,
    });
    reservedSlotId = null;
    await PaymentNotification.create({
      recipientId: String(studentId),
      title: "Food order placed",
      message: `Order ${order.orderNo} has been placed.`,
      type: "info",
      referenceType: "FoodOrder",
      referenceId: String(order._id),
    });
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
    const validTransitions = {
      Placed: ["Preparing", "Cancelled"],
      Preparing: ["Out for Delivery", "Cancelled"],
      "Out for Delivery": ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };
    const order = await FoodOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Food order not found." });
    if (!validTransitions[order.status].includes(status)) {
      return res.status(409).json({ success: false, message: `Cannot change order status from ${order.status} to ${status}.` });
    }
    order.status = status;
    await order.save();

    if (status === "Cancelled") {
      await DeliverySlot.updateOne(
        { _id: order.deliverySlotId, reserved: { $gt: 0 } },
        { $inc: { reserved: -1 } },
      );
    }
    await PaymentNotification.create({
      recipientId: order.studentId,
      title: "Food order updated",
      message: `Order ${order.orderNo} is now ${status}.`,
      type: status === "Cancelled" ? "warning" : "info",
      referenceType: "FoodOrder",
      referenceId: String(order._id),
    });
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return handleError(res, error, "Failed to update food order.");
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };
