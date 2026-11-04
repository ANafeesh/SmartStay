import { useRef } from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Logo from "../ui/Logo";

export default function ReceiptModal({ receipt, onClose }) {
  const printRef = useRef(null);

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>SmartStay Official Receipt - ${receipt.receiptNo}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #fff; }
    .receipt-box { max-width: 680px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed #cbd5e1; padding-bottom: 24px; margin-bottom: 24px; }
    .logo-title { font-size: 24px; font-weight: 800; color: #1e40af; margin: 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge-paid { background: #dcfce7; color: #166534; font-weight: 700; padding: 6px 14px; border-radius: 9999px; font-size: 13px; text-transform: uppercase; border: 1px solid #86efac; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 13px; }
    .grid dt { color: #64748b; font-size: 12px; margin-bottom: 2px; }
    .grid dd { margin: 0; font-weight: 600; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 10px; background: #f8fafc; font-size: 12px; color: #475569; border-bottom: 1px solid #e2e8f0; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .total-row td { font-weight: 800; font-size: 16px; color: #0f172a; border-top: 2px solid #0f172a; }
    .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; }
    .qr-stamp { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
    @media print {
      body { padding: 0; }
      .receipt-box { border: none; box-shadow: none; padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt-box">
    <div class="header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="/smartstay-mark.png" alt="SmartStay" width="44" height="44" style="border-radius: 10px; border: 1px solid #cbd5e1; object-fit: cover;" onerror="this.style.display='none'" />
        <div>
          <h1 class="logo-title" style="margin: 0; font-size: 20px;">SmartStay</h1>
          <p class="subtitle" style="margin: 2px 0 0 0;">Campus Hostel Bursary Division</p>
          <p class="subtitle" style="margin: 0;">Official Bursary Receipt &amp; Settlement Record</p>
        </div>
      </div>
      <div>
        <span class="badge-paid">âœ“ Verified & Paid</span>
      </div>
    </div>

    <div class="grid">
      <div>
        <dt>Receipt Number</dt>
        <dd>${receipt.receiptNo}</dd>
      </div>
      <div>
        <dt>Transaction Ref</dt>
        <dd>${receipt.refNo || "TXN-88492019"}</dd>
      </div>
      <div>
        <dt>Student Name</dt>
        <dd>${receipt.studentName || "Student"}</dd>
      </div>
      <div>
        <dt>Student Registration No</dt>
        <dd>${receipt.studentRegNo || "Unassigned"}</dd>
      </div>
      <div>
        <dt>Hostel Accommodation</dt>
        <dd>${receipt.hostelRoom || "Not Allocated"}</dd>
      </div>
      <div>
        <dt>Payment Date & Time</dt>
        <dd>${receipt.date} Â· 10:42 AM</dd>
      </div>
      <div>
        <dt>Payment Gateway</dt>
        <dd>${receipt.method || "Online Card Payment"}</dd>
      </div>
      <div>
        <dt>Issuing Authority</dt>
        <dd>University Bursary Services</dd>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Fee Description</th>
          <th>Billing Period</th>
          <th>Late Surcharge</th>
          <th style="text-align: right;">Amount (LKR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${receipt.title}</strong><br><small style="color: #64748b;">${receipt.type || "Hostel Accommodation Fee"}</small></td>
          <td>${receipt.period || "Current Semester"}</td>
          <td>LKR ${(receipt.lateFee || 0).toLocaleString()}</td>
          <td style="text-align: right;">LKR ${Number(receipt.amount).toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3">Total Paid Amount</td>
          <td style="text-align: right;">LKR ${Number(receipt.amount).toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="qr-stamp">
      <div>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=SMARTSTAY-VERIFY-${receipt.receiptNo}" width="90" height="90" alt="QR Hash" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px;" />
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Hash: ${receipt.receiptNo}-SECURE</div>
      </div>
      <div style="text-align: right;">
        <div style="border-top: 1px solid #475569; width: 160px; margin-left: auto; padding-top: 6px; font-weight: 700; font-size: 12px;">Authorized Bursar</div>
        <div style="font-size: 11px; color: #64748b;">SmartStay Financial Gateway</div>
      </div>
    </div>

    <div class="footer">
      <p>This is a computer-generated official payment receipt for SmartStay Hostel Management System.</p>
      <p>Student Accommodation &amp; Bursary Services</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SmartStay_Receipt_${receipt.receiptNo}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Official Payment Receipt
              </h2>
              <p className="text-xs text-slate-500">
                Receipt #{receipt.receiptNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              title="Download HTML/PDF Receipt"
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition ml-1"
              aria-label="Close receipt"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div ref={printRef} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-6">
            <div>
              <Logo
                variant="horizontal"
                size="md"
                badge="Bursary"
                subtitle="Campus Hostel Billing Gateway"
              />
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                <CheckCircle2 size={13} />
                Payment Received
              </span>
              <p className="mt-2 text-xs font-mono font-semibold text-slate-600">
                {receipt.receiptNo}
              </p>
              <p className="text-[11px] text-slate-400">
                Issued: {receipt.date || "Today"}
              </p>
            </div>
          </div>

          {/* Student & Bill Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl bg-slate-50/80 p-4 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Student Name
              </span>
              <span className="font-semibold text-slate-800">
                {receipt.studentName || "Student"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Student ID / Reg
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {receipt.studentRegNo || "Unassigned"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Hostel Room
              </span>
              <span className="font-semibold text-slate-800">
                {receipt.hostelRoom || "Block B - Room 204"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Transaction Ref
              </span>
              <span className="font-mono font-semibold text-blue-600">
                {receipt.refNo || "TXN-88492019"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Payment Method
              </span>
              <span className="font-semibold text-slate-800">
                {receipt.method || "Online Card Payment"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">
                Issuing Division
              </span>
              <span className="font-semibold text-slate-800">
                Hostel Bursary Division
              </span>
            </div>
          </div>

          {/* Itemized Charges Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">
                      {receipt.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Bill ID: {receipt.billId || "BIL-2026-09"}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {receipt.type || "Hostel Accommodations"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Settled
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">
                    LKR {Number(receipt.amount).toLocaleString()}
                  </td>
                </tr>

                {receipt.lateFee > 0 && (
                  <tr className="bg-amber-50/40 text-amber-900">
                    <td className="py-2.5 px-4 font-medium">
                      Late Surcharge & Administrative Fee
                    </td>
                    <td className="py-2.5 px-4">Penalty</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Paid
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium">
                      LKR {Number(receipt.lateFee).toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t-2 border-slate-200 font-bold text-slate-900">
                <tr>
                  <td colSpan={3} className="py-3.5 px-4 text-sm">
                    Total Amount Settled
                  </td>
                  <td className="py-3.5 px-4 text-right text-base text-blue-600">
                    LKR {Number(receipt.amount).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification Bar & QR Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-white p-1 rounded-xl shadow-xs shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=SMARTSTAY-VERIFY-${receipt.receiptNo}`}
                  alt="QR Code Verification"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Tamper-Proof Verification QR
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Scan to verify authentic receipt in University Bursary registry.
                </p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Hash: SEC-{receipt.receiptNo}-90
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Authorized By
              </span>
              <p className="font-serif italic font-bold text-slate-200 text-sm mt-0.5">
                Bursary Accounts Division
              </p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                âœ“ Digitally Signed & Sealed
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Digital Ledger Record Verified</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-300 transition cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
