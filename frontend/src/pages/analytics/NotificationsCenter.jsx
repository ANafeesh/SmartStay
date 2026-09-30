import { useState } from "react";

import {
  Bell,
  Search,
  CheckCheck,
  AlertTriangle,
  Info,
  CreditCard,
  Utensils,
  Droplets,
  MessageSquare,
  Filter,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  initialNotifications,
} from "../../data/notificationsData";

function NotificationsCenter() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  // Count unread notifications
  const unreadCount = notifications.filter(
    (item) => item.status === "Unread"
  ).length;

  // Filter notifications
  const filteredNotifications = notifications.filter(
    (item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus =
        status === "All" || item.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  // Mark one notification as read
  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, status: "Read" }
          : item
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
  const getIcon = (category) => {
    switch (category) {
      case "Electricity":
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Notifications Center
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hostel alerts and system notifications.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-smart-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-smart-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={18} />
          Mark All as Read
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Notifications
              </p>

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
              <p className="text-sm text-slate-500">
                Unread Notifications
              </p>

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
              <p className="text-sm text-slate-500">
                Read Notifications
              </p>

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

          <h2 className="font-semibold text-slate-700">
            Search and Filter
          </h2>
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
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

          <Badge variant="info">
            {unreadCount} Unread
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

                        <Badge variant="neutral">
                          {item.category}
                        </Badge>

                        <Badge
                          variant={
                            item.status === "Unread"
                              ? "info"
                              : "success"
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
              <Bell
                size={36}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-700">
                No notifications found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default NotificationsCenter;