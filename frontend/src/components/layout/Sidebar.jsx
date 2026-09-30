import {
  LayoutDashboard,
  ChartNoAxesCombined,
  FileText,
  Droplets,
  Activity,
  CreditCard,
  ShoppingBag,
  BedDouble,
  MessageSquare,
  Bell,
  User,
  Store,
  Utensils,
  ClipboardList,
  QrCode,
  Wallet,
  Building2,
  DoorOpen,
  UserRoundCheck,
  ArrowRightLeft,
  BarChart3,
  X,
  Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Room", path: "/room", icon: BedDouble },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Marketplace", path: "/marketplace", icon: ShoppingBag },
  { name: "Complaints", path: "/complaints", icon: MessageSquare },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Profile", path: "/profile", icon: User },
];

const hostelMenuItems = [
  { name: "Hostel Dashboard", path: "/hostel", icon: Building2 },
  { name: "Buildings", path: "/hostel/buildings", icon: Building2 },
  { name: "Rooms & Beds", path: "/hostel/rooms", icon: DoorOpen },
  { name: "Allocations", path: "/hostel/allocations", icon: UserRoundCheck },
  { name: "Transfers", path: "/hostel/transfers", icon: ArrowRightLeft },
  { name: "Occupancy", path: "/hostel/occupancy", icon: BarChart3 },
];

const vendorMenuItems = [
  { name: "Vendor Dashboard", path: "/vendor/dashboard", icon: Store },
  { name: "Food Items", path: "/vendor/food-items", icon: Utensils },
  { name: "Vendor Orders", path: "/vendor/orders", icon: ClipboardList },
  { name: "Vendor Pass", path: "/vendor/pass", icon: QrCode },
  { name: "Earnings", path: "/vendor/earnings", icon: Wallet },
];

const analyticsMenuItems = [
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Utilities & Food", path: "/utilities", icon: Droplets },
  { name: "Smart Monitoring", path: "/monitoring", icon: Activity },
  { name: "Notification Center", path: "/notifications-center", icon: Bell },
];

const MenuSection = ({ title, items, onClose }) => (
  <div className="mt-6">
    <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
      {title}
    </p>
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                isActive
                  ? "bg-blue-600 !text-white font-semibold shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  </div>
);

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-slate-200/80 bg-white shadow-xs
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Smart<span className="text-blue-600">Stay</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                Hostel Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto p-4 pb-6">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
                      isActive
                        ? "bg-blue-600 !text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          <MenuSection
            title="Hostel Management"
            items={hostelMenuItems}
            onClose={onClose}
          />

          <MenuSection
            title="Vendor Management"
            items={vendorMenuItems}
            onClose={onClose}
          />

          <MenuSection
            title="Analytics & Insights"
            items={analyticsMenuItems}
            onClose={onClose}
          />
        </nav>

        {/* Footer Widget */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <p className="text-xs font-semibold text-slate-800">
                SmartStay System
              </p>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Student Portal · v2.4
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
