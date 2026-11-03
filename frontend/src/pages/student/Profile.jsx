import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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

const initialProfile = {
  name: "Ahamed Nafeesh",
  studentId: "ICT/2024/012",
  email: "student@smartstay.edu",
  phone: "+94 77 123 4567",
  address: "Campus Student Residence Block B",
  course: "BICT (Hons)",
  faculty: "Faculty of Applied Sciences",
  year: "Second Year",
  hostel: "Block B",
  room: "B-204",
  joinedDate: "05 Jan 2026",
};

function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState(initialProfile);

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

  function handleSave(event) {
    event.preventDefault();

    setProfile(formData);
    setEditMode(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">My Profile</h1>

          
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
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-smart-primary text-3xl font-bold text-white">
            AN
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-smart-primary">
                {profile.name}
              </h2>

              <Badge variant="success">Active Student</Badge>
            </div>

            <p className="mt-2 text-smart-secondary">
              {profile.course} Â· {profile.faculty}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-smart-secondary">
              <span className="flex items-center gap-1.5">
                <IdCard size={16} />
                {profile.studentId}
              </span>

              <span className="flex items-center gap-1.5">
                <Building2 size={16} />
                {profile.hostel} Â· {profile.room}
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
                value="Confirmed"
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

      <p className="mt-2 font-semibold text-smart-primary">{value}</p>
    </div>
  );
}

export default Profile;
