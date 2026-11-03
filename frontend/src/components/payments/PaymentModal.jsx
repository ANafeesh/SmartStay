import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  X,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
  Banknote,
  RotateCcw,
  Clock,
} from "lucide-react";

export default function PaymentModal({
  bill,
  onClose,
  onCompletePayment,
}) {
  const [method, setMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationOutcome, setSimulationOutcome] = useState("success");
  const [failureReason, setFailureReason] = useState("Insufficient Funds");
  const [cardNumber, setCardNumber] = useState("4532 â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ 8842");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvv, setCardCvv] = useState("489");
  const [slipFile, setSlipFile] = useState(null);
  const [cashReceiptRef, setCashReceiptRef] = useState("CSH-SEU-9921");

  if (!bill) return null;

  const totalAmount = bill.amount + (bill.lateFee || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const isSuccess = simulationOutcome === "success";
      const isPending = simulationOutcome === "pending";
      const isRefund = simulationOutcome === "refund";
      const txnRef = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const receiptNo = isSuccess
        ? `RCT-${Math.floor(10000 + Math.random() * 90000)}`
        : null;

      const formattedMethod =
        method === "card"
          ? "Credit / Debit Card (Visa)"
          : method === "lankapay"
            ? "LankaPay Online Banking"
            : method === "bank_slip"
              ? "Bank Transfer / Slip"
              : method === "cash"
                ? "Cash at Bursary Counter"
                : "SmartStay Campus Wallet";

      const paymentRecord = {
        id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
        billId: bill.id,
        title: bill.title,
        type: bill.type,
        amount: totalAmount,
        lateFee: bill.lateFee || 0,
        period: bill.period,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        method: formattedMethod,
        refNo: txnRef,
        receiptNo: receiptNo,
        status: isSuccess
          ? "Success"
          : isPending
            ? "Pending"
            : isRefund
              ? "Refunded"
              : "Failed",
        failureReason: isSuccess || isPending ? null : failureReason,
        studentName: user?.name || "Student User",
        studentRegNo: user?.studentId || "STD-2026-090",
        hostelRoom: "Block B - Room 204",
      };

      onCompletePayment(paymentRecord, isSuccess, isPending, isRefund);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Secure Bill Settlement Gateway
              </h2>
              <p className="text-xs text-slate-500">
                Campus Hostel Bursary Division
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Bill Summary Card */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 p-4 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                  {bill.type || "Hostel Fee"}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                  {bill.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bill #{bill.id} Â· Due: {bill.dueDate} Â· Period: {bill.period}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-semibold">Total Payable</span>
                <span className="text-2xl font-black text-slate-900">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {bill.lateFee > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-blue-200/60 pt-2 text-xs">
                <span className="text-rose-700 font-semibold flex items-center gap-1">
                  <AlertTriangle size={13} /> Includes Late Payment Overdue Surcharge
                </span>
                <span className="font-bold text-rose-800">
                  + LKR {bill.lateFee.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Payment Method Selector (Requirement 7) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Payment Channel
              </label>
              <span className="text-[10px] text-slate-400">Req 7: Cash, Bank Transfer, Online</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Card */}
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                  method === "card"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    method === "card" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <CreditCard size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                  <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                </div>
              </button>

              {/* Option 2: LankaPay */}
              <button
                type="button"
                onClick={() => setMethod("lankapay")}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                  method === "lankapay"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    method === "lankapay" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">LankaPay IPG</div>
                  <div className="text-[10px] text-slate-500">Internet Banking</div>
                </div>
              </button>

              {/* Option 3: Bank Slip */}
              <button
                type="button"
                onClick={() => setMethod("bank_slip")}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                  method === "bank_slip"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    method === "bank_slip" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Upload size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Bank Deposit Slip</div>
                  <div className="text-[10px] text-slate-500">Upload receipt copy</div>
                </div>
              </button>

              {/* Option 4: Cash Counter */}
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                  method === "cash"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    method === "cash" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Banknote size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cash Counter</div>
                  <div className="text-[10px] text-slate-500">Hostel Bursary Hall</div>
                </div>
              </button>

              {/* Option 5: Campus Wallet */}
              <button
                type="button"
                onClick={() => setMethod("wallet")}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                  method === "wallet"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    method === "wallet" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Wallet size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Campus Wallet</div>
                  <div className="text-[10px] text-slate-500">Bal: LKR 24,500</div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Method Inputs */}
          {method === "card" && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                  placeholder="4532 â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ 8842"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                    placeholder="09/28"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                    placeholder="489"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {method === "bank_slip" && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <Upload size={24} className="mx-auto text-blue-600 mb-2" />
              <p className="text-xs font-bold text-slate-800">
                Upload Bank Deposit Slip / Online Transfer Slip
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Hostel Bursary Account · Bank of Ceylon (BOC) A/C: 00921820
              </p>
              <input
                type="file"
                id="slip"
                className="hidden"
                onChange={(e) => setSlipFile(e.target.files?.[0]?.name || "boc_slip_2026.pdf")}
              />
              <label
                htmlFor="slip"
                className="mt-3 inline-block rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                {slipFile ? `Attached: ${slipFile}` : "Choose Receipt / Slip File"}
              </label>
            </div>
          )}

          {method === "cash" && (
            <div className="rounded-2xl border border-slate-200 bg-amber-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Banknote size={16} className="text-amber-700" />
                <h4 className="text-xs font-bold text-amber-950">Bursary Cashier Receipt Terminal</h4>
              </div>
              <p className="text-[11px] text-amber-800">
                Payment made directly at Campus Student Welfare &amp; Bursary Office Counter.
              </p>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Cashier Counter Receipt Ref
                </label>
                <input
                  type="text"
                  value={cashReceiptRef}
                  onChange={(e) => setCashReceiptRef(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Interactive Simulation Controls (Proposal Requirements 9, 10, 11) */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Payment Status Simulator
                </h4>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Requirements 9 &amp; 10
              </span>
            </div>
            <p className="text-[11px] text-purple-800 mb-3">
              Test successful authorization, decline rejection notifications, pending verification, and refund flows.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSimulationOutcome("success")}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-bold transition cursor-pointer ${
                  simulationOutcome === "success"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                <CheckCircle2 size={13} />
                <span>Success</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulationOutcome("failure")}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-bold transition cursor-pointer ${
                  simulationOutcome === "failure"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
                }`}
              >
                <AlertTriangle size={13} />
                <span>Decline</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulationOutcome("pending")}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-bold transition cursor-pointer ${
                  simulationOutcome === "pending"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
                }`}
              >
                <Clock size={13} />
                <span>Pending</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulationOutcome("refund")}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-bold transition cursor-pointer ${
                  simulationOutcome === "refund"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-indigo-800 border border-indigo-200 hover:bg-indigo-50"
                }`}
              >
                <RotateCcw size={13} />
                <span>Refunded</span>
              </button>
            </div>

            {simulationOutcome === "failure" && (
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                  Gateway Rejection Reason:
                </label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Insufficient Funds">
                    Insufficient Account Balance (ERR_FUNDS_402)
                  </option>
                  <option value="Bank Gateway Timeout">
                    Issuer Gateway Timeout (ERR_GATEWAY_504)
                  </option>
                  <option value="3D Secure Verification Failed">
                    3D Secure OTP Verification Failed (ERR_OTP_401)
                  </option>
                  <option value="Daily Transaction Limit Exceeded">
                    Exceeded Daily Student Card Limit (ERR_LIMIT_403)
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer ${
                simulationOutcome === "success"
                  ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/25"
                  : simulationOutcome === "failure"
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/25"
                    : simulationOutcome === "pending"
                      ? "bg-amber-600 hover:bg-amber-500 shadow-amber-500/25"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Transmitting to Gateway...</span>
                </>
              ) : (
                <>
                  <span>
                    Pay LKR {totalAmount.toLocaleString()} Now
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
