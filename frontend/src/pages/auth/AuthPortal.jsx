import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, normalizeRole } from "../../context/AuthContext";
import Logo from "../../components/ui/Logo";
import campusHostelBg from "../../assets/campus-hostel-bg.jpg";
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
  ChevronDown,
  Home,
  Bed,
  CreditCard,
  Headphones,
  Shield,
  Store,
} from "lucide-react";

/**
 * Bottom-left soft pastel blue fluid wave decoration matching brand styling.
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

  const [activeTab, setActiveTab] = useState(initialTab);

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
  const [footerNotice, setFooterNotice] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage("");
    setSuccessMessage("");
    setFooterNotice(null);
  }, [initialTab]);

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

      setSuccessMessage("Authentication successful. Redirecting...");
      setTimeout(() => {
        const destination = getAppropriatePath(loggedUser, loggedUser.role);
        navigate(destination, { replace: true });
      }, 400);
    } catch (err) {
      console.warn("Sign in error:", err.message);
      setErrorMessage(
        err.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setErrorMessage("Password must be at least 6 characters.");
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

      setSuccessMessage("Account created successfully. Redirecting...");
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

  const fillDemoAccount = (email) => {
    setIdentifier(email);
    setPassword("password123");
    setErrorMessage("");
    setShowDemoMenu(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-[#1A73E8] selection:text-white font-sans antialiased">
      {/* =========================================================================
          LEFT PANEL: Authentication Card & Form View
         ========================================================================= */}
      <div className="relative w-full lg:w-[42%] xl:w-[40%] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-12 xl:p-14 bg-white min-h-screen z-10">
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
          {/* Active Session Notice */}
          {isLoggedIn && user && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-[#EBF3FE]/70 p-3 text-xs text-blue-900">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#1A73E8] text-xs font-medium text-white">
                  {user.initials || "ST"}
                </div>
                <div className="truncate">
                  <p className="font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-slate-500 text-[11px] capitalize font-mono">
                    {user.role} account active
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
                className="inline-flex items-center gap-1 rounded-md bg-[#1A73E8] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#1557B0] transition-colors cursor-pointer shrink-0"
              >
                <span>Continue</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {activeTab === "login"
                ? "Sign in to access hostel residency, dining, and campus services."
                : "Register as a resident student, warden, or facility staff."}
            </p>
          </div>

          {/* Tab Pill Switcher */}
          <div className="rounded-xl bg-slate-100 p-1 flex items-center gap-1 mb-6 border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "login"
                  ? "bg-[#EBF3FE] text-[#1A73E8]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LogIn size={15} />
              <span>Sign in</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "register"
                  ? "bg-[#EBF3FE] text-[#1A73E8]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus size={15} />
              <span>Create account</span>
            </button>
          </div>

          {/* Alerts: Error & Success */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800"
            >
              <AlertCircle size={15} className="shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800"
            >
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600 mt-0.5" />
              <span className="font-medium leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* =============================================================
              TAB 1: SIGN IN
             ============================================================= */}
          {activeTab === "login" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Email address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@campus.edu"
                    required
                    autoComplete="username"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#1A73E8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#1A73E8] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#1A73E8] focus:ring-[#1A73E8] accent-[#1A73E8] cursor-pointer"
                  />
                  <span className="text-xs text-slate-600">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setErrorMessage(
                      "To reset credentials, contact your hostel warden desk or university administrative office."
                    )
                  }
                  className="text-xs font-medium text-[#1A73E8] hover:text-[#1557B0] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-70 mt-2"
              >
                <span>{isSubmitting ? "Signing in..." : "Sign in to SmartStay"}</span>
                {!isSubmitting && <ArrowRight size={15} />}
              </button>

              {/* Demo Account Selector */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <span>Demo accounts</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-150 ${showDemoMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showDemoMenu && (
                  <div className="mt-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50 text-left grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("student@smartstay.com")}
                      className="flex items-center gap-1.5 p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors text-left"
                    >
                      <User size={13} className="text-slate-500" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("admin@smartstay.com")}
                      className="flex items-center gap-1.5 p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors text-left"
                    >
                      <Shield size={13} className="text-slate-500" />
                      <span>Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("warden@smartstay.com")}
                      className="flex items-center gap-1.5 p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors text-left"
                    >
                      <Building size={13} className="text-slate-500" />
                      <span>Warden</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("vendor@smartstay.com")}
                      className="flex items-center gap-1.5 p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors text-left"
                    >
                      <Store size={13} className="text-slate-500" />
                      <span>Vendor</span>
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
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Full name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-name"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#1A73E8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Email address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@smartstay.com"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#1A73E8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Role & ID Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-role"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Account role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#1A73E8] focus:outline-none"
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
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    {regRole === "student" ? "Student ID" : "Staff / Vendor ID"}
                  </label>
                  <div className="relative flex items-center">
                    <Building
                      size={15}
                      className="absolute left-3 text-slate-400 pointer-events-none"
                    />
                    <input
                      id="reg-id"
                      type="text"
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      placeholder={regRole === "student" ? "STD-2026-090" : "EMP-01"}
                      className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#1A73E8] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="reg-pass"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-pass"
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#1A73E8] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="reg-confirm-pass"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Confirm password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-confirm-pass"
                    type={showRegPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#1A73E8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-70 mt-3"
              >
                <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
                {!isSubmitting && <ArrowRight size={15} />}
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="font-medium text-[#1A73E8] hover:text-[#1557B0] cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Footer Informational Callout */}
          {footerNotice && (
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>{footerNotice}</span>
              <button
                type="button"
                onClick={() => setFooterNotice(null)}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Bottom Footer Links */}
        <div className="relative z-10 pt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={() =>
              setFooterNotice("Privacy: Student and resident data is securely encrypted under university policy.")
            }
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() =>
              setFooterNotice("Terms: Campus residency regulations and hostel guidelines apply.")
            }
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Terms
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() =>
              setFooterNotice("Help: Campus Support Desk is available at support@smartstay.campus or Ext. 108.")
            }
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Help
          </button>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Campus Hostel Photograph with refined glass overlay
         ========================================================================= */}
      <div
        className="hidden lg:flex lg:w-[58%] xl:w-[60%] relative bg-cover bg-center min-h-screen flex-col justify-between p-8 xl:p-12 overflow-hidden"
        style={{
          backgroundImage: `url(${campusHostelBg})`,
        }}
      >
        {/* Vignette for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30 pointer-events-none" />

        {/* Top Residence Badge */}
        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white shadow-sm">
            <Home size={13} className="text-white" />
            <span>Campus Residence</span>
          </div>
        </div>

        {/* Bottom Glass Card */}
        <div className="relative z-10 max-w-lg">
          <div className="rounded-2xl border border-white/20 bg-slate-950/70 backdrop-blur-md p-6 text-white shadow-xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
              A better way to <br />
              manage <span className="text-[#38BDF8]">campus living</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Book rooms, manage payments, and access campus services easily.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Bed size={14} className="text-slate-300 shrink-0" />
                <span>Rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-slate-300 shrink-0" />
                <span>Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones size={14} className="text-slate-300 shrink-0" />
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
