import { useState } from "react";
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
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8842");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvv, setCardCvv] = useState("489");
  const [slipFile, setSlipFile] = useState(null);

  if (!bill) return null;

  const totalAmount = bill.amount + (bill.lateFee || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const isSuccess = simulationOutcome === "success";
      const txnRef = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const receiptNo = isSuccess
        ? `RCT-${Math.floor(10000 + Math.random() * 90000)}`
        : null;

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
        method:
          method === "card"
            ? "Credit / Debit Card (Visa)"
            : method === "lankapay"
              ? "LankaPay Online Banking"
              : method === "bank_slip"
                ? "Bank Transfer / Slip"
                : "SmartStay Campus Wallet",
        refNo: txnRef,
        receiptNo: receiptNo,
        status: isSuccess ? "Success" : "Failed",
        failureReason: isSuccess ? null : failureReason,
        studentName: "Ahamed Nafeesh",
        studentRegNo: "SEU/IS/22/ICT/090",
        hostelRoom: "Block B - Room 204",
      };

      onCompletePayment(paymentRecord, isSuccess);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Secure Bill Settlement
              </h2>
              <p className="text-xs text-slate-500">
                Module 3 Payment Gateway (SEU/IS/22/ICT/090)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Bill Summary Card */}
          <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/70 to-indigo-50/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  {bill.type || "Hostel Fee"}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {bill.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bill #{bill.id} · Due: {bill.dueDate}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Due</span>
                <span className="text-2xl font-black text-slate-900">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {bill.lateFee > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-blue-200/50 pt-2 text-xs">
                <span className="text-amber-800 font-medium flex items-center gap-1">
                  <AlertTriangle size={13} /> Includes Late Payment Surcharge
                </span>
                <span className="font-semibold text-amber-900">
                  + LKR {bill.lateFee.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  method === "card"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    method === "card"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Debit / Credit Card
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Visa, Mastercard
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("lankapay")}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  method === "lankapay"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    method === "lankapay"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    LankaPay IPG
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Direct Bank Debit
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("bank_slip")}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  method === "bank_slip"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    method === "bank_slip"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Upload size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Bank Deposit Slip
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Upload receipt copy
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("wallet")}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  method === "wallet"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    method === "wallet"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Wallet size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Campus Wallet
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bal: LKR 24,500
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Method Details Inputs */}
          {method === "card" && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                  placeholder="4532 •••• •••• 8842"
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <Upload size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Upload Bank Deposit Slip / Cheque
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Account: South Eastern University Hostel Fund · BOC A/C: 00921820
              </p>
              <input
                type="file"
                id="slip"
                className="hidden"
                onChange={(e) => setSlipFile(e.target.files?.[0]?.name || "slip.jpg")}
              />
              <label
                htmlFor="slip"
                className="mt-3 inline-block rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                {slipFile ? `Attached: ${slipFile}` : "Select Receipt File"}
              </label>
            </div>
          )}

          {/* Interactive Simulation Controls (For Demonstration & Testing Requirements) */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-purple-600" />
              <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                Module 3 Payment Simulator Control
              </h4>
            </div>
            <p className="text-[11px] text-purple-800 mb-3">
              Test both positive authorization and exception handling notifications as per Module 3 specifications.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSimulationOutcome("success")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                  simulationOutcome === "success"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                <CheckCircle2 size={14} />
                Simulate Success
              </button>

              <button
                type="button"
                onClick={() => setSimulationOutcome("failure")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                  simulationOutcome === "failure"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
                }`}
              >
                <AlertTriangle size={14} />
                Simulate Failure
              </button>
            </div>

            {simulationOutcome === "failure" && (
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                  Simulated Gateway Rejection Reason:
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
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer ${
                simulationOutcome === "success"
                  ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Gateway...</span>
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
