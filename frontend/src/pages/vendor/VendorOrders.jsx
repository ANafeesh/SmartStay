import { useState } from "react";
import {
  Clock,
  Search,
  MapPin,
  Printer,
  X,
} from "lucide-react";
import { readFoodOrders, saveFoodOrders } from "../../data/foodOrders";

const initialOrders = [
  {
    id: "ORD-9041",
    studentName: "Ahamed Nafeesh",
    regNo: "STD-2026-090",
    phone: "+94 77 123 4567",
    timeSlot: "12:30 PM - 01:00 PM (Lunch)",
    deliveryLocation: "Hostel Block B - Room 204",
    totalAmount: 1500,
    status: "Placed",
    createdAt: "12:10 PM",
    paymentMethod: "Hostel Room Bill",
    items: [
      { name: "Chicken Kottu Roti (Full Portion)", qty: 1, price: 850 },
      { name: "Special Egg Fried Rice & Chili Paste", qty: 1, price: 650 },
    ],
  },
  {
    id: "ORD-9038",
    studentName: "M.I.M Izni",
    regNo: "STD-2026-112",
    phone: "+94 71 456 7890",
    timeSlot: "12:30 PM - 01:00 PM (Lunch)",
    deliveryLocation: "Hostel Block A - Foyer",
    totalAmount: 950,
    status: "Preparing",
    createdAt: "11:55 AM",
    paymentMethod: "Cash on Delivery",
    items: [{ name: "Crispy Chicken Burger & Fries", qty: 1, price: 950 }],
  },
  {
    id: "ORD-9025",
    studentName: "A. Kanesalingam",
    regNo: "STD-2026-069",
    phone: "+94 75 998 1234",
    timeSlot: "01:00 PM - 01:30 PM (Lunch)",
    deliveryLocation: "Hostel Block B - Room 102",
    totalAmount: 450,
    status: "Out for Delivery",
    createdAt: "11:40 AM",
    paymentMethod: "Hostel Room Bill",
    items: [{ name: "Iced Caramel Macchiato (500ml)", qty: 1, price: 450 }],
  },
  {
    id: "ORD-9011",
    studentName: "M.H.U Hafrath",
    regNo: "STD-2026-102",
    phone: "+94 76 332 5544",
    timeSlot: "11:30 AM - 12:00 PM",
    deliveryLocation: "Campus Gate 01 Hub",
    totalAmount: 850,
    status: "Delivered",
    createdAt: "11:15 AM",
    paymentMethod: "SmartStay Campus Wallet",
    items: [{ name: "Chicken Kottu Roti (Full Portion)", qty: 1, price: 850 }],
  },
];

const statusSteps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export default function VendorOrders() {
  const [orders, setOrders] = useState(() => readFoodOrders(initialOrders));
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSlotFilter, setSelectedSlotFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderForKOT, setSelectedOrderForKOT] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order,
    );
    setOrders(updatedOrders);
    try {
      saveFoodOrders(updatedOrders);
    } catch (error) {
      console.error("Unable to save food order status.", error);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === "All" || o.status === selectedStatus;
    const matchesSlot =
      selectedSlotFilter === "All" || (o.timeSlot && o.timeSlot.includes(selectedSlotFilter));
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.regNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSlot && matchesSearch;
  });

  const countPlaced = orders.filter((o) => o.status === "Placed").length;
  const countPreparing = orders.filter((o) => o.status === "Preparing").length;
  const countOut = orders.filter((o) => o.status === "Out for Delivery").length;
  const countDelivered = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Live Food Orders & Delivery Slots
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Live Kitchen Orders
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Outlet: <strong className="text-slate-800">Campus Diner & Cafe</strong> &middot; Order Tracking &amp; Delivery Management</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">New Orders Placed</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{countPlaced}</p>
          <span className="text-[11px] text-slate-400">Needs Acceptance</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">In Kitchen Prep</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{countPreparing}</p>
          <span className="text-[11px] text-slate-400">Cook Time Active</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Out for Gate Delivery</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{countOut}</p>
          <span className="text-[11px] text-slate-400">Rider Dispatched</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Delivered Today</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{countDelivered}</p>
          <span className="text-[11px] text-slate-400">Successful Drop-offs</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="relative w-full lg:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, student name, ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Slot Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Slot:</span>
          {["All", "Lunch", "Dinner"].map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlotFilter(slot)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selectedSlotFilter === slot
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
          {["All", "Placed", "Preparing", "Out for Delivery", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Queue Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
            <p className="text-xs text-slate-400">No orders found matching the filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4 hover:border-slate-300 transition"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-blue-600">
                      {order.id}
                    </span>
                    <span className="text-slate-300">â€¢</span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {order.studentName}
                    </h3>
                    <span className="font-mono text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-lg">
                      {order.regNo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock size={13} className="text-blue-600" />
                    <span>Slot: <strong>{order.timeSlot}</strong></span>
                    <span>â€¢</span>
                    <span>Received: {order.createdAt}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-rose-500" />
                    <span>Drop-off: <strong>{order.deliveryLocation || "Hostel Block B Room 204"}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => setSelectedOrderForKOT(order)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print KOT Slip</span>
                  </button>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold border ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : order.status === "Out for Delivery"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : order.status === "Preparing"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Order Items Breakdown
                  </span>
                  <div className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-800 font-medium">
                        <span>{item.qty}x {item.name}</span>
                        <span className="font-mono">LKR {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:border-l sm:border-slate-100 sm:pl-4 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Settlement & Total
                  </span>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-slate-800">{order.paymentMethod || "Room Bill"}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-100">
                    <span>Grand Total:</span>
                    <span className="text-blue-600 font-black">LKR {(order.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Stepper Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Transition Order Status:
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  {statusSteps.map((step) => (
                    <button
                      key={step}
                      onClick={() => handleUpdateStatus(order.id, step)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        order.status === step
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Kitchen Order Ticket (KOT) Modal */}
      {selectedOrderForKOT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Campus Diner & Cafe</h3>
                <p className="text-xs text-slate-500 font-mono">Kitchen Order Ticket (KOT)</p>
              </div>
              <button
                onClick={() => setSelectedOrderForKOT(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs space-y-1 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Order No:</span>
                <span className="font-bold">{selectedOrderForKOT.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="font-bold">{selectedOrderForKOT.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span>Reg No:</span>
                <span>{selectedOrderForKOT.regNo}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Slot:</span>
                <span className="font-bold">{selectedOrderForKOT.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span>Drop-off:</span>
                <span>{selectedOrderForKOT.deliveryLocation}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2 text-xs">
              {selectedOrderForKOT.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between font-bold">
                  <span>{item.qty}x {item.name}</span>
                  <span>LKR {item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-bold">
              <span>Total:</span>
              <span>LKR {selectedOrderForKOT.totalAmount?.toLocaleString()}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer shadow-xs"
              >
                <Printer size={14} />
                <span>Print Kitchen Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
