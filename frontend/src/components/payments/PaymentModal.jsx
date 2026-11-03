import { useState, useEffect } from "react";
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
  ShieldCheck,
  Banknote,
  Check,
  HelpCircle,
  Smartphone,
  ChevronRight,
  FileCheck,
} from "lucide-react";

export default function PaymentModal({
  bill,
  onClose,
  onCompletePayment,
}) {
  const { user } = useAuth();

  // Selected Channel: "card" | "lankapay" | "wallet" | "bank_slip"
  const [method, setMethod] = useState("card");

  // Card Form State
  const [cardHolder, setCardHolder] = useState(user?.name || "Ahamed Nafeesh");
  const [cardNumber, setCardNumber] = useState("4532 8921 4402 8842");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvv, setCardCvv] = useState("489");
  const [saveCard, setSaveCard] = useState(true);

  // LankaPay State
  const [selectedBank, setSelectedBank] = useState("boc");
  const [bankAccountNo, setBankAccountNo] = useState("892100412");

  // Wallet State
  const [walletPin, setWalletPin] = useState("1234");
  const walletBalance = 24500;

  // Slip Upload State
  const [slipFile, setSlipFile] = useState(null);
  const [slipRef, setSlipRef] = useState("DEP-BOC-99214");

  // Gateway Processing & 3D Secure Verification States
  // "idle" | "connecting" | "otp_challenge" | "authorizing" | "success"
  const [gatewayStep, setGatewayStep] = useState("idle");
  const [otpCode, setOtpCode] = useState("782910");
  const [otpTimer, setOtpTimer] = useState(30);

  if (!bill) return null;

  const totalAmount = bill.amount + (bill.lateFee || 0);

  // Determine Card Brand
  const cleanCardNumber = cardNumber.replace(/\s+/g, "");
  const cardBrand = cleanCardNumber.startsWith("5")
    ? "Mastercard"
    : cleanCardNumber.startsWith("3")
      ? "American Express"
      : "Visa";

  // Format Card Number into 4-digit blocks
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setCardExpiry(value);
  };

  // Begin Gateway Submission
  const initiatePayment = (e) => {
    e.preventDefault();

    if (method === "card" || method === "lankapay") {
      setGatewayStep("connecting");
      setTimeout(() => {
        setGatewayStep("otp_challenge");
      }, 900);
    } else {
      // Wallet or Bank Slip directly completes
      setGatewayStep("authorizing");
      setTimeout(() => {
        finalizePaymentSuccess();
      }, 1200);
    }
  };

  // Verify OTP and Complete Payment
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setGatewayStep("authorizing");

    setTimeout(() => {
      finalizePaymentSuccess();
    }, 1100);
  };

  const finalizePaymentSuccess = () => {
    const isSlip = method === "bank_slip";
    const txnRef = `TXN-LK${Math.floor(1000000 + Math.random() * 9000000)}`;
    const receiptNo = `RCT-${Math.floor(10000 + Math.random() * 90000)}`;

    const formattedMethod =
      method === "card"
        ? `Credit / Debit Card (${cardBrand} ••${cleanCardNumber.slice(-4) || "8842"})`
        : method === "lankapay"
          ? `LankaPay IPG (${selectedBank.toUpperCase()})`
          : method === "wallet"
            ? "SmartStay Campus Wallet"
            : "Bank Deposit Slip (BOC)";

    const paymentRecord = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      billId: bill.id,
      title: bill.title,
      type: bill.type || "Hostel Fee",
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
      status: isSlip ? "Pending" : "Success",
      studentName: user?.name || "Ahamed Nafeesh",
      studentRegNo: user?.studentId || "STD-2026-090",
      hostelRoom: "Block B - Room 204",
    };

    onCompletePayment(paymentRecord, !isSlip, isSlip, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden font-sans">
        
        {/* Gateway Security Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Lock size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  SmartStay PayGate
                </h2>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Campus Hostel Bursary Electronic Settlement Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={gatewayStep === "connecting" || gatewayStep === "authorizing"}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close payment modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D SECURE OTP CHALLENGE MODAL (Realistic Gateway Authentication) */}
        {gatewayStep === "otp_challenge" && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-4">
              <Smartphone size={28} />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3D Secure 2.0 Verification
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-extrabold text-blue-700">
                {cardBrand} Protect
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Enter One-Time Password (OTP)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              A 6-digit authentication code was transmitted to your verified mobile number ending in <strong className="text-slate-800">•••892</strong> to authorize <strong className="text-blue-600 font-bold">LKR {totalAmount.toLocaleString()}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="w-full max-w-xs mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold rounded-2xl border-2 border-blue-500 bg-blue-50/30 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="000000"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Test Sandbox OTP: <span className="font-mono font-bold text-slate-700">782910</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                <span>Authorize &amp; Complete Payment</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => setGatewayStep("idle")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Cancel and return
              </button>
            </form>
          </div>
        )}

        {/* PROCESSING & AUTHORIZING OVERLAY */}
        {(gatewayStep === "connecting" || gatewayStep === "authorizing") && (
          <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in">
            <Loader2 size={44} className="text-blue-600 animate-spin mb-4" />
            <h3 className="text-base font-extrabold text-slate-900">
              {gatewayStep === "connecting"
                ? "Securing Connection with Bank Gateway..."
                : "Authorizing Payment & Issuing Bursary E-Receipt..."}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Please do not refresh or close this window while your transaction is confirmed with LankaPay settlement systems.
            </p>
          </div>
        )}

        {/* MAIN GATEWAY PAYMENT FORM */}
        {gatewayStep === "idle" && (
          <form onSubmit={initiatePayment} className="overflow-y-auto p-6 space-y-6">
            
            {/* Bill Summary Banner */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-indigo-50/50 p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    {bill.type || "Hostel Fee"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    {bill.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bill #{bill.id} &bull; Due: {bill.dueDate} &bull; Period: {bill.period}
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
                    <AlertTriangle size={13} /> Late Payment Surcharge Included
                  </span>
                  <span className="font-bold text-rose-800">
                    + LKR {bill.lateFee.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
                Select Payment Channel
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                    method === "card"
                      ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
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
                    <div className="text-xs font-bold text-slate-900">Card Payment</div>
                    <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                  </div>
                </button>

                {/* 2. LankaPay IPG */}
                <button
                  type="button"
                  onClick={() => setMethod("lankapay")}
                  className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                    method === "lankapay"
                      ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
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
                    <div className="text-[10px] text-slate-500">Direct Bank Debit</div>
                  </div>
                </button>

                {/* 3. SmartPay Wallet */}
                <button
                  type="button"
                  onClick={() => setMethod("wallet")}
                  className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                    method === "wallet"
                      ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
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

                {/* 4. Bank Deposit Slip */}
                <button
                  type="button"
                  onClick={() => setMethod("bank_slip")}
                  className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                    method === "bank_slip"
                      ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
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
                    <div className="text-xs font-bold text-slate-900">Deposit Slip</div>
                    <div className="text-[10px] text-slate-500">Bank Transfer Slip</div>
                  </div>
                </button>
              </div>
            </div>

            {/* CHANNEL 1: CREDIT / DEBIT CARD */}
            {method === "card" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Modern Virtual Card Preview */}
                <div className="rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-blue-800 p-5 text-white shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-10 rounded-md bg-amber-400/90 shadow-xs border border-amber-300/40" />
                      <span className="text-[10px] font-mono text-slate-300">Contactless Chip</span>
                    </div>
                    <span className="text-sm font-black tracking-wider uppercase text-blue-200">
                      {cardBrand}
                    </span>
                  </div>

                  <div className="font-mono text-lg sm:text-xl font-bold tracking-widest my-3 text-slate-100">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 font-mono pt-1">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
                      <p className="font-bold text-white uppercase">{cardHolder || "STUDENT NAME"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Expires</p>
                      <p className="font-bold text-white">{cardExpiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                {/* Card Input Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      placeholder="e.g. Ahamed Nafeesh"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs pr-16"
                        placeholder="4532 8921 4402 8842"
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-extrabold text-blue-600 uppercase">
                        {cardBrand}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
                        placeholder="MM/YY"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
                        placeholder="•••"
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Save card token securely for automatic semester fee settlements
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* CHANNEL 2: LANKAPAY IPG */}
            {method === "lankapay" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={18} className="text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    LankaPay National Internet Payment Gateway
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Select your participating Sri Lankan commercial bank for instant digital settlement.
                </p>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-blue-600 focus:outline-none"
                  >
                    <option value="boc">Bank of Ceylon (BOC Online)</option>
                    <option value="combank">Commercial Bank (ComBank Direct)</option>
                    <option value="sampath">Sampath Bank (Vishwa Banking)</option>
                    <option value="hnb">Hatton National Bank (HNB Smart)</option>
                    <option value="peoples">People's Bank (Wave)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Student Bank Account / NIC Number
                  </label>
                  <input
                    type="text"
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                    placeholder="Enter account number"
                    required
                  />
                </div>
              </div>
            )}

            {/* CHANNEL 3: CAMPUS WALLET */}
            {method === "wallet" && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">
                      SmartStay Campus Student Wallet
                    </h4>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Integrated student bursary &amp; dining account
                    </p>
                  </div>
                  <span className="rounded-lg bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-1">
                    Active
                  </span>
                </div>

                <div className="rounded-xl bg-white p-3 border border-blue-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Available Balance:</span>
                  <span className="font-extrabold text-slate-900">
                    LKR {walletBalance.toLocaleString()}.00
                  </span>
                </div>

                <div className="rounded-xl bg-white p-3 border border-blue-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Balance After Settlement:</span>
                  <span className="font-extrabold text-emerald-600">
                    LKR {(walletBalance - totalAmount).toLocaleString()}.00
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Enter SmartPay 4-Digit Wallet PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={walletPin}
                    onChange={(e) => setWalletPin(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-center tracking-[0.4em] font-mono font-bold text-base text-slate-900 focus:border-blue-600 focus:outline-none"
                    placeholder="••••"
                    required
                  />
                </div>
              </div>
            )}

            {/* CHANNEL 4: BANK DEPOSIT SLIP */}
            {method === "bank_slip" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Upload size={17} className="text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Bank Deposit Slip / Wire Confirmation
                  </h4>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">Hostel Bursary Official Bank Account:</p>
                  <p>Bank: <span className="font-semibold text-slate-900">Bank of Ceylon (BOC)</span> &bull; Campus Branch</p>
                  <p>Account Number: <span className="font-mono font-bold text-slate-900">0092182041</span></p>
                  <p>Account Name: <span className="font-semibold text-slate-900">University Hostel Bursary Division</span></p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bank Reference / Slip Number
                  </label>
                  <input
                    type="text"
                    value={slipRef}
                    onChange={(e) => setSlipRef(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                    placeholder="e.g. DEP-BOC-99214"
                    required
                  />
                </div>

                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">
                  <input
                    type="file"
                    id="slip-upload"
                    className="hidden"
                    onChange={(e) => setSlipFile(e.target.files?.[0]?.name || "deposit_slip.pdf")}
                  />
                  <label
                    htmlFor="slip-upload"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer transition shadow-2xs"
                  >
                    <Upload size={14} />
                    <span>{slipFile ? `Attached: ${slipFile}` : "Upload Deposit Slip (PDF / JPG)"}</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">Receipt copy verified by hostel finance office within 2 hours.</p>
                </div>
              </div>
            )}

            {/* Gateway Security & Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>PCI-DSS Level 1 &bull; End-to-End Encryption</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <Lock size={13} />
                  <span>Pay LKR {totalAmount.toLocaleString()} Now</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
