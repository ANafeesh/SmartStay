const Bill = require("../models/Bill");

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
    } = req.body;

    const bill = await Bill.create({
      studentId,
      billType,
      amount,
      dueDate,
      billingPeriod,
      lateFee,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: bill,
    });
  } catch (error) {
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

    const bills = await Bill.find({ studentId }).sort({ createdAt: -1 });

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
    const bill = await Bill.findById(req.params.id);

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

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
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
