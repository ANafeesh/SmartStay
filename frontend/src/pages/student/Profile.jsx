import { useState, useEffect, useCallback } from "react";
import { useAuth, isDemoUser } from "../../context/AuthContext";
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
  BedDouble,
  CheckCircle2,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getMyAllocation } from "../../services/transferService";

const demoStudentProfile = {
  name: "Ahamed Nafeesh",
  studentId: "STD-2026-090",
  email: "student@smartstay.com",
  phone: "+94 77 123 4567",
  address: "Campus Student Residence Block B",
  course: "BICT (Hons)",
  faculty: "Faculty of Applied Sciences",
  year: "Second Year",
  hostel: "Block B",
  room: "B-204",
  bed: "Bed 02",
  allocationStatus: "Confirmed",
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
      bed: "Bed 02",
      allocationStatus: "Confirmed",
      joinedDate: "",
    };
  }

  const isDemo = isDemoUser ? isDemoUser(user) || user.isDemo || user.email === "nafeesh@campus.edu" : true;
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
        bed: "Bed 01",
        allocationStatus: "Confirmed",
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

  const studentRegId =
    user?.studentId ||
    user?.registrationNumber ||
    profile.studentId ||
    "STD-2026-090";

  // Synchronize profile with live allocation from backend
  const syncWithAllocation = useCallback(async () => {
    try {
      const alloc = await getMyAllocation(studentRegId);
      if (!alloc) return;

      const bldName =
        alloc.building?.name || alloc.building?.code || "Hostel Block B";
      const roomNum = alloc.room?.roomNumber || "B-204";
      const rawBed = alloc.bed?.bedNumber;
      const bedText = rawBed
        ? String(rawBed).toLowerCase().startsWith("bed")
          ? String(rawBed)
          : `Bed ${rawBed}`
        : "Bed 02";
      const floorText =
        alloc.room?.floor !== undefined ? `Floor ${alloc.room.floor}` : "";
      const statusText = alloc.allocation?.status || "Confirmed";
      const dynamicAddress = `Campus Student Residence ${bldName}, Room ${roomNum}`;

      const userKey = user?._id || user?.id || user?.email || "default";

      setProfile((prev) => {
        const updated = {
          ...prev,
          hostel: bldName,
          room: roomNum,
          bed: bedText,
          floor: floorText,
          allocationStatus: statusText,
          address:
            prev.address?.startsWith("Campus Student Residence")
              ? dynamicAddress
              : prev.address || dynamicAddress,
        };
        try {
          localStorage.setItem(`smartstay_student_profile_${userKey}`, JSON.stringify(updated));
          localStorage.setItem("smartstay_student_profile", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setFormData((prev) => ({
        ...prev,
        hostel: bldName,
        room: roomNum,
        bed: bedText,
        floor: floorText,
        allocationStatus: statusText,
        address:
          prev.address?.startsWith("Campus Student Residence")
            ? dynamicAddress
            : prev.address || dynamicAddress,
      }));
    } catch (err) {
      console.warn("Could not load live allocation for profile:", err);
    }
  }, [studentRegId, user]);

  useEffect(() => {
    if (user) {
      const p = getInitialProfile(user);
      setProfile(p);
      setFormData(p);
    }
    syncWithAllocation();
  }, [user, syncWithAllocation]);

  // Listen to profile updates (e.g. from transfer approval)
  useEffect(() => {
    const handleProfileSync = (event) => {
      if (event?.detail) {
        const userKey = user?._id || user?.id || user?.email || "default";
        setProfile((prev) => {
          const merged = { ...prev, ...event.detail };
          try {
            localStorage.setItem(`smartstay_student_profile_${userKey}`, JSON.stringify(merged));
            localStorage.setItem("smartstay_student_profile", JSON.stringify(merged));
          } catch {}
          return merged;
        });
        setFormData((prev) => ({ ...prev, ...event.detail }));
      }
    };

    window.addEventListener("smartstay-profile-updated", handleProfileSync);
    window.addEventListener("storage", handleProfileSync);

    return () => {
      window.removeEventListener("smartstay-profile-updated", handleProfileSync);
      window.removeEventListener("storage", handleProfileSync);
    };
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
      localStorage.setItem("smartstay_student_profile", JSON.stringify(formData));
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
      .toUpperCase() || "AN";

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">My Profile</h1>
          <p className="mt-1 text-sm text-smart-secondary">
            Manage your personal credentials and view verified hostel allocation details.
          </p>
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

      {savedSuccessMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={18} className="text-emerald-600" />
          Profile information updated successfully!
        </div>
      )}

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-smart-primary text-3xl font-bold text-white shadow-md">
            {initials}
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
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <IdCard size={16} />
                {profile.studentId}
              </span>

              <span className="flex items-center gap-1.5 font-medium text-smart-primary">
                <Building2 size={16} className="text-smart-blue" />
                {profile.hostel} • Room {profile.room} {profile.bed ? `(${profile.bed})` : ""}
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
              description="Your basic contact and residential details."
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
              description="Your current verified hostel allocation."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                icon={BedDouble}
                label="Bed Assigned"
                value={profile.bed || "Bed 02"}
              />

              <InfoItem
                icon={ShieldCheck}
                label="Allocation Status"
                value={profile.allocationStatus || "Confirmed"}
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
                onClick={() =>
                  alert(
                    "Password change will be connected to the backend later.",
                  )
                }
              >
                Change Password
              </Button>
            </div>
          </Card>
        </>
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

        <InputField
          label="Bed Assigned"
          name="bed"
          value={formData.bed || ""}
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
