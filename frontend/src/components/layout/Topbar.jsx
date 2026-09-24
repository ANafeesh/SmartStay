import { Bell, Search } from "lucide-react";

function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-smart-secondary">Welcome back,</p>

          <h2 className="text-xl font-bold text-smart-primary">
            Ahamed Nafeesh
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-xl border border-black/10 bg-white p-3 text-smart-secondary transition hover:bg-smart-background sm:block">
            <Search size={20} />
          </button>

          <button className="relative rounded-xl border border-black/10 bg-white p-3 text-smart-secondary transition hover:bg-smart-background">
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-smart-danger" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue font-bold text-white">
            AN
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
