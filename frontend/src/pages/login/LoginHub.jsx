import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DEMO_ACCOUNTS } from "../../data/demoAccounts";
import {
  GraduationCap,
  Building2,
  Wrench,
  Store,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  LogIn,
  CheckCircle2,
  Sparkles,
  Home,
} from "lucide-react";

const roleIcons = {
  student: GraduationCap,
  warden: Building2,
  maintenance: Wrench,
  vendor: Store,
  executive: BarChart3,
};

const roleGradients = {
  student: "from-blue-500 to-cyan-500",
  warden: "from-violet-500 to-purple-600",
  maintenance: "from-orange-500 to-amber-500",
  vendor: "from-emerald-500 to-teal-500",
  executive: "from-rose-500 to-pink-600",
};

const roleBorderHover = {
  student: "hover:border-blue-400/60",
  warden: "hover:border-violet-400/60",
  maintenance: "hover:border-orange-400/60",
  vendor: "hover:border-emerald-400/60",
  executive: "hover:border-rose-400/60",
};

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)", animation: "floatOrb1 8s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent)", animation: "floatOrb2 10s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)", animation: "floatOrb3 7s ease-in-out infinite" }}
      />
    </div>
  );
}

function LoginHub() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleInstantLogin = (roleKey, defaultPath) => {
    switchRole(roleKey);
    navigate(defaultPath);
  };

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">
      {/* ── Background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/campus-hostel-bg.jpg')",
          animation: "bgSlowZoom 20s ease-in-out infinite alternate",
        }}
      />

      {/* ── Layered overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-slate-900/85 to-slate-800/92" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/40" />

      {/* ── Animated orbs ── */}
      <FloatingOrbs />

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes bgSlowZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(30px, 40px); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(-40px, -30px); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(20px, -40px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .card-enter {
          animation: fadeSlideUp 0.6s ease both;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #60a5fa, #22d3ee, #818cf8, #60a5fa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Navbar ── */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-white">SmartStay</div>
                <div className="text-[10px] font-medium text-white/40 -mt-0.5">Hostel Management System</div>
              </div>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-300">Secure Portal</span>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all duration-200"
              >
                <span>Back to Home</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 w-full">

          {/* Header */}
          <div
            className="mx-auto max-w-3xl text-center"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-400/25 px-4 py-1.5 text-xs font-bold text-blue-300 mb-5 shadow-lg shadow-blue-500/10">
              <Sparkles size={13} className="text-blue-400" />
              <span>Role-Based Campus Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Select Your{" "}
              <span className="shimmer-text">Portal</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-white/55 max-w-2xl mx-auto leading-relaxed">
              Sign in to access your designated portal. Choose your role for instant access or authenticate with your credentials.
            </p>
          </div>

          {/* Role cards */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-7xl mx-auto">
            {DEMO_ACCOUNTS.map((role, idx) => {
              const Icon = roleIcons[role.roleKey] || Building2;
              const gradient = roleGradients[role.roleKey] || "from-blue-500 to-cyan-500";
              const borderHover = roleBorderHover[role.roleKey] || "hover:border-blue-400/60";

              return (
                <div
                  key={role.roleKey}
                  className={`group relative flex flex-col justify-between rounded-3xl border border-white/10 ${borderHover} backdrop-blur-xl bg-white/5 p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/8`}
                  style={{
                    animationName: visible ? "fadeSlideUp" : "none",
                    animationDuration: "0.6s",
                    animationTimingFunction: "ease",
                    animationFillMode: "both",
                    animationDelay: `${idx * 90 + 180}ms`,
                  }}
                >
                  {/* Hover inner glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative">
                    {/* Icon badge */}
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className="text-white" />
                    </div>

                    <h3 className="text-base font-black text-white">{role.roleName}</h3>

                    <div className="mt-1 text-xs font-semibold text-white/40 truncate">
                      {role.name} · {role.studentId}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-white/45 line-clamp-2">
                      {role.description}
                    </p>

                    {/* Features */}
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-2">
                        Features
                      </p>
                      <ul className="space-y-1.5">
                        {role.accessiblePortals.slice(0, 3).map((portal) => (
                          <li key={portal.name} className="flex items-center gap-2 text-xs font-medium text-white/55">
                            <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                            <span className="truncate">{portal.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="relative mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleInstantLogin(role.roleKey, role.defaultPath)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${gradient} py-2.5 text-xs font-bold text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.97] cursor-pointer`}
                    >
                      <span>Instant Login</span>
                      <ArrowRight size={13} />
                    </button>

                    <Link
                      to={`/login/${role.roleKey}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/8 py-2 text-xs font-semibold text-white/70 hover:bg-white/15 hover:text-white transition-all duration-200"
                    >
                      <LogIn size={12} className="text-white/40" />
                      <span>Login with Password</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom trust badge */}
          <div
            className="mt-10 text-center"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 900ms" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs text-white/45">
                Protected with{" "}
                <strong className="text-white/65">bcrypt</strong> hashing &amp;{" "}
                <strong className="text-white/65">JWT</strong> authorization
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginHub;
