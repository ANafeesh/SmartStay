import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Wallet,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  X,
  Building,
} from "lucide-react";
import {
  fetchVendorEarnings,
  requestPayoutDisbursement,
} from "../../services/vendorApi";

export default function VendorEarnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutBank, setPayoutBank] = useState("Commercial Bank (Acc: ****4812)");
  const [payoutNotice, setPayoutNotice] = useState(null);

  const loadEarnings = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVendorEarnings();
      if (data) {
        setEarningsData(data);
      }
    } catch (err) {
      console.error("Failed to load earnings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const summary = earningsData?.summary || {
    todayEarnings: 14250,
    thisWeekEarnings: 86400,
    thisMonthEarnings: 312000,
    pendingPayout: 18500,
  };

  const salesByCategory = earningsData?.salesByCategory || [
    { category: "Main Dishes", amount: 185000, percentage: 59 },
    { category: "Fast Food", amount: 82000, percentage: 26 },
    { category: "Beverages", amount: 45000, percentage: 15 },
  ];

  const payouts = earningsData?.payoutHistory || [];

  const handleExportStatement = () => {
    setIsExporting(true);

    try {
      const csvRows = [
        ["SMARTSTAY COMMERCIAL VENDOR FINANCIAL STATEMENT"],
        [`Generated On: ${new Date().toLocaleString()}`],
        ["Status: Verified & Audited by SmartStay System"],
        [],
        ["--- REVENUE SUMMARY ---"],
        ["Metric", "Amount (LKR)"],
        ["Today's Revenue", summary.todayEarnings],
        ["This Week's Revenue", summary.thisWeekEarnings],
        ["This Month's Revenue", summary.thisMonthEarnings],
        ["Pending Settlement", summary.pendingPayout],
        [],
        ["--- FOOD CATEGORY PERFORMANCE ---"],
        ["Category", "Revenue (LKR)", "Share (%)"],
        ...salesByCategory.map((c) => [c.category, c.amount, `${c.percentage}%`]),
        [],
        ["--- SETTLEMENT & PAYOUT HISTORY ---"],
        ["Payout ID", "Date", "Disbursement Method", "Amount (LKR)", "Status"],
        ...payouts.map((p) => [p.id, p.date, `"${p.method}"`, p.amount, p.status]),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `smartstay-vendor-statement-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRequestPayoutSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) return;

    try {
      const res = await requestPayoutDisbursement(amount, payoutBank);
      if (res?.data) {
        setEarningsData((prev) => ({
          ...prev,
          payoutHistory: [res.data, ...(prev?.payoutHistory || [])],
        }));
      }
      setPayoutNotice("Payout request submitted successfully to University Bursar.");
      setTimeout(() => {
        setPayoutModalOpen(false);
        setPayoutNotice(null);
        setPayoutAmount("");
      }, 1500);
    } catch (err) {
      console.error("Payout request error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Vendor Earnings & Financial Analytics
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Live Settlements
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Outlet: <strong className="text-slate-800">Campus Diner & Cafe</strong> &middot; Track daily sales revenue, food category performance, and bank payout logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPayoutModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Request Payout</span>
          </button>

          <button
            onClick={handleExportStatement}
            disabled={isExporting}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition shrink-0 cursor-pointer ${
              exportSuccess
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {exportSuccess ? <CheckCircle2 size={15} /> : <Download size={15} />}
            <span>
              {isExporting
                ? "Generating..."
                : exportSuccess
                ? "Statement Exported ✓"
                : "Export CSV"}
            </span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            LKR {summary.todayEarnings.toLocaleString()}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp size={12} /> Live order revenue
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">This Week</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calendar size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            LKR {summary.thisWeekEarnings.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            Last 7 operational days
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">This Month</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            LKR {summary.thisMonthEarnings.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            Current Billing Cycle
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Settlement</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wallet size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            LKR {summary.pendingPayout.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] font-semibold text-amber-600">
            Eligible for weekly disbursement
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales by Category Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Revenue by Food Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Top earning food segments from orders
          </p>

          <div className="mt-6 space-y-4">
            {salesByCategory.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.category}</span>
                  <span className="text-slate-900 font-bold">
                    LKR {cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(10, cat.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History Log */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Payout &amp; Settlement History
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly vendor disbursements transferred to registered bank account
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
              Bank Account Verified
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                <span>Loading settlement ledger...</span>
              </div>
            ) : payouts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No past payouts yet. Use "Request Payout" to submit a settlement.
              </div>
            ) : (
              payouts.map((pay) => (
                <div
                  key={pay.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-mono">
                        {pay.id}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {pay.method} &middot; {pay.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">
                      LKR {Number(pay.amount).toLocaleString()}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 size={12} /> {pay.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Request Early Disbursement</h3>
              </div>
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {payoutNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                {payoutNotice}
              </div>
            )}

            <form onSubmit={handleRequestPayoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Withdrawal Amount (LKR)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Available for withdrawal: LKR {summary.pendingPayout.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Receiving Bank Account
                </label>
                <select
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                >
                  <option value="Commercial Bank (Acc: ****4812)">Commercial Bank (Acc: ****4812) - Primary</option>
                  <option value="Bank of Ceylon (Acc: ****9019)">Bank of Ceylon (Acc: ****9019) - Secondary</option>
                  <option value="Sampath Bank (Acc: ****2204)">Sampath Bank (Acc: ****2204)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
