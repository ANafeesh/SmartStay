import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Home,
  AlertTriangle,
  Bell,
  User,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  ClipboardList,
  QrCode,
  DollarSign,
  Building,
  Bed,
  Users,
  ArrowLeftRight,
  BarChart3,
  FileText,
  Zap,
  Activity,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navigationGroups = [
  {
    title: "Student Portal",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Payments & Bills", href: "/payments", icon: CreditCard },
      { name: "My Room", href: "/room", icon: Home },
      { name: "Complaints", href: "/complaints", icon: AlertTriangle },
      { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
      { name: "Notifications", href: "/notifications", icon: Bell },
      { name: "Profile", href: "/profile", icon: User },
    ],
  },
  {
    title: "Vendor Portal",
    items: [
      { name: "Vendor Dashboard", href: "/vendor/dashboard", icon: Store },
      { name: "Food Items", href: "/vendor/food-items", icon: UtensilsCrossed },
      { name: "Live Orders", href: "/vendor/orders", icon: ClipboardList },
      { name: "Gate Pass", href: "/vendor/pass", icon: QrCode },
      { name: "Earnings", href: "/vendor/earnings", icon: DollarSign },
    ],
  },
  {
    title: "Hostel Management",
    items: [
      { name: "Hostel Dashboard", href: "/hostel", icon: Building },
      { name: "Buildings", href: "/hostel/buildings", icon: Building },
      { name: "Rooms & Beds", href: "/hostel/rooms", icon: Bed },
      { name: "Allocations", href: "/hostel/allocations", icon: Users },
      { name: "Transfers", href: "/hostel/transfers", icon: ArrowLeftRight },
      { name: "Occupancy", href: "/hostel/occupancy", icon: BarChart3 },
    ],
  },
  {
    title: "Analytics & Monitoring",
    items: [
      { name: "Analytics Overview", href: "/analytics", icon: BarChart3 },
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Utilities Analytics", href: "/utilities", icon: Zap },
      { name: "Smart Monitoring", href: "/monitoring", icon: Activity },
      {
        name: "Notifications Center",
        href: "/notifications-center",
        icon: Bell,
      },
    ],
  },
];

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black">
            S
          </span>
          SmartStay
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-xs">
              S
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                SmartStay
              </h2>
              <p className="text-[10px] font-semibold text-slate-400">
                Campus Accommodation
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        active
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={active ? "text-white" : "text-slate-500"}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700 text-xs">
                AN
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Nafeesh
                </p>
                <p className="text-[10px] font-medium text-slate-400 truncate">
                  SEU/IS/22/ICT/090
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Render Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
