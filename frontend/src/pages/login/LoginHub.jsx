import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DEMO_ACCOUNTS } from "../../data/demoAccounts";
import Logo from "../../components/ui/Logo";
import StatusBadge from "../../components/ui/StatusBadge";
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
} from "lucide-react";

const roleIcons = {
  student: GraduationCap,
  warden: Building2,
  maintenance: Wrench,
  vendor: Store,
  executive: BarChart3,
};

function LoginHub() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleInstantLogin = (roleKey, defaultPath) => {
    switchRole(roleKey);
    navigate(defaultPath);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <Logo
            variant="horizontal"
            size="md"
            
            subtitle="Hostel Management System"
            asLink
          />

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <span>Back to Home</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Header section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-700 mb-4 shadow-2xs">
            <ShieldCheck size={14} />
            <span>Role-Based Campus Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Select Your Portal
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sign in to access your designated portal. You can select any role below for instant access or use your account credentials.
          </p>
        </div>

        {/* 5 Role Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {DEMO_ACCOUNTS.map((role) => {
            const Icon = roleIcons[role.roleKey] || Building2;

            return (
              <div
                key={role.roleKey}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                      <Icon size={24} />
                    </div>

                    <StatusBadge
                      status={role.roleBadge}
                      variant={role.badgeColor}
                      size="sm"
                    />
                  </div>

                  {/* Title & Persona info */}
                  <h3 className="text-lg font-black text-slate-900">
                    {role.roleName}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <span>{role.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[11px] text-slate-500">{role.studentId}</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {role.description}
                  </p>

                  {/* Features list */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Portal Features:
                    </p>
                    <ul className="space-y-1.5">
                      {role.accessiblePortals.slice(0, 3).map((portal) => (
                        <li
                          key={portal.name}
                          className="flex items-center gap-2 text-xs font-medium text-slate-700"
                        >
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{portal.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantLogin(role.roleKey, role.defaultPath)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition active:scale-[0.98] cursor-pointer"
                  >
                    <span>Instant Login</span>
                    <ArrowRight size={14} />
                  </button>

                  <Link
                    to={`/login/${role.roleKey}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                  >
                    <LogIn size={13} className="text-slate-400" />
                    <span>Login with Password</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default LoginHub;
