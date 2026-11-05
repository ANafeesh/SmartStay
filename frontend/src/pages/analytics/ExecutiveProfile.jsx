import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { changeUserPassword } from "../../services/authApi";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Lock,
  Edit3,
  Save,
  X,
  Briefcase,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

const defaultExecutiveProfile = {
  name: "Prof. M. H. Razak",
  officialTitle: "Dean of Student Affairs & Campus Executive Oversight",
  employeeId: "EXEC-DEAN-05",
  department: "University Resource Intelligence & Campus Administration",
  officeLocation: "Senate Building, Level 3, Executive Secretariat",
  email: "executive@smartstay.com",
  phone: "+94 76 888 9900",
  assignedDivision: "Campus Operational Directorate",
  authorityLevel: "Executive Oversight (Full Access)",
  appointedDate: "05 Jan 2026",
};

export default function ExecutiveProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultExecutiveProfile);
  const [editForm, setEditForm] = useState(defaultExecutiveProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const userKey = user?._id || user?.id || user?.email || "executive";

  useEffect(() => {
    try {
      const cached = localStorage.getItem(`smartstay_executive_profile_${userKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        setEditForm(parsed);
      } else {
        const initial = {
          ...defaultExecutiveProfile,
          name: user?.name || defaultExecutiveProfile.name,
          email: user?.email || defaultExecutiveProfile.email,
          phone: user?.phone || defaultExecutiveProfile.phone,
        };
        setProfile(initial);
        setEditForm(initial);
      }
    } catch {
      // fallback
    }
  }, [userKey, user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditing(false);
    setSaveSuccess(true);
    try {
      localStorage.setItem(
        `smartstay_executive_profile_${userKey}`,
        JSON.stringify(editForm)
      );
    } catch {
      // fallback
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      await changeUserPassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Executive Profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Administrative credentials, institutional oversight authority, and operational division details.
          </p>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
            size="sm"
            icon={Edit3}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              size="sm"
              icon={X}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              variant="primary"
              size="sm"
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 p-3.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 size={16} />
          Executive profile updated and persisted successfully.
        </div>
      )}

      {/* Hero Badge Card */}
      <Card padding="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
            <span className="text-2xl font-bold tracking-tight font-mono">
              {profile.name
                .split(" ")
                .filter(Boolean)
                .slice(-2)
                .map((n) => n[0])
                .join("") || "EX"}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                {profile.name}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                <ShieldCheck size={13} />
                Executive Oversight
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-600">
              {profile.officialTitle}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-slate-400" />
                <span className="font-mono text-slate-700">{profile.employeeId}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" />
                <span>{profile.officeLocation}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-slate-400" />
                <span>Appointed: {profile.appointedDate}</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Profile Form / Details */}
      <div className="grid gap-6">
        {/* Institutional & Contact Information */}
        <Card padding="p-6">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Administrative & Contact Details
              </h3>
              <p className="text-xs text-slate-500">
                Official university contact channels and executive directory records.
              </p>
            </div>
            <User size={18} className="text-slate-400" />
          </div>

          {!isEditing ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Official Full Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile.name}</p>
              </div>

              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Executive Staff ID</p>
                <p className="mt-1 text-sm font-mono font-semibold text-slate-900">{profile.employeeId}</p>
              </div>

              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Official University Email</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  {profile.email}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Direct Contact Number</p>
                <p className="mt-1 text-sm font-mono font-semibold text-slate-900 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  {profile.phone}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">Official Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Executive Staff ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={editForm.employeeId}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Official Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Direct Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Oversight Authority & Directorate */}
        <Card padding="p-6">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Institutional Oversight & Division
              </h3>
              <p className="text-xs text-slate-500">
                Assigned administrative directorate, executive role, and secretariat location.
              </p>
            </div>
            <Layers size={18} className="text-slate-400" />
          </div>

          {!isEditing ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Designation / Official Title</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile.officialTitle}</p>
              </div>

              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Directorate / Department</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile.department}</p>
              </div>

              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Assigned Campus Division</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile.assignedDivision}</p>
              </div>

              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Authority & Privileges</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  {profile.authorityLevel}
                </p>
              </div>

              <div className="sm:col-span-2 rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                <p className="text-xs font-medium text-slate-500">Secretariat Office Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile.officeLocation}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">Official Title</label>
                <input
                  type="text"
                  name="officialTitle"
                  value={editForm.officialTitle}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Directorate / Department</label>
                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Assigned Division</label>
                <input
                  type="text"
                  name="assignedDivision"
                  value={editForm.assignedDivision}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Office Location</label>
                <input
                  type="text"
                  name="officeLocation"
                  value={editForm.officeLocation}
                  onChange={handleEditChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Security & Password */}
        <Card padding="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Security Credentials</h3>
                <p className="text-xs text-slate-500">
                  Update administrative console login password.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordError("");
                setPasswordSuccess(false);
              }}
            >
              Change Password
            </Button>
          </div>
        </Card>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal
          title="Change Executive Password"
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium">
                Password updated successfully.
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="Repeat new password"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

