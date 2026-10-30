import { useEffect, useState, useMemo } from "react";
import {
  Bell,
  Search,
  CheckCheck,
  AlertTriangle,
  Info,
  CreditCard,
  Utensils,
  Droplets,
  Zap,
  MessageSquare,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  getMonitoringAlerts,
  getPaymentNotifications,
  getComplaints,
  getComplaintAnalytics,
} from "../../services/analyticsApi";

function NotificationsCenter() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const fetchNotifications = async () => {
    try {
      setError(null);
      const [alertsRes, paymentsRes, complaintsRes, cmpAnalyticsRes] =
        await Promise.all([
          getMonitoringAlerts().catch(() => ({ data: [] })),
          getPaymentNotifications("admin").catch(() => ({ data: [] })),
          getComplaints().catch(() => ({ data: [] })),
          getComplaintAnalytics().catch(() => ({ data: {} })),
        ]);

      const unified = [];

      // 1. Module 5 Monitoring Alerts
      const dynamicAlerts = alertsRes?.data || [];
      dynamicAlerts.forEach((alert) => {
        unified.push({
          id: alert.id,
          title: alert.title,
          message: alert.description,
          category: alert.utilityType === "Electricity" ? "Electricity" : "Water",
          severity: alert.severity || "Warning",
          time: alert.time || "Today",
          status: alert.status === "Active" ? "Unread" : "Read",
        });
      });

      // 2. Module 3 Payment Notifications (read-only)
      const payNotifs = paymentsRes?.data || [];
      payNotifs.forEach((item) => {
        const isCritical = item.type === "Critical";
        const isWarning = item.type === "Warning";
        unified.push({
          id: String(item._id || item.id || `NTF-PAY-${Date.now()}`),
          title: item.title || "Payment Notification",
          message: item.message || "A hostel payment update was registered.",
          category: "Payment",
          severity: isCritical ? "Critical" : isWarning ? "Warning" : "Info",
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Recent",
          status: item.readAt ? "Read" : "Unread",
        });
      });

      // 3. Module 4 Urgent / Pending Maintenance Complaints (read-only)
      const complaints = complaintsRes?.data || [];
      if (complaints.length > 0) {
        complaints.forEach((c) => {
          const priority = String(c.priority || "").toLowerCase();
          const cStatus = String(c.status || "").toLowerCase();
          if (cStatus !== "resolved" && cStatus !== "rejected") {
            unified.push({
              id: c.complaintId || String(c._id).slice(-8).toUpperCase(),
              title: `Complaint: ${c.category || "Maintenance"}`,
              message: `${c.description || "Issue reported."} (${c.roomNumber ? `Room: ${c.roomNumber}` : "Hostel"})`,
              category: "Complaint",
              severity:
                priority === "critical" || priority === "high"
                  ? "Critical"
                  : "Warning",
              time: c.createdAt
                ? new Date(c.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Pending",
              status: "Unread",
            });
          }
        });
      } else if (cmpAnalyticsRes?.data?.openComplaints > 0) {
        const cmpData = cmpAnalyticsRes.data;
        unified.push({
          id: "NTF-CMP-OPEN",
          title: "Pending Maintenance Complaints",
          message: `${cmpData.openComplaints} active maintenance complaint(s) logged (${cmpData.priorityDistribution?.Critical || 0} critical, ${cmpData.priorityDistribution?.High || 0} high priority).`,
          category: "Complaint",
          severity:
            (cmpData.priorityDistribution?.Critical || 0) > 0 ||
            (cmpData.priorityDistribution?.High || 0) > 0
              ? "Critical"
              : "Warning",
          time: "Active",
          status: "Unread",
        });
      }

      setNotifications(unified);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Count unread notifications
  const unreadCount = useMemo(
    () => notifications.filter((item) => item.status === "Unread").length,
    [notifications]
  );

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [notifications, search, category, status]);

  // Mark one notification as read
  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "Read" } : item
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        status: "Read",
      }))
    );
  };

  // Icon based on notification category
  const getIcon = (cat) => {
    switch (cat) {
      case "Electricity":
        return Zap;
      case "Water":
        return Droplets;
      case "Complaint":
        return MessageSquare;
      case "Food Order":
        return Utensils;
      case "Payment":
        return CreditCard;
      default:
        return Bell;
    }
  };

  // Badge color based on severity
  const getSeverityVariant = (severity) => {
    if (severity === "Critical") return "danger";
    if (severity === "Warning") return "warning";
    return "info";
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-9 w-9 animate-spin text-smart-primary" />
        <p className="text-sm font-medium text-slate-500">
          Loading system alerts and notifications...
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
            Notifications Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage live hostel telemetry alerts, maintenance notices, and system alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-smart-primary" : "text-slate-500"}
            />
            Refresh
          </button>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-smart-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-smart-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={18} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchNotifications}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Notifications</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {notifications.length}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Bell size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Unread Notifications</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {unreadCount}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Read Notifications</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {notifications.length - unreadCount}
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCheck size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <h2 className="font-semibold text-slate-700">Search and Filter</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-smart-blue"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Complaint">Complaint</option>
            <option value="Food Order">Food Order</option>
            <option value="Payment">Payment</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
          >
            <option value="All">All Statuses</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
        </div>
      </Card>

      {/* Notification List */}
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Notifications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredNotifications.length} notifications found
            </p>
          </div>

          <Badge variant={unreadCount > 0 ? "info" : "success"}>
            {unreadCount > 0 ? `${unreadCount} Unread` : "All Caught Up"}
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((item) => {
            const Icon = getIcon(item.category);

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition ${
                  item.status === "Unread"
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="mt-1 rounded-xl bg-white p-3 text-smart-primary shadow-sm">
                      <Icon size={21} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {item.title}
                        </h3>

                        {item.status === "Unread" && (
                          <span className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getSeverityVariant(item.severity)}>
                          {item.severity}
                        </Badge>

                        <Badge variant="neutral">{item.category}</Badge>

                        <Badge
                          variant={
                            item.status === "Unread" ? "info" : "success"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Info size={14} />
                        {item.time} · {item.id}
                      </p>
                    </div>
                  </div>

                  {item.status === "Unread" && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center">
              <Bell size={36} className="mx-auto text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-700">
                No notifications found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                All alerts and notifications have been reviewed or match current filters.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default NotificationsCenter;
