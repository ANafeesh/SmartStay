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
  Wrench,
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
    title: "Maintenance",
    items: [
      { name: "Maintenance Overview", href: "/maintenance", icon: Wrench },
      { name: "Submit a Complaint", href: "/maintenance/submit-complaint", icon: ClipboardList },
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
  const currentPage = navigationGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === location.pathname);
  const pageTitle = currentPage?.name ?? "Workspace";
  const sidebarWidth = sidebarCollapsed ? "lg:w-24" : "lg:w-72";

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb] text-slate-800 lg:flex-row">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0b1220] px-4 py-3 text-white shadow-lg shadow-slate-950/10 lg:hidden">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-sm font-black text-white shadow-lg shadow-blue-500/25">
            S
          </span>
          SmartStay
        </Link>
        <button
          type="button"
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={sidebarOpen}
          aria-controls="smartstay-sidebar"
          onClick={() => setSidebarOpen((open) => !open)}
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="smartstay-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-screen ${sidebarWidth} shrink-0 flex-col border-r border-white/10 bg-[#0b1220] text-white shadow-2xl shadow-slate-950/20 transition-all duration-300 lg:sticky ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-5">
          <Link
            to="/"
            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-lg font-black text-white shadow-lg shadow-blue-500/20">
              S
            </span>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-base font-bold leading-tight tracking-tight text-white">
                  SmartStay
                </h2>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Campus Accommodation
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 transition-colors hover:text-white lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav
          aria-label="Primary navigation"
          className="no-scrollbar flex-1 space-y-7 overflow-y-auto px-3 py-5"
        >
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-500">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={`group flex items-center ${
                        sidebarCollapsed ? "justify-center px-1.5 py-2.5" : "gap-3 px-3 py-2.5"
                      } rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-inset ring-blue-400/40"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}
                      />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
            <div className={`flex min-w-0 items-center ${sidebarCollapsed ? "w-full justify-center" : "gap-2.5"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-xs font-bold text-blue-200 ring-1 ring-inset ring-blue-400/20">
                AN
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 truncate">
                  <p className="truncate text-xs font-semibold text-white">Nafeesh</p>
                  <p className="truncate text-[10px] font-medium text-slate-500">
                    SEU/IS/22/ICT/090
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-8 sm:px-6 lg:px-10">
        <header className="-mx-4 mb-7 flex min-h-[84px] items-center justify-between gap-4 border-b border-slate-200/80 bg-[#f4f7fb]/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:sticky lg:top-0 lg:z-30 lg:-mx-10 lg:mb-8 lg:px-10">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              SmartStay <span className="px-1.5 text-slate-300">/</span> Workspace
            </p>
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {pageTitle}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/notifications"
              aria-label="View notifications"
              title="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Bell size={18} />
            </Link>
            <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-500/20">
                AN
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Nafeesh</p>
                <p className="text-[10px] font-medium text-slate-400">Student account</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;