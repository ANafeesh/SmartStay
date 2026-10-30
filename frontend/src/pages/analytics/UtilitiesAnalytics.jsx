import { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
  AlertCircle,
  Activity,
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
import EmptyState from "../../components/ui/EmptyState";

import {
  getTelemetryTrend,
  getMonitoringAlerts,
  getFoodOrderAnalytics,
  getFoodOrders,
  getFinancialAnalytics,
} from "../../services/analyticsApi";

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6"];

const PERIOD_OPTIONS = [
  { value: "1", label: "Last month" },
  { value: "3", label: "Last 3 months" },
  { value: "6", label: "Last 6 months" },
  { value: "12", label: "Last 1 year (12 months)" },
];

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

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
        .join(",")
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
            <span className="text-xs text-gray-400">telemetry active</span>
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("6");
  const [block, setBlock] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Data states from live backend
  const [telemetry, setTelemetry] = useState({
    totalWater: 0,
    totalElectricity: 0,
    dailySummary: [],
    monthlySummary: [],
    timeline: [],
  });

  const [foodAnalytics, setFoodAnalytics] = useState({
    totalOrders: 0,
    realizedRevenue: 0,
    activeOrderRevenue: 0,
    popularMeals: [],
    volumeTrends: [],
  });

  const [rawOrders, setRawOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [financialData, setFinancialData] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [trendRes, foodRes, ordersRes, alertsRes, finRes] = await Promise.all([
        getTelemetryTrend().catch(() => ({ data: {} })),
        getFoodOrderAnalytics().catch(() => ({ data: {} })),
        getFoodOrders().catch(() => ({ data: [] })),
        getMonitoringAlerts().catch(() => ({ data: [] })),
        getFinancialAnalytics().catch(() => ({ data: {} })),
      ]);

      if (trendRes?.data) {
        setTelemetry({
          totalWater: trendRes.data.totalWater || 0,
          totalElectricity: trendRes.data.totalElectricity || 0,
          dailySummary: trendRes.data.dailySummary || [],
          monthlySummary: trendRes.data.monthlySummary || [],
          timeline: trendRes.data.timeline || [],
        });
      }

      if (foodRes?.data) {
        setFoodAnalytics({
          totalOrders: foodRes.data.totalOrders || 0,
          realizedRevenue: foodRes.data.realizedRevenue || 0,
          activeOrderRevenue: foodRes.data.activeOrderRevenue || 0,
          popularMeals: foodRes.data.popularMeals || [],
          volumeTrends: foodRes.data.volumeTrends || [],
        });
      }

      setRawOrders(ordersRes?.data || []);
      setAlerts(alertsRes?.data || []);
      setFinancialData(finRes?.data || null);
    } catch (err) {
      console.error("Failed to load utilities analytics data:", err);
      setError(err.message || "Failed to load utility and food order analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Filter utility trend data according to selected period
  const filteredUtilityData = useMemo(() => {
    const count = Number(period);
    const months = telemetry.monthlySummary || [];

    if (months.length > 0) {
      return months.slice(-count).map((m) => ({
        month: m.month,
        water: m.water,
        electricity: m.electricity,
      }));
    }

    // Fallback if only daily entries exist
    const daily = telemetry.dailySummary || [];
    if (daily.length > 0) {
      return daily.slice(-count).map((d) => ({
        month: d.date,
        water: d.water,
        electricity: d.electricity,
      }));
    }

    return [];
  }, [telemetry, period]);

  // Filter food order monthly/daily trends
  const filteredFoodData = useMemo(() => {
    const count = Number(period);
    const trends = foodAnalytics.volumeTrends || [];
    if (trends.length > 0) {
      return trends.slice(-count).map((t) => ({
        month: t.date,
        orders: t.orderCount,
        revenue: t.revenue,
      }));
    }
    return [];
  }, [foodAnalytics, period]);

  // Format popular meals for PieChart
  const popularMealsList = useMemo(() => {
    return (foodAnalytics.popularMeals || []).map((m) => ({
      name: m.name,
      orders: m.totalQuantity,
      revenue: m.totalRevenue,
    }));
  }, [foodAnalytics]);

  // Map and filter raw orders for the food order records table
  const filteredOrders = useMemo(() => {
    const mapped = (rawOrders || []).map((o) => {
      const orderId = o.orderNo || String(o._id).slice(-6).toUpperCase();
      const student = o.studentName || o.studentId || "Student";
      const meal =
        o.items && o.items.length > 0
          ? o.items.map((it) => it.name).join(", ")
          : "Standard Meal";
      const location = o.deliveryLocation || "Hostel";
      const blockLetter = location.includes("Block")
        ? location.match(/Block\s*([A-Za-z0-9]+)/i)?.[1]?.toUpperCase() || "A"
        : "A";
      const amount = Number(o.totalAmount || 0);
      const orderStatus = o.status || "Placed";

      return {
        id: orderId,
        student,
        meal,
        block: blockLetter,
        location,
        amount,
        status: orderStatus,
      };
    });

    return mapped.filter((order) => {
      const matchesBlock = block === "All" || order.block === block;
      const matchesStatus =
        status === "All" ||
        order.status.toLowerCase() === status.toLowerCase();

      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        searchText === "" ||
        order.id.toLowerCase().includes(searchText) ||
        order.student.toLowerCase().includes(searchText) ||
        order.meal.toLowerCase().includes(searchText);

      return matchesBlock && matchesStatus && matchesSearch;
    });
  }, [rawOrders, block, status, search]);

  const totalWater = useMemo(() => {
    if (filteredUtilityData.length > 0) {
      return filteredUtilityData.reduce((acc, it) => acc + (it.water || 0), 0);
    }
    return telemetry.totalWater;
  }, [filteredUtilityData, telemetry.totalWater]);

  const totalElectricity = useMemo(() => {
    if (filteredUtilityData.length > 0) {
      return filteredUtilityData.reduce(
        (acc, it) => acc + (it.electricity || 0),
        0
      );
    }
    return telemetry.totalElectricity;
  }, [filteredUtilityData, telemetry.totalElectricity]);

  // Calculate realistic utility expense from readings (or use billed amount from financial analytics)
  const utilityExpensesTotal = useMemo(() => {
    if (financialData?.totalBilledAmount > 0) {
      return financialData.totalBilledAmount;
    }
    // Standard utility tariffs in Sri Lanka: Rs. 40/L water + Rs. 65/kWh electricity
    const waterCost = totalWater * 0.05;
    const elecCost = totalElectricity * 65;
    return waterCost + elecCost;
  }, [financialData, totalWater, totalElectricity]);

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

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-9 w-9 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading utilities and food order analytics...
        </p>
      </div>
    );
  }

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
          <label
            htmlFor="reporting-period"
            className="text-sm font-medium text-gray-600"
          >
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
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-indigo-600" : ""}
            />
            Refresh
          </button>

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

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Reporting period information */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        Showing real telemetry data for <strong>{selectedPeriodLabel}</strong>.
        Aggregating live readings and active food orders from the database.
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
            change={`${telemetry.timeline.length} readings`}
            status="success"
            icon={Droplets}
          />

          <StatCard
            title="Electricity Usage"
            value={`${totalElectricity.toLocaleString("en-LK")} kWh`}
            change="Active"
            status="success"
            icon={Zap}
          />

          <StatCard
            title="Utility Expenses"
            value={formatCurrency(utilityExpensesTotal)}
            change="Realized"
            status="warning"
            icon={Wallet}
          />

          <StatCard
            title="Food Orders"
            value={foodAnalytics.totalOrders.toLocaleString("en-LK")}
            change={`${foodAnalytics.totalOrders} total`}
            status="success"
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
              <h3 className="font-semibold text-gray-900">Water Consumption</h3>
              <p className="text-sm text-gray-500">Recorded usage in litres</p>
            </div>

            {filteredUtilityData.length > 0 ? (
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
            ) : (
              <div className="py-12">
                <EmptyState
                  title="No Water Consumption Data"
                  description="No water telemetry readings recorded for this period."
                  icon={Droplets}
                />
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">Electricity Usage</h3>
              <p className="text-sm text-gray-500">Recorded usage in kWh</p>
            </div>

            {filteredUtilityData.length > 0 ? (
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
            ) : (
              <div className="py-12">
                <EmptyState
                  title="No Electricity Data"
                  description="No electricity telemetry readings recorded for this period."
                  icon={Zap}
                />
              </div>
            )}
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
          {alerts.length > 0 ? (
            alerts.slice(0, 2).map((alert) => (
              <Card key={alert.id}>
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg p-3 ${
                      alert.severity === "Critical"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <AlertTriangle size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {alert.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {alert.description}
                    </p>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        alert.severity === "Critical"
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      Threshold reached: {alert.percentage}% of limit
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">
                    <Droplets size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Water Consumption Normal
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Current water usage across all hostel blocks is well within safe daily limits.
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-700">
                      Safe threshold: Normal
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
                      Electricity Monitoring Normal
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Electricity telemetry meters are transmitting regularly with no threshold spikes detected.
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-700">
                      Safe threshold: Normal
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
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
              Food-order volume and revenue from canteen orders.
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
                  {foodAnalytics.totalOrders.toLocaleString("en-LK")}
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
                <p className="text-sm text-gray-500">Realized Food Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(foodAnalytics.realizedRevenue)}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">
                Food Orders and Revenue Trend
              </h3>
              <p className="text-sm text-gray-500">
                Order volume and revenue breakdown.
              </p>
            </div>

            {filteredFoodData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredFoodData}
                    margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} />
                    <YAxis yAxisId="orders" tickLine={false} width={45} />
                    <YAxis
                      yAxisId="revenue"
                      orientation="right"
                      tickLine={false}
                      width={65}
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
            ) : (
              <div className="py-12">
                <EmptyState
                  title="No Order Volume Trends"
                  description="No food order timeline history available yet."
                  icon={ShoppingBag}
                />
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900">Popular Meals</h3>
              <p className="text-sm text-gray-500">
                Distribution of orders across canteen menu items.
              </p>
            </div>

            {popularMealsList.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularMealsList}
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
                      {popularMealsList.map((meal, index) => (
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
            ) : (
              <div className="py-12">
                <EmptyState
                  title="No Popular Meals Data"
                  description="No menu item orders have been recorded yet."
                  icon={UtensilsCrossed}
                />
              </div>
            )}
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
            Search and filter real student food orders.
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
              <option value="Placed">Placed</option>
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
            Showing {filteredOrders.length} of {rawOrders.length} orders
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Meal</th>
                  <th className="px-4 py-3 font-semibold">Block / Location</th>
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
                      <td className="px-4 py-3 text-gray-700">{order.meal}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.location}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            order.status.toLowerCase() === "delivered" ||
                            order.status.toLowerCase() === "completed"
                              ? "success"
                              : order.status.toLowerCase() === "preparing"
                              ? "info"
                              : order.status.toLowerCase() === "cancelled"
                              ? "danger"
                              : "warning"
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
        Connected to live Module 5 analytics and real canteen orders from the SmartStay MongoDB database.
      </p>
    </div>
  );
}
