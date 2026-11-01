import { Navigate, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth, normalizeRole } from "../../context/AuthContext";
import { ShieldAlert, ArrowLeft, LogIn, Lock } from "lucide-react";

/**
 * Strict Full-Stack Route Guard for SmartStay
 * - Enforces active JWT authentication
 * - Prevents unauthenticated access with redirect to /login (preserving intended path)
 * - Restricts access based on server-verified user roles
 */
function ProtectedRoute({ allowedRoles = null, children = null }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // 1. Session verification in progress
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            aria-hidden="true"
            className="h-8 w-8 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600"
          />
          <p className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Verifying Security Credentials...
          </p>
          <p className="text-[11px] text-slate-400">SmartStay Secure Authentication Gate</p>
        </div>
      </div>
    );
  }

  // 2. Not authenticated: Strict redirect to Login
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Control
  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = normalizeRole(user.role || user.roleKey);
    const normalizedAllowed = allowedRoles.map(normalizeRole);

    const isAuthorized =
      currentRole === "admin" || normalizedAllowed.includes(currentRole);

    if (!isAuthorized) {
      const targetRoleName = allowedRoles[0].toUpperCase();

      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-sm border border-rose-100">
            <Lock size={36} />
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
            <ShieldAlert size={14} />
            <span>HTTP 403 Forbidden Access</span>
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Access Restricted to {targetRoleName}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
            You are signed in as <strong>{user.name}</strong> with role{" "}
            <span className="font-semibold text-slate-900">{user.roleBadge || user.role}</span>.
            Your account does not possess permission to access this protected workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={user.defaultPath || "/dashboard"}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              <ArrowLeft size={15} />
              <span>Return to My Authorized Dashboard</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <LogIn size={15} className="text-slate-500" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      );
    }
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
