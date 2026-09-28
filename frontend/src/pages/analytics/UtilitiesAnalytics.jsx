import { useState } from "react";
import {
  Droplets,
  Zap,
  Wallet,
  Utensils,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

const COLORS = [
  "#0f4c81",
  "#1686d4",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
];

function UtilitiesAnalytics() {
  const [month, setMonth] = useState("All");
  const [block, setBlock] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Filter monthly utility data
  const filteredUtilityData =
    month === "All"
      ? utilityData
      : utilityData.filter((item) => item.month === month);

  // Filter food order data by month
  const filteredFoodData =
    month === "All"
      ? foodOrderData
      : foodOrderData.filter((item) => item.month === month);

  // Filter orders by search, block and status
  const filteredOrders = foodOrders.filter((order) => {
    const matchesSearch =
      order.student.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.meal.toLowerCase().includes(search.toLowerCase());

    const matchesBlock =
      block === "All" || order.block === block;

    const matchesStatus =
      status === "All" || order.status === status;

    return matchesSearch && matchesBlock && matchesStatus;
  });

  // Calculate filtered food order totals
  const totalOrders = filteredFoodData.reduce(
    (total, item) => total + item.orders,
    0
  );

  const totalRevenue = filteredFoodData.reduce(
    (total, item) => total + item.revenue,
    0
  );

  const totalWater = filteredUtilityData.reduce(
    (total, item) => total + item.water,
    0
  );

  const totalElectricity = filteredUtilityData.reduce(
    (total, item) => total + item.electricity,
    0
  );

  // Export filtered orders as CSV
  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Student",
      "Meal",
      "Block",
      "Amount",
      "Status",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.student,
      order.meal,
      order.block,
      order.amount,
      order.status,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smartstay-food-orders.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      title: "Water Consumption",
      value: `${totalWater.toLocaleString()} L`,
      icon: Droplets,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Electricity Usage",
      value: `${totalElectricity.toLocaleString()} kWh`,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Food Orders",
      value: totalOrders.toLocaleString(),
      icon: Utensils,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Food Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Utilities & Food Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor hostel utilities, food orders, and revenue.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-smart-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-smart-blue"
        >
          <Download size={18} />
          Export Orders
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl p-3 ${stat.bg}`}
                >
                  <Icon
                    size={23}
                    className={stat.color}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Month Filter */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />

            <span className="text-sm font-semibold text-slate-700">
              Filter Analytics
            </span>
          </div>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
          >
            <option value="All">All Months</option>
            {utilityData.map((item) => (
              <option key={item.month} value={item.month}>
                {item.month}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Utility Chart */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Utility Consumption
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Water and electricity usage by month.
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredUtilityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="water"
                name="Water (L)"
                fill="#06b6d4"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="electricity"
                name="Electricity (kWh)"
                fill="#f59e0b"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Food Analytics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Orders and Revenue Chart */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Food Order Trends
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monthly food orders and revenue.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredFoodData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#1686d4"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue (Rs.)"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Popular Meals */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Popular Meals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Food preferences based on sample order counts.
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
                  outerRadius={100}
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

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Food Orders Table */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Food Order Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and filter hostel food orders.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-smart-blue sm:w-48"
              />
            </div>

            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
            >
              <option value="All">All Blocks</option>
              <option value="A">Block A</option>
              <option value="B">Block B</option>
              <option value="C">Block C</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Preparing">Preparing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="px-4 py-4 font-semibold">
                  Order ID
                </th>

                <th className="px-4 py-4 font-semibold">
                  Student
                </th>

                <th className="px-4 py-4 font-semibold">
                  Meal
                </th>

                <th className="px-4 py-4 font-semibold">
                  Block
                </th>

                <th className="px-4 py-4 font-semibold">
                  Amount
                </th>

                <th className="px-4 py-4 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-semibold text-smart-primary">
                    {order.id}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                    {order.student}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {order.meal}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    Block {order.block}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-700">
                    Rs. {order.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
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
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No food orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Showing {filteredOrders.length} of {foodOrders.length} orders
        </div>
      </Card>
    </div>
  );
}

export default UtilitiesAnalytics;