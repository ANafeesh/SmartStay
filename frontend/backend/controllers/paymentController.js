const crypto = require("crypto");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Receipt = require("../models/Receipt");
const PaymentNotification = require("../models/PaymentNotification");

const paymentMethods = [
  "Card",
  "Bank Transfer",
  "Wallet",
  "Cash",
  "Other",
  "Credit / Debit Card (Visa)",
  "LankaPay Online Banking",
  "Bank Transfer / Slip",
  "SmartStay Campus Wallet",
];

const handleError = (res, error, message) => {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that identifier already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message, error: error.message });
};

const notify = (recipientId, title, message, type, referenceType, referenceId) =>
  PaymentNotification.findOneAndUpdate(
    { eventKey: `${referenceType}:${referenceId}:${title}` },
    {
      $setOnInsert: {
        recipientId: String(recipientId),
        title,
        message,
        type,
        referenceType,
        referenceId: String(referenceId),
        eventKey: `${referenceType}:${referenceId}:${title}`,
      },
    },
    { upsert: true, new: true, runValidators: true },
  );

const issueReceipt = async (payment, bill) => {
  let receipt = await Receipt.findOne({ paymentId: payment._id });
  if (receipt) return { receipt, created: false };

  receipt = await Receipt.create({
    receiptNo: `RCT-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    verificationCode: crypto.randomBytes(24).toString("hex"),
    paymentId: payment._id,
    billId: bill._id,
    studentId: bill.studentId,
    amount: payment.amount,
    method: payment.method,
  });
  payment.receiptId = receipt._id;
  await payment.save();
  return { receipt, created: true };
};

const createPayment = async (req, res) => {
  try {
    const { billId, method, reference = "" } = req.body;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found." });
    if (["Paid", "Cancelled"].includes(bill.status)) {
      return res.status(409).json({ success: false, message: "This bill cannot receive a payment." });
    }
    if (!paymentMethods.includes(method)) {
      return res.status(400).json({ success: false, message: "A supported payment method is required." });
    }

    const payment = await Payment.create({
      billId: bill._id,
      studentId: bill.studentId,
      amount: bill.amount + bill.lateFee,
      method,
      reference,
    });
    return res.status(201).json({
      success: true,
      message: "Payment recorded as pending confirmation.",
      data: payment,
    });
  } catch (error) {
    return handleError(res, error, "Failed to record payment.");
  }
};

const getPayments = async (req, res) => {
  try {
    const filter = {};
    ["billId", "studentId", "status"].forEach((field) => {
      if (req.query[field] !== undefined) filter[field] = req.query[field];
    });
    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return handleError(res, error, "Failed to fetch payments.");
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("receiptId");
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found." });
    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return handleError(res, error, "Failed to fetch payment.");
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status, reference, failureReason } = req.body;
    if (!["Success", "Failed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Success or Failed." });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found." });
    if (payment.status === status) {
      let receipt = payment.receiptId ? await Receipt.findById(payment.receiptId) : null;
      if (status === "Success" && !receipt) {
        const bill = await Bill.findById(payment.billId);
        if (!bill || bill.status !== "Paid") {
          return res.status(409).json({ success: false, message: "The successful payment is missing its paid bill." });
        }
        const issued = await issueReceipt(payment, bill);
        receipt = issued.receipt;
        if (issued.created) {
          await notify(
            bill.studentId,
            "Payment received",
            `Payment of ${payment.amount} was confirmed. Receipt ${receipt.receiptNo} is ready.`,
            "success",
            "Receipt",
            receipt._id,
          );
        }
      }
      if (status === "Success" && receipt) {
        await notify(
          payment.studentId,
          "Payment received",
          `Payment of ${payment.amount} was confirmed. Receipt ${receipt.receiptNo} is ready.`,
          "success",
          "Receipt",
          receipt._id,
        );
      } else if (status === "Failed") {
        await notify(
          payment.studentId,
          "Payment failed",
          `Payment for bill ${payment.billId} failed: ${payment.failureReason}`,
          "danger",
          "Payment",
          payment._id,
        );
      }
      return res.status(200).json({ success: true, data: { payment, receipt } });
    }
    if (payment.status !== "Pending") {
      return res.status(409).json({ success: false, message: "Only pending payments can be confirmed." });
    }

    const billBefore = await Bill.findOne({
      _id: payment.billId,
      status: { $in: ["Pending", "Overdue"] },
    });
    if (!billBefore) {
      return res.status(409).json({ success: false, message: "The bill is no longer payable." });
    }
    const bill =
      status === "Success"
        ? await Bill.findOneAndUpdate(
            { _id: billBefore._id, status: billBefore.status },
            { $set: { status: "Paid" } },
            { new: true },
          )
        : billBefore;
    if (!bill) {
      return res.status(409).json({ success: false, message: "The bill changed while payment was being confirmed." });
    }

    payment.status = status;
    payment.reference = reference === undefined ? payment.reference : reference;
    payment.failureReason = status === "Failed" ? (failureReason || "Payment was not authorized.") : "";
    try {
      await payment.save();
    } catch (error) {
      if (status === "Success") {
        await Bill.updateOne(
          { _id: bill._id, status: "Paid" },
          { $set: { status: billBefore.status } },
        );
      }
      throw error;
    }

    let receipt = null;
    if (status === "Success") {
      const issued = await issueReceipt(payment, bill);
      receipt = issued.receipt;
      await notify(
        bill.studentId,
        "Payment received",
        `Payment of ${payment.amount} was confirmed. Receipt ${receipt.receiptNo} is ready.`,
        "success",
        "Receipt",
        receipt._id,
      );
    } else {
      await notify(
        bill.studentId,
        "Payment failed",
        `Payment for bill ${bill._id} failed: ${payment.failureReason}`,
        "danger",
        "Payment",
        payment._id,
      );
    }

    return res.status(200).json({
      success: true,
      message: `Payment ${status.toLowerCase()}.`,
      data: { payment, receipt },
    });
  } catch (error) {
    return handleError(res, error, "Failed to update payment status.");
  }
};

const getReceipts = async (req, res) => {
  try {
    const filter = {};
    ["paymentId", "billId", "studentId"].forEach((field) => {
      if (req.query[field] !== undefined) filter[field] = req.query[field];
    });
    const receipts = await Receipt.find(filter).sort({ issuedAt: -1 });
    return res.status(200).json({ success: true, count: receipts.length, data: receipts });
  } catch (error) {
    return handleError(res, error, "Failed to fetch receipts.");
  }
};

const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ receiptNo: req.params.receiptNo });
    if (!receipt) return res.status(404).json({ success: false, message: "Receipt not found." });
    return res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    return handleError(res, error, "Failed to fetch receipt.");
  }
};

const verifyReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ receiptNo: req.params.receiptNo }).select("+verificationCode");
    if (!receipt) return res.status(404).json({ success: false, message: "Receipt not found." });
    const supplied = Buffer.from(String(req.body.verificationCode || ""));
    const expected = Buffer.from(receipt.verificationCode);
    const valid =
      supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
    return res.status(200).json({ success: true, valid, receiptNo: receipt.receiptNo });
  } catch (error) {
    return handleError(res, error, "Failed to verify receipt.");
  }
};

const getNotifications = async (req, res) => {
  try {
    let filter = {};
    if (req.query.recipientId) {
      filter.recipientId = req.query.recipientId;
    } else if (req.user) {
      const userRole = (req.user.role || "").toLowerCase().trim();
      if (userRole !== "admin") {
        const identifiers = [
          String(req.user._id),
          req.user.studentId,
          req.user.registrationNumber,
          req.user.email,
        ].filter(Boolean);
        filter.recipientId = { $in: identifiers };
      }
    } else {
      return res.status(400).json({ success: false, message: "recipientId is required." });
    }
    if (req.query.unread === "true") filter.readAt = null;
    const notifications = await PaymentNotification.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    return handleError(res, error, "Failed to fetch notifications.");
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = await PaymentNotification.create({
      recipientId: req.body.recipientId,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type,
      referenceType: req.body.referenceType,
      referenceId: req.body.referenceId,
    });
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    return handleError(res, error, "Failed to create notification.");
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await PaymentNotification.findByIdAndUpdate(
      req.params.id,
      { $set: { readAt: new Date() } },
      { new: true },
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return handleError(res, error, "Failed to update notification.");
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    let filter = { readAt: null };
    if (req.query.recipientId) {
      filter.recipientId = req.query.recipientId;
    } else if (req.user) {
      const userRole = (req.user.role || "").toLowerCase().trim();
      if (userRole !== "admin") {
        const identifiers = [
          String(req.user._id),
          req.user.studentId,
          req.user.registrationNumber,
          req.user.email,
        ].filter(Boolean);
        filter.recipientId = { $in: identifiers };
      }
    }
    await PaymentNotification.updateMany(filter, { $set: { readAt: new Date() } });
    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    return handleError(res, error, "Failed to update notifications.");
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await PaymentNotification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
    return res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    return handleError(res, error, "Failed to delete notification.");
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
  getReceipts,
  getReceipt,
  verifyReceipt,
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
