import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Filter,
  MessageSquareWarning,
  RotateCcw,
  TrendingUp,
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
  "#0d9488",
  "#d97706",
  "#e11d48",
  "#7c3aed",
  "#0284c7",
];

const BLOCKS = ["All", "Block A", "Block B", "Block C"];

const PERIODS = [
  { label: "All time records", value: "all" },
  { label: "Last 30 days", value: "30days" },
  { label: "Current month", value: "current" },
];

const formatCurrency = (value) =>
  `LKR ${Number(value || 0).toLocaleString("en-LK")}`;

const formatShortCurrency = (value) => {
  const amount = Number(value || 0);

  if (amount >= 1000000) {
    return `LKR ${(amount / 1000000).toFixed(2)}M`;
  }

  if (amount >= 1000) {
    return `LKR ${(amount / 1000).toFixed(1)}K`;
  }

  return `LKR ${amount.toLocaleString("en-LK")}`;
};

const getPercentage = (value, total) =>
  total > 0 ? (value / total) * 100 : 0;

function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md">
      <p className="mb-2 text-xs font-semibold text-slate-800">{label}</p>

      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-4 py-0.5 text-xs font-mono"
        >
          <span className="font-sans text-slate-500">{entry.name}:</span>
          <span className="font-medium text-slate-900">
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
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight font-mono tabular-nums text-slate-900 sm:text-3xl">
            {value}
          </h2>

          <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>

          {trend !== undefined && (
            <div
              className={`mt-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border ${
                trend >= 0
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                  : "bg-rose-50 text-rose-800 border-rose-200/80"
              }`}
            >
              {trend >= 0 ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              <span className="font-mono tabular-nums">{trend.toFixed(1)}%</span>
              <span className="font-sans">{trendLabel || "collection rate"}</span>
            </div>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
        >
          <Icon size={18} />
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
      <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <Activity size={18} />
      </div>

      <p className="text-xs font-semibold text-slate-700">
        No records available
      </p>

      <p className="mt-0.5 text-xs text-slate-500">{message}</p>
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
      className={`flex items-center justify-between gap-4 py-1 ${
        highlight ? "border-t border-slate-100 pt-3" : ""
      }`}
    >
      <span
        className={`text-xs ${
          highlight
            ? "font-medium text-slate-900"
            : "text-slate-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-right text-xs font-medium font-mono tabular-nums ${
          highlight
            ? positive
              ? "text-emerald-700 font-semibold"
              : "text-rose-700 font-semibold"
            : "text-slate-900"
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
      console.error("Dashboard data load error:", err);
      setError(err?.message || "Failed to load live analytics records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const occupancyChartData = useMemo(() => {
    if (!occupancyData?.blocksSummary?.length) return [];
    return occupancyData.blocksSummary
      .filter((b) => selectedBlock === "All" || b.blockName === selectedBlock)
      .map((b) => ({
        name: b.blockName,
        occupied: b.occupiedBeds || 0,
        available: b.availableBeds || 0,
        total: b.totalBeds || 0,
      }));
  }, [occupancyData, selectedBlock]);

  const revenueChartData = useMemo(() => {
    if (!financialData?.monthlyTrends?.length) return [];
    return financialData.monthlyTrends.map((t) => ({
      month: t.month,
      revenue: t.collectedRevenue || 0,
      billed: t.billedAmount || 0,
    }));
  }, [financialData]);

  const complaintChartData = useMemo(() => {
    if (!complaintData?.categoryBreakdown?.length) return [];
    return complaintData.categoryBreakdown.map((c) => ({
      category: c.category,
      count: c.count,
    }));
  }, [complaintData]);

  const complaintCategoryTotal = useMemo(() => {
    return complaintChartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [complaintChartData]);

  const resetFilters = () => {
    setSelectedBlock("All");
    setReportingPeriod("all");
    loadDashboardData();
  };

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Rooms", occupancyData?.totalRooms || 0],
      ["Occupancy Rate", `${occupancyData?.occupancyPercentage || 0}%`],
      ["Total Collected", financialData?.totalCollectedPayments || 0],
      ["Outstanding Balance", financialData?.outstandingBalance || 0],
      ["Open Complaints", complaintData?.openComplaints || 0],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campus_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Executive Command Banner */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-white sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-800 border border-slate-700/80 px-2.5 py-1 text-xs font-medium text-slate-300 mb-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Campus Operational Telemetry</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Smart Analytics
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Consolidated intelligence: room occupancy capacity, fee collections, utility consumption, and maintenance resolutions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={resetFilters}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>

            <button
              onClick={exportCSV}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400 font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Building2 size={13} className="text-slate-500" />
            {selectedBlock === "All" ? "All campus blocks" : selectedBlock}
          </span>
          <span className="text-slate-700">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-slate-500" />
            Live database records
          </span>
          <span className="text-slate-700">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Activity size={13} className="text-slate-500" />
            Telemetry verified
          </span>
        </div>
      </section>

      {/* Global Error Alert */}
      {error && (
        <Card>
          <div className="flex items-start gap-3 text-rose-800">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
            <div>
              <h3 className="text-xs font-semibold text-rose-900">Connection notice</h3>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-2 inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors"
              >
                <RefreshCw size={12} /> Retry Connection
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Controls */}
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Filter size={15} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Dashboard filters</h2>
              <p className="text-xs text-slate-500">
                Filter analytics by period or hostel building
              </p>
            </div>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-700">
              Reporting scope
            </span>
            <select
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
            >
              {PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-700">
              Hostel block
            </span>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
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
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Performance overview
          </h2>
          <p className="text-xs text-slate-500">
            Aggregated indicators from live campus database records
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
                : "No rooms registered"
            }
            icon={Building2}
            iconStyle="bg-slate-100 text-slate-700"
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
                ? `${occupancyData.occupiedBeds} occupied · ${occupancyData.availableBeds} vacant`
                : "Awaiting bed allocation records"
            }
            icon={BedDouble}
            iconStyle="bg-blue-50 text-blue-700 border border-blue-200/50"
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
            iconStyle="bg-emerald-50 text-emerald-700 border border-emerald-200/50"
            trend={financialData?.collectionRate}
            trendLabel="collection rate"
          />

          <MetricCard
            title="Open Maintenance Complaints"
            value={
              loading
                ? "..."
                : Number(complaintData?.openComplaints || 0).toLocaleString()
            }
            subtitle={
              complaintData?.resolvedComplaints !== undefined
                ? `${complaintData.resolvedComplaints} tickets resolved`
                : "Maintenance issues"
            }
            icon={MessageSquareWarning}
            iconStyle="bg-amber-50 text-amber-700 border border-amber-200/50"
          />
        </div>
      </section>

      {/* Utility Telemetry */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Live utility telemetry
          </h2>
          <p className="text-xs text-slate-500">
            Today's recorded consumption against daily campus limits
          </p>
        </div>

        {loading ? (
          <Card>
            <div className="flex items-center gap-2 py-3 text-xs text-slate-500">
              <RefreshCw size={14} className="animate-spin text-slate-600" />
              Loading live utility telemetry...
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

              const statusBadgeStyle =
                status === "Exceeded"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : status === "Warning"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200";

              const progressFill =
                status === "Exceeded"
                  ? "bg-rose-600"
                  : status === "Warning"
                  ? "bg-amber-500"
                  : type === "Water"
                  ? "bg-cyan-600"
                  : "bg-amber-600";

              return (
                <Card key={type}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          type === "Water"
                            ? "bg-cyan-50 text-cyan-700 border border-cyan-200/50"
                            : "bg-amber-50 text-amber-700 border border-amber-200/50"
                        }`}
                      >
                        {type === "Water" ? (
                          <Droplets size={18} />
                        ) : (
                          <Zap size={18} />
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          {type} consumption today
                        </p>
                        <p className="mt-0.5 text-2xl font-semibold font-mono tabular-nums text-slate-900">
                          {value.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-slate-500 font-sans">{unit}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${statusBadgeStyle}`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 font-mono">
                    {item?.dailyLimit != null
                      ? `Daily threshold: ${Number(item.dailyLimit).toLocaleString()} ${unit}`
                      : "Standard threshold active"}
                  </p>

                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between text-xs text-slate-500 font-mono">
                      <span className="font-sans">Limit progress</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-colors ${progressFill}`}
                        style={{
                          width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] text-slate-400 font-mono">
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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Building2 size={16} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Utility summary by block
                </h2>
                <p className="text-xs text-slate-500">
                  Recorded water and electricity metrics by campus location
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400">BLK-LOG · 24H</span>
          </div>

          {blockSummary.length === 0 ? (
            <div className="rounded-lg bg-slate-50 px-4 py-8 text-center border border-slate-100">
              <Building2 size={24} className="mx-auto text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">
                No block readings recorded today
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Readings logged in Smart Monitoring appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="px-3 py-2.5">Hostel Block</th>
                    <th className="px-3 py-2.5">Water (L)</th>
                    <th className="px-3 py-2.5">Electricity (kWh)</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {blockSummary.map((block, index) => (
                    <tr
                      key={block.blockName || index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-3 py-2.5 font-medium text-slate-800">
                        {block.blockName || "Unassigned"}
                      </td>

                      <td className="px-3 py-2.5 font-mono tabular-nums text-slate-700">
                        {Number(block.water || 0).toLocaleString()}
                      </td>

                      <td className="px-3 py-2.5 font-mono tabular-nums text-slate-700">
                        {Number(block.electricity || 0).toLocaleString()}
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                            block.status === "Warning"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
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
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200/50">
                  <BedDouble size={16} />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Occupancy breakdown
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Occupied and available bed capacity across blocks
              </p>
            </div>

            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-mono text-slate-700">
              {occupancyData?.totalBeds || 0} Total Beds
            </span>
          </div>

          <div className="h-[280px] w-full">
            {occupancyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={occupancyChartData}
                  barGap={4}
                  margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#f1f5f9"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="occupied"
                    name="Occupied beds"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="available"
                    name="Available beds"
                    fill="#93c5fd"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No room or bed allocation records found." />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <div className="rounded-lg bg-slate-50 p-2.5">
              <p className="text-[11px] text-slate-500">Total occupied beds</p>
              <p className="mt-0.5 text-lg font-semibold font-mono tabular-nums text-slate-900">
                {Number(occupancyData?.occupiedBeds || 0).toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5">
              <p className="text-[11px] text-slate-500">Total vacant beds</p>
              <p className="mt-0.5 text-lg font-semibold font-mono tabular-nums text-slate-900">
                {Number(occupancyData?.availableBeds || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Revenue & Collections Chart */}
        <Card>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <TrendingUp size={16} />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Fee collections and billing
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Monthly collected payments and invoiced amounts (LKR)
              </p>
            </div>

            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-mono text-emerald-800">
              {financialData?.collectionRate ?? 0}% Collected
            </span>
          </div>

          <div className="h-[280px] w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChartData}
                  margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#f1f5f9"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    tickFormatter={(val) => formatShortCurrency(val).replace("LKR ", "")}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Collected payments"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#059669" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="billed"
                    name="Invoiced fees"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#d97706" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No payment transactions recorded yet." />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <div className="rounded-lg bg-emerald-50/70 p-2.5 border border-emerald-100">
              <p className="text-[11px] text-emerald-800">Collected amount</p>
              <p className="mt-0.5 text-lg font-semibold font-mono tabular-nums text-emerald-950">
                {formatShortCurrency(financialData?.totalCollectedPayments || 0)}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50/70 p-2.5 border border-amber-100">
              <p className="text-[11px] text-amber-800">Outstanding balance</p>
              <p className="mt-0.5 text-lg font-semibold font-mono tabular-nums text-amber-950">
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
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Complaint analysis
              </h2>
              <p className="text-xs text-slate-500">
                Maintenance tickets categorized by facility type
              </p>
            </div>

            {complaintCategoryTotal > 0 ? (
              <div className="grid items-center gap-4 md:grid-cols-2">
                <div className="h-[250px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complaintChartData}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
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

                <div className="space-y-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Total logged tickets
                    </p>
                    <p className="mt-0.5 text-2xl font-semibold font-mono tabular-nums text-slate-900">
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
                        <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="text-slate-700">
                              {item.category}
                            </span>
                          </div>

                          <span className="font-mono tabular-nums text-slate-900 font-medium">
                            {item.count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-colors"
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
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <CircleDollarSign size={16} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Financial summary
                </h2>
                <p className="text-xs text-slate-500">
                  Verified hostel billing records
                </p>
              </div>
            </div>

            <div className="space-y-3">
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
                label="Settled Transactions"
                value={`${financialData?.paymentsSummary?.successfulCount || 0} receipts`}
              />
            </div>
          </Card>
        </div>
      </section>

      <p className="text-center text-[11px] font-mono text-slate-400">
        SmartStay Operations &amp; Executive Telemetry Console
      </p>
    </div>
  );
}

export default AnalyticsDashboard;
