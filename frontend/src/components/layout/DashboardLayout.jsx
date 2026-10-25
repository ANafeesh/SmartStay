import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import TopRightAuth from "./TopRightAuth";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
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
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const currentPage = navigationGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === location.pathname);
  const pageTitle = currentPage?.name ?? "Workspace";
  const sidebarWidth = sidebarCollapsed ? "lg:w-20" : "lg:w-72";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 lg:flex-row antialiased font-sans">
      {/* Mobile Top Navigation Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 py-3 text-slate-900 shadow-xs backdrop-blur-md lg:hidden">
        <Logo variant="horizontal" size="sm" badge="SEU" asLink />
        <div className="flex items-center gap-2">
          <TopRightAuth compact={true} />
          <button
            type="button"
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
            aria-controls="smartstay-sidebar"
            onClick={() => setSidebarOpen((open) => !open)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Primary Sidebar */}
      <aside
        id="smartstay-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-screen ${sidebarWidth} shrink-0 flex-col border-r border-slate-200/90 bg-white text-slate-800 shadow-xl shadow-slate-900/5 transition-all duration-300 lg:sticky ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4">
          {sidebarCollapsed ? (
            <Logo variant="mark" size="md" asLink />
          ) : (
            <Logo
              variant="horizontal"
              size="md"
              badge="v2.0"
              subtitle="Hostel Management OS"
              asLink
            />
          )}

          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(true)}
              className="hidden h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:flex cursor-pointer"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 transition-colors hover:text-slate-700 lg:hidden cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Expand Button (When Collapsed) */}
        {sidebarCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}

        {/* Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4"
        >
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between mb-2 px-2.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    {group.title}
                  </p>
                  {group.title === "Student Portal" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                  {group.title === "Vendor Portal" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
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
                      className={`group relative flex items-center ${
                        sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"
                      } rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-inset ring-blue-500 font-bold"
                          : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={`shrink-0 transition-colors ${
                          active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.name}</span>}

                      {/* Subtle indicators for key Module 3 pages */}
                      {!sidebarCollapsed && item.name === "Payments & Bills" && !active && (
                        <span className="ml-auto rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                          Due
                        </span>
                      )}
                      {!sidebarCollapsed && item.name === "Marketplace" && !active && (
                        <span className="ml-auto rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                          Food
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Member ID Footer */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/50">
          <div className="flex items-center rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
            <div className={`flex min-w-0 items-center ${sidebarCollapsed ? "w-full justify-center" : "gap-2.5"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-black text-white shadow-xs">
                {user?.initials || "AN"}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {user?.name || "Ahamed Nafeesh"}
                    </p>
                  </div>
                  <p className="truncate font-mono text-[10px] font-semibold text-blue-600">
                    {user?.studentId || "SEU/IS/22/ICT/090"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="min-w-0 flex-1 px-4 pb-12 sm:px-6 lg:px-10">
        {/* Sticky Executive Top Bar */}
        <header className="-mx-4 mb-6 flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:sticky lg:top-0 lg:z-30 lg:-mx-10 lg:mb-8 lg:px-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Campus Network
              </span>
              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">•</span>
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                SEU SmartStay Platform
              </span>
            </div>
            <h1 className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl mt-0.5">
              {pageTitle}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/notifications"
              aria-label="View notifications"
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:border-blue-300 hover:text-blue-600 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Bell size={18} />
              <span className="absolute 1.5 -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white">
                3
              </span>
            </Link>
            <TopRightAuth />
          </div>
        </header>

        {/* Viewport Router Outlet */}
        <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;