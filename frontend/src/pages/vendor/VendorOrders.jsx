import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Package,
  Bike,
  Search,
  Filter,
  User,
  MapPin,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const initialOrders = [
  {
    id: "ORD-9041",
    studentName: "Ahamed Nafeesh",
    regNo: "SEU/IS/22/ICT/090",
    timeSlot: "12:30 PM - 01:00 PM (Lunch)",
    totalAmount: 1500,
    status: "Placed",
    createdAt: "12:10 PM",
    items: [
      { name: "Chicken Kottu Roti (Full)", qty: 1, price: 850 },
      { name: "Egg Fried Rice", qty: 1, price: 650 },
    ],
  },
  {
    id: "ORD-9038",
    studentName: "M.I.M Izni",
    regNo: "SEU/IS/22/ICT/112",
    timeSlot: "12:30 PM - 01:00 PM (Lunch)",
    totalAmount: 950,
    status: "Preparing",
    createdAt: "11:55 AM",
    items: [{ name: "Crispy Chicken Burger & Fries", qty: 1, price: 950 }],
  },
  {
    id: "ORD-9025",
    studentName: "A. Kanesalingam",
    regNo: "SEU/IS/22/ICT/069",
    timeSlot: "01:00 PM - 01:30 PM (Lunch)",
    totalAmount: 350,
    status: "Out for Delivery",
    createdAt: "11:40 AM",
    items: [{ name: "Iced Milk Coffee (500ml)", qty: 1, price: 350 }],
  },
  {
    id: "ORD-9011",
    studentName: "M.H.U Hafrath",
    regNo: "SEU/IS/22/ICT/102",
    timeSlot: "11:30 AM - 12:00 PM",
    totalAmount: 850,
    status: "Delivered",
    createdAt: "11:15 AM",
    items: [{ name: "Chicken Kottu Roti (Full)", qty: 1, price: 850 }],
  },
];

const statusSteps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

function VendorOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === "All" || o.status === selectedStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Placed":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Preparing":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "Out for Delivery":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Live Food Orders Queue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track incoming student food orders and update status for campus gate
            delivery.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          {
            label: "New Orders",
            count: orders.filter((o) => o.status === "Placed").length,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "In Kitchen",
            count: orders.filter((o) => o.status === "Preparing").length,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "On the Way",
            count: orders.filter((o) => o.status === "Out for Delivery").length,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Delivered Today",
            count: orders.filter((o) => o.status === "Delivered").length,
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map((s, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs"
          >
            <span className="text-xs font-semibold text-slate-400">
              {s.label}
            </span>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {s.count} Orders
            </h3>
          </div>
        ))}
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order ID or Student Name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["All", ...statusSteps].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-800 text-xs">
                    {order.id.split("-")[1]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {order.id}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <User size={13} />
                      <span>
                        {order.studentName} ({order.regNo})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Clock size={14} className="text-blue-600" />
                    <span>
                      Slot: <strong>{order.timeSlot}</strong>
                    </span>
                  </div>
                  <span className="text-base font-bold text-slate-900">
                    LKR {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Items & Status Actions */}
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-700 flex items-center gap-2"
                    >
                      <span className="font-bold text-slate-900">
                        {item.qty}x
                      </span>
                      <span>{item.name}</span>
                      <span className="text-slate-400">
                        — LKR {item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status Update Button */}
                <div className="flex items-center gap-2">
                  {order.status === "Placed" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "Preparing")}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "Preparing" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "Out for Delivery")
                      }
                      className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-500"
                    >
                      Dispatch to Gate
                    </button>
                  )}
                  {order.status === "Out for Delivery" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "Delivered")}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={16} /> Order Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-xs text-slate-500">
            No active orders match your search filter.
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorOrders;
