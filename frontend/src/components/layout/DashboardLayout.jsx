import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Bed,
  Bell,
  Building,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  ShoppingBag,
  Store,
  User,
  Users,
  UtensilsCrossed,
  X,
  Zap,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const sidebarWidth = sidebarCollapsed ? "lg:w-24" : "lg:w-72";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col lg:flex-row">
      <div className="lg:hidden flex items-center justify-between bg-white/90 border-b border-slate-200 px-4 py-3 sticky top-0 z-40 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-black shadow-sm">
            S
          </span>
          SmartStay
        </div>

        <button
          type="button"
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={sidebarOpen}
          aria-controls="smartstay-sidebar"
          onClick={() => setSidebarOpen((open) => !open)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="smartstay-sidebar"
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${sidebarWidth} shrink-0 bg-white/95 border-r border-slate-200/80 flex flex-col shadow-lg shadow-slate-200/60 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <Link to="/" className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2.5"}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-black text-lg shadow-sm">
              S
            </span>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  SmartStay
                </h2>
                <p className="text-[10px] font-semibold text-slate-400">
                  Campus Accommodation
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav
          aria-label="Primary navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar"
        >
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 mb-2">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={`group relative flex items-center ${
                        sidebarCollapsed ? "justify-center px-1.5 py-2.5" : "gap-3 px-3 py-2.5"
                      } rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={active ? "text-white" : "text-slate-500 group-hover:text-slate-700"}
                      />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-sm">
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-2.5 overflow-hidden"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700 text-xs">
                AN
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Nafeesh
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">
                    SEU/IS/22/ICT/090
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
