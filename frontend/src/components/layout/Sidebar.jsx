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
  UserRoundPlus,
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
  Wrench,
  ShieldCheck,
  Shield,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";
import { useAuth, normalizeRole } from "../../context/AuthContext";

const studentMenuItems = [
  { name: "Student Dashboard", path: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "My Room", path: "/room", icon: BedDouble },
  { name: "Payments & Invoices", path: "/payments", icon: CreditCard },
  { name: "Food Marketplace", path: "/marketplace", icon: ShoppingBag },
  { name: "My Complaints", path: "/complaints", icon: MessageSquare },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "My Profile", path: "/profile", icon: User },
];

const hostelMenuItems = [
  { name: "Hostel Overview", path: "/hostel", icon: Building2, exact: true },
  { name: "Buildings & Blocks", path: "/hostel/buildings", icon: Building2 },
  { name: "Rooms & Beds", path: "/hostel/rooms", icon: DoorOpen },
  { name: "Student Allocations", path: "/hostel/allocations", icon: UserRoundCheck },
  { name: "Room Transfers", path: "/hostel/transfers", icon: ArrowRightLeft },
  { name: "Campus Occupancy", path: "/hostel/occupancy", icon: BarChart3 },
];

const vendorMenuItems = [
  { name: "Vendor Dashboard", path: "/vendor/dashboard", icon: Store, exact: true },
  { name: "Vendor Registration", path: "/vendor/applications", icon: UserRoundPlus },
  { name: "Food Menu Items", path: "/vendor/food-items", icon: Utensils },
  { name: "Live Food Orders", path: "/vendor/orders", icon: ClipboardList },
  { name: "Digital Gate Pass", path: "/vendor/pass", icon: QrCode },
  { name: "Financial Earnings", path: "/vendor/earnings", icon: Wallet },
];

const maintenanceMenuItems = [
  { name: "Student Complaints", path: "/maintenance", icon: ClipboardList, exact: true },
  { name: "Submit Complaint", path: "/maintenance/submit-complaint", icon: MessageSquare, allowedRoles: ["student"] },
  { name: "Utilities Telemetry", path: "/utilities", icon: Droplets },
  { name: "Smart IoT Monitoring", path: "/monitoring", icon: Activity },
];

const analyticsMenuItems = [
  { name: "Executive Analytics", path: "/analytics", icon: ChartNoAxesCombined, exact: true },
  { name: "Audit Reports", path: "/reports", icon: FileText },
  { name: "Utilities & Food", path: "/utilities", icon: Droplets },
  { name: "Smart IoT Monitoring", path: "/monitoring", icon: Activity },
  { name: "Notifications Center", path: "/notifications-center", icon: Bell },
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
            end={item.exact}
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
  const { user } = useAuth();
  const currentRole = normalizeRole(user?.role || user?.roleKey);

  // Role-based visibility flags
  const showStudent = currentRole === "student" || currentRole === "admin";
  const showHostel = currentRole === "admin" || currentRole === "warden";
  const showVendor = currentRole === "vendor" || currentRole === "admin";
  const showMaintenance =
    currentRole === "maintenance" || currentRole === "admin" || currentRole === "warden";
  const showAnalytics =
    currentRole === "admin" ||
    currentRole === "warden" ||

    currentRole === "executive" ||
    currentRole === "finance";

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
          <Logo
            variant="horizontal"
            size="md"
            subtitle="Campus Management"
            asLink
          />

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
          {showStudent && (
            <div>
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Student Services
              </p>
              <div className="space-y-1">
                {studentMenuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
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
          )}

          {showHostel && (
            <MenuSection
              title="Hostel Management"
              items={hostelMenuItems}
              onClose={onClose}
            />
          )}

          {showMaintenance && !showStudent && (
            <MenuSection
              title="Maintenance Division"
              items={maintenanceMenuItems}
              onClose={onClose}
            />
          )}

          {showVendor && (
            <MenuSection
              title="Vendor Portal"
              items={vendorMenuItems}
              onClose={onClose}
            />
          )}

          {showAnalytics && (
            <MenuSection
              title="Analytics & Oversight"
              items={analyticsMenuItems}
              onClose={onClose}
            />
          )}
        </nav>

        {/* Footer Widget */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {user?.name || "SmartStay"}
                </p>
              </div>
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                {user?.roleKey || currentRole}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 truncate">
              {user?.roleBadge || "Verified Session"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
