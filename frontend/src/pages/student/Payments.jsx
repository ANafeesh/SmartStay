import { useState } from "react";
import {
  CreditCard,
  Download,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Building2,
  FileText,
  Bell,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const initialBills = [
  {
    id: "BIL-2026-09",
    title: "Hostel Fee & Room Rent",
    period: "September 2026",
    dueDate: "05 Oct 2026",
    amount: 15000,
    lateFee: 0,
    status: "Pending",
    type: "Room Fee",
  },
  {
    id: "BIL-2026-08U",
    title: "Electricity & Water Surcharge",
    period: "August 2026",
    dueDate: "20 Sep 2026",
    amount: 2800,
    lateFee: 250,
    status: "Overdue",
    type: "Utilities",
  },
];

const paymentHistory = [
  {
    id: "PAY-90421",
    billId: "BIL-2026-08",
    title: "Hostel Fee - August 2026",
    amount: 15000,
    date: "02 Aug 2026",
    method: "Card Payment (Visa)",
    refNo: "TXN-88492019",
    status: "Success",
  },
  {
    id: "PAY-88210",
    billId: "BIL-2026-07",
    title: "Hostel Fee - July 2026",
    amount: 15000,
    date: "01 Jul 2026",
    method: "Bank Transfer",
    refNo: "TXN-77310249",
    status: "Success",
  },
];

function Payments() {
  const [bills, setBills] = useState(initialBills);
  const [history, setHistory] = useState(paymentHistory);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentNotification, setPaymentNotification] = useState(null);

  // Form Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedBill) return;

    const totalAmount = selectedBill.amount + selectedBill.lateFee;
    const txnRef = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const receiptNo = `RCT-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create New Payment History Record
    const newPayment = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      billId: selectedBill.id,
      title: selectedBill.title,
      amount: totalAmount,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      method:
        paymentMethod === "card"
          ? "Online Card Payment"
          : paymentMethod === "bank"
            ? "Bank Transfer"
            : "Cash Deposit",
      refNo: txnRef,
      receiptNo: receiptNo,
      status: "Success",
    };

    // Update Bills state
    setBills(bills.filter((b) => b.id !== selectedBill.id));
    setHistory([newPayment, ...history]);

    // Set Triggered Payment Notification
    setPaymentNotification({
      title: "Payment Successful!",
      amount: totalAmount,
      date: newPayment.date,
      method: newPayment.method,
      txnRef: txnRef,
      receiptNo: receiptNo,
      billTitle: selectedBill.title,
    });

    setSelectedBill(null);
  };

  const totalOutstanding = bills.reduce(
    (sum, b) => sum + b.amount + b.lateFee,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Payments & Fee Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View outstanding bills, make online payments, and download official
            receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 border border-blue-200/60">
            <ShieldCheck size={16} />
            Secure Payment Gateway Active
          </span>
        </div>
      </div>

      {/* Payment Success/Status Alert Banner */}
      {paymentNotification && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-xs transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  {paymentNotification.title}
                </h3>
                <p className="mt-0.5 text-xs text-emerald-800">
                  Your payment for{" "}
                  <strong>{paymentNotification.billTitle}</strong> of LKR{" "}
                  {paymentNotification.amount.toLocaleString()} has been
                  processed.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-emerald-900">
                  <span>
                    Ref: <strong>{paymentNotification.txnRef}</strong>
                  </span>
                  <span>
                    Receipt #: <strong>{paymentNotification.receiptNo}</strong>
                  </span>
                  <span>
                    Method: <strong>{paymentNotification.method}</strong>
                  </span>
                  <span>
                    Date: <strong>{paymentNotification.date}</strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setPaymentNotification(null)}
              className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Stat Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <DollarSign size={20} />
            </div>
            <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              Action Required
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            Total Outstanding Balance
          </p>
          <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
            LKR {totalOutstanding.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock size={20} />
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
              Pending Bills
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            Unpaid Invoices
          </p>
          <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
            {bills.length} Invoices
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Up to Date
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            Last Payment Amount
          </p>
          <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
            LKR {history[0]?.amount.toLocaleString() || 0}
          </h3>
        </div>
      </div>

      {/* Active Unpaid Bills Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">
            Pending & Due Invoices
          </h2>
          <p className="text-xs text-slate-500">
            Select a bill to make an instant payment
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {bills.length > 0 ? (
            bills.map((bill) => (
              <div
                key={bill.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      bill.status === "Overdue"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <FileText size={22} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        {bill.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {bill.period}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {bill.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        Due Date:{" "}
                        <strong className="text-slate-700">
                          {bill.dueDate}
                        </strong>
                      </span>
                      {bill.lateFee > 0 && (
                        <span className="text-rose-600 font-semibold">
                          + LKR {bill.lateFee} Late Fee Included
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 border-t sm:border-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <p className="text-base font-bold text-slate-900">
                      LKR {(bill.amount + bill.lateFee).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedBill(bill)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition"
                  >
                    <span>Pay Now</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              🎉 All hostel fees and utility bills are fully paid!
            </div>
          )}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Payment History & Receipts
            </h2>
            <p className="text-xs text-slate-500">
              Review completed transactions and download receipts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-3.5">Transaction Ref</th>
                <th className="px-6 py-3.5">Bill Details</th>
                <th className="px-6 py-3.5">Payment Date</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {history.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {tx.refNo}
                  </td>
                  <td className="px-6 py-4">{tx.title}</td>
                  <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4">{tx.method}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    LKR {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        alert(
                          `Downloading official receipt ${tx.receiptNo || tx.id}...`,
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                    >
                      <Download size={14} />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONLINE CHECKOUT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Complete Payment
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedBill.title} - {selectedBill.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              {/* Bill Breakdown Summary */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fee Amount</span>
                  <span className="font-semibold text-slate-800">
                    LKR {selectedBill.amount.toLocaleString()}
                  </span>
                </div>
                {selectedBill.lateFee > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Late Payment Surcharge</span>
                    <span className="font-semibold">
                      + LKR {selectedBill.lateFee}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Payable</span>
                  <span>
                    LKR{" "}
                    {(
                      selectedBill.amount + selectedBill.lateFee
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "card",
                      label: "Credit/Debit Card",
                      icon: CreditCard,
                    },
                    { id: "bank", label: "Bank Transfer", icon: Building2 },
                    { id: "cash", label: "Cash / Counter", icon: DollarSign },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition ${
                          paymentMethod === m.id
                            ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-[11px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Form */}
              {paymentMethod === "card" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Instructions */}
              {paymentMethod === "bank" && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">
                    Bank Transfer Details:
                  </p>
                  <p>Bank: Bank of Ceylon (BOC)</p>
                  <p>Account Name: SmartStay Hostel Operations</p>
                  <p>Account No: 7048291038</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    *Please use bill ID ({selectedBill.id}) as payment
                    reference.
                  </p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBill(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-500"
                >
                  Pay LKR{" "}
                  {(
                    selectedBill.amount + selectedBill.lateFee
                  ).toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
