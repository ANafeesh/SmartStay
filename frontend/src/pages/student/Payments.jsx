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
  ArrowUpRight,
  ShieldCheck,
  Search,
  Filter,
  Receipt,
  Bell,
  CheckCircle,
  AlertCircle,
  Printer,
  Sparkles,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";
import ReceiptModal from "../../components/payments/ReceiptModal";
import PaymentModal from "../../components/payments/PaymentModal";
import Module3TestSuite from "../../components/payments/Module3TestSuite";

const initialBills = [
  {
    id: "BIL-2026-09",
    title: "Hostel Fee & Room Rent (Semester 2)",
    period: "September 2026",
    dueDate: "05 Oct 2026",
    amount: 15000,
    lateFee: 0,
    status: "Pending",
    type: "Room Fee",
  },
  {
    id: "BIL-2026-08U",
    title: "Electricity & AC Surcharge (August)",
    period: "August 2026",
    dueDate: "20 Sep 2026",
    amount: 2800,
    lateFee: 250,
    status: "Overdue",
    type: "Utilities",
  },
  {
    id: "BIL-2026-09W",
    title: "Water Service & Common Maintenance",
    period: "September 2026",
    dueDate: "15 Oct 2026",
    amount: 1200,
    lateFee: 0,
    status: "Pending",
    type: "Maintenance",
  },
];

const initialPaymentHistory = [
  {
    id: "PAY-90421",
    billId: "BIL-2026-08",
    title: "Hostel Fee - August 2026",
    type: "Room Fee",
    amount: 15000,
    lateFee: 0,
    period: "August 2026",
    date: "02 Aug 2026",
    method: "Credit / Debit Card (Visa)",
    refNo: "TXN-88492019",
    receiptNo: "RCT-90421",
    status: "Success",
    studentName: "Ahamed Nafeesh",
    studentRegNo: "SEU/IS/22/ICT/090",
    hostelRoom: "Block B - Room 204",
  },
  {
    id: "PAY-88210",
    billId: "BIL-2026-07",
    title: "Hostel Fee - July 2026",
    type: "Room Fee",
    amount: 15000,
    lateFee: 0,
    period: "July 2026",
    date: "01 Jul 2026",
    method: "LankaPay Online Banking",
    refNo: "TXN-77310249",
    receiptNo: "RCT-88210",
    status: "Success",
    studentName: "Ahamed Nafeesh",
    studentRegNo: "SEU/IS/22/ICT/090",
    hostelRoom: "Block B - Room 204",
  },
  {
    id: "PAY-87502",
    billId: "BIL-2026-07U",
    title: "Electricity & Utility Surcharge - July",
    type: "Utilities",
    amount: 2400,
    lateFee: 0,
    period: "July 2026",
    date: "12 Jul 2026",
    method: "SmartStay Campus Wallet",
    refNo: "TXN-66190241",
    receiptNo: "RCT-87502",
    status: "Success",
    studentName: "Ahamed Nafeesh",
    studentRegNo: "SEU/IS/22/ICT/090",
    hostelRoom: "Block B - Room 204",
  },
];

const initialNotifications = [
  {
    id: "NOTIF-01",
    title: "Payment Received Successfully",
    message: "LKR 15,000 for Hostel Fee (August 2026) settled. Receipt RCT-90421 generated.",
    date: "02 Aug 2026, 11:20 AM",
    type: "success",
    refNo: "TXN-88492019",
  },
  {
    id: "NOTIF-02",
    title: "Overdue Bill Alert",
    message: "Electricity & AC Surcharge is overdue since 20 Sep 2026. A late fee of LKR 250 has been added.",
    date: "21 Sep 2026, 09:00 AM",
    type: "warning",
    refNo: "BIL-2026-08U",
  },
  {
    id: "NOTIF-03",
    title: "Bursary Subsidy Credited",
    message: "South Eastern University student welfare meal subsidy applied to account.",
    date: "15 Sep 2026, 02:15 PM",
    type: "info",
    refNo: "SUB-2026-09",
  },
];

export default function Payments() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bills, setBills] = useState(initialBills);
  const [history, setHistory] = useState(initialPaymentHistory);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const totalOutstanding = bills.reduce(
    (sum, b) => sum + b.amount + (b.lateFee || 0),
    0,
  );
  const totalPaid = history
    .filter((h) => h.status === "Success")
    .reduce((sum, h) => sum + h.amount, 0);

  const handleCompletePayment = (paymentRecord, isSuccess) => {
    setSelectedBillForPayment(null);

    // Add to history
    setHistory((prev) => [paymentRecord, ...prev]);

    if (isSuccess) {
      // Remove or mark paid
      setBills((prev) => prev.filter((b) => b.id !== paymentRecord.billId));

      const newNotif = {
        id: `NOTIF-${Date.now()}`,
        title: "Payment Successful",
        message: `Settled LKR ${paymentRecord.amount.toLocaleString()} for ${paymentRecord.title}. Receipt #${paymentRecord.receiptNo} generated.`,
        date: "Just now",
        type: "success",
        refNo: paymentRecord.refNo,
        receiptNo: paymentRecord.receiptNo,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setLatestAlert({
        type: "success",
        title: "Payment Authorized Successfully",
        message: `Your payment of LKR ${paymentRecord.amount.toLocaleString()} has been confirmed. Transaction Ref: ${paymentRecord.refNo}. Official receipt ${paymentRecord.receiptNo} is now ready to download.`,
        receiptRecord: paymentRecord,
      });
    } else {
      const newNotif = {
        id: `NOTIF-${Date.now()}`,
        title: "Payment Declined",
        message: `Transaction of LKR ${paymentRecord.amount.toLocaleString()} for ${paymentRecord.title} failed: ${paymentRecord.failureReason}.`,
        date: "Just now",
        type: "danger",
        refNo: paymentRecord.refNo,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setLatestAlert({
        type: "danger",
        title: "Payment Declined by Gateway",
        message: `Your transaction could not be completed. Reason: ${paymentRecord.failureReason}. Your bill remains pending; please retry or choose another payment method.`,
        billId: paymentRecord.billId,
      });
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receiptNo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Billing & Financial Management
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              Module 3
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Student: <strong className="text-slate-800">Ahamed Nafeesh</strong> (ID:{" "}
            <span className="font-mono font-semibold text-blue-600">
              SEU/IS/22/ICT/090
            </span>
            ) · Hostel Block B, Room 204
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("tests")}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 border border-indigo-200/80 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Module 3 Test Suite</span>
          </button>
        </div>
      </div>

      {/* Global Alert Banner */}
      {latestAlert && (
        <div
          role="status"
          className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all animate-in slide-in-from-top-2 duration-300 ${
            latestAlert.type === "success"
              ? "border-emerald-300 bg-emerald-50/95"
              : "border-rose-300 bg-rose-50/95"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs ${
                  latestAlert.type === "success"
                    ? "bg-emerald-600 shadow-emerald-600/30"
                    : "bg-rose-600 shadow-rose-600/30"
                }`}
              >
                {latestAlert.type === "success" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <AlertTriangle size={22} />
                )}
              </div>
              <div>
                <h3
                  className={`text-sm font-bold ${
                    latestAlert.type === "success"
                      ? "text-emerald-950"
                      : "text-rose-950"
                  }`}
                >
                  {latestAlert.title}
                </h3>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    latestAlert.type === "success"
                      ? "text-emerald-800"
                      : "text-rose-800"
                  }`}
                >
                  {latestAlert.message}
                </p>

                {latestAlert.receiptRecord && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReceipt(latestAlert.receiptRecord)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View Official Receipt</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setLatestAlert(null)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-black/5"
              aria-label="Dismiss banner"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "dashboard"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard size={16} />
          <span>Billing Dashboard</span>
          {bills.length > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-800 font-bold">
              {bills.length} Due
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("records")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "records"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText size={16} />
          <span>Payment Records ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("receipts")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "receipts"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Receipt size={16} />
          <span>Receipts Archive</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "notifications"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bell size={16} />
          <span>Notifications</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800 font-bold">
            {notifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("tests")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "tests"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles size={16} className="text-indigo-600" />
          <span>Module 3 Test Cases</span>
        </button>
      </div>

      {/* TAB 1: BILLING DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Total Outstanding</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <AlertTriangle size={18} />
                </div>
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-900">
                LKR {totalOutstanding.toLocaleString()}
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-rose-600">
                {bills.some((b) => b.status === "Overdue")
                  ? "Overdue notice active"
                  : "Due by next cycle"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Total Settled (Semester)</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-900">
                LKR {totalPaid.toLocaleString()}
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                {history.filter((h) => h.status === "Success").length} Official Receipts Issued
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Next Due Date</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock size={18} />
                </div>
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-900">
                {bills.length > 0 ? bills[0].dueDate : "All Cleared"}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Semester 2 Hostel Dues
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Bursary Standing</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-900">
                Good Standing
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-purple-600">
                ID Verified: SEU/IS/22/ICT/090
              </p>
            </div>
          </div>

          {/* Current Outstanding Bills Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Current Invoices & Payable Charges
                </h3>
                <p className="text-xs text-slate-500">
                  Click 'Pay Now' to launch the secure checkout simulator.
                </p>
              </div>
              <span className="rounded-xl bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                {bills.length} Open Invoices
              </span>
            </div>

            {bills.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  All Hostel Dues Settled!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You have no pending bills. Your accommodation and utility fees are completely up to date.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-slate-50/60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">
                            {bill.title}
                          </h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              bill.status === "Overdue"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {bill.status}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {bill.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Invoice ID: <span className="font-mono text-slate-700">{bill.id}</span> · Billing Cycle: {bill.period} · Due Date: <strong>{bill.dueDate}</strong>
                        </p>
                        {bill.lateFee > 0 && (
                          <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Includes overdue penalty of LKR {bill.lateFee.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Payable Amount
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          LKR {(bill.amount + (bill.lateFee || 0)).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedBillForPayment(bill)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
                      >
                        <CreditCard size={15} />
                        <span>Pay Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT RECORDS */}
      {activeTab === "records" && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search transaction ref, receipt #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {["All", "Success", "Failed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      statusFilter === st
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Transaction / Bill</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{rec.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          <span>Ref: {rec.refNo}</span>
                          {rec.receiptNo && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600 font-semibold">
                                {rec.receiptNo}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {rec.date}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {rec.method}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        LKR {rec.amount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            rec.status === "Success"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {rec.status === "Success" ? (
                          <button
                            onClick={() => setSelectedReceipt(rec)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition shadow-2xs cursor-pointer"
                          >
                            <Receipt size={14} />
                            <span>View Receipt</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {rec.failureReason || "Declined"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECEIPTS ARCHIVE */}
      {activeTab === "receipts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Bursary Payment Receipts
              </h3>
              <p className="text-xs text-slate-500">
                Verified digital receipts equipped with anti-tamper QR signatures.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history
              .filter((h) => h.status === "Success" && h.receiptNo)
              .map((rec) => (
                <div
                  key={rec.receiptNo}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                          SS
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-slate-900">
                            {rec.receiptNo}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {rec.date}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        Paid
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <p className="font-bold text-slate-900">{rec.title}</p>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Student Reg:</span>
                        <span className="font-mono text-slate-700">SEU/IS/22/ICT/090</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Gateway:</span>
                        <span className="text-slate-700">{rec.method}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="font-medium text-slate-600">Total Settled:</span>
                        <span className="text-base font-black text-slate-900">
                          LKR {rec.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-xs cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>Open Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/70">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Billing & Payment Notification Dispatch Center
              </h3>
              <p className="text-xs text-slate-500">
                Audited timeline of payment confirmations, rejection alerts, and invoice issuances.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
                    notif.type === "success"
                      ? "bg-emerald-600"
                      : notif.type === "danger"
                        ? "bg-rose-600"
                        : notif.type === "warning"
                          ? "bg-amber-600"
                          : "bg-blue-600"
                  }`}
                >
                  {notif.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : notif.type === "danger" ? (
                    <AlertTriangle size={18} />
                  ) : notif.type === "warning" ? (
                    <Clock size={18} />
                  ) : (
                    <Info size={18} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {notif.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.refNo && (
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      Ref: {notif.refNo}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MODULE 3 TEST CASES SUITE */}
      {activeTab === "tests" && (
        <Module3TestSuite />
      )}

      {/* Payment Modal */}
      {selectedBillForPayment && (
        <PaymentModal
          bill={selectedBillForPayment}
          onClose={() => setSelectedBillForPayment(null)}
          onCompletePayment={handleCompletePayment}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
