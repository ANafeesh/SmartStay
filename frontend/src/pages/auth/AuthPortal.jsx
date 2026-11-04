import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth, normalizeRole } from "../../context/AuthContext";
import Logo from "../../components/ui/Logo";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

/**
 * Bottom-left soft pastel blue fluid wave decoration matching the design mockup.
 */
function BottomLeftWaves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 w-64 sm:w-80 md:w-96 h-28 sm:h-36 z-0 overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 380 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 160V95C50 75 110 70 170 95C230 120 290 125 380 75V160H0Z"
          fill="#EFF6FF"
          opacity="0.85"
        />
        <path
          d="M0 160V110C65 95 125 90 185 115C245 140 305 145 380 115V160H0Z"
          fill="#DBEAFE"
          opacity="0.6"
        />
        <path
          d="M0 160V125C75 115 140 110 205 130C265 150 315 150 380 135V160H0Z"
          fill="#BFDBFE"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}

export default function AuthPortal({ initialTab = "login" }) {
  const { user, isLoggedIn, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab); // "login" | "register"

  // Sign In inputs
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up inputs
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("student");
  const [regStudentId, setRegStudentId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  // Keep active tab in sync with prop changes (e.g., navigating /login vs /register)
  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage("");
    setSuccessMessage("");
  }, [initialTab]);

  // Check if a specific URL path is authorized for a given user role
  const checkRoleCanAccessPath = (roleKey, path) => {
    if (!path || typeof path !== "string") return false;
    const role = normalizeRole(roleKey);
    if (role === "admin") return true;
    if (path.startsWith("/hostel")) return role === "warden" || role === "admin";
    if (path.startsWith("/vendor")) return role === "vendor" || role === "admin";
    if (path.startsWith("/maintenance")) {
      return ["maintenance", "admin", "warden", "student"].includes(role);
    }
    if (
      path.startsWith("/analytics") ||
      path.startsWith("/reports") ||
      path.startsWith("/utilities") ||
      path.startsWith("/monitoring") ||
      path.startsWith("/notifications-center")
    ) {
      return ["admin", "warden", "executive", "finance"].includes(role);
    }
    return ["student", "admin"].includes(role);
  };

  // Determine destination URL
  const getAppropriatePath = (targetUser, fallbackRole) => {
    const roleKey = normalizeRole(
      targetUser?.role || targetUser?.roleKey || fallbackRole
    );
    const fromPath = location.state?.from?.pathname;

    if (
      fromPath &&
      fromPath !== "/" &&
      fromPath !== "/login" &&
      !fromPath.startsWith("/login/") &&
      fromPath !== "/register" &&
      fromPath !== "/signup"
    ) {
      if (checkRoleCanAccessPath(roleKey, fromPath)) {
        return fromPath;
      }
    }

    if (roleKey === "warden" || roleKey === "admin") return "/hostel";
    if (roleKey === "vendor") return "/vendor/dashboard";
    if (roleKey === "maintenance") return "/maintenance";
    if (roleKey === "executive") return "/analytics";
    return "/dashboard";
  };

  // Submit Handler for Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const loggedUser = await login({
        identifier: identifier.trim(),
        password,
      });

      setSuccessMessage("Authentication successful! Redirecting...");
      setTimeout(() => {
        const destination = getAppropriatePath(loggedUser, loggedUser.role);
        navigate(destination, { replace: true });
      }, 400);
    } catch (err) {
      console.warn("Sign in error:", err.message);
      setErrorMessage(
        err.message || "Invalid email or password. Please verify your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler for Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const prefix =
        regRole === "student"
          ? "STD"
          : regRole === "admin"
          ? "ADM"
          : regRole === "warden"
          ? "WRD"
          : regRole === "maintenance"
          ? "MNT"
          : "VND";
      const autoId = `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`;

      const regUser = await register({
        name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        studentId: regStudentId.trim() || autoId,
        registrationNumber: regStudentId.trim() || autoId,
      });

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        const destination = getAppropriatePath(regUser, regRole);
        navigate(destination, { replace: true });
      }, 500);
    } catch (err) {
      console.warn("Registration error:", err.message);
      setErrorMessage(
        err.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Helper
  const fillDemoAccount = (email) => {
    setIdentifier(email);
    setPassword("password123");
    setErrorMessage("");
    setShowDemoMenu(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* =========================================================================
          LEFT PANEL: Exact layout from mockup with brand logo, form, and waves
         ========================================================================= */}
      <div className="relative w-full lg:w-[42%] xl:w-[40%] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-12 xl:p-14 bg-white min-h-screen z-10">
        {/* Soft Background Wave at Bottom Left */}
        <BottomLeftWaves />

        {/* Top Header: Brand Logo */}
        <div className="relative z-10 flex items-center justify-between pb-6 sm:pb-8">
          <Logo
            variant="horizontal"
            size="md"
            subtitle="Campus Living"
            asLink={false}
          />
        </div>

        {/* Center Container: Main Form Card */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto my-auto py-2">
          {/* Active Session Notice (when already logged in) */}
          {isLoggedIn && user && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-3.5 text-xs text-blue-900 animate-in fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A73E8] text-xs font-bold text-white shadow-xs">
                  {user.initials || "ST"}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-blue-700 text-[11px] capitalize">
                    {user.role} Account Active
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigate(getAppropriatePath(user, user.roleKey), {
                    replace: true,
                  })
                }
                className="inline-flex items-center gap-1 rounded-lg bg-[#1A73E8] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1557B0] transition cursor-pointer shrink-0"
              >
                <span>Continue</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight text-slate-900">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-normal">
              {activeTab === "login"
                ? "Sign in to manage your campus stay."
                : "Register to manage rooms, dining, and campus services."}
            </p>
          </div>

          {/* Tab Pill Switcher (Matches Mockup) */}
          <div className="rounded-2xl bg-slate-100/90 p-1 flex items-center gap-1 mb-6 border border-slate-200/50">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-[#EBF3FE] text-[#1A73E8] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LogIn size={16} />
              <span>Sign in</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-[#EBF3FE] text-[#1A73E8] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus size={16} />
              <span>Create account</span>
            </button>
          </div>

          {/* Alerts: Error & Success */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 animate-in fade-in"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800 animate-in fade-in"
            >
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              <span className="font-semibold leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* =============================================================
              TAB 1: SIGN IN (Pixel-accurate to provided mockup image)
             ============================================================= */}
          {activeTab === "login" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={17}
                    className="absolute left-3.5 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Password <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={17}
                    className="absolute left-3.5 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1A73E8] focus:ring-[#1A73E8] accent-[#1A73E8] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setErrorMessage(
                      "To reset your password, contact your hostel warden desk or admin office."
                    )
                  }
                  className="text-xs sm:text-sm font-semibold text-[#1A73E8] hover:text-blue-700 transition cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold py-3.5 px-6 rounded-xl transition duration-150 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
              >
                <span>{isSubmitting ? "Signing in..." : "Sign in to SmartStay"}</span>
                {!isSubmitting && <ArrowRight size={18} />}
              </button>

              {/* Discreet Demo Account Helper Toggle */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <span>Quick demo credentials</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${showDemoMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showDemoMenu && (
                  <div className="mt-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/80 text-left grid grid-cols-2 gap-1.5 animate-in fade-in text-xs">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("student@smartstay.com")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-blue-50 hover:border-blue-200 transition text-left"
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("admin@smartstay.com")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-blue-50 hover:border-blue-200 transition text-left"
                    >
                      🛡️ Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("warden@smartstay.com")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-blue-50 hover:border-blue-200 transition text-left"
                    >
                      🏢 Warden
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("vendor@smartstay.com")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-blue-50 hover:border-blue-200 transition text-left"
                    >
                      ☕ Vendor
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* =============================================================
              TAB 2: CREATE RESIDENT ACCOUNT
             ============================================================= */}
          {activeTab === "register" && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Full Name <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <User
                    size={17}
                    className="absolute left-3.5 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-name"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={17}
                    className="absolute left-3.5 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@smartstay.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Role & ID Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-role"
                    className="block text-xs font-semibold text-slate-800 mb-1.5"
                  >
                    Account Role <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Hostel Admin</option>
                    <option value="warden">Hostel Warden</option>
                    <option value="maintenance">Maintenance Staff</option>
                    <option value="vendor">Canteen Vendor</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="reg-id"
                    className="block text-xs font-semibold text-slate-800 mb-1.5"
                  >
                    {regRole === "student" ? "Student ID" : "Staff / Vendor ID"}
                  </label>
                  <div className="relative flex items-center">
                    <Building
                      size={16}
                      className="absolute left-3 text-slate-400 pointer-events-none"
                    />
                    <input
                      id="reg-id"
                      type="text"
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      placeholder={regRole === "student" ? "STD-2026-090" : "EMP-01"}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="reg-pass"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Password <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={17}
                    className="absolute left-3.5 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-pass"
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition focus:outline-none cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="reg-confirm-pass"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Confirm Password <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={17}
                    className="absolute left-3.5 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-confirm-pass"
                    type={showRegPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold py-3.5 px-6 rounded-xl transition duration-150 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-3"
              >
                <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
                {!isSubmitting && <ArrowRight size={18} />}
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="font-semibold text-[#1A73E8] hover:text-blue-700 cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Bottom Clean Footer Links (Matches Mockup: Privacy | Terms | Help) */}
        <div className="relative z-10 pt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={() =>
              alert("SmartStay Privacy Policy: All student & resident data is securely encrypted.")
            }
            className="hover:text-slate-600 transition cursor-pointer"
          >
            Privacy
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() =>
              alert("SmartStay Terms of Service: Campus living terms and regulations apply.")
            }
            className="hover:text-slate-600 transition cursor-pointer"
          >
            Terms
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() =>
              alert("Campus Support Desk: Available 24/7 at support@smartstay.campus or Ext. 108.")
            }
            className="hover:text-slate-600 transition cursor-pointer"
          >
            Help
          </button>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: University Campus Hostel Photograph matching provided photo
         ========================================================================= */}
      <div
        className="hidden lg:flex lg:w-[58%] xl:w-[60%] relative bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: "url('/campus-hostel-bg.jpg')",
        }}
      />
    </div>
  );
}
