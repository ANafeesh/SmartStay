import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogIn, LogOut, RefreshCw, ChevronDown } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";
import RoleSwitcherModal from "../auth/RoleSwitcherModal";

export default function TopRightAuth({ compact = false }) {
  const { user, isLoggedIn, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowConfirmLogout(false);
  };

  if (!isLoggedIn) {
    return (
      <Link
        to="/login"
        className="group flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <LogIn size={15} className="transition-transform group-hover:translate-x-0.5" />
        <span>Log In</span>
      </Link>
    );
  }

  // Logged-in state
  return (
    <>
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Active Role Persona Switcher Pill */}
        <button
          type="button"
          onClick={() => setShowRoleSwitcher(true)}
          title="Switch Demo Persona"
          aria-label="Switch Demo Persona"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 sm:px-2.5 sm:py-1.5 shadow-2xs hover:border-blue-300 hover:bg-blue-50/50 transition cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 bg-gradient-to-br from-blue-600 to-indigo-700 text-[11px] font-black text-white shadow-2xs">
            {user?.initials || "AN"}
          </div>

          {!compact && (
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] font-semibold text-blue-600 leading-tight">
                {user?.roleBadge || user?.role || "Demo User"}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-400">
            <RefreshCw size={12} className="hover:rotate-180 transition-transform duration-300" />
            <ChevronDown size={13} />
          </div>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => setShowConfirmLogout(true)}
          title="Log out"
          aria-label="Log out"
          className="group relative flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/60 p-2 text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 hover:shadow-2xs active:scale-95 sm:px-3 sm:py-1.5"
        >
          <LogOut size={15} className="text-rose-600 transition-transform group-hover:scale-110" />
          {!compact && (
            <span className="hidden text-xs font-semibold tracking-tight text-rose-700 sm:inline">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Persona Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out of Session"
        message={`Are you sure you want to end your current session as ${user?.name || "this user"}? You can log back in with any persona at any time.`}
        confirmText="Sign Out"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}
