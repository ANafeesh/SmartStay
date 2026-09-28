
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  BedDouble,
  MessageSquare,
  Bell,
  User,
  ChartNoAxesCombined,
  FileText,
  Droplets,
  Activity,
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
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "Utilities & Food",
    path: "/utilities",
    icon: Droplets,
  },
  {
    name: "Smart Monitoring",
    path: "/monitoring",
    icon: Activity,
  },
  {
    name: "Notification Center",
    path: "/notification-center",
    icon: Bell,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-black/5 bg-smart-primary text-white lg:flex">

      {/* Logo Section */}
      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
        <div>
          <h1 className="text-2xl font-bold">
            Smart<span className="text-smart-teal">Stay</span>
          </h1>

          <p className="text-xs text-white/50">
            Hostel Management
          </p>
        </div>
      </div>

      {/* Scrollable Navigation Menu */}
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.4)_transparent]">

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
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-smart-blue text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} className="shrink-0" />

                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Fixed Student Portal Section */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-sm font-semibold">
            SmartStay
          </p>

          <p className="mt-1 text-xs text-white/50">
            Student Portal
          </p>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;