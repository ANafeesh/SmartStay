import { useState } from "react";

import {
  Activity,
  Droplets,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Building2,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  monitoringSummary,
  blockMonitoring,
  initialAlerts,
  monitoringHistory,
} from "../../data/monitoringData";

function SmartMonitoring() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [blockFilter, setBlockFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBlocks = blockMonitoring.filter((item) => {
    return blockFilter === "All" || item.block === blockFilter;
  });

  const filteredAlerts = alerts.filter((alert) => {
    const matchesBlock =
      blockFilter === "All" || alert.block === blockFilter;

    const matchesSeverity =
      severityFilter === "All" ||
      alert.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      alert.status === statusFilter;

    return matchesBlock && matchesSeverity && matchesStatus;
  });

  const activeCount = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  const criticalCount = alerts.filter(
    (alert) =>
      alert.status === "Active" &&
      alert.severity === "Critical"
  ).length;

  const acknowledgeAlert = (id) => {
    setAlerts((previousAlerts) =>
      previousAlerts.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Acknowledged" }
          : alert
      )
    );
  };

  const resolveAlert = (id) => {
    setAlerts((previousAlerts) =>
      previousAlerts.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
  };

  const getStatusVariant = (status) => {
    if (status === "Active") return "danger";
    if (status === "Acknowledged") return "warning";
    if (status === "Resolved") return "success";
    return "neutral";
  };

  const getSeverityVariant = (severity) => {
    return severity === "Critical" ? "danger" : "warning";
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Smart Monitoring
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor hostel utilities and manage system alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Demo Monitoring Active
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {monitoringSummary.map((item) => {
          const Icon =
            item.type === "water"
              ? Droplets
              : item.type === "electricity"
              ? Zap
              : item.type === "alerts"
              ? AlertTriangle
              : CheckCircle;

          const iconColor =
            item.type === "water"
              ? "text-cyan-600 bg-cyan-50"
              : item.type === "electricity"
              ? "text-amber-600 bg-amber-50"
              : item.type === "alerts"
              ? "text-red-600 bg-red-50"
              : "text-emerald-600 bg-emerald-50";

          return (
            <Card key={item.title}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-800">
                    {item.type === "alerts"
                      ? activeCount
                      : item.value}
                  </h2>

                  <p className="mt-2 text-xs text-slate-500">
                    {item.type === "alerts"
                      ? `${criticalCount} critical alerts`
                      : item.limit}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${iconColor}`}>
                  <Icon size={22} />
                </div>
              </div>

              {(item.type === "water" ||
                item.type === "electricity") && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      item.percentage >= 90
                        ? "bg-red-500"
                        : "bg-smart-blue"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />

            <h2 className="font-semibold text-slate-700">
              Monitoring Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Usage Chart */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Today's Consumption Trend
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sample water and electricity readings throughout the day.
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monitoringHistory}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="water"
                name="Water (L)"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="electricity"
                name="Electricity (kWh)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Block Monitoring */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Block-wise Monitoring
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Utility usage compared with daily limits.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {filteredBlocks.map((item) => {
            const waterPercent =
              (item.water / item.waterLimit) * 100;

            const electricityPercent =
              (item.electricity / item.electricityLimit) * 100;

            return (
              <Card key={item.block}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-smart-primary">
                      <Building2 size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        {item.block}
                      </h3>

                      <p className="text-xs text-slate-500">
                        Utility Overview
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      item.status === "Normal"
                        ? "success"
                        : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>

                {/* Water */}
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Droplets size={16} />
                      Water
                    </span>

                    <span className="font-semibold text-slate-800">
                      {item.water.toLocaleString()} L
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        waterPercent >= 90
                          ? "bg-red-500"
                          : "bg-cyan-500"
                      }`}
                      style={{
                        width: `${Math.min(waterPercent, 100)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Limit: {item.waterLimit.toLocaleString()} L
                  </p>
                </div>

                {/* Electricity */}
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Zap size={16} />
                      Electricity
                    </span>

                    <span className="font-semibold text-slate-800">
                      {item.electricity.toLocaleString()} kWh
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        electricityPercent >= 90
                          ? "bg-red-500"
                          : "bg-amber-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          electricityPercent,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Limit: {item.electricityLimit.toLocaleString()} kWh
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Monitoring Alerts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Acknowledge alerts or mark them as resolved.
            </p>
          </div>

          <Badge variant="danger">
            {activeCount} Active
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-3">
                  <div
                    className={`mt-1 rounded-xl p-3 ${
                      alert.severity === "Critical"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <AlertTriangle size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {alert.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {alert.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={getSeverityVariant(alert.severity)}>
                        {alert.severity}
                      </Badge>

                      <Badge variant="neutral">
                        {alert.block}
                      </Badge>

                      <Badge variant={getStatusVariant(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>

                    <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={14} />
                      {alert.time} · {alert.id}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {alert.status === "Active" && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== "Resolved" && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="rounded-lg bg-smart-primary px-3 py-2 text-sm font-medium text-white hover:bg-smart-blue"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="py-10 text-center">
              <CheckCircle
                size={32}
                className="mx-auto text-emerald-500"
              />

              <p className="mt-3 font-semibold text-slate-700">
                No matching alerts
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the filters.
              </p>
            </div>
          )}
        </div>
      </Card>

      <p className="flex items-center gap-2 text-xs text-slate-400">
        <Activity size={15} />
        Demonstration data only. Readings do not update from physical sensors.
      </p>
    </div>
  );
}

export default SmartMonitoring;