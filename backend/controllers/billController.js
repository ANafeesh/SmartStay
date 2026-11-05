const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const PaymentNotification = require("../models/PaymentNotification");

const isValidObjectId = (id) =>
  id &&
  mongoose.Types.ObjectId.isValid(id) &&
  String(new mongoose.Types.ObjectId(id)) === String(id);

// Create a new bill
const createBill = async (req, res) => {
  try {
    const {
      studentId,
      billType,
      amount,
      dueDate,
      billingPeriod,
      lateFee,
      description,
      title,
    } = req.body;

    const bill = await Bill.create({
      studentId,
      billType: billType || "Room Fee",
      title: title || `${billType || "Room Fee"} - ${billingPeriod || "Current Cycle"}`,
      billCode: `BIL-2026-${Math.floor(100 + Math.random() * 900)}`,
      amount,
      dueDate,
      billingPeriod,
      lateFee,
      description,
    });

    try {
      if (studentId) {
        await PaymentNotification.create({
          recipientId: String(studentId),
          title: "New Bill Issued",
          message: `A new ${billType || "Hostel"} bill for Rs. ${Number(amount || 0).toLocaleString()} has been generated. Due date: ${dueDate ? new Date(dueDate).toLocaleDateString() : "Pending"}.`,
          type: "warning",
          referenceType: "Bill",
          referenceId: String(bill._id),
        });
      }
    } catch (notifErr) {
      console.warn("Could not dispatch bill notification:", notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: bill,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create bill",
      error: error.message,
    });
  }
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};

// Get bills for a specific student
const getStudentBills = async (req, res) => {
  try {
    const { studentId } = req.params;

    const query = [
      { studentId: studentId },
      { billCode: studentId },
      ...(isValidObjectId(studentId) ? [{ studentId: new mongoose.Types.ObjectId(studentId) }] : []),
    ];

    const bills = await Bill.find({ $or: query }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student bills",
      error: error.message,
    });
  }
};

// Get one bill
const getBillById = async (req, res) => {
  try {
    const query = isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { billCode: String(req.params.id) };

    const bill = await Bill.findOne(query);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
      error: error.message,
    });
  }
};

// Update bill status
const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Paid", "Overdue", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "A valid bill status is required.",
      });
    }

    const query = isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { billCode: String(req.params.id) };

    const bill = await Bill.findOneAndUpdate(
      query,
      { status },
      { new: true, runValidators: true },
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bill status updated successfully",
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update bill status",
      error: error.message,
    });
  }
};

module.exports = {
  createBill,
  getAllBills,
  getStudentBills,
  getBillById,
  updateBillStatus,
};
