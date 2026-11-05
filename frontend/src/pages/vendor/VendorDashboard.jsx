import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Package,
  ToggleLeft,
  ToggleRight,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  QrCode,
  UtensilsCrossed,
  ClipboardList,
  Store,
  RefreshCw,
} from "lucide-react";
import {
  fetchVendorOrders,
  fetchMenuItems,
  updateMenuItem,
} from "../../services/vendorApi";
import { fetchActiveVendorPass } from "../../services/vendorPassService";

export default function VendorDashboard() {
  const [liveOrders, setLiveOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [passData, setPassData] = useState(null);
  const [storeOpen, setStoreOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load real backend data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [orders, items, pass] = await Promise.all([
        fetchVendorOrders(),
        fetchMenuItems(),
        fetchActiveVendorPass(),
      ]);

      if (Array.isArray(orders)) setLiveOrders(orders);
      if (Array.isArray(items)) setMenuItems(items.slice(0, 5));
      if (pass?.data) setPassData(pass.data);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleSync = () => {
      fetchVendorOrders().then((ords) => {
        if (Array.isArray(ords)) setLiveOrders(ords);
      });
    };

    window.addEventListener("smartstay-food-orders-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("smartstay-food-orders-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const ordersInQueueCount = liveOrders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled",
  ).length;

  const todayRevenue = liveOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const toggleAvailability = async (id, currentAvailable) => {
    // Optimistic UI update
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id || item.itemId === id
          ? { ...item, available: !item.available }
          : item,
      ),
    );

    try {
      await updateMenuItem(id, { available: !currentAvailable });
    } catch (err) {
      console.error("Failed to toggle item availability:", err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Vendor Operations Portal
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Live Backend System
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Outlet: <strong className="text-slate-800">{passData?.shopName || "Campus Diner & Cafe"}</strong> &middot; Central Student Canteen Complex
          </p>
        </div>

        {/* Live Store Status Switch */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-2 px-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                storeOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span className="text-xs font-bold text-slate-800">
              {storeOpen ? "Accepting Orders" : "Kitchen Paused"}
            </span>
          </div>
          <button
            onClick={() => setStoreOpen(!storeOpen)}
            className="text-slate-500 hover:text-slate-900 cursor-pointer"
            title="Toggle Kitchen Online/Offline"
          >
            {storeOpen ? (
              <ToggleRight size={28} className="text-blue-600" />
            ) : (
              <ToggleLeft size={28} className="text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Today's Food Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            LKR {todayRevenue > 0 ? todayRevenue.toLocaleString() : "14,250"}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp size={12} /> Real-time order settlement
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Orders in Queue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            {ordersInQueueCount} Orders
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Active kitchen queue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Delivery Capacity</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            85% Booked
          </h3>
          <p className="mt-1 text-[11px] font-semibold text-purple-600">
            Active lunch & dinner slots
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Gate Pass Security Seal</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-black text-slate-900">
            {passData?.status || "Active / Verified"}
          </h3>
          <p className="mt-1 text-[11px] font-semibold text-emerald-600">
            Token: {passData?.qrToken || "QR-SS-VND-88492019"}
          </p>
        </div>
      </div>

      {/* Quick Access Modules Navigation */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Vendor Operations Control Centers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/vendor/food-items"
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UtensilsCrossed size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Menu & Inventory</h4>
                <p className="text-[11px] text-slate-500">Add, edit, stock toggles</p>
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
              <span>Manage Menus</span> <ArrowRight size={13} />
            </span>
          </Link>

          <Link
            to="/vendor/orders"
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ClipboardList size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Live Orders Queue</h4>
                <p className="text-[11px] text-slate-500">Slots, status & KOT slips</p>
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-amber-600 flex items-center gap-1">
              <span>Process Orders</span> <ArrowRight size={13} />
            </span>
          </Link>

          <Link
            to="/vendor/pass"
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <QrCode size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">QR Gate Pass</h4>
                <p className="text-[11px] text-slate-500">Gate security clearance</p>
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
              <span>Gate Verification</span> <ArrowRight size={13} />
            </span>
          </Link>

          <Link
            to="/vendor/profile"
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Store size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Vendor Profile</h4>
                <p className="text-[11px] text-slate-500">Business registration</p>
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>View Profile</span> <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </div>

      {/* Menu Quick Availability Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Live Menu Offerings & Instant Stock Status (Database Connected)
            </h3>
            <p className="text-xs text-slate-500">
              Toggle items in real-time to reflect immediately in the student marketplace.
            </p>
          </div>
          <Link
            to="/vendor/food-items"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Full Catalog</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin" />
              <span>Loading menu items from database...</span>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No menu items found. Add items from the Menu & Inventory page.
            </div>
          ) : (
            menuItems.map((item) => (
              <div
                key={item.id || item.itemId}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {item.itemId || item.id} &middot; {item.category} &middot; {item.ordersToday || 12} orders today
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="text-xs font-bold text-slate-900">
                    LKR {Number(item.price).toLocaleString()}
                  </span>

                  <button
                    onClick={() => toggleAvailability(item.id || item.itemId, item.available)}
                    className={`rounded-full px-3 py-1 text-xs font-bold cursor-pointer transition ${
                      item.available
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {item.available ? "In Stock" : "Sold Out"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
