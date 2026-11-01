import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Modal, StatusBadge } from "../ui";
import {
  GraduationCap,
  Building2,
  Wrench,
  Store,
  BarChart3,
  Check,
  ArrowRight,
  Info,
} from "lucide-react";

/**
 * Standardized Role Switcher Modal for SmartStay
 * Allows evaluators and users to instantly switch between the 5 personas
 * from anywhere in the application without re-logging in.
 */
function RoleSwitcherModal({ isOpen, onClose }) {
  const { user, switchRole, availableRoles } = useAuth();
  const navigate = useNavigate();

  const roleIcons = {
    student: GraduationCap,
    warden: Building2,
    maintenance: Wrench,
    vendor: Store,
    executive: BarChart3,
  };

  const handleSelectRole = (roleKey, defaultPath) => {
    switchRole(roleKey);
    onClose?.();
    if (defaultPath) {
      navigate(defaultPath);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Switch Demo Persona"
      subtitle="Instantly explore SmartStay from the perspective of different university stakeholders."
    >
      {/* Demo Notice Banner */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900">
        <Info size={16} className="text-smart-blue shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Frontend Demonstration Access: </span>
          Switching roles immediately updates permissions, navigation menu, and session info in your local browser.
        </div>
      </div>

      {/* Role Cards List */}
      <div className="space-y-2.5">
        {availableRoles.map((role) => {
          const isCurrent = user?.roleKey === role.roleKey;
          const Icon = roleIcons[role.roleKey] || Building2;

          return (
            <div
              key={role.roleKey}
              onClick={() => handleSelectRole(role.roleKey, role.defaultPath)}
              className={`
                group relative flex flex-col sm:flex-row items-start sm:items-center justify-between
                gap-3 rounded-2xl border p-4 transition-all duration-150 cursor-pointer
                ${
                  isCurrent
                    ? "border-smart-blue bg-blue-50/40 shadow-xs ring-1 ring-smart-blue/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                }
              `}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition
                    ${
                      isCurrent
                        ? "bg-smart-blue text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-smart-blue"
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-smart-primary">
                      {role.name}
                    </h4>
                    <StatusBadge
                      status={role.roleBadge}
                      variant={role.badgeColor}
                      size="sm"
                      showDot={false}
                    />
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Check size={11} /> Active
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-smart-secondary line-clamp-1">
                    {role.description}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-500">
                    <span>ID: <strong className="text-slate-700">{role.studentId}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-slate-700">{role.room}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  className={`
                    inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition
                    ${
                      isCurrent
                        ? "bg-smart-blue text-white"
                        : "border border-slate-200 bg-white text-slate-700 group-hover:bg-slate-100"
                    }
                  `}
                >
                  <span>{isCurrent ? "Current" : "Switch"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default RoleSwitcherModal;
