import { useMemo, useState } from "react";

import {
  Download,
  RotateCcw,
  Users,
  BedDouble,
  Wallet,
  MessageSquareWarning,
  Activity,
  TrendingUp,
  TrendingDown,
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
  months,
  overallMonthlyData,
  blockData,
  recentActivity,
} from "../../data/analyticsData";

function AnalyticsDashboard() {
  // =====================================================
  // FILTER STATE
  // =====================================================

  const [dateRange, setDateRange] = useState("6months");
  const [selectedBlock, setSelectedBlock] = useState("All");

  // =====================================================
  // SELECT DATA SOURCE
  // =====================================================

  const sourceData = useMemo(() => {
    if (selectedBlock === "All") {
      return overallMonthlyData;
    }

    return blockData[selectedBlock] || overallMonthlyData;
  }, [selectedBlock]);

  // =====================================================
  // DATE RANGE FILTER
  // =====================================================

  const filteredMonthlyData = useMemo(() => {
    let numberOfMonths = 6;

    if (dateRange === "1month") {
      numberOfMonths = 1;
    }

    if (dateRange === "3months") {
      numberOfMonths = 3;
    }

    if (dateRange === "6months") {
      numberOfMonths = 6;
    }

    return sourceData.slice(-numberOfMonths);
  }, [sourceData, dateRange]);

  // =====================================================
  // HELPER - FORMAT RUPEES
  // =====================================================

  function formatCurrency(value) {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  }

  function formatShortCurrency(value) {
    const number = Number(value || 0);

    if (number >= 1000000) {
      return `Rs. ${(number / 1000000).toFixed(2)}M`;
    }

    if (number >= 1000) {
      return `Rs. ${(number / 1000).toFixed(0)}K`;
    }

    return `Rs. ${number.toLocaleString()}`;
  }

  // =====================================================
  // SUMMARY CALCULATIONS
  // =====================================================

  const summary = useMemo(() => {
    const data = filteredMonthlyData;

    if (data.length === 0) {
      return {
        totalStudents: 0,
        averageOccupancy: 0,
        totalRevenue: 0,
        totalComplaints: 0,
        totalOccupied: 0,
        totalBeds: 0,
      };
    }

    const averageStudents =
      data.reduce((sum, item) => sum + item.students, 0) /
      data.length;

    const totalOccupied = data.reduce(
      (sum, item) => sum + item.occupied,
      0
    );

    const totalBeds = data.reduce(
      (sum, item) => sum + item.totalBeds,
      0
    );

    const averageOccupancy =
      totalBeds > 0
        ? (totalOccupied / totalBeds) * 100
        : 0;

    const totalRevenue = data.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    const totalComplaints = data.reduce(
      (sum, item) => sum + item.openComplaints,
      0
    );

    return {
      totalStudents: Math.round(averageStudents),
      averageOccupancy,
      totalRevenue,
      totalComplaints,
      totalOccupied,
      totalBeds,
    };
  }, [filteredMonthlyData]);

  // =====================================================
  // OCCUPANCY CHART DATA
  // =====================================================

  const occupancyChartData = useMemo(() => {
    return filteredMonthlyData.map((item) => ({
      month: item.month,
      occupied: item.occupied,
      available: Math.max(item.totalBeds - item.occupied, 0),
    }));
  }, [filteredMonthlyData]);

  // =====================================================
  // REVENUE CHART DATA
  // =====================================================

  const revenueChartData = useMemo(() => {
    return filteredMonthlyData.map((item) => ({
      month: item.month,
      revenue: item.revenue,
      expenses: item.expenses,
    }));
  }, [filteredMonthlyData]);

  // =====================================================
  // COMPLAINT CHART DATA
  // =====================================================

  const complaintChartData = useMemo(() => {
    const totals = {
      Maintenance: 0,
      Cleaning: 0,
      Internet: 0,
      Water: 0,
      Other: 0,
    };

    filteredMonthlyData.forEach((monthData) => {
      Object.entries(monthData.complaints || {}).forEach(
        ([category, count]) => {
          if (totals[category] !== undefined) {
            totals[category] += count;
          }
        }
      );
    });

    return Object.entries(totals)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .filter((item) => item.count > 0);
  }, [filteredMonthlyData]);

  // =====================================================
  // BLOCK-WISE OCCUPANCY
  // =====================================================

  const blockOccupancyChartData = useMemo(() => {
    // If a specific block is selected,
    // show that block for the selected period.
    if (selectedBlock !== "All") {
      const selectedData = blockData[selectedBlock] || [];

      const selectedRange = selectedData.slice(
        -filteredMonthlyData.length
      );

      const occupied =
        selectedRange.length > 0
          ? selectedRange[selectedRange.length - 1].occupied
          : 0;

      const total =
        selectedRange.length > 0
          ? selectedRange[selectedRange.length - 1].totalBeds
          : 0;

      return [
        {
          block: selectedBlock,
          occupied,
          available: Math.max(total - occupied, 0),
          total,
        },
      ];
    }

    // All blocks selected
    return Object.entries(blockData).map(
      ([blockName, data]) => {
        const selectedRange = data.slice(
          -filteredMonthlyData.length
        );

        const latest =
          selectedRange[selectedRange.length - 1];

        return {
          block: blockName,
          occupied: latest?.occupied || 0,
          available: latest
            ? Math.max(
                latest.totalBeds - latest.occupied,
                0
              )
            : 0,
          total: latest?.totalBeds || 0,
        };
      }
    );
  }, [selectedBlock, filteredMonthlyData.length]);

  // =====================================================
  // TOTAL PROFIT
  // =====================================================

  const totalExpenses = useMemo(() => {
    return filteredMonthlyData.reduce(
      (sum, item) => sum + item.expenses,
      0
    );
  }, [filteredMonthlyData]);

  const totalProfit = summary.totalRevenue - totalExpenses;

  // =====================================================
  // COMPLAINT TOTAL
  // =====================================================

  const complaintTotal = complaintChartData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // =====================================================
  // CSV EXPORT
  // =====================================================

  function exportCSV() {
    const rows = filteredMonthlyData.map((item) => [
      item.month,
      item.students,
      item.totalBeds,
      item.occupied,
      item.totalBeds - item.occupied,
      item.revenue,
      item.expenses,
      item.openComplaints,
    ]);

    const headers = [
      "Month",
      "Students",
      "Total Beds",
      "Occupied Beds",
      "Available Beds",
      "Revenue",
      "Expenses",
      "Open Complaints",
    ];

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

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
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // =====================================================
  // RESET FILTERS
  // =====================================================

  function resetFilters() {
    setDateRange("6months");
    setSelectedBlock("All");
  }

  // =====================================================
  // PIE CHART COLORS
  // =====================================================

  const complaintColors = [
    "#0ea5e9",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  // =====================================================
  // CUSTOM TOOLTIP
  // =====================================================

  function CurrencyTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    return (
      <div className="rounded-xl border border-black/10 bg-white p-3 shadow-lg">
        <p className="mb-2 font-semibold text-smart-primary">
          {label}
        </p>

        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="text-sm text-smart-secondary"
          >
            {entry.name}:{" "}
            <span className="font-semibold text-smart-primary">
              {formatCurrency(entry.value)}
            </span>
          </p>
        ))}
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">
            Smart Analytics
          </h1>

          <p className="mt-2 text-smart-secondary">
            Monitor hostel occupancy, revenue, complaints,
            and operational performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-smart-primary transition hover:border-smart-blue hover:text-smart-blue"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl bg-smart-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-smart-blue"
          >
            <Download size={17} />
            Export CSV
          </button>

        </div>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <Card>
        <div className="grid gap-4 md:grid-cols-2">

          {/* Date Range */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-smart-primary">
              Date Range
            </label>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
            >
              <option value="1month">
                Last 1 Month
              </option>

              <option value="3months">
                Last 3 Months
              </option>

              <option value="6months">
                Last 6 Months
              </option>
            </select>
          </div>

          {/* Block */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-smart-primary">
              Hostel Block
            </label>

            <select
              value={selectedBlock}
              onChange={(e) =>
                setSelectedBlock(e.target.value)
              }
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
            >
              <option value="All">
                All Blocks
              </option>

              <option value="Block A">
                Block A
              </option>

              <option value="Block B">
                Block B
              </option>

              <option value="Block C">
                Block C
              </option>
            </select>
          </div>

        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-smart-secondary">
          <span className="rounded-full bg-smart-background px-3 py-1.5">
            Block:{" "}
            <strong className="text-smart-primary">
              {selectedBlock}
            </strong>
          </span>

          <span className="rounded-full bg-smart-background px-3 py-1.5">
            Period:{" "}
            <strong className="text-smart-primary">
              {filteredMonthlyData.length} month
              {filteredMonthlyData.length !== 1
                ? "s"
                : ""}
            </strong>
          </span>
        </div>
      </Card>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Students */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">
                Average Students
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {summary.totalStudents}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                Selected period
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10">
              <Users
                size={21}
                className="text-smart-blue"
              />
            </div>
          </div>
        </Card>

        {/* Occupancy */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">
                Average Occupancy
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {summary.averageOccupancy.toFixed(1)}%
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                {summary.totalOccupied} occupied bed records
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-teal/10">
              <BedDouble
                size={21}
                className="text-smart-teal"
              />
            </div>
          </div>
        </Card>

        {/* Revenue */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">
                Period Revenue
              </p>

              <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                {formatShortCurrency(summary.totalRevenue)}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                {filteredMonthlyData.length} month
                {filteredMonthlyData.length !== 1
                  ? "s"
                  : ""} total
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-success/10">
              <Wallet
                size={21}
                className="text-smart-success"
              />
            </div>
          </div>
        </Card>

        {/* Complaints */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">
                Complaint Reports
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {complaintTotal}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                Selected period
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-warning/10">
              <MessageSquareWarning
                size={21}
                className="text-smart-warning"
              />
            </div>
          </div>
        </Card>

      </div>

      {/* =================================================
          OCCUPANCY + REVENUE
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Occupancy */}
        <Card>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Activity
                size={20}
                className="text-smart-blue"
              />

              <h2 className="text-lg font-bold text-smart-primary">
                Hostel Occupancy
              </h2>
            </div>

            <p className="mt-1 text-sm text-smart-secondary">
              {selectedBlock === "All"
                ? "All blocks"
                : selectedBlock}{" "}
              occupancy for the selected period
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={occupancyChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="occupied"
                  name="Occupied"
                  fill="#0f6fff"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="available"
                  name="Available"
                  fill="#dbeafe"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue */}
        <Card>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp
                size={20}
                className="text-smart-success"
              />

              <h2 className="text-lg font-bold text-smart-primary">
                Revenue & Expenses
              </h2>
            </div>

            <p className="mt-1 text-sm text-smart-secondary">
              Financial performance for the selected period
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={revenueChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${(value / 1000000).toFixed(1)}M`
                  }
                />

                <Tooltip
                  content={<CurrencyTooltip />}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
            <div>
              <p className="text-xs text-smart-secondary">
                Net Profit
              </p>

              <p className="font-bold text-smart-primary">
                {formatShortCurrency(totalProfit)}
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm">
              {totalProfit >= 0 ? (
                <>
                  <TrendingUp
                    size={16}
                    className="text-smart-success"
                  />

                  <span className="font-semibold text-smart-success">
                    Positive
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown
                    size={16}
                    className="text-smart-danger"
                  />

                  <span className="font-semibold text-smart-danger">
                    Negative
                  </span>
                </>
              )}
            </div>
          </div>
        </Card>

      </div>

      {/* =================================================
          COMPLAINT ANALYSIS
      ================================================= */}

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-smart-primary">
            Complaint Analysis
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            {selectedBlock === "All"
              ? "All blocks"
              : selectedBlock}{" "}
            complaints by service category
          </p>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-2">

          {/* Donut Chart */}
          <div className="h-[330px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={complaintChartData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={120}
                  paddingAngle={3}
                  labelLine={false}
                >
                  {complaintChartData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${entry.category}`}
                        fill={
                          complaintColors[
                            index %
                              complaintColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Complaint Details */}
          <div className="space-y-3">

            <div className="rounded-xl bg-smart-background p-4">
              <p className="text-sm text-smart-secondary">
                Total Complaints
              </p>

              <p className="mt-1 text-2xl font-bold text-smart-primary">
                {complaintTotal}
              </p>
            </div>

            {complaintChartData.map(
              (item, index) => {
                const percentage =
                  complaintTotal > 0
                    ? (item.count /
                        complaintTotal) *
                      100
                    : 0;

                return (
                  <div
                    key={item.category}
                    className="rounded-xl border border-black/5 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              complaintColors[
                                index %
                                  complaintColors.length
                              ],
                          }}
                        />

                        <span className="text-sm font-semibold text-smart-primary">
                          {item.category}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-smart-primary">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-smart-background">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            complaintColors[
                              index %
                                complaintColors.length
                            ],
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-smart-secondary">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              }
            )}

          </div>
        </div>
      </Card>

      {/* =================================================
          BLOCK-WISE OCCUPANCY
      ================================================= */}

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-smart-primary">
            Block-wise Occupancy
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            Latest occupancy within the selected date range
          </p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={blockOccupancyChartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="block"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="occupied"
                name="Occupied"
                fill="#0f6fff"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="available"
                name="Available"
                fill="#dbeafe"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* =================================================
          FINANCIAL SUMMARY
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Revenue Summary */}
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Wallet
              size={20}
              className="text-smart-success"
            />

            <h2 className="font-bold text-smart-primary">
              Financial Summary
            </h2>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-smart-secondary">
                Total Revenue
              </span>

              <span className="font-bold text-smart-primary">
                {formatCurrency(summary.totalRevenue)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-smart-secondary">
                Total Expenses
              </span>

              <span className="font-bold text-smart-primary">
                {formatCurrency(totalExpenses)}
              </span>
            </div>

            <div className="border-t border-black/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-smart-secondary">
                  Net Profit
                </span>

                <span
                  className={`font-bold ${
                    totalProfit >= 0
                      ? "text-smart-success"
                      : "text-smart-danger"
                  }`}
                >
                  {formatCurrency(totalProfit)}
                </span>
              </div>
            </div>

          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Activity
              size={20}
              className="text-smart-blue"
            />

            <h2 className="font-bold text-smart-primary">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-4">

            {recentActivity.map((activity) => (
              <div
                key={`${activity.title}-${activity.time}`}
                className="flex gap-3"
              >
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-smart-blue" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-smart-primary">
                    {activity.title}
                  </p>

                  <p className="mt-0.5 text-xs text-smart-secondary">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-smart-secondary">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </Card>

      </div>

    </div>
  );
}

export default AnalyticsDashboard;