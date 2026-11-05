import { useState, useEffect } from "react";
import {
  Clock,
  Search,
  MapPin,
  Printer,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import {
  fetchVendorOrders,
  updateOrderStatusApi,
} from "../../services/vendorApi";
import { saveFoodOrders } from "../../data/foodOrders";

const statusSteps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSlotFilter, setSelectedSlotFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderForKOT, setSelectedOrderForKOT] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVendorOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleSync = (e) => {
      if (Array.isArray(e?.detail)) {
        setOrders(e.detail);
      }
      fetchVendorOrders().then((data) => {
        if (Array.isArray(data)) setOrders(data);
      });
    };

    window.addEventListener("smartstay-food-orders-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("smartstay-food-orders-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Optimistic UI update
    const updatedOrders = orders.map((order) =>
      order.id === orderId || order._id === orderId || order.orderNo === orderId
        ? { ...order, status: newStatus }
        : order,
    );
    setOrders(updatedOrders);
    saveFoodOrders(updatedOrders);

    try {
      await updateOrderStatusApi(orderId, newStatus);
    } catch (error) {
      console.error("Unable to update food order status on server:", error);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === "All" || o.status === selectedStatus;
    const matchesSlot =
      selectedSlotFilter === "All" || (o.timeSlot && o.timeSlot.includes(selectedSlotFilter));
    const matchesSearch =
      (o.id || o.orderNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.regNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.deliveryLocation || "").toLowerCase().includes(searchTerm.toLowerCase());
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
            Outlet: <strong className="text-slate-800">Campus Diner & Cafe</strong> &middot; Order Tracking &amp; Delivery Management
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Queue</span>
        </button>
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
          <span className="text-xs font-semibold text-slate-500">Out for Delivery</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{countOut}</p>
          <span className="text-[11px] text-slate-400">Courier Dispatched</span>
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
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selectedStatus === st
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm font-medium">Fetching real-time orders from database...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
          <ShoppingBag size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No orders found in queue.</p>
          <p className="text-xs text-slate-400 mt-1">Orders placed by hostel residents will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOrders.map((order) => {
            const currentStepIdx = statusSteps.indexOf(order.status);

            return (
              <div
                key={order.id || order.orderNo}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-slate-300 transition"
              >
                <div>
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-slate-900">
                          {order.id || order.orderNo}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 font-mono">
                          {order.createdAt || "Just now"}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {order.studentName} ({order.regNo})
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForKOT(order)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                      title="Print KOT Slip"
                    >
                      <Printer size={13} />
                      <span>KOT</span>
                    </button>
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <Clock size={13} />
                      {order.timeSlot}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin size={13} />
                      {order.deliveryLocation}
                    </span>
                  </div>

                  {/* Order Items List */}
                  <div className="mt-3 rounded-2xl bg-slate-50/70 p-3 text-xs space-y-1.5">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-slate-800 font-medium">
                          <strong>{it.qty}x</strong> {it.name}
                        </span>
                        <span className="text-slate-600 font-mono">
                          LKR {Number(it.price * it.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200/60 pt-1.5 flex items-center justify-between font-bold text-slate-900">
                      <span>Total Amount ({order.paymentMethod})</span>
                      <span className="text-sm font-black">
                        LKR {Number(order.totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progression Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-1">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <button
                          key={step}
                          onClick={() => handleUpdateStatus(order.id || order.orderNo, step)}
                          className={`flex-1 rounded-xl py-2 px-1 text-[11px] font-bold text-center transition cursor-pointer ${
                            isCurrent
                              ? "bg-blue-600 text-white shadow-xs"
                              : isCompleted
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {step}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* KOT (Kitchen Order Ticket) Modal Slip */}
      {selectedOrderForKOT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 font-mono text-xs text-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-3">
              <div>
                <h3 className="font-bold text-sm">CAMPUS DINER & CAFE</h3>
                <p className="text-[10px] text-slate-500">Kitchen Order Ticket (KOT)</p>
              </div>
              <button
                onClick={() => setSelectedOrderForKOT(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1 text-[11px]">
              <p>Order: <strong>{selectedOrderForKOT.id || selectedOrderForKOT.orderNo}</strong></p>
              <p>Time Slot: {selectedOrderForKOT.timeSlot}</p>
              <p>Student: {selectedOrderForKOT.studentName} ({selectedOrderForKOT.regNo})</p>
              <p>Drop Zone: {selectedOrderForKOT.deliveryLocation}</p>
            </div>

            <div className="border-t-2 border-dashed border-slate-300 pt-2 space-y-1">
              <span className="font-bold text-[10px] block uppercase">Items to Prepare:</span>
              {selectedOrderForKOT.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between font-bold">
                  <span>{it.qty}x {it.name}</span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-slate-300 pt-2 flex justify-between font-bold text-sm">
              <span>Total:</span>
              <span>LKR {Number(selectedOrderForKOT.totalAmount).toLocaleString()}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-2 rounded-2xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Printer size={15} />
              <span>Print KOT Slip</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
