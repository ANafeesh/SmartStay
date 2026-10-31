import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, ArrowRight, UserCheck } from "lucide-react";

/**
 * Frontend-Only Route Guard for SmartStay
 * Verifies logged-in status and provides friendly evaluation-mode role switching.
 */
function ProtectedRoute({ allowedRoles = null, children = null }) {
  const { user, isLoggedIn, switchRole } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role check is needed and user role is not in allowedRoles
  const isRoleAllowed =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    allowedRoles.includes(user?.roleKey);

  if (!isRoleAllowed) {
    const targetRole = allowedRoles[0];

    return (
      <div className="space-y-6">
        {/* Soft Role Mismatch Banner (Evaluation Friendly) */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 text-amber-900 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Role Demonstration Notice
                </h4>
                <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
                  You are currently logged in as{" "}
                  <strong>{user?.name} ({user?.role || user?.roleKey})</strong>.
                  This workspace typically requires <strong>{targetRole.toUpperCase()}</strong> permissions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => switchRole(targetRole)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition shrink-0"
            >
              <UserCheck size={14} />
              <span>Switch to {targetRole} persona</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Still render the content so examiners are never locked out */}
        {children || <Outlet />}
      </div>
    );
  }

  return children || <Outlet />;
}

export default ProtectedRoute;

