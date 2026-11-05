import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  CheckCircle2,
  Download,
  Filter,
  RotateCcw,
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
} from "recharts";

import Card from "../../components/ui/Card";

import {
  getMonitoringSummary,
  getBlockSummary,
  getOccupancyAnalytics,
  getFinancialAnalytics,
  getComplaintAnalytics,
} from "../../services/analyticsApi";

// Restrained palette for categories: calm slate & indigo tints instead of a saturated rainbow
const CATEGORY_COLORS = [
  "#2563eb",
  "#475569",
  "#0284c7",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
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

function ChartTooltipWrapper({ active, payload, label, isCurrency = false }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-slate-800">{label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.dataKey || entry.name}
            className="flex items-center justify-between gap-4 text-slate-600"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span>{entry.name}</span>
            </span>
            <span className="font-mono tabular-nums text-slate-900 font-medium">
              {isCurrency ? formatCurrency(entry.value) : Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, trend, trendLabel, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        {Icon && (
          <span className="text-slate-400">
            <Icon size={16} strokeWidth={1.75} />
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums text-slate-900">
          {value}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">{subtitle}</span>

        {trend !== undefined && (
          <div
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium ${
              trend >= 0
                ? "bg-slate-100 text-slate-800"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight size={13} strokeWidth={2} />
            ) : (
              <ArrowDownRight size={13} strokeWidth={2} />
            )}
            <span className="font-mono tabular-nums">{trend.toFixed(1)}%</span>
            {trendLabel && <span className="text-[11px] text-slate-500 ml-1">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message = "No data available for the selected filters." }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <Activity size={16} />
      </div>
      <p className="text-xs font-medium text-slate-700">No records available</p>
      <p className="mt-0.5 text-xs text-slate-500">{message}</p>
    </div>
  );
}

function FinancialRow({ label, value, highlight, positive = true }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2 text-xs ${
        highlight ? "border-t border-slate-100 pt-2.5 font-medium text-slate-900" : "text-slate-600"
      }`}
    >
      <span>{label}</span>
      <span
        className={`font-mono tabular-nums ${
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
    link.setAttribute("download", `hostel_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Hostel Administration Console</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Hostel Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time occupancy capacity, collections, utilities, and maintenance resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Global Error Notice */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs text-rose-800">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Connection notice</p>
              <p className="mt-0.5 text-rose-700">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-2 inline-flex items-center gap-1 rounded border border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-800 hover:bg-rose-50 cursor-pointer"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Filter size={14} className="text-slate-400" />
            <span>Filters</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Period:</label>
            <select
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
            >
              {PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Block:</label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
            >
              {BLOCKS.map((block) => (
                <option key={block} value={block}>
                  {block === "All" ? "All Blocks" : block}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Sync data</span>
        </button>
      </div>

      {/* Primary KPI Row */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Registered Rooms"
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
          />

          <StatCard
            title="Occupancy Rate"
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
          />

          <StatCard
            title="Fee Collections"
            value={
              loading
                ? "..."
                : formatShortCurrency(financialData?.totalCollectedPayments || 0)
            }
            subtitle={
              financialData?.outstandingBalance
                ? `Due: ${formatShortCurrency(financialData.outstandingBalance)}`
                : "Zero outstanding"
            }
            icon={Wallet}
            trend={financialData?.collectionRate}
            trendLabel="collection rate"
          />

          <StatCard
            title="Open Complaints"
            value={
              loading
                ? "..."
                : Number(complaintData?.openComplaints || 0).toLocaleString()
            }
            subtitle={
              complaintData?.resolvedComplaints !== undefined
                ? `${complaintData.resolvedComplaints} resolved tickets`
                : "Maintenance issues"
            }
            icon={CheckCircle2}
          />
        </div>
      </section>

      {/* Hero Chart & Financial Summary Split (Varied Grid Rhythm) */}
      <section className="grid gap-5 xl:grid-cols-3">
        {/* Main Anchor: Bed Occupancy by Block (Takes 2/3) */}
        <div className="xl:col-span-2">
          <Card padding="p-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Bed Occupancy by Block
                </h2>
                <p className="text-xs text-slate-500">
                  Distribution of occupied versus vacant capacity across residential buildings
                </p>
              </div>

              <span className="font-mono text-xs text-slate-500">
                {occupancyData?.totalBeds || 0} total beds
              </span>
            </div>

            <div className="h-[280px] w-full">
              {occupancyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={occupancyChartData}
                    barGap={6}
                    margin={{ top: 12, right: 6, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#f1f5f9"
                      strokeDasharray="2 2"
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
                    <Tooltip content={<ChartTooltipWrapper />} />
                    <Bar
                      dataKey="occupied"
                      name="Occupied beds"
                      fill="#1e293b"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="available"
                      name="Available beds"
                      fill="#cbd5e1"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No bed allocation records found." />
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-sm bg-slate-900" />
                  Occupied: <strong className="font-mono text-slate-900">{occupancyData?.occupiedBeds || 0}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-sm bg-slate-300" />
                  Vacant: <strong className="font-mono text-slate-900">{occupancyData?.availableBeds || 0}</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedBlock === "All" ? "Campus wide" : selectedBlock}
              </span>
            </div>
          </Card>
        </div>

        {/* Financial Ledger (Takes 1/3) */}
        <div>
          <Card padding="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Financial Summary
              </h2>
              <p className="text-xs text-slate-500">
                Current invoicing and collection efficiency
              </p>
            </div>

            <div className="space-y-1">
              <FinancialRow
                label="Total Invoiced"
                value={formatCurrency(financialData?.totalBilledAmount || 0)}
              />
              <FinancialRow
                label="Collected to Date"
                value={formatCurrency(financialData?.totalCollectedPayments || 0)}
              />
              <FinancialRow
                label="Outstanding Balance"
                value={formatCurrency(financialData?.outstandingBalance || 0)}
                highlight
                positive={(financialData?.outstandingBalance || 0) === 0}
              />
              <FinancialRow
                label="Collection Efficiency"
                value={`${(financialData?.collectionRate || 0).toFixed(1)}%`}
              />
              <FinancialRow
                label="Settled Receipts"
                value={`${financialData?.paymentsSummary?.successfulCount || 0} verified`}
              />
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
              <div className="flex justify-between text-slate-600 mb-1.5">
                <span>Collection rate</span>
                <span className="font-mono font-medium text-slate-900">
                  {financialData?.collectionRate ?? 0}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-300"
                  style={{
                    width: `${Math.min(Math.max(financialData?.collectionRate || 0, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Revenue Trends Line Chart */}
      <section>
        <Card padding="p-5">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly Invoicing & Collections
              </h2>
              <p className="text-xs text-slate-500">
                Sequential billing comparisons over recent monthly cycles
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">
              Amounts in LKR
            </span>
          </div>

          <div className="h-[250px] w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChartData}
                  margin={{ top: 10, right: 12, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#f1f5f9"
                    strokeDasharray="2 2"
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
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(val) => formatShortCurrency(val).replace("LKR ", "")}
                  />
                  <Tooltip content={<ChartTooltipWrapper isCurrency />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Collected"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#0f172a" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="billed"
                    name="Billed"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 3, fill: "#94a3b8" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No payment transaction history recorded." />
            )}
          </div>
        </Card>
      </section>

      {/* Utility Consumption & Maintenance Categories */}
      <section className="grid gap-5 xl:grid-cols-2">
        {/* Utility Usage */}
        <Card padding="p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Daily Utility Consumption
            </h2>
            <p className="text-xs text-slate-500">
              Today's recorded campus meter telemetry against daily allowances
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-6 text-xs text-slate-500">
              <RefreshCw size={13} className="animate-spin text-slate-600" />
              Loading telemetry...
            </div>
          ) : (
            <div className="space-y-4">
              {["Water", "Electricity"].map((type) => {
                const item = monitoringSummary.find(
                  (reading) => reading.utilityType === type
                );

                const value = Number(item?.total ?? 0);
                const unit = item?.unit ?? (type === "Water" ? "L" : "kWh");
                const percentage = Number(item?.percentage ?? 0);
                const status = item?.status ?? "Normal";

                const isWarning = status === "Warning" || status === "Exceeded";

                return (
                  <div
                    key={type}
                    className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        {type === "Water" ? (
                          <Droplets size={14} className="text-slate-600" />
                        ) : (
                          <Zap size={14} className="text-slate-600" />
                        )}
                        <span className="font-medium text-slate-800">{type}</span>
                      </div>

                      <span
                        className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                          isWarning
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-200/80 text-slate-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-2">
                      <span className="text-lg font-semibold font-mono tabular-nums text-slate-900">
                        {value.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-500">{unit}</span>
                      </span>
                      <span className="font-mono text-slate-500">
                        {percentage.toFixed(1)}% of allowance
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isWarning ? "bg-rose-600" : "bg-slate-800"
                        }`}
                        style={{
                          width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Maintenance Categories */}
        <Card padding="p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Maintenance Tickets by Category
            </h2>
            <p className="text-xs text-slate-500">
              Distribution of logged hostel facility complaints
            </p>
          </div>

          {complaintCategoryTotal > 0 ? (
            <div className="grid items-center gap-6 sm:grid-cols-2">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complaintChartData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {complaintChartData.map((entry, index) => (
                        <Cell
                          key={entry.category}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipWrapper />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {complaintChartData.map((item, index) => {
                  const percentage = getPercentage(
                    item.count,
                    complaintCategoryTotal
                  );

                  return (
                    <div key={item.category} className="text-xs">
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                            }}
                          />
                          <span>{item.category}</span>
                        </span>
                        <span className="font-mono tabular-nums text-slate-900 font-medium">
                          {item.count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState message="No maintenance complaints logged." />
          )}
        </Card>
      </section>

      {/* Block Utility Table */}
      {blockSummary.length > 0 && (
        <section>
          <Card padding="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Block Utility Breakdown
                </h2>
                <p className="text-xs text-slate-500">
                  Sub-metered water and electricity consumption across campus blocks
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">24-hour log</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="px-3 py-2">Hostel Block</th>
                    <th className="px-3 py-2">Water (L)</th>
                    <th className="px-3 py-2">Electricity (kWh)</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blockSummary.map((block, index) => (
                    <tr
                      key={block.blockName || index}
                      className="hover:bg-slate-50/60 transition-colors"
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
                          className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                            block.status === "Warning"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-slate-100 text-slate-700"
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
          </Card>
        </section>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
