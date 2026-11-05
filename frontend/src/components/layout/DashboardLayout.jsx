import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import TopRightAuth from "./TopRightAuth";
import Logo from "../ui/Logo";
import { useAuth, normalizeRole } from "../../context/AuthContext";
import { getUnreadNotificationCount } from "../../services/notificationService";
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
  QrCode,
  RefreshCw,
  ShieldCheck,
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
    role: "student",
    allowedRoles: ["student", "admin"],
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
    role: "vendor",
    allowedRoles: ["vendor", "admin"],
    items: [
      { name: "Vendor Dashboard", href: "/vendor/dashboard", icon: Store },
      { name: "Food Items", href: "/vendor/food-items", icon: UtensilsCrossed },
      { name: "Live Orders", href: "/vendor/orders", icon: ClipboardList },
      { name: "Gate Pass", href: "/vendor/pass", icon: QrCode },
      { name: "Earnings", href: "/vendor/earnings", icon: DollarSign },
      { name: "Profile", href: "/vendor/profile", icon: User },
    ],
  },
  {
    title: "Hostel Management",
    role: "warden",
    allowedRoles: ["warden", "admin", "maintenance"],
    items: [
      { name: "Hostel Dashboard", href: "/hostel", icon: Building },
      { name: "Buildings", href: "/hostel/buildings", icon: Building },
      { name: "Rooms & Beds", href: "/hostel/rooms", icon: Bed },
      { name: "Allocations", href: "/hostel/allocations", icon: Users },
      { name: "Transfers", href: "/hostel/transfers", icon: ArrowLeftRight },
      { name: "Occupancy", href: "/hostel/occupancy", icon: BarChart3 },
      { name: "Student Complaints", href: "/maintenance", icon: AlertTriangle },
    ],
  },
  {
    title: "Analytics & Monitoring",
    role: "executive",
    allowedRoles: ["executive", "finance", "admin"],
    items: [
      {
        name: "Analytics Overview",
        href: "/analytics",
        icon: BarChart3,
        allowedRoles: ["executive", "finance", "admin"],
      },
      {
        name: "Reports",
        href: "/reports",
        icon: FileText,
        allowedRoles: ["executive", "finance", "admin"],
      },
      {
        name: "Utilities Analytics",
        href: "/utilities",
        icon: Zap,
        allowedRoles: ["executive", "admin"],
      },
      {
        name: "Smart Monitoring",
        href: "/monitoring",
        icon: Activity,
        allowedRoles: ["executive", "admin"],
      },
      {
        name: "Notifications Center",
        href: "/notifications-center",
        icon: Bell,
        allowedRoles: ["executive", "finance", "admin"],
      },
    ],
  },
  {
    title: "Security Portal",
    role: "security",
    allowedRoles: ["security", "admin"],
    items: [
      { name: "Digital Gate Passes", href: "/vendor/pass", icon: QrCode },
      { name: "Gate Clearance", href: "/dashboard", icon: ShieldCheck },
    ],
  },
];

function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(() =>
    getUnreadNotificationCount(user)
  );

  useEffect(() => {
    const handleSync = () => {
      setUnreadNotifCount(getUnreadNotificationCount(user));
    };
    handleSync();
    window.addEventListener("smartstay-notifications-updated", handleSync);
    window.addEventListener("smartstay-complaints-updated", handleSync);
    window.addEventListener("smartstay-food-orders-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("smartstay-notifications-updated", handleSync);
      window.removeEventListener("smartstay-complaints-updated", handleSync);
      window.removeEventListener("smartstay-food-orders-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [user, location.pathname]);

  const sidebarCollapsed = false;

  const currentRole = user ? normalizeRole(user.role || user.roleKey) : "";

  // Filter navigation groups according to authenticated user's role
  const visibleGroups = navigationGroups
    .filter((group) => {
      if (currentRole === "admin") return true;
      if (group.allowedRoles) {
        return group.allowedRoles.includes(currentRole);
      }
      return group.role === currentRole;
    })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (currentRole === "admin") return true;
        if (item.allowedRoles) {
          return item.allowedRoles.includes(currentRole);
        }
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const currentPage = navigationGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === location.pathname);
  const pageTitle =
    location.pathname === "/maintenance/submit-complaint"
      ? "Submit Complaint"
      : currentPage?.name ?? "Dashboard";
  const sidebarWidth = sidebarCollapsed ? "lg:w-20" : "lg:w-72";
  const notificationsHref =
    currentRole === "executive" ? "/notifications-center" : "/notifications";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 lg:flex-row antialiased font-sans">
      {/* Mobile Top Navigation Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/90 bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xs backdrop-blur-md lg:hidden">
        <Logo variant="horizontal" size="sm" asLink />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to={notificationsHref}
            aria-label="View notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 active:scale-95"
          >
            <Bell size={16} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white">
                {unreadNotifCount}
              </span>
            )}
          </Link>
          <TopRightAuth compact={true} />
          <button
            type="button"
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
            aria-controls="smartstay-sidebar"
            onClick={() => setSidebarOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 active:scale-95 cursor-pointer"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Primary Sidebar */}
      <aside
        id="smartstay-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 sm:w-80 max-w-[85vw] ${sidebarWidth} shrink-0 flex-col border-r border-slate-200/90 bg-white text-slate-800 shadow-2xl shadow-slate-900/10 transition-all duration-300 lg:sticky ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4">
          <Logo
            variant="horizontal"
            size="md"
            subtitle="Hostel Living OS"
            asLink
          />

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 transition-colors hover:text-slate-700 lg:hidden cursor-pointer p-1"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4"
        >
          {visibleGroups.map((group) => {
            const isUserPrimaryGroup =
              currentRole === group.role ||
              (currentRole === "admin" && group.role === "admin");

            return (
              <div key={group.title}>
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between mb-2 px-2.5">
                    <p className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                      isUserPrimaryGroup ? "text-blue-600 font-black" : "text-slate-400"
                    }`}>
                      {group.title}
                    </p>
                    {isUserPrimaryGroup && (
                      <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                        Active Role
                      </span>
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
            );
          })}
        </nav>

        {/* User / Member ID Footer */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/50">
          <Link
            to={user?.role === "vendor" ? "/vendor/profile" : "/profile"}
            title="View Profile"
            className="w-full text-left flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer"
          >
            <div className={`flex min-w-0 items-center ${sidebarCollapsed ? "w-full justify-center" : "gap-2.5"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-xs">
                {user?.initials || "U"}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {user?.name || "Student User"}
                    </p>
                  </div>
                  <p className="truncate text-[10px] font-semibold text-blue-600">
                    {user?.roleBadge || user?.role || "Student account"}
                  </p>
                  <p className="truncate font-mono text-[9px] text-slate-400">
                    {user?.studentId || user?.registrationNumber || user?.email || ""}
                  </p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-bold text-slate-400 hover:text-blue-600 ml-1">
                Profile
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="min-w-0 flex-1 px-3.5 pb-12 sm:px-6 lg:px-10">
        {/* Sticky Executive Top Bar (Desktop) */}
        <header className="hidden lg:flex sticky top-0 z-30 -mx-10 mb-8 min-h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-10 backdrop-blur-xl">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to={notificationsHref}
              aria-label="View notifications"
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:border-blue-300 hover:text-blue-600 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Bell size={18} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white">
                  {unreadNotifCount}
                </span>
              )}
            </Link>
            <TopRightAuth />
          </div>
        </header>

        {/* Mobile Page Header Strip */}
        <div className="lg:hidden flex items-center justify-between pt-3 pb-3 mb-4 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SmartStay Living
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 mt-0.5">
              {pageTitle}
            </h1>
          </div>
          <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">SmartStay</span>
        </div>

        {/* Viewport Router Outlet */}
        <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
