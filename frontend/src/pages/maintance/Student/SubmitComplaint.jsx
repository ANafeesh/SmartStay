import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench,
  Zap,
  Armchair,
  Wifi,
  SprayCan,
  Hammer,
  MoreHorizontal,
  Info,
  CheckCircle2,
  Building2,
  ImagePlus,
  Send,
  UploadCloud,
  X,
  AlertCircle,
  MapPin,
  ChevronDown,
  Check,
  ArrowLeft,
  MessageSquareWarning,
  Loader2,
  Cloud,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  uploadComplaintPhotos,
  submitComplaintToDB,
} from "../../../services/complaintApi";

/* ---------- Theme Tokens ---------- */
const C = {
  navy: "#0F4C81",
  blue: "#2563eb",
  teal: "#06b6d4",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#64748B",
  green: "#10B981",
  orange: "#F59E0B",
  red: "#EF4444",
  line: "#E2E8F0",
};

const CATEGORIES = [
  { name: "Plumbing", icon: Wrench },
  { name: "Electrical", icon: Zap },
  { name: "Furniture", icon: Armchair },
  { name: "Internet / Network", icon: Wifi },
  { name: "Cleaning", icon: SprayCan },
  { name: "Building Maintenance", icon: Hammer },
  { name: "Other", icon: MoreHorizontal },
];

const PRIORITIES = [
  { id: "Low", color: C.green, hint: "Minor issue, can wait a few days" },
  { id: "Medium", color: C.blue, hint: "Needs attention this week" },
  { id: "High", color: C.orange, hint: "Affects daily study or living" },
  { id: "Critical", color: C.red, hint: "Safety risk, urgent action needed" },
];

const BUILDINGS = [
  "Block A â€“ Aurora Hall",
  "Block B â€“ Horizon Hall",
  "Block C â€“ Lakeside Residence",
  "Block D â€“ Co-Living Annex",
];

const FLOORS = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
];

const MAX_DESC = 500;
const MIN_DESC = 20;
const MAX_IMG = 3;

const EMPTY = {
  title: "",
  category: "Plumbing",
  priority: "Medium",
  description: "",
  building: "Block B â€“ Horizon Hall",
  floor: "2nd Floor",
  room: "B-204",
  spot: "",
};

/* ---------- Custom Dropdown Component ---------- */
function Dropdown({ value, onChange, options, placeholder, error, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const items = options.map((o) => (typeof o === "string" ? { name: o } : o));
  const sel = items.find((i) => i.name === value);
  const SelIcon = sel?.icon || Icon;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${
          error
            ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10"
            : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex items-center gap-2 truncate"
          style={{ color: sel ? C.text : "#94A3B8" }}
        >
          {SelIcon && <SelIcon size={16} className="text-blue-600 shrink-0" />}
          {sel ? sel.name : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
        >
          {items.map((it) => {
            const I = it.icon;
            const on = it.name === value;
            return (
              <li
                key={it.name}
                role="option"
                aria-selected={on}
                onClick={() => {
                  onChange(it.name);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                  on
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {I && <I size={16} className={on ? "text-blue-600" : "text-slate-400"} />}
                <span className="flex-1">{it.name}</span>
                {on && <Check size={15} className="text-blue-600" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const Field = ({ label, required, error, children, hint }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
      {label}
      {required && <span className="text-rose-500 font-black"> *</span>}
    </label>
    {children}
    {error ? (
      <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-1.5">
        <AlertCircle size={13} className="shrink-0" />
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-slate-400 mt-1.5">{hint}</p>
    ) : null}
  </div>
);

const SectionTitle = ({ icon: Icon, title, sub }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
      <Icon size={18} />
    </div>
    <div>
      <h2 className="text-base font-bold text-slate-900 leading-tight">{title}</h2>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ---------- SubmitComplaint Component ---------- */
export default function SubmitComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [f, setF] = useState({
    ...EMPTY,
    room: user?.room ? user.room.split(" - ").pop() : "B-204",
  });
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [over, setOver] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  const set = (k) => (v) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onText = (k) => (e) => set(k)(e.target.value);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 8000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Upload handler connecting to Cloudinary
  const handlePhotoUpload = async (fileList) => {
    setUploadMsg("");
    const files = Array.from(fileList || []);
    const valid = files.filter((x) => x.type.startsWith("image/"));

    if (valid.length < files.length) {
      setUploadMsg("Only image files (JPG, PNG, WebP) are supported.");
    }

    const availableSlots = MAX_IMG - images.length;
    if (valid.length > availableSlots) {
      setUploadMsg(`You can attach up to ${MAX_IMG} photos in total.`);
    }

    const filesToUpload = valid.slice(0, Math.max(availableSlots, 0));
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    try {
      // Call Cloudinary Upload via Backend Service
      const uploadedResults = await uploadComplaintPhotos(filesToUpload);

      const newPhotos = uploadedResults.map((item, idx) => ({
        id: item.publicId || Math.random().toString(36).slice(2),
        name: item.name || filesToUpload[idx]?.name || "photo.jpg",
        size: filesToUpload[idx]
          ? (filesToUpload[idx].size / 1024 / 1024).toFixed(2)
          : "0.50",
        url: item.url,
        publicId: item.publicId,
        cloudinary: true,
      }));

      setImages((prev) => [...prev, ...newPhotos]);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setUploadMsg(`Cloudinary upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImg = (id) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
    setUploadMsg("");
  };

  const validate = () => {
    const e = {};
    if (!f.title.trim()) e.title = "Enter a short title for your complaint.";
    else if (f.title.trim().length < 5)
      e.title = "Title should be at least 5 characters.";
    if (!f.category) e.category = "Choose a complaint category.";
    if (!f.priority) e.priority = "Select a priority level.";
    if (!f.description.trim())
      e.description = "Describe the problem so hostel staff know what to fix.";
    else if (f.description.trim().length < MIN_DESC)
      e.description = `Add a little more detail (at least ${MIN_DESC} characters).`;
    if (!f.building) e.building = "Select your building.";
    if (!f.floor) e.floor = "Select the floor.";
    if (!f.room.trim()) e.room = "Enter your room number.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length > 0) {
      setToast({
        type: "error",
        text: "Please fill in all highlighted fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Record complaint in MongoDB via Backend API
      const complaintPayload = {
        title: f.title.trim(),
        category: f.category,
        priority: f.priority,
        description: f.description.trim(),
        building: f.building,
        floor: f.floor,
        room: f.room.trim() + (f.spot.trim() ? ` (${f.spot.trim()})` : ""),
        images: images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          name: img.name,
        })),
        studentId: user?.studentId || "STD-2026-090",
        studentName: user?.name || "Student User",
      };

      const result = await submitComplaintToDB(complaintPayload);

      setToast({
        type: "success",
        text: `Complaint ${result.complaintId} has been successfully recorded and queued with Maintenance!`,
        ref: result.complaintId,
      });

      // Reset form
      setF(EMPTY);
      setImages([]);
      setErrors({});
      setUploadMsg("");
    } catch (err) {
      console.error("Submission error:", err);
      setToast({
        type: "error",
        text: `Could not save to MongoDB: ${err.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    setF(EMPTY);
    setImages([]);
    setErrors({});
    setUploadMsg("");
    setToast(null);
  };

  const descLen = f.description.length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 antialiased">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav
            className="flex items-center gap-1.5 text-xs text-slate-400 mb-1"
            aria-label="Breadcrumb"
          >
            <Link to="/dashboard" className="hover:text-slate-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/complaints" className="hover:text-slate-600 transition">
              Complaints
            </Link>
            <span>/</span>
            <span className="font-semibold text-blue-600">Submit Complaint</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Submit New Complaint
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Report hostel room maintenance, electrical, plumbing, or facility issues to the warden.
          </p>
        </div>

        <Link
          to="/complaints"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
        >
          <ArrowLeft size={15} />
          <span>Back to Complaints</span>
        </Link>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border p-4 shadow-md transition-all animate-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-rose-300 bg-rose-50 text-rose-900"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">
              {toast.type === "success"
                ? "Complaint Submitted Successfully"
                : "Submission Problem"}
            </p>
            <p className="text-xs mt-0.5 leading-relaxed">{toast.text}</p>
            {toast.ref && (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/80 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                  Ref: {toast.ref}
                </span>
                <Link
                  to="/complaints"
                  className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  View in My Complaints â†’
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-black/5 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT 2 COLS: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Details */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs">
              <SectionTitle
                icon={MessageSquareWarning}
                title="Complaint Details"
                sub="Specify the nature of the issue and its urgency level."
              />

              <div className="space-y-5">
                <Field label="Complaint Title" required error={errors.title}>
                  <input
                    type="text"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition ${
                      errors.title
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    placeholder="e.g., Bathroom water tap leaking continuously"
                    value={f.title}
                    onChange={onText("title")}
                    maxLength={80}
                  />
                </Field>

                <Field label="Category" required error={errors.category}>
                  <Dropdown
                    value={f.category}
                    onChange={set("category")}
                    options={CATEGORIES}
                    placeholder="Select category"
                    error={errors.category}
                  />
                </Field>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Priority Level <span className="text-rose-500 font-black">*</span>
                  </label>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
                    role="radiogroup"
                  >
                    {PRIORITIES.map((p) => {
                      const on = f.priority === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => set("priority")(p.id)}
                          className={`rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                            on
                              ? "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: p.color }}
                            />
                            {on && <Check size={14} className="text-blue-600 font-bold" />}
                          </div>
                          <span
                            className="block text-xs font-bold"
                            style={{ color: on ? C.blue : C.text }}
                          >
                            {p.id}
                          </span>
                          <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">
                            {p.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.priority && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-1.5">
                      <AlertCircle size={13} />
                      {errors.priority}
                    </p>
                  )}
                </div>

                <Field label="Description" required error={errors.description}>
                  <textarea
                    rows={5}
                    className={`w-full rounded-xl border bg-white p-3.5 text-sm text-slate-800 outline-none transition leading-relaxed ${
                      errors.description
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    placeholder="Provide relevant details: when did the issue start, what have you tried, or what parts need replacement?"
                    value={f.description}
                    maxLength={MAX_DESC}
                    onChange={onText("description")}
                  />
                  <div className="flex justify-end mt-1.5">
                    <span
                      className={`text-[11px] font-medium ${
                        descLen > MAX_DESC - 40 ? "text-amber-600" : "text-slate-400"
                      }`}
                    >
                      {descLen} / {MAX_DESC} characters
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 2: Location */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs">
              <SectionTitle
                icon={MapPin}
                title="Location in Hostel"
                sub="Help the maintenance technician pinpoint the exact room or fixture."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <Field label="Building / Hostel Block" required error={errors.building}>
                  <Dropdown
                    value={f.building}
                    onChange={set("building")}
                    options={BUILDINGS}
                    placeholder="Select building"
                    error={errors.building}
                    icon={Building2}
                  />
                </Field>

                <Field label="Floor" required error={errors.floor}>
                  <Dropdown
                    value={f.floor}
                    onChange={set("floor")}
                    options={FLOORS}
                    placeholder="Select floor"
                    error={errors.floor}
                  />
                </Field>

                <Field label="Room Number" required error={errors.room}>
                  <input
                    type="text"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition ${
                      errors.room
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    placeholder="e.g., B-204"
                    value={f.room}
                    onChange={onText("room")}
                    maxLength={15}
                  />
                </Field>

                <Field label="Specific Spot (Optional)">
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g., Near window desk, washroom sink"
                    value={f.spot}
                    onChange={onText("spot")}
                    maxLength={60}
                  />
                </Field>
              </div>
            </div>

            {/* Section 3: Photo Evidence with Cloudinary Integration */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-5">
                <SectionTitle
                  icon={ImagePlus}
                  title="Photo Evidence (Cloudinary)"
                  sub={`Attach up to ${MAX_IMG} photos. Images are uploaded to Cloudinary CDN.`}
                />
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                  <Cloud size={13} />
                  Cloud Storage
                </span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handlePhotoUpload(e.target.files);
                  e.target.value = "";
                }}
              />

              {images.length < MAX_IMG && (
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
                    over
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/20"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => !isUploading && fileRef.current?.click()}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    (!isUploading && fileRef.current?.click())
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOver(true);
                  }}
                  onDragLeave={() => setOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setOver(false);
                    handlePhotoUpload(e.dataTransfer.files);
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-3 shadow-xs">
                    {isUploading ? (
                      <Loader2 size={24} className="animate-spin text-blue-600" />
                    ) : (
                      <UploadCloud size={24} />
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    {isUploading
                      ? "Uploading image to Cloudinary..."
                      : "Drag photos here, or browse files"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, or WebP up to 10MB ({images.length} of {MAX_IMG} uploaded)
                  </p>
                </div>
              )}

              {uploadMsg && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mt-3">
                  <AlertCircle size={14} />
                  {uploadMsg}
                </p>
              )}

              {/* Uploaded Cloudinary Photos Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs group"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-36 object-cover bg-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeImg(img.id)}
                        aria-label={`Remove photo ${img.name}`}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/75 text-white hover:bg-rose-600 transition shadow-xs cursor-pointer"
                      >
                        <X size={14} />
                      </button>

                      <div className="p-2.5 bg-white border-t border-slate-100">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {img.name}
                          </p>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                            âœ“ Cloud
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{img.size} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: Student Info & Actions */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Student Profile Info */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Student Information
                </h2>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Verified
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white shadow-xs">
                  {user?.initials || "AN"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 leading-tight truncate">
                    {user?.name || "Student User"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {user?.role || "Student account"}
                  </p>
                </div>
              </div>

              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Student ID</dt>
                  <dd className="font-mono font-bold text-slate-700">
                    {user?.studentId || "STD-2026-090"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Hostel</dt>
                  <dd className="font-semibold text-slate-700">Block B â€“ Horizon Hall</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Allocated Room</dt>
                  <dd className="font-semibold text-slate-700">
                    {user?.room || "Block B - Room 204"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Database</dt>
                  <dd className="font-semibold text-emerald-600">MongoDB Atlas Live</dd>
                </div>
              </dl>
            </div>

            {/* Submission Actions */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Ready to Submit?
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Your report will be stored in MongoDB and routed directly to the hostel maintenance desk.
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={cancel}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
