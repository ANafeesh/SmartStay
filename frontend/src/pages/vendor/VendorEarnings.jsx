import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Wallet,
  CheckCircle2,
} from "lucide-react";

const earningsSummary = {
  todayEarnings: 14250,
  thisWeekEarnings: 86400,
  thisMonthEarnings: 312000,
  pendingPayout: 18500,
};

const salesByCategory = [
  { category: "Main Dishes", amount: 185000, percentage: 59 },
  { category: "Fast Food", amount: 82000, percentage: 26 },
  { category: "Beverages", amount: 45000, percentage: 15 },
];

const payoutHistory = [
  {
    id: "PAY-8012",
    date: "28 Sep 2026",
    amount: 42000,
    method: "Bank Transfer (Commercial Bank)",
    status: "Completed",
  },
  {
    id: "PAY-7950",
    date: "21 Sep 2026",
    amount: 38500,
    method: "Bank Transfer (Commercial Bank)",
    status: "Completed",
  },
  {
    id: "PAY-7891",
    date: "14 Sep 2026",
    amount: 45000,
    method: "Bank Transfer (Commercial Bank)",
    status: "Completed",
  },
];

function VendorEarnings() {
  const [payouts] = useState(payoutHistory);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportStatement = () => {
    setIsExporting(true);

    try {
      const csvRows = [
        ["SMARTSTAY VENDOR FINANCIAL STATEMENT"],
        [`Generated On: ${new Date().toLocaleString()}`],
        ["Period: September 2026", "Status: Verified & Audited"],
        [],
        ["--- REVENUE SUMMARY ---"],
        ["Metric", "Amount (LKR)"],
        ["Today's Revenue", earningsSummary.todayEarnings],
        ["This Week's Revenue", earningsSummary.thisWeekEarnings],
        ["This Month's Revenue", earningsSummary.thisMonthEarnings],
        ["Pending Withdrawal", earningsSummary.pendingPayout],
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Vendor Earnings & Financial Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track daily sales revenue, food category performance, and bank
            payout logs.
          </p>
        </div>

        <button
          onClick={handleExportStatement}
          disabled={isExporting}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition shrink-0 cursor-pointer ${
            exportSuccess
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {exportSuccess ? <CheckCircle2 size={16} /> : <Download size={16} />}
          <span>
            {isExporting
              ? "Generating Statement..."
              : exportSuccess
              ? "Statement Exported ✓"
              : "Export Financial Statement"}
          </span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Today's Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Rs. {earningsSummary.todayEarnings.toLocaleString()}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp size={12} /> +12.5% from yesterday
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">This Week</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Calendar size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Rs. {earningsSummary.thisWeekEarnings.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            7 active operational days
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">This Month</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Rs. {earningsSummary.thisMonthEarnings.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            September 2026
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Withdrawal</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Wallet size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Rs. {earningsSummary.pendingPayout.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] font-semibold text-amber-600">
            Payout scheduled for Sunday
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales by Category Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">
            Revenue by Food Category
          </h2>
          <p className="text-xs text-slate-500">
            Top earning food segments this month
          </p>

          <div className="mt-6 space-y-4">
            {salesByCategory.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.category}</span>
                  <span className="text-slate-900">
                    Rs. {cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History Log */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Payout & Settlement History
              </h2>
              <p className="text-xs text-slate-500">
                Weekly vendor payouts disbursed to bank account
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
              Bank Account Verified
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {payouts.map((pay) => (
              <div
                key={pay.id}
                className="flex items-center justify-between py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {pay.id}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {pay.method} • {pay.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">
                    Rs. {pay.amount.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 size={12} /> {pay.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorEarnings;
