
import { useMemo, useState } from "react";
import {
  Droplets,
  Zap,
  Wallet,
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  Search,
  RotateCcw,
  Download,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";

import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  utilitySummary,
  utilityData,
  foodOrderData,
  popularMeals,
  foodOrders,
} from "../../data/utilitiesData";

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e"];

const PERIOD_OPTIONS = [
  { value: "1", label: "Last month" },
  { value: "3", label: "Last 3 months" },
  { value: "6", label: "Last 6 months" },
  { value: "12", label: "Last 1 year (12 months)" },
];

const formatCurrency = (value) =>
  `Rs. ${Number(value).toLocaleString("en-LK")}`;

const downloadCSV = (filename, rows) => {
  if (!rows || rows.length === 0) {
    window.alert("No data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = String(row[header] ?? "").replace(/"/g, '""');
          return `"${value}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

const StatCard = ({ title, value, change, status, icon: Icon }) => {
  const isPositive = status === "success";

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>

          <div className="mt-3 flex items-center gap-2">
            {isPositive ? (
              <TrendingDown size={16} className="text-emerald-600" />
            ) : (
              <TrendingUp size={16} className="text-amber-600" />
            )}

            <span
              className={`text-sm font-medium ${
                isPositive ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-400">vs previous period</span>
          </div>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={23} />
        </div>
      </div>
    </Card>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <p className="mb-2 font-semibold text-gray-800">{label}</p>

      {payload.map((item, index) => (
        <p key={index} className="text-sm" style={{ color: item.color }}>
          {item.name}:{" "}
          {typeof item.value === "number"
            ? item.value.toLocaleString("en-LK")
            : item.value}
        </p>
      ))}
    </div>
  );
};

export default function UtilitiesAnalytics() {
  const [period, setPeriod] = useState("6");
  const [block, setBlock] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Select the latest available months from the sample data.
  const filteredUtilityData = useMemo(() => {
    const count = Number(period);

    return utilityData.slice(-count);
  }, [period]);

  const filteredFoodData = useMemo(() => {
    const count = Number(period);

    return foodOrderData.slice(-count);
  }, [period]);

  // Apply the table filters to food orders.
  const filteredOrders = useMemo(() => {
    return foodOrders.filter((order) => {
      const matchesBlock = block === "All" || order.block === block;
      const matchesStatus = status === "All" || order.status === status;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        searchText === "" ||
        order.id.toLowerCase().includes(searchText) ||
        order.student.toLowerCase().includes(searchText) ||
        order.meal.toLowerCase().includes(searchText);

      return matchesBlock && matchesStatus && matchesSearch;
    });
  }, [block, status, search]);

  const totalWater = filteredUtilityData.reduce(
    (total, item) => total + item.water,
    0,
  );

  const totalElectricity = filteredUtilityData.reduce(
    (total, item) => total + item.electricity,
    0,
  );

  const totalFoodOrders = filteredFoodData.reduce(
    (total, item) => total + item.orders,
    0,
  );

  const totalFoodRevenue = filteredFoodData.reduce(
    (total, item) => total + item.revenue,
    0,
  );

  const resetFilters = () => {
    setPeriod("6");
    setBlock("All");
    setStatus("All");
    setSearch("");
  };

  const exportUtilities = () => {
    downloadCSV("utility-analytics.csv", filteredUtilityData);
  };

  const exportFoodOrders = () => {
    downloadCSV("food-orders.csv", filteredOrders);
  };

  const exportFoodAnalytics = () => {
    downloadCSV("food-analytics.csv", filteredFoodData);
  };

  const selectedPeriodLabel =
    PERIOD_OPTIONS.find((option) => option.value === period)?.label ??
    "Last 6 months";

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Utilities & Food Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor utility consumption, expenses, and food-order performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="reporting-period" className="text-sm font-medium text-gray-600">
            Reporting period
          </label>

          <select
            id="reporting-period"
            aria-label="Select reporting period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Reporting period information */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        Showing data for <strong>{selectedPeriodLabel}</strong>. Results use the
        latest available months in your sample dataset.
      </div>

      {/* Summary cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Utility Summary
          </h2>
          <p className="text-sm text-gray-500">
            Key utility indicators and expenses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Water Consumption"
            value={`${totalWater.toLocaleString("en-LK")} L`}
            change={utilitySummary[0]?.change ?? "—"}
            status={utilitySummary[0]?.status}
            icon={Droplets}
          />

          <StatCard
            title="Electricity Usage"
            value={`${totalElectricity.toLocaleString("en-LK")} kWh`}
            change={utilitySummary[1]?.change ?? "—"}
            status={utilitySummary[1]?.status}
            icon={Zap}
          />

          <StatCard
            title="Utility Expenses"
            value={utilitySummary[2]?.value ?? "Rs. 0"}
            change={utilitySummary[2]?.change ?? "—"}
            status={utilitySummary[2]?.status}
            icon={Wallet}
          />

          <StatCard
            title="Food Orders"
            value={totalFoodOrders.toLocaleString("en-LK")}
            change={utilitySummary[3]?.change ?? "—"}
            status={utilitySummary[3]?.status}
            icon={UtensilsCrossed}
          />
        </div>
      </section>

      {/* Utility charts */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Utility Consumption
          </h2>
          <p className="text-sm text-gray-500">
            Water and electricity usage across the selected period.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">
                Water Consumption
              </h3>
              <p className="text-sm text-gray-500">Monthly usage in litres</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredUtilityData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis tickLine={false} width={55} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="water"
                    name="Water (L)"
                    fill="#06b6d4"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">
                Electricity Usage
              </h3>
              <p className="text-sm text-gray-500">Monthly usage in kWh</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredUtilityData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis tickLine={false} width={55} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="electricity"
                    name="Electricity (kWh)"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={exportUtilities}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Download size={16} />
            Export Utility Data
          </button>
        </div>
      </section>

      {/* Utility alerts */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Utility Monitoring Alerts
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Water Consumption
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Review water usage and check for possible leaks or unnecessary
                  consumption.
                </p>
                <p className="mt-2 text-sm font-medium text-amber-700">
                  Sample alert: usage requires review
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">
                <Zap size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Electricity Monitoring
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Track electricity usage and encourage energy-saving practices
                  in hostel blocks.
                </p>
                <p className="mt-2 text-sm font-medium text-emerald-700">
                  Monitor monthly usage trends
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Food analytics */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Food Order Analytics
            </h2>
            <p className="text-sm text-gray-500">
              Food-order volume and revenue for the selected period.
            </p>
          </div>

          <button
            type="button"
            onClick={exportFoodAnalytics}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download size={16} />
            Export Food Analytics
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <ShoppingBag size={23} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalFoodOrders.toLocaleString("en-LK")}
                </h3>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Wallet size={23} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Food Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalFoodRevenue)}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">
                Food Orders and Revenue
              </h3>
              <p className="text-sm text-gray-500">
                Compare order volume and revenue by month.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredFoodData}
                  margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis
                    yAxisId="orders"
                    tickLine={false}
                    width={45}
                  />
                  <YAxis
                    yAxisId="revenue"
                    orientation="right"
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (Rs.)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">Popular Meals</h3>
              <p className="text-sm text-gray-500">
                Distribution of sample orders by meal.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularMeals}
                    dataKey="orders"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={48}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {popularMeals.map((meal, index) => (
                      <Cell
                        key={meal.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      {/* Food order table */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Food Order Records
          </h2>
          <p className="text-sm text-gray-500">
            Search and filter the available sample food orders.
          </p>
        </div>

        <Card>
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order ID, student, or meal..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              aria-label="Filter by block"
              value={block}
              onChange={(event) => setBlock(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Blocks</option>
              <option value="A">Block A</option>
              <option value="B">Block B</option>
              <option value="C">Block C</option>
            </select>

            <select
              aria-label="Filter by order status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Preparing">Preparing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={exportFoodOrders}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          <div className="mb-3 text-sm text-gray-500">
            Showing {filteredOrders.length} of {foodOrders.length} orders
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Meal</th>
                  <th className="px-4 py-3 font-semibold">Block</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.student}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.meal}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        Block {order.block}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "success"
                              : order.status === "Preparing"
                                ? "info"
                                : order.status === "Pending"
                                  ? "warning"
                                  : "danger"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No food orders match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Data note */}
      <p className="text-xs leading-5 text-gray-400">
        Note: This dashboard currently uses demonstration data from
        utilitiesData.js. Summary percentages, expenses, alert messages, and
        meal popularity are sample values, not live measurements.
      </p>
    </div>
  );
}
