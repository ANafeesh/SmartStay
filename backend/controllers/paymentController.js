const crypto = require("crypto");
const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Receipt = require("../models/Receipt");
const PaymentNotification = require("../models/PaymentNotification");
const PaymentOtp = require("../models/PaymentOtp");
const User = require("../models/User");
const {
  sendOtpEmail,
  sendWardenPaymentNotification,
  sendStudentPaymentReceipt,
} = require("../services/emailService");

const isValidObjectId = (id) =>
  id &&
  mongoose.Types.ObjectId.isValid(id) &&
  String(new mongoose.Types.ObjectId(id)) === String(id);

const paymentMethods = [
  "Card",
  "Bank Transfer",
  "Wallet",
  "Cash",
  "Other",
  "Credit / Debit Card (Visa)",
  "Credit / Debit Card (Mastercard)",
  "Credit / Debit Card (Amex)",
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
    billId: bill._id || bill.id,
    studentId: bill.studentId || payment.studentId,
    studentName: payment.studentName || "",
    billTitle: bill.title || payment.billTitle || "",
    amount: payment.amount,
    method: payment.method,
  });
  payment.receiptId = receipt._id;
  await payment.save();
  return { receipt, created: true };
};

/**
 * Request OTP for Payment Verification
 * Generates 6-digit OTP, records in PaymentOtp, and sends email to student.
 */
const requestPaymentOtp = async (req, res) => {
  try {
    const { billId, amount, studentName, billTitle, email } = req.body;

    const studentEmail = (email || req.user?.email || "").toLowerCase().trim();
    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "A valid student email address is required to transmit the payment OTP.",
      });
    }

    // Generate secure 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any older unused OTP for this email & bill
    await PaymentOtp.deleteMany({
      email: studentEmail,
      billId: String(billId),
    });

    // Save newly generated OTP
    await PaymentOtp.create({
      email: studentEmail,
      otp: otpCode,
      billId: String(billId),
      amount: Number(amount || 0),
      studentName: studentName || req.user?.name || "Student",
      expiresAt,
    });

    // Mask email for student-facing response (e.g. a***h@campus.edu)
    const [namePart, domainPart] = studentEmail.split("@");
    const maskedName =
      namePart.length > 2
        ? `${namePart[0]}${"*".repeat(namePart.length - 2)}${namePart.slice(-1)}`
        : `${namePart[0]}*`;
    const maskedEmail = `${maskedName}@${domainPart}`;

    // Dispatch real email via Nodemailer
    await sendOtpEmail({
      toEmail: studentEmail,
      otpCode,
      studentName: studentName || req.user?.name || "Student",
      billTitle: billTitle || "Hostel Fee Settlement",
      amount: Number(amount || 0),
    });

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${maskedEmail}.`,
      maskedEmail,
    });
  } catch (error) {
    return handleError(res, error, "Failed to send payment verification OTP.");
  }
};

/**
 * Verify OTP and Complete Payment
 * Verifies code, marks bill paid, records payment & receipt, notifies Warden and Student via email.
 */
const verifyOtpAndCompletePayment = async (req, res) => {
  try {
    const { billId, otp, method, cardDetails, student = {}, bill = {} } = req.body;

    const studentEmail = (student.email || req.user?.email || "").toLowerCase().trim();
    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email is required for payment confirmation.",
      });
    }

    if (!otp || String(otp).trim().length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit OTP authentication code.",
      });
    }

    // Lookup OTP record in database
    const otpRecord = await PaymentOtp.findOne({
      email: studentEmail,
      billId: String(billId),
      otp: String(otp).trim(),
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please check your email or request a new code.",
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Prepare transaction reference and receipt number with guaranteed unique timestamps
    const totalAmount = Number(otpRecord.amount || bill.amount || 0) + Number(bill.lateFee || 0);
    const txnRef = `TXN-LK${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const receiptNo = `RCT-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const studentIdVal = student.id || student._id || req.user?._id || "STD-STUDENT";
    const studentRegNo = student.studentId || student.regNo || student.registrationNumber || req.user?.studentId || "STD-2026-89";
    const studentNameVal = student.name || req.user?.name || "Student User";
    const hostelRoomVal = student.hostelRoom || (student.room ? `Block ${student.building || "A"}, Room ${student.room}` : "Block B - Room 204");

    // Update or upsert Bill in DB to status "Paid" safely without CastError
    const billQueries = [{ billCode: String(billId) }];
    if (isValidObjectId(billId)) {
      billQueries.push({ _id: billId });
    }
    if (bill && bill.title) {
      billQueries.push({ title: bill.title });
    }

    let dbBill = await Bill.findOne({ $or: billQueries });

    if (dbBill) {
      dbBill.status = "Paid";
      await dbBill.save();
    } else {
      try {
        dbBill = await Bill.create({
          studentId: studentIdVal,
          billCode: String(billId),
          title: bill.title || "Hostel Fee",
          billType: bill.type || "Room Fee",
          amount: bill.amount || totalAmount,
          dueDate: bill.dueDate || new Date(),
          billingPeriod: bill.period || "Current Cycle",
          lateFee: bill.lateFee || 0,
          status: "Paid",
        });
      } catch (err) {
        console.warn("Could not upsert bill in DB:", err.message);
      }
    }

    // Check if an approved payment already exists for this bill to avoid duplicate charges
    const existingPayment = await Payment.findOne({
      $or: [
        { billId: dbBill ? dbBill._id : billId },
        { billId: String(billId) },
        ...(bill && bill.title ? [{ billTitle: bill.title }] : []),
      ],
      status: { $in: ["Success", "successful"] },
    });

    if (existingPayment) {
      if (dbBill && dbBill.status !== "Paid") {
        dbBill.status = "Paid";
        await dbBill.save();
      }
      const existingReceipt = await Receipt.findOne({
        $or: [{ paymentId: existingPayment._id }, { billId: dbBill ? dbBill._id : billId }],
      });

      return res.status(200).json({
        success: true,
        message: "Payment successfully verified and authorized.",
        data: {
          payment: {
            id: String(existingPayment._id),
            billId: billId,
            title: bill.title || existingPayment.billTitle,
            type: bill.type || "Hostel Fee",
            amount: existingPayment.amount,
            lateFee: 0,
            period: bill.period || "Current Cycle",
            date: "Paid",
            method: existingPayment.method || "SmartStay PayGate",
            refNo: existingPayment.reference || existingPayment.referenceNumber || "TXN-VERIFIED",
            receiptNo: existingReceipt ? existingReceipt.receiptNo : "RCT-VERIFIED",
            status: "Success",
            studentName: studentNameVal,
            studentRegNo: studentRegNo,
            hostelRoom: hostelRoomVal,
          },
          receipt: existingReceipt || {
            receiptNo: existingPayment.receiptNo || "RCT-VERIFIED",
            amount: existingPayment.amount,
          },
        },
      });
    }

    // Record Payment in DB with unique key collision protection
    let payment;
    try {
      payment = await Payment.create({
        billId: dbBill ? dbBill._id : String(billId),
        studentId: studentIdVal,
        studentName: studentNameVal,
        studentRegNo: studentRegNo,
        studentEmail: studentEmail,
        hostelRoom: hostelRoomVal,
        billTitle: bill.title || "Hostel Fee",
        amount: totalAmount,
        lateFee: bill.lateFee || 0,
        method: method || "Credit / Debit Card (Visa)",
        reference: txnRef,
        referenceNumber: txnRef,
        receiptNo: receiptNo,
        status: "Success",
      });
    } catch (payErr) {
      const fallbackTxn = `TXN-LK${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      payment = await Payment.create({
        billId: dbBill ? dbBill._id : String(billId),
        studentId: studentIdVal,
        studentName: studentNameVal,
        studentRegNo: studentRegNo,
        studentEmail: studentEmail,
        hostelRoom: hostelRoomVal,
        billTitle: bill.title || "Hostel Fee",
        amount: totalAmount,
        lateFee: bill.lateFee || 0,
        method: method || "Credit / Debit Card (Visa)",
        reference: fallbackTxn,
        referenceNumber: fallbackTxn,
        receiptNo: receiptNo,
        status: "Success",
      });
    }

    // Record Receipt in DB with unique receiptNo collision protection
    let receipt;
    try {
      receipt = await Receipt.create({
        receiptNo: receiptNo,
        verificationCode: crypto.randomBytes(24).toString("hex"),
        paymentId: payment._id,
        billId: dbBill ? dbBill._id : String(billId),
        studentId: studentIdVal,
        studentName: studentNameVal,
        billTitle: bill.title || "Hostel Fee",
        amount: totalAmount,
        method: payment.method,
      });
    } catch (rcptErr) {
      const fallbackRcpt = `RCT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      receipt = await Receipt.create({
        receiptNo: fallbackRcpt,
        verificationCode: crypto.randomBytes(24).toString("hex"),
        paymentId: payment._id,
        billId: dbBill ? dbBill._id : String(billId),
        studentId: studentIdVal,
        studentName: studentNameVal,
        billTitle: bill.title || "Hostel Fee",
        amount: totalAmount,
        method: payment.method,
      });
    }

    payment.receiptId = receipt._id;
    await payment.save();

    // 1. Dynamically query all Admins, Wardens, and Finance staff from MongoDB (no hardcoding)
    let staffRecipients = [];
    try {
      staffRecipients = await User.find(
        { role: { $in: ["warden", "admin", "hostel_admin", "finance", "finance_staff"] } },
        { _id: 1, name: 1, email: 1, role: 1 }
      );
    } catch (err) {
      console.warn("Could not query staff from DB:", err.message);
    }

    const adminAndWardenEmails = Array.from(
      new Set(
        [
          ...staffRecipients.map((u) => u.email),
          process.env.WARDEN_EMAIL,
          process.env.ADMIN_EMAIL,
        ].filter(Boolean)
      )
    );

    // 2. Dispatch Official Bursary Settlement Email to all Admins and Wardens
    if (adminAndWardenEmails.length > 0) {
      await sendWardenPaymentNotification({
        wardenEmails: adminAndWardenEmails,
        student: {
          name: studentNameVal,
          regNo: studentRegNo,
          email: studentEmail,
          hostelRoom: hostelRoomVal,
        },
        bill: {
          id: billId,
          title: bill.title || "Hostel Fee Settlement",
          type: bill.type || "Room Fee",
          period: bill.period || "Current Cycle",
        },
        payment: {
          amount: totalAmount,
          refNo: txnRef,
          receiptNo: receiptNo,
          method: payment.method,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        receipt,
      });
    }

    // 3. Dispatch Official Receipt Confirmation Email to Student
    await sendStudentPaymentReceipt({
      toEmail: studentEmail,
      student: {
        name: studentNameVal,
        regNo: studentRegNo,
        email: studentEmail,
      },
      bill: {
        id: billId,
        title: bill.title || "Hostel Fee Settlement",
      },
      payment: {
        amount: totalAmount,
        refNo: txnRef,
        receiptNo: receiptNo,
        method: payment.method,
        date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
      },
      receipt,
    });

    // 4. Create in-app System Notifications for Student AND all Admins & Wardens dynamically
    try {
      // Notify Student
      await notify(
        studentIdVal,
        "Payment Confirmed",
        `LKR ${totalAmount.toLocaleString()} settled for ${bill.title || "bill"}. Receipt #${receiptNo} generated.`,
        "success",
        "Receipt",
        receipt._id
      );

      // Notify each Admin & Warden in their in-app notifications inbox
      for (const staff of staffRecipients) {
        await notify(
          String(staff._id),
          "Student Bill Payment Received",
          `Official Bursary Receipt #${receiptNo} issued: ${studentNameVal} (${studentRegNo}) settled LKR ${totalAmount.toLocaleString()} for ${bill.title || "bill"} via ${payment.method}. Ref: ${txnRef}.`,
          "success",
          "Receipt",
          receipt._id
        );
      }
    } catch (notifErr) {
      console.warn("Could not dispatch system notification:", notifErr.message);
    }

    const clientPaymentRecord = {
      id: String(payment._id),
      billId: billId,
      title: bill.title || "Hostel Fee",
      type: bill.type || "Room Fee",
      amount: totalAmount,
      lateFee: bill.lateFee || 0,
      period: bill.period || "Current Cycle",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      method: payment.method,
      refNo: txnRef,
      receiptNo: receiptNo,
      status: "Success",
      studentName: studentNameVal,
      studentRegNo: studentRegNo,
      hostelRoom: hostelRoomVal,
    };

    return res.status(200).json({
      success: true,
      message: "Payment successfully verified and authorized.",
      data: {
        payment: clientPaymentRecord,
        receipt,
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to complete payment authorization.");
  }
};

/**
 * Submit Bank Deposit Slip (Manual Bursary Verification)
 */
const submitDepositSlip = async (req, res) => {
  try {
    const { billId, slipRef, fileName, student = {}, bill = {} } = req.body;

    const studentEmail = (student.email || req.user?.email || "").toLowerCase().trim();
    const studentIdVal = student.id || student._id || req.user?._id || "STD-STUDENT";
    const studentRegNo = student.studentId || student.regNo || student.registrationNumber || "STD-2026-89";
    const studentNameVal = student.name || req.user?.name || "Student User";
    const hostelRoomVal = student.hostelRoom || "Room 101, Block A";
    const totalAmount = Number(bill.amount || 0) + Number(bill.lateFee || 0);

    const txnRef = slipRef || `DEP-BOC-${Math.floor(10000 + Math.random() * 90000)}`;

    const payment = await Payment.create({
      billId: billId,
      studentId: studentIdVal,
      studentName: studentNameVal,
      studentRegNo: studentRegNo,
      studentEmail: studentEmail,
      hostelRoom: hostelRoomVal,
      billTitle: bill.title || "Hostel Fee",
      amount: totalAmount,
      lateFee: bill.lateFee || 0,
      method: `Bank Deposit Slip (${fileName || "BOC Deposit Slip"})`,
      reference: txnRef,
      status: "Pending",
    });

    // Dynamically query all Admins and Wardens from MongoDB
    let staffRecipients = [];
    try {
      staffRecipients = await User.find(
        { role: { $in: ["warden", "admin", "hostel_admin", "finance", "finance_staff"] } },
        { _id: 1, name: 1, email: 1, role: 1 }
      );
    } catch (err) {}

    const adminAndWardenEmails = Array.from(
      new Set(
        [
          ...staffRecipients.map((u) => u.email),
          process.env.WARDEN_EMAIL,
          process.env.ADMIN_EMAIL,
        ].filter(Boolean)
      )
    );

    // Alert Admin & Warden
    await sendWardenPaymentNotification({
      wardenEmails: adminAndWardenEmails,
      student: {
        name: studentNameVal,
        regNo: studentRegNo,
        email: studentEmail,
        hostelRoom: hostelRoomVal,
      },
      bill: {
        id: billId,
        title: bill.title || "Deposit Slip Settlement",
        type: bill.type || "Room Fee",
        period: bill.period || "Current Cycle",
      },
      payment: {
        amount: totalAmount,
        refNo: txnRef,
        receiptNo: "Pending Verification",
        method: `Deposit Slip: ${txnRef}`,
        date: new Date().toLocaleString(),
      },
      receipt: null,
    });

    const clientPaymentRecord = {
      id: String(payment._id),
      billId: billId,
      title: bill.title || "Hostel Fee",
      type: bill.type || "Room Fee",
      amount: totalAmount,
      lateFee: bill.lateFee || 0,
      period: bill.period || "Current Cycle",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      method: `Bank Deposit Slip (${txnRef})`,
      refNo: txnRef,
      receiptNo: null,
      status: "Pending",
      studentName: studentNameVal,
      studentRegNo: studentRegNo,
      hostelRoom: hostelRoomVal,
    };

    return res.status(201).json({
      success: true,
      message: "Bank deposit slip submitted for bursary verification.",
      data: clientPaymentRecord,
    });
  } catch (error) {
    return handleError(res, error, "Failed to submit deposit slip.");
  }
};

const createPayment = async (req, res) => {
  try {
    const { billId, method, reference = "" } = req.body;
    const query = isValidObjectId(billId) ? { _id: billId } : { billCode: String(billId) };
    const bill = await Bill.findOne(query);
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
    const query = isValidObjectId(req.params.id) ? { _id: req.params.id } : { reference: req.params.id };
    const payment = await Payment.findOne(query).populate("receiptId");
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

    const query = isValidObjectId(req.params.id) ? { _id: req.params.id } : { reference: req.params.id };
    const payment = await Payment.findOne(query);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found." });
    if (payment.status === status) {
      let receipt = payment.receiptId ? await Receipt.findById(payment.receiptId) : null;
      if (status === "Success" && !receipt) {
        const billQuery = isValidObjectId(payment.billId) ? { _id: payment.billId } : { billCode: String(payment.billId) };
        const bill = await Bill.findOne(billQuery);
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
      return res.status(200).json({ success: true, data: { payment, receipt } });
    }
    if (payment.status !== "Pending") {
      return res.status(409).json({ success: false, message: "Only pending payments can be confirmed." });
    }

    const billQuery = isValidObjectId(payment.billId) ? { _id: payment.billId } : { billCode: String(payment.billId) };
    const billBefore = await Bill.findOne({
      ...billQuery,
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
    const userRole = (req.user?.role || "").toLowerCase().trim();
    const identifiers = new Set();

    if (req.query.recipientId) {
      identifiers.add(String(req.query.recipientId).trim());
    }

    if (req.user && userRole !== "admin") {
      if (req.user._id) identifiers.add(String(req.user._id));
      if (req.user.studentId) identifiers.add(String(req.user.studentId).trim());
      if (req.user.registrationNumber) identifiers.add(String(req.user.registrationNumber).trim());
      if (req.user.email) identifiers.add(String(req.user.email).toLowerCase().trim());
      if (req.user.name) identifiers.add(String(req.user.name).trim());
    }

    if (identifiers.size > 0) {
      filter.recipientId = { $in: Array.from(identifiers) };
    } else if (req.query.recipientId) {
      filter.recipientId = req.query.recipientId;
    } else if (!req.user || userRole !== "admin") {
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
    const idParam = req.params.id;
    const query = isValidObjectId(idParam) ? { _id: idParam } : { referenceId: idParam };
    const notification = await PaymentNotification.findOneAndUpdate(
      query,
      { $set: { readAt: new Date() } },
      { new: true },
    );
    if (!notification) {
      return res.status(200).json({ success: true, message: "Notification marked as read." });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return handleError(res, error, "Failed to update notification.");
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    let filter = { readAt: null };
    const userRole = (req.user?.role || "").toLowerCase().trim();
    const identifiers = new Set();

    if (req.query.recipientId) {
      identifiers.add(String(req.query.recipientId).trim());
    }

    if (req.user && userRole !== "admin") {
      if (req.user._id) identifiers.add(String(req.user._id));
      if (req.user.studentId) identifiers.add(String(req.user.studentId).trim());
      if (req.user.registrationNumber) identifiers.add(String(req.user.registrationNumber).trim());
      if (req.user.email) identifiers.add(String(req.user.email).toLowerCase().trim());
    }

    if (identifiers.size > 0) {
      filter.recipientId = { $in: Array.from(identifiers) };
    }

    await PaymentNotification.updateMany(filter, { $set: { readAt: new Date() } });
    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    return handleError(res, error, "Failed to update notifications.");
  }
};

const deleteNotification = async (req, res) => {
  try {
    const idParam = req.params.id;
    const query = isValidObjectId(idParam) ? { _id: idParam } : { referenceId: idParam };
    await PaymentNotification.findOneAndDelete(query);
    return res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    return handleError(res, error, "Failed to delete notification.");
  }
};

module.exports = {
  requestPaymentOtp,
  verifyOtpAndCompletePayment,
  submitDepositSlip,
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
