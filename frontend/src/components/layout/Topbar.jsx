import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-2xs transition hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Welcome Text */}
          <div className="min-w-0">
            <p className="hidden text-xs font-medium text-slate-400 sm:block">
              Welcome back,
            </p>
            <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
              {user?.name || "Student"}
            </h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Quick Search */}
          <button
            className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:flex"
            aria-label="Search"
          >
            <Search size={16} />
            <span>Search features...</span>
          </button>

          {/* Search Button for Mobile */}
          <button
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-2xs transition hover:bg-slate-50 sm:hidden"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-2xs transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-3 pl-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-xs shadow-blue-500/20">
              {user?.initials || (user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "ST")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
