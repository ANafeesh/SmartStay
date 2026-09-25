
import{
  LayoutDashboard,
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
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Room",
    path: "/room",
    icon: BedDouble,
  },
  {
    name: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    name: "Marketplace",
    path: "/marketplace",
    icon: ShoppingBag,
  },
  {
    name: "Complaints",
    path: "/complaints",
    icon: MessageSquare,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

const hostelMenuItems = [
  {
    name: "Hostel Dashboard",
    path: "/hostel",
    icon: Building2,
  },
  {
    name: "Buildings",
    path: "/hostel/buildings",
    icon: Building2,
  },
  {
    name: "Rooms & Beds",
    path: "/hostel/rooms",
    icon: DoorOpen,
  },
  {
    name: "Allocations",
    path: "/hostel/allocations",
    icon: UserRoundCheck,
  },
  {
    name: "Transfers",
    path: "/hostel/transfers",
    icon: ArrowRightLeft,
  },
  {
    name: "Occupancy",
    path: "/hostel/occupancy",
    icon: BarChart3,
  },
];

const vendorMenuItems = [
  {
    name: "Vendor Dashboard",
    path: "/vendor/dashboard",
    icon: Store,
  },
  {
    name: "Food Items",
    path: "/vendor/food-items",
    icon: Utensils,
  },
  {
    name: "Vendor Orders",
    path: "/vendor/orders",
    icon: ClipboardList,
  },
  {
    name: "Vendor Pass",
    path: "/vendor/pass",
    icon: QrCode,
  },
  {
    name: "Earnings",
    path: "/vendor/earnings",
    icon: Wallet,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-black/5 bg-smart-primary text-white lg:block">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <div>
          <h1 className="text-2xl font-bold">
            Smart<span className="text-smart-teal">Stay</span>
          </h1>

          <p className="text-xs text-white/50">Hostel Management</p>
        </div>
      </div>

      <nav className="p-4">
        {/* Main Menu */}
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Main Menu
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 bg-smart-blue text-white shadow-md"
                    : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 text-white/70 hover:bg-white/10 hover:text-white"
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Hostel Management */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Hostel Management
          </p>

          <div className="space-y-1">
            {hostelMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 bg-smart-blue text-white shadow-md"
                      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Vendor Management */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Vendor Management
          </p>

          <div className="space-y-1">
            {vendorMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 bg-smart-blue text-white shadow-md"
                      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-sm font-semibold">SmartStay</p>
   <p className="mt-1 text-xs text-white/50">Student Portal</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
