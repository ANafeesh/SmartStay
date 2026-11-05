import { useState, useEffect } from "react";
import { useAuth, isDemoUser } from "../../context/AuthContext";
import { changeUserPassword } from "../../services/authApi";
import studentLogo from "../../assets/smartstay-mark.png";
import Modal from "../../components/ui/Modal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  IdCard,
  Building2,
  CalendarDays,
  ShieldCheck,
  Lock,
  Edit3,
  Save,
  X,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const demoStudentProfile = {
  name: "Student Account",
  studentId: "STD-2026-101",
  email: "student@smartstay.com",
  phone: "+94 77 123 4567",
  address: "Campus Student Residence Block B",
  course: "BICT (Hons)",
  faculty: "Faculty of Applied Sciences",
  year: "Second Year",
  hostel: "Block A",
  room: "Room 101",
  joinedDate: "05 Jan 2026",
};

function getInitialProfile(user) {
  if (!user) {
    return {
      name: "",
      studentId: "",
      email: "",
      phone: "",
      address: "",
      course: "",
      faculty: "",
      year: "",
      hostel: "",
      room: "",
      joinedDate: "",
    };
  }

  const isDemo = isDemoUser(user) || user.isDemo || user.email === "nafeesh@campus.edu";
  const userKey = user._id || user.id || user.email || "default";

  // Purge any legacy un-scoped cache if it bleeds onto a non-demo user
  try {
    const rawLegacy = localStorage.getItem("smartstay_student_profile");
    if (rawLegacy && !isDemo) {
      localStorage.removeItem("smartstay_student_profile");
    }
  } catch {}

  const defaultValues = isDemo
    ? {
        ...demoStudentProfile,
        name: user.name || demoStudentProfile.name,
        email: user.email || demoStudentProfile.email,
        studentId: user.studentId || user.registrationNumber || demoStudentProfile.studentId,
        room: user.room || demoStudentProfile.room,
        hostel: user.building || demoStudentProfile.hostel,
        phone: user.phone || demoStudentProfile.phone,
      }
    : {
        name: user.name || "Student User",
        studentId: user.studentId || user.registrationNumber || "Unassigned",
        email: user.email || "",
        phone: user.phone || "Not Provided",
        address: user.address || "Not Provided",
        course: user.course || "Undergraduate Degree",
        faculty: user.faculty || "Not Specified",
        year: user.year || "First Year",
        hostel: user.building || user.hostel || "Not Allocated",
        room: user.room || "Not Allocated",
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Recently Joined",
      };

  try {
    const cached = localStorage.getItem(`smartstay_student_profile_${userKey}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ...defaultValues,
        ...parsed,
        name: user.name || parsed.name || defaultValues.name,
        email: user.email || parsed.email || defaultValues.email,
      };
    }
  } catch {}

  return defaultValues;
}

function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(() => getInitialProfile(user));
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(() => getInitialProfile(user));
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Real Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: "", message: "" });

    if (!passwordForm.newPassword) {
      setPasswordStatus({ type: "error", message: "Please enter a new password." });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "New password and confirmation do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res && res.success) {
        setPasswordStatus({
          type: "success",
          message: res.message || "Password updated successfully!",
        });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordStatus({ type: "", message: "" });
        }, 2000);
      } else {
        setPasswordStatus({
          type: "error",
          message: res?.message || "Failed to update password. Please check your current password.",
        });
      }
    } catch (err) {
      setPasswordStatus({
        type: "error",
        message: err?.message || "An error occurred while connecting to the server.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const p = getInitialProfile(user);
      setProfile(p);
      setFormData(p);
    }
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEdit() {
    setFormData(profile);
    setEditMode(true);
  }

  function handleCancel() {
    setFormData(profile);
    setEditMode(false);
  }

  async function handleSave(event) {
    event.preventDefault();

    setProfile(formData);
    setEditMode(false);
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3500);

    const userKey = user?._id || user?.id || user?.email || "default";

    try {
      localStorage.setItem(`smartstay_student_profile_${userKey}`, JSON.stringify(formData));
      if (updateUser) {
        await updateUser(formData);
      }
    } catch (e) {
      console.warn("Unable to save profile:", e);
    }
  }

  const initials =
    profile.name
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "SU";

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">My Profile</h1>
          {savedSuccessMsg && (
            <p className="mt-1 text-sm font-semibold text-emerald-600 animate-in fade-in">
              Profile details updated successfully!
            </p>
          )}
        </div>

        {!editMode ? (
          <Button onClick={handleEdit}>
            <Edit3 size={17} className="mr-2 inline" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              <X size={17} className="mr-2 inline" />
              Cancel
            </Button>

            <Button onClick={handleSave}>
              <Save size={17} className="mr-2 inline" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-sm overflow-hidden group">
            <img
              src={studentLogo}
              alt="Student Portal Logo"
              className="h-full w-full object-contain select-none transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-1 right-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow-2xs font-mono">
              {initials}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-smart-primary">
                {profile.name}
              </h2>

              <Badge variant="success">Active Student</Badge>
            </div>

            <p className="mt-2 text-smart-secondary">
              {profile.course} • {profile.faculty}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-smart-secondary">
              <span className="flex items-center gap-1.5">
                <IdCard size={16} />
                {profile.studentId}
              </span>

              <span className="flex items-center gap-1.5">
                <Building2 size={16} />
                {profile.hostel} • {profile.room}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {editMode ? (
        <EditProfileForm
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
        />
      ) : (
        <>
          {/* Personal Information */}
          <Card className="mt-6">
            <SectionHeader
              icon={User}
              title="Personal Information"
              description="Your basic contact and personal details."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoItem icon={User} label="Full Name" value={profile.name} />

              <InfoItem
                icon={IdCard}
                label="Student ID"
                value={profile.studentId}
              />

              <InfoItem
                icon={Mail}
                label="Email Address"
                value={profile.email}
              />

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={profile.phone}
              />

              <InfoItem icon={MapPin} label="Address" value={profile.address} />

              <InfoItem
                icon={CalendarDays}
                label="Hostel Joined"
                value={profile.joinedDate}
              />
            </div>
          </Card>

          {/* Academic Information */}
          <Card className="mt-6">
            <SectionHeader
              icon={GraduationCap}
              title="Academic Information"
              description="Your university and academic details."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                icon={GraduationCap}
                label="Programme"
                value={profile.course}
              />

              <InfoItem
                icon={Building2}
                label="Faculty"
                value={profile.faculty}
              />

              <InfoItem
                icon={CalendarDays}
                label="Academic Year"
                value={profile.year}
              />

              <InfoItem
                icon={IdCard}
                label="Student ID"
                value={profile.studentId}
              />
            </div>
          </Card>

          {/* Hostel Information */}
          <Card className="mt-6">
            <SectionHeader
              icon={Building2}
              title="Hostel Information"
              description="Your current hostel allocation."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={Building2}
                label="Hostel Block"
                value={profile.hostel}
              />

              <InfoItem
                icon={MapPin}
                label="Room Number"
                value={profile.room}
              />

              <InfoItem
                icon={ShieldCheck}
                label="Allocation Status"
                value={profile.room && profile.room !== "Not Allocated" ? "Confirmed" : "Pending"}
              />
            </div>
          </Card>

          {/* Security */}
          <Card className="mt-6">
            <SectionHeader
              icon={ShieldCheck}
              title="Account & Security"
              description="Manage your account security settings."
            />

            <div className="mt-6 flex flex-col gap-4 rounded-xl bg-smart-background p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-smart-blue shadow-sm">
                  <Lock size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-smart-primary">Password</h3>

                  <p className="mt-1 text-sm text-smart-secondary">
                    Change your account password regularly for better security.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setPasswordStatus({ type: "", message: "" });
                  setShowPasswordModal(true);
                }}
              >
                Change Password
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Real Connected Password Change Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Account Password"
          subtitle="Update your password securely in the database"
          size="md"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordStatus.message && (
              <div
                className={`rounded-lg p-3 text-xs font-medium border ${
                  passwordStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {passwordStatus.message}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="Enter your current password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Re-enter your new password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordModal(false)}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function EditProfileForm({ formData, handleChange, handleSave }) {
  return (
    <Card className="mt-6">
      <div>
        <h2 className="text-lg font-bold text-smart-primary">Edit Profile</h2>

        <p className="mt-1 text-sm text-smart-secondary">
          Update your personal information below.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 grid gap-5 sm:grid-cols-2">
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <InputField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="sm:col-span-2">
          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <InputField
          label="Programme"
          name="course"
          value={formData.course}
          onChange={handleChange}
        />

        <InputField
          label="Faculty"
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
        />

        <InputField
          label="Academic Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />

        <InputField
          label="Hostel Block"
          name="hostel"
          value={formData.hostel}
          onChange={handleChange}
        />

        <InputField
          label="Room Number"
          name="room"
          value={formData.room}
          onChange={handleChange}
        />

        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit">
            <Save size={17} className="mr-2 inline" />
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-smart-primary">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-smart-primary outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
      />
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
        <Icon size={21} />
      </div>

      <div>
        <h2 className="font-bold text-smart-primary">{title}</h2>

        <p className="mt-1 text-sm text-smart-secondary">{description}</p>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-smart-background p-4">
      <div className="flex items-center gap-2 text-smart-blue">
        <Icon size={17} />
        <span className="text-xs font-medium text-smart-secondary">
          {label}
        </span>
      </div>

      <p className="mt-2 font-semibold text-smart-primary">{value || "—"}</p>
    </div>
  );
}

export default Profile;
