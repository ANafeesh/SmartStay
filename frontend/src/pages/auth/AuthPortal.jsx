import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, normalizeRole } from "../../context/AuthContext";
import {
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
  Store,
  Wrench,
  BarChart3,
  GraduationCap,
  ShieldCheck,
  LogIn,
  UserPlus,
} from "lucide-react";

/* ─── keyframes injected once ─── */
const STYLES = `
  @keyframes kenBurns {
    from { transform: scale(1.0); }
    to   { transform: scale(1.06); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .anim-slide-right { animation: slideInRight .55s cubic-bezier(.22,.68,0,1.2) both; }
  .anim-fade-up     { animation: fadeUp .5s cubic-bezier(.22,.68,0,1.2) both; }
  .anim-fade-in     { animation: fadeIn .4s ease both; }
  .btn-primary {
    position: relative;
    overflow: hidden;
    transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,99,235,.30);
  }
  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }
  /* ripple */
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 70%);
    opacity: 0;
    transition: opacity .2s ease;
  }
  .btn-primary:hover::after { opacity: 1; }
  /* tab hover */
  .tab-btn { transition: color .2s ease, background-color .2s ease, box-shadow .2s ease; }
  /* input focus ring */
  .inp-field { transition: border-color .18s ease, box-shadow .18s ease; }
  .inp-field:focus { box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
  /* demo row hover */
  .demo-btn { transition: border-color .15s ease, color .15s ease, background-color .15s ease; }
  .demo-btn:hover { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
`;

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: STYLES }} />;
}

export default function AuthPortal({ initialTab = "login" }) {
  const { user, isLoggedIn, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab);

  /* Sign In */
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  /* Sign Up */
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("student");
  const [regStudentId, setRegStudentId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  /* Status */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [footerNotice, setFooterNotice] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [tabKey, setTabKey] = useState(0); // bumped on tab change to re-trigger stagger

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage("");
    setSuccessMessage("");
    setFooterNotice(null);
  }, [initialTab]);

  useEffect(() => {
    // small delay so CSS transition triggers after paint
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  /* ── routing helpers ── */
  const checkRoleCanAccessPath = (roleKey, path) => {
    if (!path || typeof path !== "string") return false;
    const role = normalizeRole(roleKey);
    if (role === "admin") return true;
    if (path.startsWith("/hostel")) return role === "warden" || role === "admin";
    if (path.startsWith("/vendor")) return role === "vendor" || role === "admin";
    if (path.startsWith("/maintenance"))
      return ["maintenance", "admin", "warden", "student"].includes(role);
    if (
      path.startsWith("/analytics") ||
      path.startsWith("/reports") ||
      path.startsWith("/utilities") ||
      path.startsWith("/monitoring") ||
      path.startsWith("/notifications-center")
    )
      return ["admin", "warden", "executive", "finance"].includes(role);
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
      if (checkRoleCanAccessPath(roleKey, fromPath)) return fromPath;
    }
    if (roleKey === "warden" || roleKey === "admin") return "/hostel";
    if (roleKey === "vendor") return "/vendor/dashboard";
    if (roleKey === "maintenance") return "/maintenance";
    if (roleKey === "executive") return "/analytics";
    return "/dashboard";
  };

  /* ── handlers ── */
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
      const loggedUser = await login({ identifier: identifier.trim(), password });
      setSuccessMessage("Authentication successful. Redirecting...");
      setTimeout(() => {
        navigate(getAppropriatePath(loggedUser, loggedUser.role), { replace: true });
      }, 400);
    } catch (err) {
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
      setErrorMessage("Passwords do not match.");
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
        regRole === "student" ? "STD" :
        regRole === "admin"   ? "ADM" :
        regRole === "warden"  ? "WRD" :
        regRole === "maintenance" ? "MNT" : "VND";
      const autoId = `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`;
      const regUser = await register({
        name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        studentId: regStudentId.trim() || autoId,
        registrationNumber: regStudentId.trim() || autoId,
      });
      setSuccessMessage("Account created. Redirecting...");
      setTimeout(() => {
        navigate(getAppropriatePath(regUser, regRole), { replace: true });
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (email, pass = "password123") => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMessage("");
    setShowDemoMenu(false);
  };

  /* ── demo list ── */
  const demos = [
    { label: "Student",     email: "izni@gmail.com",              pass: "123456",      icon: GraduationCap },
    { label: "Warden",      email: "warden@smartstay.com",        pass: "password123", icon: Building },
    { label: "Vendor",      email: "vendor@smartstay.com",        pass: "password123", icon: Store },
    { label: "Maintenance", email: "maintenance@smartstay.com",   pass: "password123", icon: Wrench },
    { label: "Executive",   email: "executive@smartstay.com",     pass: "password123", icon: BarChart3 },
  ];

  /* ── input base style ── */
  const inp =
    "w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen flex font-sans antialiased bg-white">
      <GlobalStyles />

      {/* ══════════════════════════════
          LEFT — photo panel
      ══════════════════════════════ */}
      <div className="hidden lg:block relative w-[52%] overflow-hidden">
        {/* The photo itself — gentle Ken Burns */}
        <img
          src="/campus-hostel-bg.jpg"
          alt="SmartStay campus residence"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ animation: "kenBurns 20s ease-in-out infinite alternate" }}
        />

        {/* Light bottom gradient so the caption reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

        {/* Top-left wordmark — fades in */}
        <div
          className="absolute top-8 left-8 flex items-center gap-2.5 anim-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path d="M9 23L24 10l15 13" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 22v14a2 2 0 002 2h16a2 2 0 002-2V22" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="27" r="3.2" fill="#06b6d4"/>
            </svg>
          </div>
          <span className="text-white text-base font-semibold tracking-tight drop-shadow">SmartStay</span>
        </div>

        {/* Bottom caption — slides up */}
        <div
          className="absolute bottom-10 left-8 right-8 text-white anim-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <p className="text-2xl font-semibold leading-snug mb-2 drop-shadow-sm">
            Your campus,<br />your home.
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Book rooms, pay fees, order meals and report faults — all in one place.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT — form panel
      ══════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-white overflow-y-auto anim-slide-right">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg width="17" height="17" viewBox="0 0 48 48" fill="none">
              <path d="M9 23L24 10l15 13" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 22v14a2 2 0 002 2h16a2 2 0 002-2V22" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="27" r="3.2" fill="#06b6d4"/>
            </svg>
          </div>
          <span className="text-slate-900 text-sm font-semibold">SmartStay</span>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm mx-auto my-auto">

          {/* Active session */}
          {isLoggedIn && user && (
            <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white">
                  {user.initials || "ST"}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-slate-500 text-[11px] capitalize">{user.role} · active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(getAppropriatePath(user, user.roleKey), { replace: true })}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition cursor-pointer shrink-0"
              >
                Continue <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="mb-7 anim-fade-up" style={{ animationDelay: "120ms" }}>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "login"
                ? "Sign in to access hostel, dining, and campus services."
                : "Register as a resident student, warden, or facility staff."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-slate-200 p-1 mb-6 bg-slate-50 anim-fade-up" style={{ animationDelay: "180ms" }}>
            {[
              { key: "login", icon: LogIn, label: "Sign in" },
              { key: "register", icon: UserPlus, label: "Create account" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setActiveTab(key); setErrorMessage(""); setSuccessMessage(""); setTabKey(k => k + 1); }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === key
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div role="status" className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-500" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* ── SIGN IN ── */}
          {activeTab === "login" && (
            <form onSubmit={handleSignIn} className="space-y-4" key="login-form">
              <div className="anim-fade-up" style={{ animationDelay: "220ms" }}>
                <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@campus.edu"
                    required
                    autoComplete="username"
                    className={`${inp} inp-field`}
                  />
                </div>
              </div>

              <div className="anim-fade-up" style={{ animationDelay: "280ms" }}>
                <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className={`${inp} pr-10 inp-field`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between anim-fade-up" style={{ animationDelay: "330ms" }}>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setErrorMessage("Contact your hostel warden desk or university administration to reset your credentials.")}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="anim-fade-up" style={{ animationDelay: "380ms" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-1 btn-primary"
                >
                  {isSubmitting ? "Signing in…" : <><span>Sign in to SmartStay</span><ArrowRight size={15} /></>}
                </button>
              </div>

              {/* Demo accounts */}
              <div className="text-center pt-1 anim-fade-up" style={{ animationDelay: "430ms" }}>
                <button
                  type="button"
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  Demo accounts
                  <ChevronDown size={12} className={`transition-transform duration-200 ${showDemoMenu ? "rotate-180" : ""}`} />
                </button>

                {showDemoMenu && (
                  <div className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2 grid grid-cols-2 gap-1.5 text-left anim-fade-up">
                    {demos.map(({ label, email, pass, icon: DIcon }) => (
                      <button
                        key={email}
                        type="button"
                        onClick={() => fillDemo(email, pass)}
                        className={`demo-btn flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 cursor-pointer ${label === "Executive" ? "col-span-2 justify-center" : ""}`}
                      >
                        <DIcon size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
          )}

          {/* ── REGISTER ── */}
          {activeTab === "register" && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-name"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    className={inp}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@smartstay.com"
                    required
                    className={inp}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-role" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Hostel Admin</option>
                    <option value="warden">Warden</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="reg-id" className="block text-xs font-medium text-slate-700 mb-1.5">
                    {regRole === "student" ? "Student ID" : "Staff ID"}
                  </label>
                  <div className="relative">
                    <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="reg-id"
                      type="text"
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      placeholder={regRole === "student" ? "STD-2026" : "EMP-01"}
                      className={`${inp} font-mono`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="reg-pass" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-pass"
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className={`${inp} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-confirm"
                    type={showRegPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className={inp}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isSubmitting ? "Creating account…" : <><span>Create Account</span><ArrowRight size={15} /></>}
              </button>

              <p className="text-center text-xs text-slate-500">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Footer notice */}
          {footerNotice && (
            <div className="mt-4 p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-start justify-between gap-2">
              <span>{footerNotice}</span>
              <button type="button" onClick={() => setFooterNotice(null)} className="text-slate-400 hover:text-slate-600 shrink-0">×</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Secured with bcrypt &amp; JWT</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {[
              { label: "Privacy", msg: "Student data is encrypted under university policy." },
              { label: "Terms",   msg: "Campus residency regulations and hostel guidelines apply." },
              { label: "Help",    msg: "Support Desk: support@smartstay.campus · Ext. 108" },
            ].map(({ label, msg }) => (
              <button
                key={label}
                type="button"
                onClick={() => setFooterNotice(msg)}
                className="hover:text-slate-600 transition cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
