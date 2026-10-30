import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Filter,
  MessageSquareWarning,
  RotateCcw,
  TrendingUp,
  Users,
  Wallet,
  Droplets,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import Card from "../../components/ui/Card";

import {
  getMonitoringSummary,
  getBlockSummary,
  getOccupancyAnalytics,
  getFinancialAnalytics,
  getComplaintAnalytics,
} from "../../services/analyticsApi";

const COLORS = [
  "#2563eb",
  "#14b8a6",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
];

const BLOCKS = ["All", "Block A", "Block B", "Block C"];

const PERIODS = [
  { label: "All time records", value: "all" },
  { label: "Last 30 days", value: "30days" },
  { label: "Current month", value: "current" },
];

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

const formatShortCurrency = (value) => {
  const amount = Number(value || 0);

  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(2)}M`;
  }

  if (amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }

  return `Rs. ${amount.toLocaleString("en-LK")}`;
};

const getPercentage = (value, total) =>
  total > 0 ? (value / total) * 100 : 0;

function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <p className="mb-2 text-sm font-bold text-slate-800">{label}</p>

      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-5 py-1 text-sm"
        >
          <span className="text-slate-500">{entry.name}</span>
          <span className="font-semibold text-slate-800">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconStyle,
  trend,
  trendLabel,
}) {
  return (
    <Card>
      <div className="flex h-full items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-smart-secondary">{title}</p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-smart-primary sm:text-3xl">
            {value}
          </h2>

          <p className="mt-2 text-xs text-smart-secondary">{subtitle}</p>

          {trend !== undefined && (
            <div
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                trend >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {trend >= 0 ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {trend.toFixed(1)}% {trendLabel || "collection rate"}
            </div>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  message = "No data available for the selected filters.",
}) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Activity size={23} />
      </div>

      <p className="text-sm font-semibold text-slate-700">
        Nothing to display
      </p>

      <p className="mt-1 text-xs text-slate-500">{message}</p>
    </div>
  );
}

function FinancialRow({
  label,
  value,
  highlight,
  positive = true,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        highlight ? "border-t border-slate-100 pt-4" : ""
      }`}
    >
      <span
        className={`text-sm ${
          highlight
            ? "font-semibold text-slate-800"
            : "text-slate-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-right text-sm font-bold ${
          highlight
            ? positive
              ? "text-emerald-700"
              : "text-rose-700"
            : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function AnalyticsDashboard() {
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [reportingPeriod, setReportingPeriod] = useState("all");

  // Live Backend States
  const [monitoringSummary, setMonitoringSummary] = useState([]);
  const [blockSummary, setBlockSummary] = useState([]);
  const [occupancyData, setOccupancyData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [complaintData, setComplaintData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [
        summaryRes,
        blocksRes,
        occupancyRes,
        financialRes,
        complaintsRes,
      ] = await Promise.all([
        getMonitoringSummary(),
        getBlockSummary(),
        getOccupancyAnalytics(),
        getFinancialAnalytics(),
        getComplaintAnalytics(),
      ]);

      setMonitoringSummary(Array.isArray(summaryRes?.data) ? summaryRes.data : []);
      setBlockSummary(Array.isArray(blocksRes?.data) ? blocksRes.data : []);
      setOccupancyData(occupancyRes?.data || null);
      setFinancialData(financialRes?.data || null);
      setComplaintData(complaintsRes?.data || null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to SmartStay backend analytics. Ensure the API server is active."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filter block occupancy data
  const filteredBlocks = useMemo(() => {
    if (!occupancyData?.blocks) return [];
    if (selectedBlock === "All") return occupancyData.blocks;
    return occupancyData.blocks.filter(
      (b) =>
        b.blockName?.toLowerCase() === selectedBlock.toLowerCase() ||
        b.buildingCode?.toLowerCase() === selectedBlock.toLowerCase()
    );
  }, [occupancyData, selectedBlock]);

  // Occupancy chart data
  const occupancyChartData = useMemo(() => {
    if (!filteredBlocks.length) {
      if (occupancyData?.totalBeds > 0) {
        return [
          {
            name: "Overall",
            occupied: occupancyData.occupiedBeds || 0,
            available: occupancyData.availableBeds || 0,
            rate: occupancyData.occupancyPercentage || 0,
          },
        ];
      }
      return [];
    }
    return filteredBlocks.map((b) => ({
      name: b.blockName || b.buildingCode || "Block",
      occupied: b.occupiedBeds || 0,
      available: b.availableBeds || 0,
      rate: b.occupancyRate || 0,
    }));
  }, [filteredBlocks, occupancyData]);

  // Revenue chart data (from actual monthly collection summary)
  const revenueChartData = useMemo(() => {
    if (!financialData?.monthlySummary?.length) return [];
    return financialData.monthlySummary.map((m) => ({
      month: m.month || m.yearMonth,
      revenue: m.collectedAmount || 0,
      billed: m.billedAmount || 0,
      transactions: m.transactionCount || 0,
    }));
  }, [financialData]);

  // Complaint category chart data
  const complaintChartData = useMemo(() => {
    if (!complaintData?.categoryDistribution) return [];
    return Object.entries(complaintData.categoryDistribution).map(
      ([category, count]) => ({
        category,
        count,
      })
    );
  }, [complaintData]);

  const complaintCategoryTotal = useMemo(() => {
    return complaintChartData.reduce((sum, item) => sum + item.count, 0);
  }, [complaintChartData]);

  function resetFilters() {
    setSelectedBlock("All");
    setReportingPeriod("all");
    loadDashboardData();
  }

  function exportCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Total Rooms", occupancyData?.totalRooms ?? 0],
      ["Total Beds", occupancyData?.totalBeds ?? 0],
      ["Occupied Beds", occupancyData?.occupiedBeds ?? 0],
      ["Available Beds", occupancyData?.availableBeds ?? 0],
      ["Occupancy Rate (%)", occupancyData?.occupancyPercentage ?? 0],
      ["Total Billed (LKR)", financialData?.totalBilledAmount ?? 0],
      ["Total Collected (LKR)", financialData?.totalCollectedPayments ?? 0],
      ["Outstanding Balance (LKR)", financialData?.outstandingBalance ?? 0],
      ["Collection Rate (%)", financialData?.collectionRate ?? 0],
      ["Total Complaints", complaintData?.totalComplaints ?? 0],
      ["Open Complaints", complaintData?.openComplaints ?? 0],
      ["Resolved Complaints", complaintData?.resolvedComplaints ?? 0],
    ];

    const csv = rows
      .map((row) =>
        row.map((val) => `"${String(val).replaceAll('"', '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smartstay-live-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* Dashboard heading banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Module 5 Live Engine
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Smart Analytics
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Real-time campus operational intelligence: live room occupancy, fee
              collections, utility telemetry, and maintenance resolutions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetFilters}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Reset filters
            </button>

            <button
              onClick={exportCSV}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-950 shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
            >
              <Download size={17} />
              Export Live CSV
            </button>
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-3 border-t border-white/15 pt-5 text-xs text-blue-100">
          <span className="inline-flex items-center gap-2">
            <Building2 size={14} />
            {selectedBlock === "All" ? "All campus blocks" : selectedBlock}
          </span>

          <span className="text-blue-200/60">•</span>

          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={14} />
            MongoDB live aggregations
          </span>

          <span className="text-blue-200/60">•</span>

          <span className="inline-flex items-center gap-2">
            <Activity size={14} />
            Dynamic status monitoring
          </span>
        </div>
      </section>

      {/* Global Error Alert */}
      {error && (
        <Card>
          <div className="flex items-start gap-3 text-rose-700">
            <AlertCircle size={22} className="shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-800">API Connection Notice</h3>
              <p className="text-sm mt-0.5 text-rose-600">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-200"
              >
                <RefreshCw size={14} /> Retry Connection
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Controls */}
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Filter size={17} />
            </div>

            <div>
              <h2 className="font-bold text-smart-primary">Dashboard filters</h2>
              <p className="text-xs text-smart-secondary">
                Filter live analytics views by block or period
              </p>
            </div>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-smart-primary">
              Reporting scope
            </span>
            <select
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              {PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-smart-primary">
              Hostel block
            </span>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              {BLOCKS.map((block) => (
                <option key={block} value={block}>
                  {block === "All" ? "All hostel blocks" : block}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {/* Performance Overview Cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-smart-primary">
            Performance overview
          </h2>
          <p className="mt-1 text-sm text-smart-secondary">
            Aggregated indicators from live database records
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Registered Rooms"
            value={
              loading
                ? "..."
                : Number(occupancyData?.totalRooms || 0).toLocaleString()
            }
            subtitle={
              occupancyData?.totalBeds
                ? `${occupancyData.totalBeds} total bed capacity`
                : "No rooms registered yet"
            }
            icon={Building2}
            iconStyle="bg-blue-50 text-blue-700"
          />

          <MetricCard
            title="Hostel Occupancy Rate"
            value={
              loading
                ? "..."
                : `${Number(occupancyData?.occupancyPercentage || 0).toFixed(1)}%`
            }
            subtitle={
              occupancyData?.totalBeds
                ? `${occupancyData.occupiedBeds} occupied / ${occupancyData.availableBeds} available`
                : "Awaiting bed allocation records"
            }
            icon={BedDouble}
            iconStyle="bg-teal-50 text-teal-700"
          />

          <MetricCard
            title="Total Collected Revenue"
            value={
              loading
                ? "..."
                : formatShortCurrency(financialData?.totalCollectedPayments || 0)
            }
            subtitle={
              financialData?.outstandingBalance
                ? `Outstanding: ${formatShortCurrency(financialData.outstandingBalance)}`
                : "Zero outstanding balance"
            }
            icon={Wallet}
            iconStyle="bg-emerald-50 text-emerald-700"
            trend={financialData?.collectionRate}
            trendLabel="collection rate"
          />

          <MetricCard
            title="Open Complaints"
            value={
              loading
                ? "..."
                : Number(complaintData?.openComplaints || 0).toLocaleString()
            }
            subtitle={
              complaintData?.resolvedComplaints !== undefined
                ? `${complaintData.resolvedComplaints} tickets resolved`
                : "Maintenance tickets"
            }
            icon={MessageSquareWarning}
            iconStyle="bg-amber-50 text-amber-700"
          />
        </div>
      </section>

      {/* Backend Utility Telemetry */}
      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              Live Utility Monitoring
            </h2>
            <p className="mt-1 text-sm text-smart-secondary">
              Today's recorded consumption vs campus daily limits
            </p>
          </div>
        </div>

        {loading ? (
          <Card>
            <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
              <RefreshCw size={18} className="animate-spin text-blue-600" />
              Loading live utility readings...
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {["Water", "Electricity"].map((type) => {
              const item = monitoringSummary.find(
                (reading) => reading.utilityType === type
              );

              const value = Number(item?.total ?? 0);
              const unit = item?.unit ?? (type === "Water" ? "L" : "kWh");
              const percentage = Number(item?.percentage ?? 0);
              const status = item?.status ?? "Normal";

              const statusClass =
                status === "Exceeded"
                  ? "bg-rose-100 text-rose-700"
                  : status === "Warning"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700";

              const progressClass =
                status === "Exceeded"
                  ? "bg-rose-500"
                  : status === "Warning"
                  ? "bg-amber-500"
                  : "bg-emerald-500";

              return (
                <Card key={type}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          type === "Water"
                            ? "bg-cyan-50 text-cyan-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {type === "Water" ? (
                          <Droplets size={22} />
                        ) : (
                          <Zap size={22} />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-smart-secondary">
                          {type} usage today
                        </p>
                        <p className="mt-1 text-2xl font-bold text-smart-primary">
                          {value.toLocaleString()}{" "}
                          <span className="text-sm font-medium">{unit}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-smart-secondary">
                    {item?.dailyLimit != null
                      ? `Daily limit: ${Number(item.dailyLimit).toLocaleString()} ${unit}`
                      : "Daily limit configured"}
                  </p>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Daily threshold progress</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${progressClass}`}
                        style={{
                          width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {item?.readingCount ?? 0} meter readings recorded today
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Utility Summary by Block */}
      <section>
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Utility Summary by Block
              </h2>
              <p className="text-sm text-smart-secondary">
                Today's recorded water and electricity usage by hostel location
              </p>
            </div>
          </div>

          {blockSummary.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
              <Building2 size={28} className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No block readings recorded today
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Readings logged in the Smart Monitoring portal will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Block</th>
                    <th className="px-3 py-3 font-medium">Water (L)</th>
                    <th className="px-3 py-3 font-medium">Electricity (kWh)</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {blockSummary.map((block, index) => (
                    <tr
                      key={block.blockName || index}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {block.blockName || "Unassigned"}
                      </td>

                      <td className="px-3 py-3 text-slate-700">
                        {Number(block.water || 0).toLocaleString()}
                      </td>

                      <td className="px-3 py-3 text-slate-700">
                        {Number(block.electricity || 0).toLocaleString()}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            block.status === "Warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {block.status || "Normal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Occupancy and Revenue Charts */}
      <section className="grid gap-5 xl:grid-cols-2">
        {/* Occupancy Chart */}
        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <BedDouble size={18} />
                </div>
                <h2 className="text-lg font-bold text-smart-primary">
                  Occupancy Breakdown
                </h2>
              </div>

              <p className="mt-2 text-sm text-smart-secondary">
                Live occupied and available bed capacity
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {occupancyData?.totalBeds || 0} Total Beds
            </span>
          </div>

          <div className="h-[300px] w-full">
            {occupancyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={occupancyChartData}
                  barGap={5}
                  margin={{ top: 10, right: 4, left: -18, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="occupied"
                    name="Occupied beds"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={34}
                  />
                  <Bar
                    dataKey="available"
                    name="Available beds"
                    fill="#bfdbfe"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No hostel room or bed records found in database." />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total occupied beds</p>
              <p className="mt-1 text-lg font-bold text-slate-800">
                {Number(occupancyData?.occupiedBeds || 0).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total available beds</p>
              <p className="mt-1 text-lg font-bold text-slate-800">
                {Number(occupancyData?.availableBeds || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Revenue & Collections Chart */}
        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <TrendingUp size={18} />
                </div>
                <h2 className="text-lg font-bold text-smart-primary">
                  Fee Collections & Billing
                </h2>
              </div>

              <p className="mt-2 text-sm text-smart-secondary">
                Aggregated monthly collections and invoiced fees (LKR)
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              {financialData?.collectionRate ?? 0}% Collected
            </span>
          </div>

          <div className="h-[300px] w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChartData}
                  margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(val) => formatShortCurrency(val).replace("Rs. ", "")}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Collected Payments"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#059669" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="billed"
                    name="Invoiced Fees"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f59e0b" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No payment transactions recorded in database yet." />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-xs text-emerald-700">Collected amount</p>
              <p className="mt-1 text-lg font-bold text-emerald-800">
                {formatShortCurrency(financialData?.totalCollectedPayments || 0)}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Outstanding balance</p>
              <p className="mt-1 text-lg font-bold text-amber-800">
                {formatShortCurrency(financialData?.outstandingBalance || 0)}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Complaint Analysis & Financial Summary */}
      <section className="grid gap-5 xl:grid-cols-5">
        {/* Complaint Category Breakdown */}
        <div className="xl:col-span-3">
          <Card>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-smart-primary">
                Complaint Analysis
              </h2>
              <p className="mt-1 text-sm text-smart-secondary">
                Reported maintenance issues grouped by category
              </p>
            </div>

            {complaintCategoryTotal > 0 ? (
              <div className="grid items-center gap-4 md:grid-cols-2">
                <div className="h-[270px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complaintChartData}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {complaintChartData.map((entry, index) => (
                          <Cell
                            key={entry.category}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Total logged complaints
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {complaintCategoryTotal.toLocaleString()}
                    </p>
                  </div>

                  {complaintChartData.map((item, index) => {
                    const percentage = getPercentage(
                      item.count,
                      complaintCategoryTotal
                    );

                    return (
                      <div key={item.category}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium text-slate-700">
                              {item.category}
                            </span>
                          </div>

                          <span className="font-bold text-slate-900">
                            {item.count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState message="No maintenance complaints logged in database." />
            )}
          </Card>
        </div>

        {/* Financial Details Summary */}
        <div className="xl:col-span-2">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CircleDollarSign size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-smart-primary">
                  Financial Summary
                </h2>
                <p className="text-sm text-smart-secondary">
                  Hostel fees & verified transactions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FinancialRow
                label="Total Invoiced"
                value={formatCurrency(financialData?.totalBilledAmount || 0)}
              />
              <FinancialRow
                label="Total Collected"
                value={formatCurrency(financialData?.totalCollectedPayments || 0)}
              />
              <FinancialRow
                label="Outstanding Dues"
                value={formatCurrency(financialData?.outstandingBalance || 0)}
                highlight
                positive={(financialData?.outstandingBalance || 0) === 0}
              />
              <FinancialRow
                label="Collection Efficiency"
                value={`${(financialData?.collectionRate || 0).toFixed(1)}%`}
              />
              <FinancialRow
                label="Successful Payments"
                value={`${financialData?.paymentsSummary?.successfulCount || 0} transactions`}
              />
            </div>
          </Card>
        </div>
      </section>

      <p className="px-1 text-center text-xs text-smart-secondary">
        SmartStay Module 5 · Live Analytics Engine · Connected to MongoDB Atlas API endpoints.
      </p>
    </div>
  );
}

export default AnalyticsDashboard;
