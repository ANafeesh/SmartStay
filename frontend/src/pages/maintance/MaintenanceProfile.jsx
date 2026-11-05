import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { changeUserPassword } from "../../services/authApi";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  Wrench,
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
  MapPin,
  CheckCircle2,
  Clock,
  HardHat,
  Cpu,
  AlertTriangle,
} from "lucide-react";

const defaultMaintenanceProfile = {
  name: "R. S. Wickramasinghe",
  designation: "Senior Facilities Maintenance Technician",
  staffId: "TECH-MNT-2026",
  division: "Electrical & Plumbing Division",
  department: "University Works & Physical Plant Directorate",
  workshopLocation: "Central Maintenance Workshop, Hostel Services Block",
  email: "maintenance@smartstay.com",
  phone: "+94 75 456 7890",
  emergencyContact: "+94 11 234 5678 (Ext 401)",
  joinedDate: "15 Mar 2023",
  shiftSchedule: "Day Shift (07:30 AM - 04:30 PM)",
  certifications: "NVQ Level 4 Electrical Systems, C&G Plumbing Inspection",
  primaryAreas: "Hostel Blocks A, B, C & Central Water Pumping Stations",
};

export default function MaintenanceProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultMaintenanceProfile);
  const [editForm, setEditForm] = useState(defaultMaintenanceProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Load saved profile data from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem("smartstay_maintenance_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
        setEditForm((prev) => ({ ...prev, ...parsed }));
      } catch {
        // use default
      }
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        staffId: user.studentId || user.staffId || prev.staffId,
        division: user.department || prev.division,
        department: user.faculty || prev.department,
        workshopLocation: user.room || prev.workshopLocation,
      }));
      setEditForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        staffId: user.studentId || user.staffId || prev.staffId,
        division: user.department || prev.division,
        department: user.faculty || prev.department,
        workshopLocation: user.room || prev.workshopLocation,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem("smartstay_maintenance_profile", JSON.stringify(editForm));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setIsSubmittingPassword(true);
      await changeUserPassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Password updated successfully.");
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || err.message || "Failed to update password."
      );
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16 antialiased">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-amber-600 uppercase tracking-wider">
              Maintenance Management
            </span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Technical Staff Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Staff Profile & Credentials
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            University Works & Maintenance Staff record, operational workshop assignments, and account security.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditing(true)}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={X}
                onClick={handleCancelEdit}
                className="text-slate-600"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Save}
                onClick={handleSaveProfile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Profile information updated successfully.</span>
        </div>
      )}

      {/* Main Staff Identity Card */}
      <Card padding="p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl font-bold text-white shadow-md shadow-orange-500/20">
              <HardHat size={36} />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <CheckCircle2 size={14} />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {profile.name}
                </h2>
                <Badge variant="warning" className="text-xs font-bold px-2.5 py-0.5">
                  Technical Staff
                </Badge>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active on Duty
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                {profile.designation}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                  <Briefcase size={13} className="text-slate-400" />
                  Staff ID: {profile.staffId}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 size={13} className="text-slate-400" />
                  {profile.division}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={Lock}
              onClick={() => setShowPasswordModal(true)}
              className="text-xs font-medium border-slate-300 hover:bg-slate-50"
            >
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Form / Display Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact & Personal Information */}
        <Card padding="p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Staff Information</h3>
              <p className="text-xs text-slate-500">Primary staff contact and identity</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={editForm.designation}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Schedule</label>
                <input
                  type="text"
                  name="shiftSchedule"
                  value={editForm.shiftSchedule}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" /> Full Name
                </span>
                <span className="font-semibold text-slate-800">{profile.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" /> Official Email
                </span>
                <span className="font-medium text-slate-800">{profile.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" /> Mobile Direct
                </span>
                <span className="font-medium text-slate-800">{profile.phone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" /> Emergency Hotline
                </span>
                <span className="font-medium text-slate-800">{profile.emergencyContact}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> Shift Schedule
                </span>
                <span className="font-semibold text-slate-800">{profile.shiftSchedule}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-slate-400" /> Service Appointment
                </span>
                <span className="font-medium text-slate-800">{profile.joinedDate}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Operational & Workshop Details */}
        <Card padding="p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wrench size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Technical Posting & Coverage</h3>
              <p className="text-xs text-slate-500">Department, workshop post, and assigned zone</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
                <input
                  type="text"
                  name="division"
                  value={editForm.division}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Directorate / Faculty</label>
                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Workshop / Room</label>
                <input
                  type="text"
                  name="workshopLocation"
                  value={editForm.workshopLocation}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Coverage Zones</label>
                <input
                  type="text"
                  name="primaryAreas"
                  value={editForm.primaryAreas}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Qualifications</label>
                <input
                  type="text"
                  name="certifications"
                  value={editForm.certifications}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-slate-400" /> Operational Division
                </span>
                <span className="font-semibold text-slate-800">{profile.division}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building2 size={13} className="text-slate-400" /> Directorate
                </span>
                <span className="font-medium text-slate-800">{profile.department}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" /> Station Workshop
                </span>
                <span className="font-semibold text-slate-800 text-right max-w-[220px]">
                  {profile.workshopLocation}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Cpu size={13} className="text-slate-400" /> Primary Coverage
                </span>
                <span className="font-medium text-slate-800 text-right max-w-[220px]">
                  {profile.primaryAreas}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <HardHat size={13} className="text-slate-400" /> Certification
                </span>
                <span className="font-medium text-slate-800 text-right max-w-[220px]">
                  {profile.certifications}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Account Security Information Card */}
      <Card padding="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Account Credentials & Access Control</h4>
              <p className="text-xs text-slate-500">
                Manage your SmartStay staff password and maintenance portal authorization.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordModal(true)}
            className="text-xs font-semibold"
          >
            Change Password
          </Button>
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          if (!isSubmittingPassword) {
            setShowPasswordModal(false);
            setPasswordError("");
            setPasswordSuccess("");
          }
        }}
        title="Change Staff Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <p className="text-xs text-slate-500">
            Ensure your account is protected with a secure password containing at least 6 characters.
          </p>

          {passwordError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium">
              {passwordSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmittingPassword}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmittingPassword}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmittingPassword}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmittingPassword}
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmittingPassword}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmittingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

