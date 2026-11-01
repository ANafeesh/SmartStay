import { useEffect, useState, useMemo } from "react";
import {
  Activity,
  Droplets,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Building2,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  X,
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
import EmptyState from "../../components/ui/EmptyState";

import {
  getMonitoringSummary,
  getBlockSummary,
  getTelemetryTrend,
  getMonitoringAlerts,
  createMonitoringReading,
} from "../../services/analyticsApi";

function SmartMonitoring() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [summaryData, setSummaryData] = useState([]);
  const [blocksData, setBlocksData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Filters
  const [blockFilter, setBlockFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Record Reading Modal State
  const [showModal, setShowModal] = useState(false);
  const [submittingReading, setSubmittingReading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    utilityType: "Water",
    value: "",
    unit: "L",
    blockName: "Block A",
    location: "",
  });

  const fetchData = async () => {
    try {
      setError(null);
      const [sumRes, blkRes, trendRes, altRes] = await Promise.all([
        getMonitoringSummary().catch(() => ({ data: [] })),
        getBlockSummary().catch(() => ({ data: [] })),
        getTelemetryTrend({ period: "24h" }).catch(() => ({
          data: { timeline: [] },
        })),
        getMonitoringAlerts().catch(() => ({ data: [] })),
      ]);

      setSummaryData(sumRes.data || []);
      setBlocksData(blkRes.data || []);
      // Reconcile alert status with localStorage persistence
      let ackList = [];
      let resList = [];
      try {
        ackList = JSON.parse(localStorage.getItem("smartstay_acknowledged_alerts") || "[]");
        resList = JSON.parse(localStorage.getItem("smartstay_resolved_alerts") || "[]");
      } catch {
        // fallback
      }
      const ackSet = new Set(ackList);
      const resSet = new Set(resList);

      const loadedAlerts = (altRes.data || []).map((a) => {
        if (resSet.has(a.id)) return { ...a, status: "Resolved" };
        if (ackSet.has(a.id)) return { ...a, status: "Acknowledged" };
        return a;
      });
      setAlerts(loadedAlerts);

      // Build unified timeline for chart (group by timestamp/time)
      const rawTimeline = trendRes?.data?.timeline || [];
      const groupedMap = {};
      rawTimeline.forEach((item) => {
        const timeKey = item.time || new Date(item.recordedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        if (!groupedMap[timeKey]) {
          groupedMap[timeKey] = { time: timeKey, water: 0, electricity: 0 };
        }
        if (item.utilityType === "Water") {
          groupedMap[timeKey].water += Number(item.value || 0);
        } else if (item.utilityType === "Electricity") {
          groupedMap[timeKey].electricity += Number(item.value || 0);
        }
      });

      setTimelineData(Object.values(groupedMap));
    } catch (err) {
      console.error("Failed to load smart monitoring data:", err);
      setError(err.message || "Failed to load smart monitoring telemetry.");
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

  // Filter blocks
  const filteredBlocks = useMemo(() => {
    return blocksData.filter((item) => {
      const bName = item.blockName || item.block;
      return blockFilter === "All" || bName === blockFilter;
    });
  }, [blocksData, blockFilter]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesBlock =
        blockFilter === "All" ||
        alert.block === blockFilter ||
        alert.block === "All Blocks";

      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" || alert.status === statusFilter;

      return matchesBlock && matchesSeverity && matchesStatus;
    });
  }, [alerts, blockFilter, severityFilter, statusFilter]);

  const activeCount = alerts.filter((alert) => alert.status === "Active").length;
  const criticalCount = alerts.filter(
    (alert) => alert.status === "Active" && alert.severity === "Critical"
  ).length;

  const acknowledgeAlert = (id) => {
    try {
      const ackList = JSON.parse(
        localStorage.getItem("smartstay_acknowledged_alerts") || "[]"
      );
      if (!ackList.includes(id)) {
        localStorage.setItem(
          "smartstay_acknowledged_alerts",
          JSON.stringify([...ackList, id])
        );
      }
    } catch {
      // fallback
    }

    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Acknowledged" } : a))
    );
  };

  const resolveAlert = (id) => {
    try {
      const resList = JSON.parse(
        localStorage.getItem("smartstay_resolved_alerts") || "[]"
      );
      if (!resList.includes(id)) {
        localStorage.setItem(
          "smartstay_resolved_alerts",
          JSON.stringify([...resList, id])
        );
      }
    } catch {
      // fallback
    }

    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "utilityType") {
      setFormData((prev) => ({
        ...prev,
        utilityType: value,
        unit: value === "Water" ? "L" : "kWh",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const numVal = Number(formData.value);
    if (formData.value === "" || isNaN(numVal) || numVal < 0) {
      setFormError("Please enter a valid non-negative reading value (0 or higher).");
      return;
    }

    try {
      setSubmittingReading(true);
      setFormError(null);
      await createMonitoringReading({
        utilityType: formData.utilityType,
        value: numVal,
        unit: formData.unit,
        blockName: formData.blockName,
        location: formData.location || `${formData.blockName} Main Meter`,
      });

      setShowModal(false);
      setFormData({
        utilityType: "Water",
        value: "",
        unit: "L",
        blockName: "Block A",
        location: "",
      });
      fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to record reading.");
    } finally {
      setSubmittingReading(false);
    }
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

  // Water & Electricity summary extraction
  const waterSummary = summaryData.find((s) => s.utilityType === "Water") || {
    total: 0,
    dailyLimit: 3000,
    percentage: 0,
  };

  const electricitySummary = summaryData.find(
    (s) => s.utilityType === "Electricity"
  ) || {
    total: 0,
    dailyLimit: 2000,
    percentage: 0,
  };

  // Available block names for filter dropdown
  const availableBlocks = useMemo(() => {
    const names = new Set(["Block A", "Block B", "Block C"]);
    blocksData.forEach((b) => {
      if (b.blockName) names.add(b.blockName);
    });
    return Array.from(names);
  }, [blocksData]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-9 w-9 animate-spin text-smart-primary" />
        <p className="text-sm font-medium text-slate-500">
          Loading live telemetry and sensor monitoring data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Smart Monitoring
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor hostel utilities and manage real-time telemetry alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-smart-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-smart-blue"
          >
            <PlusCircle size={17} />
            Record Meter Reading
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            title="Refresh Monitoring Data"
          >
            <RefreshCw
              size={16}
              className={`${refreshing ? "animate-spin text-smart-primary" : "text-slate-500"}`}
            />
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Telemetry Active
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Water */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Water Usage Today</p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {waterSummary.total.toLocaleString()} L
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Daily limit: {waterSummary.dailyLimit.toLocaleString()} L
              </p>
            </div>
            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
              <Droplets size={22} />
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${waterSummary.percentage >= 90
                ? "bg-red-500"
                : waterSummary.percentage >= 80
                  ? "bg-amber-500"
                  : "bg-cyan-500"
                }`}
              style={{ width: `${Math.min(waterSummary.percentage, 100)}%` }}
            />
          </div>
        </Card>

        {/* Electricity */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Electricity Today</p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {electricitySummary.total.toLocaleString()} kWh
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Daily limit: {electricitySummary.dailyLimit.toLocaleString()} kWh
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Zap size={22} />
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${electricitySummary.percentage >= 90
                ? "bg-red-500"
                : electricitySummary.percentage >= 80
                  ? "bg-amber-500"
                  : "bg-smart-blue"
                }`}
              style={{
                width: `${Math.min(electricitySummary.percentage, 100)}%`,
              }}
            />
          </div>
        </Card>

        {/* Active Alerts */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Active Alerts</p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {activeCount}
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                {criticalCount} critical, {activeCount - criticalCount} warnings
              </p>
            </div>
            <div
              className={`rounded-xl p-3 ${activeCount > 0
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
                }`}
            >
              <AlertTriangle size={22} />
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">System Status</p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {criticalCount > 0
                  ? "Limit Exceeded"
                  : activeCount > 0
                    ? "Threshold Warning"
                    : "Operational"}
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Monitoring engine active
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            <h2 className="font-semibold text-slate-700">Monitoring Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-smart-blue"
            >
              <option value="All">All Blocks</option>
              {availableBlocks.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-smart-blue"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-smart-blue"
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
            Water and electricity readings recorded throughout the day.
          </p>
        </div>

        {timelineData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="electricity"
                  name="Electricity (kWh)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              title="No Telemetry Readings Today"
              description="No meter readings have been logged for today yet. Use 'Record Meter Reading' above to record initial readings."
              icon={Activity}
            />
          </div>
        )}
      </Card>

      {/* Block Monitoring */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Block-wise Monitoring
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Utility usage compared with daily limits for each hostel block.
          </p>
        </div>

        {filteredBlocks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {filteredBlocks.map((item) => {
              const bName = item.blockName || item.block || "Block";
              const waterVal = Number(item.water || 0);
              const waterLim = Number(item.waterLimit || 1000);
              const waterPercent = waterLim > 0 ? (waterVal / waterLim) * 100 : 0;

              const elecVal = Number(item.electricity || 0);
              const elecLim = Number(item.electricityLimit || 700);
              const elecPercent = elecLim > 0 ? (elecVal / elecLim) * 100 : 0;

              return (
                <Card key={bName}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-smart-primary">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{bName}</h3>
                        <p className="text-xs text-slate-500">Utility Overview</p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        item.status === "Normal" ? "success" : "warning"
                      }
                    >
                      {item.status || "Normal"}
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
                        {waterVal.toLocaleString()} L
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${waterPercent >= 90
                          ? "bg-red-500"
                          : "bg-cyan-500"
                          }`}
                        style={{
                          width: `${Math.min(waterPercent, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Limit: {waterLim.toLocaleString()} L
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
                        {elecVal.toLocaleString()} kWh
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${elecPercent >= 90
                          ? "bg-red-500"
                          : "bg-amber-500"
                          }`}
                        style={{
                          width: `${Math.min(elecPercent, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Limit: {elecLim.toLocaleString()} kWh
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="py-8 text-center text-slate-500">
              <Building2 size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="font-semibold">No block monitoring records</p>
              <p className="text-sm text-slate-400">
                No telemetry recorded for the selected block filter today.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Alerts */}
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Monitoring Alerts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dynamic alerts generated from real utility consumption thresholds.
            </p>
          </div>

          <Badge variant={activeCount > 0 ? "danger" : "success"}>
            {activeCount > 0 ? `${activeCount} Active` : "All Normal"}
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-200 p-4 transition"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-3">
                  <div
                    className={`mt-1 rounded-xl p-3 ${alert.severity === "Critical"
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

                      <Badge variant="neutral">{alert.block}</Badge>

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
              <CheckCircle size={32} className="mx-auto text-emerald-500" />
              <p className="mt-3 font-semibold text-slate-700">
                No active threshold alerts
              </p>
              <p className="mt-1 text-sm text-slate-500">
                All water and electricity meters are operating within normal daily limits.
              </p>
            </div>
          )}
        </div>
      </Card>

      <p className="flex items-center gap-2 text-xs text-slate-400">
        <Activity size={15} />
        Live readings are collected and aggregated via SmartStay IoT & Meter Reading API.
      </p>

      {/* Record Meter Reading Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                Record Meter Reading
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Utility Type
                </label>
                <select
                  name="utilityType"
                  value={formData.utilityType}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-smart-blue"
                >
                  <option value="Water">Water (L)</option>
                  <option value="Electricity">Electricity (kWh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Reading Value ({formData.unit})
                </label>
                <input
                  type="number"
                  name="value"
                  step="any"
                  min="0.1"
                  required
                  placeholder={
                    formData.utilityType === "Water" ? "e.g. 450" : "e.g. 180"
                  }
                  value={formData.value}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-smart-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Hostel Block
                </label>
                <select
                  name="blockName"
                  value={formData.blockName}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-smart-blue"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Sensor / Location Label (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Main Inflow Meter"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-smart-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReading}
                  className="flex items-center gap-2 rounded-xl bg-smart-primary px-5 py-2 text-sm font-semibold text-white hover:bg-smart-blue disabled:opacity-50"
                >
                  {submittingReading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartMonitoring;
