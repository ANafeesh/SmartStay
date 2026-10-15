
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  CheckCircle2,
  Download,
  Filter,
  MessageSquareWarning,
  RotateCcw,
  TrendingUp,
  Users,
  Wallet,
  CalendarDays,
  Building2,
  CircleDollarSign,
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
  overallMonthlyData,
  blockData,
  recentActivity,
} from "../../data/analyticsData";

const COLORS = [
  "#2563eb",
  "#14b8a6",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
];

const BLOCKS = ["All", "Block A", "Block B", "Block C"];

const PERIODS = [
  { label: "Last month", value: "1month", count: 1 },
  { label: "Last 3 months", value: "3months", count: 3 },
  { label: "Last 6 months", value: "6months", count: 6 },
];

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

const formatShortCurrency = (value) => {
  const amount = Number(value || 0);

  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(2)}M`;
  }

  if (amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(0)}K`;
  }

  return `Rs. ${amount.toLocaleString("en-LK")}`;
};

const getPercentage = (value, total) =>
  total > 0 ? (value / total) * 100 : 0;

function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("6months");
  const [selectedBlock, setSelectedBlock] = useState("All");

  const sourceData = useMemo(() => {
    if (selectedBlock === "All") {
      return overallMonthlyData;
    }

    return blockData[selectedBlock] || overallMonthlyData;
  }, [selectedBlock]);

  const filteredMonthlyData = useMemo(() => {
    const selectedPeriod =
      PERIODS.find((period) => period.value === dateRange) ||
      PERIODS[2];

    return sourceData.slice(-selectedPeriod.count);
  }, [sourceData, dateRange]);

  const summary = useMemo(() => {
    const data = filteredMonthlyData;

    if (!data.length) {
      return {
        averageStudents: 0,
        averageOccupancy: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        totalOpenComplaints: 0,
        totalOccupied: 0,
        totalBeds: 0,
        totalAvailable: 0,
      };
    }

    const totalRevenue = data.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    const totalExpenses = data.reduce(
      (sum, item) => sum + item.expenses,
      0
    );

    const totalOccupied = data.reduce(
      (sum, item) => sum + item.occupied,
      0
    );

    const totalBeds = data.reduce(
      (sum, item) => sum + item.totalBeds,
      0
    );

    const averageStudents =
      data.reduce((sum, item) => sum + item.students, 0) /
      data.length;

    const totalOpenComplaints = data.reduce(
      (sum, item) => sum + item.openComplaints,
      0
    );

    return {
      averageStudents: Math.round(averageStudents),
      averageOccupancy: getPercentage(totalOccupied, totalBeds),
      totalRevenue,
      totalExpenses,
      totalOpenComplaints,
      totalOccupied,
      totalBeds,
      totalAvailable: Math.max(totalBeds - totalOccupied, 0),
    };
  }, [filteredMonthlyData]);

  const occupancyChartData = useMemo(
    () =>
      filteredMonthlyData.map((item) => ({
        month: item.month,
        occupied: item.occupied,
        available: Math.max(item.totalBeds - item.occupied, 0),
        occupancyRate: getPercentage(item.occupied, item.totalBeds),
      })),
    [filteredMonthlyData]
  );

  const revenueChartData = useMemo(
    () =>
      filteredMonthlyData.map((item) => ({
        month: item.month,
        revenue: item.revenue,
        expenses: item.expenses,
        profit: item.revenue - item.expenses,
      })),
    [filteredMonthlyData]
  );

  const complaintChartData = useMemo(() => {
    const totals = {};

    filteredMonthlyData.forEach((item) => {
      Object.entries(item.complaints || {}).forEach(
        ([category, count]) => {
          totals[category] = (totals[category] || 0) + count;
        }
      );
    });

    return Object.entries(totals)
      .map(([category, count]) => ({ category, count }))
      .filter((item) => item.count > 0);
  }, [filteredMonthlyData]);

  const complaintCategoryTotal = complaintChartData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const blockOccupancyChartData = useMemo(() => {
    const blocks =
      selectedBlock === "All"
        ? Object.entries(blockData)
        : [[selectedBlock, blockData[selectedBlock] || []]];

    return blocks.map(([block, monthlyData]) => {
      const latest = monthlyData[monthlyData.length - 1];
      const occupied = latest?.occupied || 0;
      const total = latest?.totalBeds || 0;

      return {
        block,
        occupied,
        available: Math.max(total - occupied, 0),
        total,
        rate: getPercentage(occupied, total),
      };
    });
  }, [selectedBlock]);

  const totalProfit = summary.totalRevenue - summary.totalExpenses;
  const profitMargin = getPercentage(
    totalProfit,
    summary.totalRevenue
  );

  const firstMonth = filteredMonthlyData[0];
  const lastMonth =
    filteredMonthlyData[filteredMonthlyData.length - 1];

  const revenueChange =
    firstMonth && lastMonth && firstMonth.revenue > 0
      ? ((lastMonth.revenue - firstMonth.revenue) /
          firstMonth.revenue) *
        100
      : 0;

  function resetFilters() {
    setDateRange("6months");
    setSelectedBlock("All");
  }

  function exportCSV() {
    const headers = [
      "Month",
      "Block",
      "Students",
      "Total Beds",
      "Occupied Beds",
      "Available Beds",
      "Occupancy Percentage",
      "Revenue (LKR)",
      "Expenses (LKR)",
      "Net Profit (LKR)",
      "Open Complaints",
    ];

    const rows = filteredMonthlyData.map((item) => [
      item.month,
      selectedBlock,
      item.students,
      item.totalBeds,
      item.occupied,
      Math.max(item.totalBeds - item.occupied, 0),
      getPercentage(item.occupied, item.totalBeds).toFixed(2),
      item.revenue,
      item.expenses,
      item.revenue - item.expenses,
      item.openComplaints,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `smartstay-${selectedBlock
      .toLowerCase()
      .replaceAll(" ", "-")}-analytics.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function CurrencyTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
        <p className="mb-2 text-sm font-bold text-slate-800">
          {label}
        </p>

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
  }) {
    return (
      <Card>
        <div className="flex h-full items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-smart-secondary">
              {title}
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-smart-primary sm:text-3xl">
              {value}
            </h2>

            <p className="mt-2 text-xs text-smart-secondary">
              {subtitle}
            </p>

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
                {Math.abs(trend).toFixed(1)}% vs first month
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

  const chartHeading =
    selectedBlock === "All" ? "All hostel blocks" : selectedBlock;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* Page heading */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Activity size={14} />
              SMARTSTAY · MODULE 05
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Smart Analytics
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Understand hostel occupancy, financial performance,
              and service issues from one clear dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <RotateCcw size={16} />
              Reset filters
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-950 shadow-sm transition hover:bg-blue-50"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-3 border-t border-white/15 pt-5 text-xs text-blue-100">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={14} />
            {filteredMonthlyData.length} month
            {filteredMonthlyData.length === 1 ? "" : "s"} selected
          </span>
          <span className="text-blue-200/60">•</span>
          <span className="inline-flex items-center gap-2">
            <Building2 size={14} />
            {selectedBlock === "All" ? "All blocks" : selectedBlock}
          </span>
          <span className="text-blue-200/60">•</span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={14} />
            Sample dashboard data
          </span>
        </div>
      </section>

      {/* Filters */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Filter size={17} />
          </div>
          <div>
            <h2 className="font-bold text-smart-primary">
              Dashboard filters
            </h2>
            <p className="text-xs text-smart-secondary">
              Choose the reporting period and hostel block
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-smart-primary">
              Reporting period
            </span>
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
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
              onChange={(event) => setSelectedBlock(event.target.value)}
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

      {/* KPI cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-smart-primary">
            Performance overview
          </h2>
          <p className="mt-1 text-sm text-smart-secondary">
            Key indicators for {chartHeading.toLowerCase()}.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Average students"
            value={summary.averageStudents.toLocaleString()}
            subtitle="Average per month"
            icon={Users}
            iconStyle="bg-blue-50 text-blue-700"
          />

          <MetricCard
            title="Average occupancy"
            value={`${summary.averageOccupancy.toFixed(1)}%`}
            subtitle={`${summary.totalOccupied.toLocaleString()} occupied bed-months`}
            icon={BedDouble}
            iconStyle="bg-teal-50 text-teal-700"
          />

          <MetricCard
            title="Total revenue"
            value={formatShortCurrency(summary.totalRevenue)}
            subtitle={`${filteredMonthlyData.length} month reporting total`}
            icon={Wallet}
            iconStyle="bg-emerald-50 text-emerald-700"
            trend={revenueChange}
          />

          <MetricCard
            title="Open complaint records"
            value={summary.totalOpenComplaints.toLocaleString()}
            subtitle="Sum of monthly open-complaint figures"
            icon={MessageSquareWarning}
            iconStyle="bg-amber-50 text-amber-700"
          />
        </div>
      </section>

      {/* Occupancy and revenue charts */}
      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <BedDouble size={18} />
                </div>
                <h2 className="text-lg font-bold text-smart-primary">
                  Occupancy trends
                </h2>
              </div>
              <p className="mt-2 text-sm text-smart-secondary">
                Occupied and available beds by month
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {chartHeading}
            </span>
          </div>

          <div className="h-[300px] w-full">
            {occupancyChartData.length ? (
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
                    dataKey="month"
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
              <EmptyState />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Occupied records</p>
              <p className="mt-1 text-lg font-bold text-slate-800">
                {summary.totalOccupied.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Available records</p>
              <p className="mt-1 text-lg font-bold text-slate-800">
                {summary.totalAvailable.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <TrendingUp size={18} />
                </div>
                <h2 className="text-lg font-bold text-smart-primary">
                  Revenue & expenses
                </h2>
              </div>
              <p className="mt-2 text-sm text-smart-secondary">
                Monthly financial performance in LKR
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              {totalProfit >= 0 ? "Positive balance" : "Negative balance"}
            </span>
          </div>

          <div className="h-[300px] w-full">
            {revenueChartData.length ? (
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
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#059669" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f59e0b" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-xs text-emerald-700">Net profit</p>
              <p className="mt-1 text-lg font-bold text-emerald-800">
                {formatShortCurrency(totalProfit)}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Total expenses</p>
              <p className="mt-1 text-lg font-bold text-amber-800">
                {formatShortCurrency(summary.totalExpenses)}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Complaints */}
      <section className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Card>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-smart-primary">
                Complaint analysis
              </h2>
              <p className="mt-1 text-sm text-smart-secondary">
                Reported issues grouped by service category
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
                      Categorized complaint entries
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
                                backgroundColor:
                                  COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium text-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState message="No categorized complaints in this period." />
            )}
          </Card>
        </div>

        {/* Block comparison */}
        <div className="xl:col-span-2">
          <Card>
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Building2 size={18} />
                </div>
                <h2 className="text-lg font-bold text-smart-primary">
                  Block occupancy
                </h2>
              </div>
              <p className="mt-2 text-sm text-smart-secondary">
                Latest occupancy snapshot by block
              </p>
            </div>

            <div className="space-y-5">
              {blockOccupancyChartData.map((item, index) => (
                <div key={item.block}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {item.block}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.rate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(item.rate, 100)}%`,
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {item.occupied} occupied / {item.total} beds
                    {item.total > 0 &&
                      ` · ${Math.max(item.total - item.occupied, 0)} available`}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Occupancy insight
              </p>
              <p className="mt-1 text-xs leading-5 text-blue-800">
                {blockOccupancyChartData.length
                  ? `${blockOccupancyChartData.reduce(
                      (best, item) => (item.rate > best.rate ? item : best),
                      blockOccupancyChartData[0]
                    ).block} has the highest occupancy in the displayed snapshot.`
                  : "No block occupancy data available."}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Financial summary and activity */}
      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CircleDollarSign size={21} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Financial summary
              </h2>
              <p className="text-sm text-smart-secondary">
                Income and spending overview
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FinancialRow
              label="Total revenue"
              value={formatCurrency(summary.totalRevenue)}
            />
            <FinancialRow
              label="Total expenses"
              value={formatCurrency(summary.totalExpenses)}
            />
            <FinancialRow
              label="Net profit"
              value={formatCurrency(totalProfit)}
              highlight
              positive={totalProfit >= 0}
            />
            <FinancialRow
              label="Profit margin"
              value={`${profitMargin.toFixed(1)}%`}
            />
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Activity size={21} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Recent activity
              </h2>
              <p className="text-sm text-smart-secondary">
                Latest sample system activity
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <div
                key={`${activity.title}-${activity.time}`}
                className="flex gap-3"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      index % 2 === 0
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <Activity size={17} />
                  </div>
                  {index < recentActivity.length - 1 && (
                    <div className="mt-2 min-h-5 w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {activity.title}
                    </p>
                    <span className="text-xs text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {activity.description}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-600">
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <p className="px-1 text-center text-xs text-smart-secondary">
        SmartStay Analytics · Figures are based on the project's current
        sample data and are not live backend records.
      </p>
    </div>
  );
}

function FinancialRow({ label, value, highlight, positive = true }) {
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

export default AnalyticsDashboard;
