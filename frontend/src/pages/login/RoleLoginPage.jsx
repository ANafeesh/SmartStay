import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDemoAccount } from "../../data/demoAccounts";
import Logo from "../../components/ui/Logo";
import StatusBadge from "../../components/ui/StatusBadge";
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
} from "lucide-react";

const roleIcons = {
  student: GraduationCap,
  warden: Building2,
  maintenance: Wrench,
  vendor: Store,
  executive: BarChart3,
};

function RoleLoginPage({ forcedRoleKey = null }) {
  const params = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const roleKey = forcedRoleKey || params.roleKey || "student";
  const demoProfile = getDemoAccount(roleKey);
  const Icon = roleIcons[demoProfile.roleKey] || Building2;

  const [username, setUsername] = useState(demoProfile.username);
  const [password, setPassword] = useState(demoProfile.demoPassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAutoFill = () => {
    setUsername(demoProfile.username);
    setPassword(demoProfile.demoPassword);
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage("Please enter your username or ID.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    setTimeout(() => {
      // Complete client-side demo login
      login(demoProfile);
      setIsSubmitting(false);
      navigate(demoProfile.defaultPath);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <Logo
            variant="horizontal"
            size="md"
            badge={demoProfile.roleBadge}
            subtitle="Campus Accommodation OS"
            asLink
          />

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>All Roles</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
            {/* Role Header */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-2xs">
                <Icon size={28} />
              </div>

              <StatusBadge
                status={demoProfile.roleBadge}
                variant={demoProfile.badgeColor}
                size="md"
              />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {demoProfile.roleName} Login
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Sign in to manage your {demoProfile.roleName.toLowerCase()} portal.
            </p>

            {/* Quick-Fill Demo Account Callout */}
            <div className="mt-5 rounded-2xl border border-blue-200/90 bg-blue-50/70 p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>Demo Persona Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-500 transition shadow-2xs cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-blue-950 font-mono">
                <div className="rounded-lg bg-white/80 p-2 border border-blue-100">
                  <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">Username</span>
                  <span className="truncate block font-semibold">{demoProfile.username}</span>
                </div>
                <div className="rounded-lg bg-white/80 p-2 border border-blue-100">
                  <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">Password</span>
                  <span className="truncate block font-semibold">{demoProfile.demoPassword}</span>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-blue-800">
                Persona: <strong>{demoProfile.name}</strong> • {demoProfile.studentId}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <InputField
                label="Username or ID"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. nafeesh or studentId"
                icon={User}
                required
              />

              <InputField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                icon={KeyRound}
                required
              />

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full mt-2"
                size="md"
              >
                {isSubmitting ? (
                  <span>Signing in as {demoProfile.name}...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Sign In to {demoProfile.roleName}</span>
                    <ArrowRight size={15} />
                  </span>
                )}
              </Button>
            </form>

            {/* Disclaimer notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Academic Notice:</strong> This is a client-side role simulator. Credentials are not sent to any backend server.
              </span>
            </div>
          </div>

          {/* Switch Role Link */}
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              Need a different role? View all 5 login roles →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoleLoginPage;
