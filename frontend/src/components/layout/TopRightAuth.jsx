import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogIn, User, ShieldCheck, X } from "lucide-react";
import Logo from "../ui/Logo";

export default function TopRightAuth({ compact = false }) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("nafeesh");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState("student");

  const handleLogoutConfirm = () => {
    logout();
    setShowConfirmLogout(false);
  };

  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    if (selectedRole === "vendor") {
      login({
        name: "Campus Bites",
        initials: "CB",
        email: "vendor@campusbites.edu",
        studentId: "VND-2026-08",
        role: "Approved Food Vendor",
        room: "Canteen Stall #3",
      });
    } else if (selectedRole === "warden") {
      login({
        name: "Dr. K. Perera",
        initials: "KP",
        email: "warden@campus.edu",
        studentId: "ADM-WARDEN-01",
        role: "Hostel Warden",
        room: "Admin Hall 101",
      });
    } else {
      login({
        name: "Nafeesh",
        initials: "AN",
        email: "nafeesh@campus.edu",
        studentId: "SEU/IS/22/ICT/090",
        role: "Student account",
        room: "Block B - Room 204",
      });
    }
    setShowLoginModal(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LogIn size={16} className="transition-transform group-hover:translate-x-0.5" />
            <span>Log In</span>
          </button>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="mb-5">
                <Logo
                  variant="horizontal"
                  size="md"
                  subtitle="Access student, vendor or management portals"
                />
              </div>

              <div className="mb-4 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Quick Select Account Demo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("student");
                      setUsername("nafeesh");
                    }}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                      selectedRole === "student"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("vendor");
                      setUsername("campus_bites");
                    }}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                      selectedRole === "vendor"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Vendor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("warden");
                      setUsername("warden_perera");
                    }}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                      selectedRole === "warden"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Warden
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Username / ID</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  <LogIn size={15} />
                  <span>Log In to Account</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // Logged-in state
  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Info (hidden on compact/mobile) */}
        {!compact && (
          <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-500/20">
              {user?.initials || "AN"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">{user?.name || "Nafeesh"}</p>
              <p className="truncate text-[10px] font-medium text-slate-400">{user?.role || "Student account"}</p>
            </div>
          </div>
        )}

        {/* Animated Lordicon Exit/Logout Button */}
        <button
          type="button"
          onClick={() => setShowConfirmLogout(true)}
          title="Log out"
          aria-label="Log out"
          className="group relative flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/60 px-2.5 py-1.5 text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-95 sm:px-3 sm:py-2"
        >
          {/* Lordicon element with person exit animation */}
          <lord-icon
            src="/system-solid-1725-person-exit.json"
            trigger="hover"
            state="hover-pinch"
            colors="primary:#e11d48"
            style={{ width: "22px", height: "22px" }}
          ></lord-icon>

          {!compact && (
            <span className="hidden text-xs font-semibold tracking-tight text-rose-700 group-hover:text-rose-800 sm:inline">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 shadow-inner">
                <lord-icon
                  src="/system-solid-1725-person-exit.json"
                  trigger="hover"
                  state="hover-pinch"
                  colors="primary:#e11d48"
                  style={{ width: "36px", height: "36px" }}
                ></lord-icon>
              </div>

              <h3 className="text-base font-bold text-slate-900">Confirm Sign Out</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Are you sure you want to end your active session as{" "}
                <span className="font-semibold text-slate-700">{user?.name}</span>?
              </p>

              <div className="mt-6 flex w-full gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmLogout(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700 active:scale-95"
                >
                  <lord-icon
                    src="/system-solid-1725-person-exit.json"
                    trigger="hover"
                    state="hover-pinch"
                    colors="primary:#ffffff"
                    style={{ width: "16px", height: "16px" }}
                  ></lord-icon>
                  <span>Yes, Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
