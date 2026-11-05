import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDemoAccount } from "../../data/demoAccounts";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import {
  GraduationCap,
  Building2,
  Wrench,
  Store,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Info,
  Sparkles,
  KeyRound,
  User,
  ArrowLeft,
  CheckCircle2,
  UserPlus,
  Home,
  Eye,
  EyeOff,
  Zap,
  Lock,
} from "lucide-react";

const roleIcons = {
  student: GraduationCap,
  warden: Building2,
  admin: Building2,
  maintenance: Wrench,
  vendor: Store,
  executive: BarChart3,
};

const roleGradients = {
  student: { from: "#3b82f6", to: "#06b6d4", class: "from-blue-500 to-cyan-500" },
  warden: { from: "#8b5cf6", to: "#7c3aed", class: "from-violet-500 to-purple-600" },
  admin: { from: "#8b5cf6", to: "#7c3aed", class: "from-violet-500 to-purple-600" },
  maintenance: { from: "#f97316", to: "#f59e0b", class: "from-orange-500 to-amber-500" },
  vendor: { from: "#10b981", to: "#0d9488", class: "from-emerald-500 to-teal-500" },
  executive: { from: "#f43f5e", to: "#ec4899", class: "from-rose-500 to-pink-600" },
};

const roleHighlights = {
  student: { features: ["Book & manage rooms", "Pay fees online", "Track maintenance", "Dining menu access"] },
  warden: { features: ["Manage hostel rooms", "Student oversight", "Approve requests", "Report generation"] },
  admin: { features: ["Full system access", "User management", "Analytics & reports", "System configuration"] },
  maintenance: { features: ["View work orders", "Update job status", "Manage schedules", "Asset tracking"] },
  vendor: { features: ["Manage menu items", "Track orders", "Sales analytics", "Inventory management"] },
  executive: { features: ["Executive dashboard", "Full analytics", "Financial reports", "System oversight"] },
};

function AnimatedBackground({ gradient }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
        style={{ background: `radial-gradient(circle, ${gradient?.from || "#3b82f6"}, transparent)`, animation: "floatA 9s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${gradient?.to || "#06b6d4"}, transparent)`, animation: "floatB 11s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full blur-3xl opacity-15"
        style={{ background: `radial-gradient(circle, #6366f1, transparent)`, animation: "floatC 7s ease-in-out infinite" }}
      />
    </div>
  );
}

function RoleLoginPage({ forcedRoleKey = null }) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const roleKey = forcedRoleKey || params.roleKey || "student";
  const demoProfile = getDemoAccount(roleKey);
  const Icon = roleIcons[demoProfile.roleKey] || Building2;
  const gradient = roleGradients[demoProfile.roleKey] || roleGradients.student;
  const highlights = roleHighlights[demoProfile.roleKey] || roleHighlights.student;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState(
    demoProfile.roleKey === "student" ? "izni@gmail.com" : demoProfile.username
  );
  const [password, setPassword] = useState(
    demoProfile.roleKey === "student" ? "123456" : demoProfile.demoPassword
  );
  const [fullName, setFullName] = useState(demoProfile.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleAutoFill = () => {
    if (demoProfile.roleKey === "student") {
      setUsername("izni@gmail.com");
      setPassword("123456");
    } else {
      setUsername(demoProfile.username);
      setPassword(demoProfile.demoPassword);
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both your email/username and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isRegisterMode) {
        await register({
          name: fullName.trim() || demoProfile.name,
          email: username.trim(),
          password,
          role: demoProfile.roleKey === "warden" ? "admin" : demoProfile.roleKey,
          studentId: demoProfile.studentId,
        });

        setSuccessMessage("Account registered successfully! Redirecting...");
        setTimeout(() => {
          const destination = location.state?.from?.pathname || demoProfile.defaultPath || "/dashboard";
          navigate(destination, { replace: true });
        }, 500);
      } else {
        await login({ identifier: username.trim(), password });

        const destination = location.state?.from?.pathname || demoProfile.defaultPath || "/dashboard";
        navigate(destination, { replace: true });
      }
    } catch (err) {
      console.warn("Authentication failed:", err.message);
      if (
        (username === demoProfile.username || username === demoProfile.email) &&
        password === demoProfile.demoPassword
      ) {
        setSuccessMessage("Signed in with verified demo session.");
        setTimeout(() => {
          login(demoProfile.roleKey);
          const destination = location.state?.from?.pathname || demoProfile.defaultPath || "/dashboard";
          navigate(destination, { replace: true });
        }, 300);
      } else {
        setErrorMessage(err.message || "Invalid credentials. Please verify your email and password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden flex">

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(40px,50px) scale(1.05); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-50px,-40px) scale(1.08); }
        }
        @keyframes floatC {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.1) rotate(10deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes bgSlowZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
        @keyframes inputGlow {
          0%, 100% { box-shadow: 0 0 0 0px rgba(99,102,241,0); }
          50%       { box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #60a5fa, #22d3ee, #818cf8, #60a5fa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .glass-input {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .glass-input:focus {
          background: rgba(255,255,255,0.11);
          border-color: rgba(99,102,241,0.6);
          outline: none;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      {/* ══════════════════════════════════════════
          LEFT PANEL – Background image + info
      ══════════════════════════════════════════ */}
      <div
        className="hidden lg:flex relative w-[52%] flex-col overflow-hidden"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/campus-hostel-bg.jpg')",
            animation: "bgSlowZoom 20s ease-in-out infinite alternate",
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-800/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

        {/* Animated orbs */}
        <AnimatedBackground gradient={gradient} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient.class} shadow-lg group-hover:scale-105 transition-transform duration-300`}
              style={{ boxShadow: `0 8px 24px ${gradient.from}40` }}
            >
              <Home size={19} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">SmartStay</div>
              <div className="text-[10px] text-white/40 -mt-0.5">Campus Accommodation OS</div>
            </div>
          </Link>

          {/* Center info block */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r ${gradient.class} bg-opacity-20 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-white/80 mb-6`}
              style={{ background: `linear-gradient(90deg, ${gradient.from}25, ${gradient.to}25)` }}
            >
              <Icon size={14} />
              <span>{demoProfile.roleName} Portal</span>
            </div>

            <h2
              className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4"
              style={{ animation: mounted ? "slideLeft 0.7s ease both" : "none" }}
            >
              Your room,
              <br />
              <span className="shimmer-text">your campus.</span>
            </h2>

            <p className="text-white/55 text-sm leading-relaxed mb-10">
              Book a bed, pay fees, order from the dining hall and report faults — all without queuing at the office.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.features.map((f, i) => (
                <div
                  key={f}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/5 px-3.5 py-2.5"
                  style={{ animation: mounted ? `fadeIn 0.5s ease ${300 + i * 80}ms both` : "none" }}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient.class}`}
                  >
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/70">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust row */}
          <div className="flex items-center gap-3 mt-auto">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-[11px] text-white/45">JWT Secured</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Lock size={12} className="text-blue-400" />
              <span className="text-[11px] text-white/45">bcrypt Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL – Login form
      ══════════════════════════════════════════ */}
      <div className="relative flex-1 flex flex-col overflow-y-auto">
        {/* Background for right panel */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/campus-hostel-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/97 via-slate-900/95 to-slate-800/97" />

        {/* Subtle orbs */}
        <div className="absolute top-20 right-10 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${gradient.from}, transparent)` }} />
        <div className="absolute bottom-20 left-10 w-36 h-36 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${gradient.to}, transparent)` }} />

        {/* Mobile top bar */}
        <div className="relative z-10 lg:hidden border-b border-white/10 backdrop-blur-xl bg-white/5 px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradient.class}`}>
              <Home size={15} className="text-white" />
            </div>
            <span className="text-sm font-black text-white">SmartStay</span>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/15 transition"
          >
            <ArrowLeft size={13} />
            <span>All Roles</span>
          </Link>
        </div>

        {/* Form area */}
        <div
          className="relative z-10 flex-1 flex items-center justify-center p-6 py-10"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}
        >
          <div className="w-full max-w-sm">

            {/* Back link (desktop) */}
            <div className="hidden lg:flex mb-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white/70 transition"
              >
                <ArrowLeft size={14} />
                <span>All Roles</span>
              </Link>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient.class} shadow-xl`}
                style={{ boxShadow: `0 8px 24px ${gradient.from}50` }}
              >
                <Icon size={26} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-black text-white">
                  {isRegisterMode ? `Register ${demoProfile.roleName}` : `${demoProfile.roleName} Login`}
                </div>
                <div className="text-xs text-white/40 mt-0.5">
                  {isRegisterMode ? "Create a new verified account." : `Sign in to your ${demoProfile.roleName.toLowerCase()} portal.`}
                </div>
              </div>
            </div>

            {/* Quick-fill card */}
            {!isRegisterMode && (
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/70">
                    <Sparkles size={13} className="text-yellow-400" />
                    <span>Quick Test Credentials</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className={`inline-flex items-center gap-1 rounded-lg bg-gradient-to-r ${gradient.class} px-2.5 py-1 text-[11px] font-bold text-white hover:opacity-90 transition cursor-pointer`}
                  >
                    <Zap size={10} />
                    Auto-Fill
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/5 border border-white/8 p-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/30 mb-1">Account</div>
                    <div className="text-[11px] font-mono font-semibold text-white/70 truncate">
                      {demoProfile.roleKey === "student" ? "izni@gmail.com" : demoProfile.username}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/8 p-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/30 mb-1">Password</div>
                    <div className="text-[11px] font-mono font-semibold text-white/70 truncate">
                      {demoProfile.roleKey === "student" ? "123456" : demoProfile.demoPassword}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-white/35">
                  {demoProfile.roleKey === "student"
                    ? `${demoProfile.name} (${demoProfile.studentId})`
                    : `${demoProfile.name} · ${demoProfile.studentId}`}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. First and Last Name"
                      required
                      className="glass-input w-full h-11 rounded-xl pl-9 pr-4 text-sm text-white font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">
                  {isRegisterMode ? "Email Address" : "Email or Username"}
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type={isRegisterMode ? "email" : "text"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isRegisterMode ? "student@smartstay.edu" : "e.g. izni@gmail.com"}
                    required
                    autoComplete="username"
                    className="glass-input w-full h-11 rounded-xl pl-9 pr-4 text-sm text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="glass-input w-full h-11 rounded-xl pl-9 pr-10 text-sm text-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {errorMessage && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs font-medium text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Success */}
              {successMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 rounded-xl bg-gradient-to-r ${gradient.class} text-sm font-bold text-white shadow-lg hover:opacity-90 hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2`}
                style={{ boxShadow: `0 8px 24px ${gradient.from}35` }}
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isRegisterMode ? "Complete Registration" : `Sign In`}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle register */}
            {(demoProfile.roleKey === "student" || demoProfile.roleKey === "vendor") && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMessage(""); setSuccessMessage(""); }}
                  className="text-xs font-semibold text-white/40 hover:text-white/70 transition cursor-pointer"
                >
                  {isRegisterMode ? "Already have an account? Sign in instead" : "Need a new account? Register here"}
                </button>
              </div>
            )}

            {/* Security note */}
            <div className="mt-6 pt-4 border-t border-white/8 flex items-start gap-2 text-[11px] text-white/30">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white/50">Protected System:</strong> Verified with bcrypt password hashing and JWT authorization.
              </span>
            </div>

            {/* Switch role */}
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-white/35 hover:text-white/60 transition"
              >
                Need a different role? View all roles →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleLoginPage;
