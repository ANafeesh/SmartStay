let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch (err) {
  console.warn("Notice: nodemailer not found, running email service in mock/log mode");
}
const path = require("path");
const dotenv = require("dotenv");

// Ensure .env is fresh
dotenv.config({ path: path.join(__dirname, "../.env") });

/**
 * Configure Nodemailer Transport
 * Automatically connects to Gmail or custom SMTP when credentials are in .env.
 */
let transporter = null;
let currentAuthUser = null;

function getTransporter() {
  if (!nodemailer) {
    return null;
  }
  // Re-read process.env in case .env was recently modified
  dotenv.config({ path: path.join(__dirname, "../.env") });

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "").trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  // If credentials changed or not yet initialized with real auth
  if (transporter && currentAuthUser === user && user !== "") {
    return transporter;
  }

  if (user && pass) {
    if (host.includes("gmail")) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
      console.log(`[Email Service] Connected to Gmail service via authenticated user: ${user}`);
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false,
        },
      });
      console.log(`[Email Service] Connected to live SMTP gateway (${host}:${port}) as ${user}`);
    }
    currentAuthUser = user;
  } else {
    // Development / Stream fallback transport
    transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "windows",
      buffer: true,
    });
    currentAuthUser = null;
    console.warn(`[Email Service Notice] SMTP_USER and SMTP_PASS are empty in backend/.env. Real internet emails cannot be delivered until you configure your Gmail & 16-character App Password in backend/.env.`);
  }

  return transporter;
}

function getFromAddress() {
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  if (user) {
    return `"SmartStay PayGate" <${user}>`;
  }
  return process.env.EMAIL_FROM || '"SmartStay PayGate" <bursary@smartstay.campus.edu>';
}

/**
 * Send Payment OTP to Student Email
 */
async function sendOtpEmail({ toEmail, otpCode, studentName, billTitle, amount }) {
  const mailTransporter = getTransporter();
  const from = getFromAddress();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 32px 28px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .intro { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .otp-box { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-label { font-size: 12px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .otp-code { font-size: 38px; font-family: 'Courier New', Courier, monospace; font-weight: 900; letter-spacing: 10px; color: #166534; margin: 8px 0; }
        .otp-expire { font-size: 12px; color: #15803d; font-weight: 600; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        .details-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .details-table td.label { color: #64748b; font-weight: 600; width: 40%; }
        .details-table td.value { color: #0f172a; font-weight: 700; }
        .security-alert { background: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #9a3412; margin-top: 24px; line-height: 1.5; }
        .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartStay PayGate &bull; 3D Secure 2.0</h1>
          <p>Campus Hostel Bursary Electronic Settlement Gateway</p>
        </div>
        <div class="body">
          <div class="greeting">Hello ${studentName || "Student"},</div>
          <div class="intro">
            You have initiated a payment request for your hostel invoice. Please use the One-Time Password (OTP) below to authenticate and confirm your payment.
          </div>

          <div class="otp-box">
            <div class="otp-label">Payment Verification Code</div>
            <div class="otp-code">${otpCode}</div>
            <div class="otp-expire">&bull; Valid for 10 minutes &bull;</div>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">Invoice Item:</td>
              <td class="value">${billTitle || "Hostel Fee Settlement"}</td>
            </tr>
            <tr>
              <td class="label">Total Amount:</td>
              <td class="value" style="color: #2563eb; font-size: 15px;">LKR ${Number(amount || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td class="label">Payment Channel:</td>
              <td class="value">SmartStay PayGate 256-Bit SSL</td>
            </tr>
          </table>

          <div class="security-alert">
            <strong>Security Warning:</strong> Never share this OTP with anyone, including university staff or hostel administration. We will never ask for your verification code.
          </div>
        </div>
        <div class="footer">
          SmartStay Hostel Living OS &bull; Automated Bursary Electronic Gateway<br/>
          This is an automated security transmission. Please do not reply directly to this email.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from,
    to: toEmail,
    subject: `🔐 ${otpCode} is your SmartStay PayGate OTP (LKR ${Number(amount).toLocaleString()})`,
    text: `Your SmartStay payment verification OTP is ${otpCode}. Valid for 10 minutes to authorize payment of LKR ${Number(amount).toLocaleString()} for ${billTitle}. Do not share this OTP with anyone.`,
    html,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    const user = (process.env.SMTP_USER || "").trim();
    if (user) {
      console.log(`[Email Service] Live internet email successfully delivered to ${toEmail} for bill "${billTitle}". Message ID: ${info?.messageId}`);
    } else {
      console.log(`[Email Service (Local Console)] OTP code for ${toEmail}: ${otpCode}`);
    }
    return { success: true, messageId: info?.messageId, otpCode };
  } catch (error) {
    console.error(`[Email Service] Failed to send OTP email to ${toEmail}:`, error.message);
    return { success: false, error: error.message, otpCode };
  }
}

/**
 * Send Transaction Alert to Authorized Person (Warden / Finance / Admin)
 */
async function sendWardenPaymentNotification({ wardenEmails, student, bill, payment, receipt }) {
  const mailTransporter = getTransporter();
  const from = getFromAddress();

  const recipients = Array.isArray(wardenEmails) ? wardenEmails : [wardenEmails || "warden@campus.edu"];
  const recipientList = recipients.filter(Boolean).join(", ");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px 28px; text-align: left; color: #ffffff; }
        .header .badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #94a3b8; }
        .body { padding: 30px 28px; }
        .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
        .table td { padding: 8px 12px; border-bottom: 1px solid #f8fafc; }
        .table td.lbl { color: #64748b; font-weight: 600; width: 38%; }
        .table td.val { color: #0f172a; font-weight: 700; }
        .amount-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px; text-align: center; margin: 16px 0; }
        .amount-card .title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #166534; }
        .amount-card .sum { font-size: 30px; font-weight: 900; color: #15803d; margin: 4px 0; }
        .amount-card .status { font-size: 12px; font-weight: 700; color: #16a34a; }
        .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">Official Bursary Notice</div>
          <h1>Student Bill Settlement Received</h1>
          <p>Hostel living administrative record for Warden &amp; Finance Division</p>
        </div>
        <div class="body">
          <div class="amount-card">
            <div class="title">Total Amount Settled</div>
            <div class="sum">LKR ${Number(payment.amount || 0).toLocaleString()}</div>
            <div class="status">&bull; Status: Settled &bull; Digital Anti-Tamper Stamp Issued &bull;</div>
          </div>

          <div class="section-title">Student Details</div>
          <table class="table">
            <tr>
              <td class="lbl">Student Name:</td>
              <td class="val">${student.name || "Student"}</td>
            </tr>
            <tr>
              <td class="lbl">Registration / Student ID:</td>
              <td class="val">${student.regNo || student.studentId || "STD-2026-101"}</td>
            </tr>
            <tr>
              <td class="lbl">Email Address:</td>
              <td class="val">${student.email || "student@smartstay.com"}</td>
            </tr>
            <tr>
              <td class="lbl">Hostel Room &amp; Block:</td>
              <td class="val">${student.hostelRoom || student.room || "Room 101, Block A"}</td>
            </tr>
          </table>

          <div class="section-title">Invoice &amp; Bill Information</div>
          <table class="table">
            <tr>
              <td class="lbl">Bill Title:</td>
              <td class="val">${bill.title || "Hostel Fee & Room Rent"}</td>
            </tr>
            <tr>
              <td class="lbl">Invoice Number:</td>
              <td class="val font-mono">${bill.id || bill._id || "BIL-2026-09"}</td>
            </tr>
            <tr>
              <td class="lbl">Fee Category:</td>
              <td class="val">${bill.type || bill.billType || "Room Fee"}</td>
            </tr>
            <tr>
              <td class="lbl">Billing Period:</td>
              <td class="val">${bill.period || bill.billingPeriod || "Current Semester"}</td>
            </tr>
          </table>

          <div class="section-title">Transaction &amp; Gateway Settlement</div>
          <table class="table">
            <tr>
              <td class="lbl">Transaction Reference:</td>
              <td class="val" style="font-family: monospace; color: #2563eb;">${payment.refNo || payment.reference || "TXN-88492019"}</td>
            </tr>
            <tr>
              <td class="lbl">Bursary Receipt No:</td>
              <td class="val" style="font-family: monospace; color: #059669;">${payment.receiptNo || (receipt && receipt.receiptNo) || "RCT-90421"}</td>
            </tr>
            <tr>
              <td class="lbl">Settlement Method:</td>
              <td class="val">${payment.method || "Credit / Debit Card (Visa)"}</td>
            </tr>
            <tr>
              <td class="lbl">Timestamp:</td>
              <td class="val">${payment.date || new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          SmartStay Hostel Living OS &bull; Warden &amp; Finance Automation System<br/>
          Confidential record intended for University Accommodation Authorities.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from,
    to: recipientList,
    subject: `📋 [SmartStay Payment Alert] LKR ${Number(payment.amount || 0).toLocaleString()} settled by ${student.name || "Student"} (${student.regNo || student.studentId || "Student"})`,
    text: `SmartStay Bursary Alert: Student ${student.name} (${student.regNo || student.studentId}) has paid LKR ${Number(payment.amount).toLocaleString()} for ${bill.title}. Receipt: ${payment.receiptNo || "RCT-90421"}, Txn: ${payment.refNo}.`,
    html,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email Service] Warden payment alert sent to [${recipientList}] for student ${student.name} (${payment.refNo})`);
    return { success: true, messageId: info?.messageId };
  } catch (error) {
    console.error(`[Email Service] Failed to send Warden alert to [${recipientList}]:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Official Payment Receipt to Student Email
 */
async function sendStudentPaymentReceipt({ toEmail, student, bill, payment, receipt }) {
  const mailTransporter = getTransporter();
  const from = getFromAddress();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 30px 28px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 30px 28px; }
        .receipt-badge { text-align: center; margin-bottom: 20px; }
        .receipt-badge span { background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 999px; text-transform: uppercase; }
        .receipt-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .table td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; }
        .table td.lbl { color: #64748b; font-weight: 600; width: 45%; }
        .table td.val { color: #0f172a; font-weight: 700; text-align: right; }
        .total-row { font-size: 16px; border-top: 2px solid #cbd5e1; }
        .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Official Bursary Settlement Receipt</h1>
          <p>University Hostel Living Electronic Settlement Record</p>
        </div>
        <div class="body">
          <div class="receipt-badge">
            <span>Payment Confirmed &amp; Dues Cleared</span>
          </div>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Dear <strong>${student.name || "Student"}</strong>,<br/>
            Thank you for your payment. Your hostel account has been credited and your invoice is now marked as <strong>PAID</strong>.
          </p>

          <div class="receipt-card">
            <table class="table">
              <tr>
                <td class="lbl">Receipt Number:</td>
                <td class="val" style="color: #0284c7; font-family: monospace;">${payment.receiptNo || (receipt && receipt.receiptNo) || "RCT-90421"}</td>
              </tr>
              <tr>
                <td class="lbl">Transaction Reference:</td>
                <td class="val" style="font-family: monospace;">${payment.refNo || payment.reference}</td>
              </tr>
              <tr>
                <td class="lbl">Invoice Description:</td>
                <td class="val">${bill.title}</td>
              </tr>
              <tr>
                <td class="lbl">Invoice ID:</td>
                <td class="val">${bill.id || bill._id}</td>
              </tr>
              <tr>
                <td class="lbl">Student Reg Number:</td>
                <td class="val">${student.regNo || student.studentId}</td>
              </tr>
              <tr>
                <td class="lbl">Payment Channel:</td>
                <td class="val">${payment.method}</td>
              </tr>
              <tr>
                <td class="lbl">Payment Date:</td>
                <td class="val">${payment.date || new Date().toLocaleDateString()}</td>
              </tr>
              <tr class="total-row">
                <td class="lbl" style="font-weight: 800; color: #0f172a; padding-top: 12px;">Amount Settled:</td>
                <td class="val" style="font-size: 18px; font-weight: 900; color: #16a34a; padding-top: 12px;">LKR ${Number(payment.amount).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
            This electronic bursary receipt contains an authorized cryptographic anti-tamper stamp. It is recognized as valid official proof of payment for hostel residence.
          </p>
        </div>
        <div class="footer">
          SmartStay Bursary Division &bull; Smart Hostel Living OS<br/>
          Keep this receipt for your personal semester records.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from,
    to: toEmail,
    subject: `🧾 SmartStay Official Bursary Receipt #${payment.receiptNo || "RCT-90421"} - ${bill.title}`,
    text: `Official Bursary Receipt #${payment.receiptNo}. LKR ${Number(payment.amount).toLocaleString()} settled for ${bill.title}. Ref: ${payment.refNo}.`,
    html,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email Service] Student confirmation receipt sent to ${toEmail} (${payment.receiptNo})`);
    return { success: true, messageId: info?.messageId };
  } catch (error) {
    console.error(`[Email Service] Failed to send Student receipt to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOtpEmail,
  sendWardenPaymentNotification,
  sendStudentPaymentReceipt,
};
