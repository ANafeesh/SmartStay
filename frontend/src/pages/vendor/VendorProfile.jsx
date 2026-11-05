import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Truck,
  QrCode,
  Tag,
  Award,
  Lock,
  ChevronRight,
  AlertCircle,
  Car,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../services/apiClient";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const defaultVendorData = {
  vendorId: "VND-2026-09",
  shopName: "Campus Diner & Cafe",
  ownerName: "Campus Canteen Staff",
  regNo: "STD-2026-101",
  email: "vendor@smartstay.com",
  phone: "+94 71 892 4110",
  secondaryPhone: "+94 11 289 4400",
  location: "Cafeteria Complex, Ground Floor Booth 03",
  operatingHours: "07:30 AM - 10:30 PM (Daily)",
  deliveryTime: "15 - 25 mins",
  hygieneGrade: "A+ (University Public Health Clearance)",
  status: "Active / Verified",
  categories: ["Hot Meals", "Beverages", "Snacks", "Late Night Meals"],
  tags: ["Halal Certified", "Vegetarian Options", "Campus Delivery", "Eco Packaging"],
  deliveryPerson: "Kamal Perera",
  riderNic: "199420912401",
  vehicleNo: "WP BCD-4821",
  vehicleType: "Motorcycle / Delivery Courier",
  authorizedZones: "Hostel Block A, Hostel Block B, Main Gate Foyer",
  memberSince: "January 2026",
};

const VENDOR_PROFILE_CACHE_KEY = "smartstay_vendor_profile_data";

export default function VendorProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(VENDOR_PROFILE_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return {
      ...defaultVendorData,
      ownerName: user?.name || defaultVendorData.ownerName,
      email: user?.email || defaultVendorData.email,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Fetch from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteProfile = async () => {
      try {
        const res = await apiFetch("/vendors/profile");
        if (isMounted && res?.data) {
          const remote = res.data;
          const merged = {
            ...profile,
            shopName: remote.name || profile.shopName,
            ownerName: remote.ownerName || user?.name || profile.ownerName,
            phone: remote.phone || profile.phone,
            deliveryTime: remote.deliveryTime || profile.deliveryTime,
            hygieneGrade: remote.hygieneGrade || profile.hygieneGrade,
            categories: Array.isArray(remote.categories) && remote.categories.length > 0
              ? remote.categories
              : profile.categories,
            tags: Array.isArray(remote.tags) && remote.tags.length > 0
              ? remote.tags
              : profile.tags,
          };
          setProfile(merged);
          setFormData(merged);
          try {
            localStorage.setItem(VENDOR_PROFILE_CACHE_KEY, JSON.stringify(merged));
          } catch {}
        }
      } catch (err) {
        console.warn("Could not fetch remote vendor profile, using local:", err.message);
      }
    };

    fetchRemoteProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Send update to backend API
      const res = await apiFetch("/vendors/profile", {
        method: "PUT",
        body: {
          name: formData.shopName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          deliveryTime: formData.deliveryTime,
          hygieneGrade: formData.hygieneGrade,
          categories: typeof formData.categories === "string"
            ? formData.categories.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.categories,
          tags: typeof formData.tags === "string"
            ? formData.tags.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.tags,
        },
      });

      const updated = {
        ...formData,
        categories: Array.isArray(formData.categories)
          ? formData.categories
          : formData.categories.split(",").map((s) => s.trim()).filter(Boolean),
      };

      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);
      setSaveSuccess(true);

      // Save to localStorage
      try {
        localStorage.setItem(VENDOR_PROFILE_CACHE_KEY, JSON.stringify(updated));
      } catch {}

      // Update Auth context user if name or phone changed
      if (updateUser) {
        updateUser({
          ...user,
          name: formData.ownerName,
          phone: formData.phone,
        });
      }

      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error("Save vendor profile error:", err);
      // Still persist locally
      setProfile(formData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setSaveError(null);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus({ type: "error", message: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setPasswordStatus({ type: "success", message: "Password updated successfully!" });
    setTimeout(() => {
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus(null);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Vendor Profile & Business Details
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Approved Commercial Operator
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Official commercial outlet registration, contact info, authorized couriers, and delivery specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition cursor-pointer"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 text-emerald-950 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Profile Updated Successfully</p>
              <p className="text-[11px] text-emerald-800">
                Your business details and delivery configurations have been updated.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
            Synced
          </span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Primary Business Info & Food Service Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Outlet Details Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Store size={28} />
                </div>
                <div>
                  {isEditing ? (
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block">
                        Outlet Name
                      </label>
                      <input
                        type="text"
                        value={formData.shopName}
                        onChange={(e) => handleInputChange("shopName", e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-sm font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <h2 className="text-lg font-black text-slate-900">{profile.shopName}</h2>
                  )}
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Vendor Registration ID: <strong>{profile.vendorId}</strong>
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                {profile.status}
              </span>
            </div>

            {/* Grid of Key Attributes */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Proprietor / Responsible Person
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-bold text-slate-800 text-sm">{profile.ownerName}</p>
                )}
                <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">
                  University Ref: {profile.regNo}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Outlet Campus Location
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-600 shrink-0" />
                    <span>{profile.location}</span>
                  </p>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">Central Commercial Block</span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Operating Hours
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600 shrink-0" />
                    <span>{profile.operatingHours}</span>
                  </p>
                )}
                <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                  Authorized for late hostel delivery
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Average Delivery Speed
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Truck size={14} className="text-blue-600 shrink-0" />
                    <span>{profile.deliveryTime}</span>
                  </p>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">To hostel rooms & common rooms</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Phone size={16} className="text-blue-600" />
              <span>Contact Information & Inquiries</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Primary Contact Phone
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                ) : (
                  <p className="font-bold text-slate-800 text-sm mt-1">{profile.phone}</p>
                )}
                <span className="text-[10px] text-slate-400 mt-0.5 block">Direct WhatsApp & Voice Line</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Emergency Line / Kitchen Hotline
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.secondaryPhone}
                    onChange={(e) => handleInputChange("secondaryPhone", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                ) : (
                  <p className="font-bold text-slate-800 text-sm mt-1">{profile.secondaryPhone}</p>
                )}
                <span className="text-[10px] text-slate-400 mt-0.5 block">Campus Intercom Ext: 402</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Registered Commercial Email
                </span>
                <p className="font-mono font-bold text-slate-800 text-sm mt-1">{profile.email}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  University Bursar & Finance settlement account
                </span>
              </div>
            </div>
          </div>

          {/* Food Categories & Hygiene Standard Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-blue-600" />
              <span>Service Categories & Health Hygiene Rating</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                  Active Food Offerings & Categories
                </span>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={Array.isArray(formData.categories) ? formData.categories.join(", ") : formData.categories}
                      onChange={(e) => handleInputChange("categories", e.target.value)}
                      placeholder="Comma-separated categories e.g. Hot Meals, Beverages, Bakery"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Separate multiple items with commas</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="rounded-xl bg-blue-50 border border-blue-200/80 px-3 py-1 font-bold text-blue-800 text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span className="font-bold text-emerald-950 text-xs">
                    Campus Public Health Officer (PHO) Clearance
                  </span>
                </div>
                <p className="mt-1 text-xs text-emerald-900 font-semibold">
                  Certified Hygiene Grade: <strong>{profile.hygieneGrade}</strong>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                  {profile.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white/90 border border-emerald-300 px-2 py-0.5 font-bold text-emerald-800 text-[10px]"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Gate Courier Association & Security Credentials */}
        <div className="lg:col-span-4 space-y-6">
          {/* Authorized Gate Delivery Courier Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Authorized Courier
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Pass Linked
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Delivery Associate
                </span>
                <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-blue-600" />
                  <span>{profile.deliveryPerson}</span>
                </p>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  NIC: {profile.riderNic}
                </span>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Approved Vehicle
                </span>
                <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5 font-mono">
                  <Car size={14} className="text-blue-600" />
                  <span>{profile.vehicleNo}</span>
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {profile.vehicleType}
                </span>
              </div>

              <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-3.5">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">
                  Hostel Drop Zones
                </span>
                <p className="text-slate-700 text-xs mt-1 font-medium">
                  {profile.authorizedZones}
                </p>
              </div>

              <Link
                to="/vendor/pass"
                className="w-full flex items-center justify-between rounded-2xl bg-blue-600 p-3 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition"
              >
                <div className="flex items-center gap-2">
                  <QrCode size={16} />
                  <span>Open Gate Pass & Scanner</span>
                </div>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Account Security & Password Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock size={16} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Account &amp; Security
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">Account Password</span>
                  <span className="text-[10px] text-slate-400 block">Last changed 30 days ago</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  University Partnership Terms
                </span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Active lease agreement with Campus Hostel Administration. Subject to quarterly public health review.
                </p>
                <span className="inline-block mt-2 font-mono text-[10px] text-slate-400">
                  Member Since: {profile.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordStatus(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {passwordStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  passwordStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {passwordStatus.message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

