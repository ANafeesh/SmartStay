import { Bell, Menu, Search } from "lucide-react";

function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="flex shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white p-2.5 text-smart-primary transition hover:bg-smart-background lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Welcome */}
          <div className="min-w-0">
            <p className="hidden text-sm text-smart-secondary sm:block">
              Welcome back,
            </p>

            <h2 className="truncate text-base font-bold text-smart-primary sm:text-xl">
              Ahamed Nafeesh
            </h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search */}
          <button
            className="hidden rounded-xl border border-black/10 bg-white p-3 text-smart-secondary transition hover:bg-smart-background sm:block"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button
            className="relative rounded-xl border border-black/10 bg-white p-2.5 text-smart-secondary transition hover:bg-smart-background sm:p-3"
            aria-label="Notifications"
          >
            <Bell size={19} className="sm:h-5 sm:w-5" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-smart-danger sm:right-2 sm:top-2" />
          </button>

          {/* Profile */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-smart-blue text-sm font-bold text-white sm:h-10 sm:w-10">
            AN
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
