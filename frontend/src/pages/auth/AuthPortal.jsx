import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useAuth, normalizeRole } from "../../context/AuthContext";
import Logo from "../../components/ui/Logo";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import {
  KeyRound,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building,
  ShieldCheck,
  Sparkles,
  QrCode,
  CreditCard,
  Wrench,
  ChevronRight,
} from "lucide-react";

export default function AuthPortal({ initialTab = "login" }) {
  const { user, isLoggedIn, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab); // "login" | "register"

  // Input fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("student");
  const [regStudentId, setRegStudentId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Submit Handler for Sign In (Authenticates with real MongoDB backend)
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
      const prefix = regRole === "student" ? "STD" : regRole === "admin" ? "ADM" : regRole === "warden" ? "WRD" : regRole === "maintenance" ? "MNT" : "VND";
      const autoId = `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`;

      const regUser = await register({
        name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        studentId: regStudentId.trim() || autoId,
        registrationNumber: regStudentId.trim() || autoId,
      });

      setSuccessMessage(
        "Account created successfully! Redirecting to your dashboard..."
      );
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

  // Quick Account Populator for Easy Testing
  const selectQuickAccount = (email) => {
    setIdentifier(email);
    setPassword("password123");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 selection:bg-blue-600 selection:text-white">
      {/* LEFT COLUMN: Clean, High-Contrast Authentication Form */}
      <div className="w-full lg:w-[48%] xl:w-[42%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white border-r border-slate-200/80 shadow-2xl lg:shadow-none min-h-screen">
        {/* Brand & Status Header */}
        <div className="flex items-center justify-between pb-8">
          <Logo
            variant="horizontal"
            size="md"
            subtitle="Campus Living OS"
            asLink={false}
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </span>
        </div>

        {/* Center Auth Card */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          {/* Active Session Notice if logged in */}
          {isLoggedIn && user && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/90 p-4 text-xs text-blue-900 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-xs">
                  {user.initials || "AN"}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-blue-700 text-[11px] font-semibold">
                    Signed In ({user.roleBadge || user.role})
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer shrink-0"
              >
                <span>Open Portal</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeTab === "login"
                ? "Sign in to SmartStay"
                : "Create Resident Account"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {activeTab === "login"
                ? "Enter your email and password to access your campus account."
                : "Register for digital room access, gate passes, and services."}
            </p>
          </div>

          {/* Tab Pill Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <KeyRound size={15} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/95 p-3.5 text-xs text-rose-800 animate-in fade-in"
            >
              <AlertCircle size={17} className="shrink-0 text-rose-600 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-xs text-emerald-800 animate-in fade-in"
            >
              <CheckCircle2 size={17} className="shrink-0 text-emerald-600 mt-0.5" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === "login" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <InputField
                label="Email Address"
                id="identifier"
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@smartstay.com"
                icon={Mail}
                required
                autoComplete="username"
              />

              <InputField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={Lock}
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setErrorMessage(
                      "Password resets are handled securely through the hostel administration desk."
                    )
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center shadow-md shadow-blue-600/20 font-bold"
              >
                <span>Sign In to SmartStay</span>
                <ArrowRight size={16} />
              </Button>

              
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === "register" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <InputField
                label="Full Name"
                id="regFullName"
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="e.g. Your Full Name"
                icon={User}
                required
              />

              <InputField
                label="Email Address"
                id="regEmail"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. user@smartstay.com"
                icon={Mail}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="student">Student Account</option>
                    <option value="admin">Hostel Administrator (Admin)</option>
                    <option value="warden">Hostel Warden</option>
                    <option value="maintenance">Maintenance Staff</option>
                    <option value="vendor">Canteen Vendor</option>
                  </select>
                </div>

                <InputField
                  label={
                    regRole === "student" ? "Student ID" : "Staff / Vendor ID"
                  }
                  id="regStudentId"
                  type="text"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  placeholder={
                    regRole === "student"
                      ? "e.g. STD-2026-090"
                      : "e.g. EMP-2026-01"
                  }
                  icon={Building}
                />
              </div>

              <InputField
                label="Password"
                id="regPassword"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min 6 characters"
                icon={Lock}
                required
              />

              <InputField
                label="Confirm Password"
                id="regConfirmPassword"
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                icon={Lock}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center shadow-md shadow-blue-600/20 font-bold mt-2"
              >
                <span>Create Account</span>
                <ArrowRight size={16} />
              </Button>

              <p className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Clean Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>&copy; {new Date().getFullYear()} SmartStay OS</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 transition">Privacy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 transition">Terms</span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 transition">Help Desk</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Real University Hostel Visual with Glass Floating Card */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[58%] relative p-8 xl:p-12 flex-col justify-between overflow-hidden bg-slate-900 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
        }}
      >
        {/* Subtle Modern Gradient Vignette to keep image crisp and text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-lg">
            <Building size={14} className="text-blue-400" />
            <span>Campus Residence &bull; Block B</span>
          </div>
        </div>

        {/* Bottom Floating Glass Card Showcase */}
        <div className="relative z-10 max-w-xl">
          <div className="rounded-3xl border border-white/15 bg-slate-900/65 backdrop-blur-xl p-6 xl:p-8 text-white shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/80 text-white">
                <Sparkles size={16} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Modern Hostel Living
              </span>
            </div>

            <h2 className="text-xl xl:text-2xl font-black text-white leading-snug">
              Every campus service, unified in one living operating system.
            </h2>

            <p className="mt-2 text-xs xl:text-sm text-slate-300 leading-relaxed">
              Automated gate pass clearances, real-time mess bills, room
              allocations, and facility maintenance directly from your device.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <QrCode size={16} className="text-blue-400 shrink-0" />
                <span>QR Passes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CreditCard size={16} className="text-blue-400 shrink-0" />
                <span>Mess Pay</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Wrench size={16} className="text-blue-400 shrink-0" />
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
