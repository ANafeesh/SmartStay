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
  CheckCircle2,
  Building2,
  Send,
  Upload,
  X,
  AlertCircle,
  MapPin,
  ChevronDown,
  Check,
  ArrowLeft,
  Loader2,
  Clock,
  AlertTriangle,
  User,
  FileText,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  uploadComplaintPhotos,
  submitComplaintToDB,
} from "../../../services/complaintApi";

const CATEGORIES = [
  { name: "Plumbing", icon: Wrench, desc: "Leaks, taps, drainage, washroom" },
  { name: "Electrical", icon: Zap, desc: "Lights, switches, power sockets, ceiling fan" },
  { name: "Furniture & Bed", icon: Armchair, desc: "Study desk, chair, wardrobe, bed frame" },
  { name: "Internet / Wi-Fi", icon: Wifi, desc: "Signal strength, router, network connectivity" },
  { name: "Cleaning & Hygiene", icon: SprayCan, desc: "Corridor cleanliness, trash, washroom sanitization" },
  { name: "Building & Carpentry", icon: Hammer, desc: "Doors, locks, windows, wall dampness" },
  { name: "Other Issue", icon: MoreHorizontal, desc: "Any other maintenance or facility concern" },
];

const PRIORITIES = [
  { id: "Low", label: "Low", hint: "Minor issue, can wait a few days", dot: "bg-emerald-500" },
  { id: "Medium", label: "Normal", hint: "Standard request, resolve this week", dot: "bg-blue-500" },
  { id: "High", label: "Urgent", hint: "Affects daily routine or studies", dot: "bg-amber-500" },
  { id: "Critical", label: "Emergency", hint: "Safety hazard, severe leak, or power outage", dot: "bg-rose-500" },
];

const BUILDINGS = [
  "Block A - Aurora Hall",
  "Block B - Horizon Hall",
  "Block C - Lakeside Residence",
  "Block D - Co-Living Annex",
];

const FLOORS = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
];

const MAX_DESC = 600;
const MIN_DESC = 10;
const MAX_IMG = 3;

/**
 * Client-side canvas image downscaler
 * Compresses large phone photos (e.g. 10MB) to lightweight ~100KB JPEGs
 */
async function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) {
  if (!file || !file.type.startsWith("image/")) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function SubmitComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Extract student details
  const studentName = user?.name || "Student Resident";
  const studentRegNo = user?.studentId || user?.registrationNumber || "STD-2026-101";
  const studentBuilding = user?.building || "Block B - Horizon Hall";
  const studentRoom = user?.room ? user.room.replace(/^Block\s+[A-D]\s*-\s*/i, "") : "B-204";

  const [form, setForm] = useState({
    title: "",
    category: "Plumbing",
    priority: "Medium",
    description: "",
    building: studentBuilding,
    floor: "2nd Floor",
    room: studentRoom,
    spot: "",
  });

  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadMsg, setUploadMsg] = useState("");
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  // Sync initial user room if loaded late
  useEffect(() => {
    if (user?.room && form.room === "B-204") {
      setForm((prev) => ({
        ...prev,
        room: user.room.replace(/^Block\s+[A-D]\s*-\s*/i, ""),
        building: user.building || prev.building,
      }));
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoSelect = async (filesList) => {
    setUploadMsg("");
    const rawFiles = Array.from(filesList || []);
    const validFiles = rawFiles.filter((f) => f.type.startsWith("image/"));

    if (validFiles.length < rawFiles.length) {
      setUploadMsg("Only image files (JPG, PNG, WebP) can be attached.");
    }

    const availableSlots = MAX_IMG - images.length;
    if (availableSlots <= 0) {
      setUploadMsg(`You can attach up to ${MAX_IMG} photos.`);
      return;
    }

    const toProcess = validFiles.slice(0, availableSlots);
    if (toProcess.length === 0) return;

    setIsUploading(true);
    try {
      // 1. Client-side compression
      const compressedFiles = await Promise.all(toProcess.map((f) => compressImage(f)));

      // 2. Upload to backend
      const uploaded = await uploadComplaintPhotos(compressedFiles);

      const mappedPhotos = uploaded.map((item, idx) => ({
        id: item.publicId || Math.random().toString(36).slice(2),
        name: item.name || compressedFiles[idx]?.name || "photo.jpg",
        size: compressedFiles[idx] ? (compressedFiles[idx].size / 1024).toFixed(0) + " KB" : "85 KB",
        url: item.url,
        publicId: item.publicId,
      }));

      setImages((prev) => [...prev, ...mappedPhotos]);
    } catch (err) {
      console.warn("Upload fallback to local preview:", err.message);
      // Fallback: convert to persistent base64 Data URLs so images render without expiring blob references
      const base64Photos = await Promise.all(
        toProcess.map((f) => {
          return new Promise((res) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              res({
                id: "local-" + Math.random().toString(36).slice(2),
                name: f.name,
                size: (f.size / 1024).toFixed(0) + " KB",
                url: e.target.result,
              });
            };
            reader.onerror = () => res(null);
            reader.readAsDataURL(f);
          });
        })
      );
      setImages((prev) => [...prev, ...base64Photos.filter(Boolean)]);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setUploadMsg("");
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = "Please provide a brief title describing the issue.";
    } else if (form.title.trim().length < 4) {
      errs.title = "Title is too short. Please be a bit more specific.";
    }

    if (!form.description.trim()) {
      errs.description = "Please describe the problem so maintenance staff can prepare the right tools.";
    } else if (form.description.trim().length < MIN_DESC) {
      errs.description = `Please provide at least ${MIN_DESC} characters of detail.`;
    }

    if (!form.building.trim()) errs.building = "Please select the hostel building.";
    if (!form.floor.trim()) errs.floor = "Please select the floor.";
    if (!form.room.trim()) errs.room = "Please enter the room number.";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setToast({
        type: "error",
        text: "Please review the highlighted fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        priority: form.priority,
        description: form.description.trim(),
        building: form.building.trim(),
        floor: form.floor.trim(),
        room: form.room.trim() + (form.spot.trim() ? ` (${form.spot.trim()})` : ""),
        images: images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          name: img.name,
        })),
        studentId: studentRegNo,
        studentName: studentName,
      };

      const result = await submitComplaintToDB(payload);

      setToast({
        type: "success",
        text: `Your complaint #${result.complaintId} has been submitted. The warden and maintenance staff have been notified.`,
        ref: result.complaintId,
      });

      // Clear form
      setForm({
        title: "",
        category: "Plumbing",
        priority: "Medium",
        description: "",
        building: studentBuilding,
        floor: "2nd Floor",
        room: studentRoom,
        spot: "",
      });
      setImages([]);
      setErrors({});
    } catch (err) {
      console.error("Complaint submission error:", err);
      setToast({
        type: "error",
        text: err.message || "Failed to submit complaint. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Staff view guard
  if (user?.role === "warden" || user?.role === "maintenance" || user?.role === "admin") {
    return (
      <div className="mx-auto max-w-4xl space-y-6 pb-12 antialiased">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Complaints Oversight</h1>
            <p className="mt-1 text-sm text-slate-500">
              Wardens review and assign incoming maintenance tickets from students.
            </p>
          </div>
          <Link
            to="/maintenance"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
          >
            <span>Open Maintenance Hub</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            You are logged in as <strong>{studentName} ({user?.role === "maintenance" ? "Technical Staff" : user?.role === "warden" ? "Hostel Warden" : "Administrator"})</strong>. Room maintenance requests are submitted by students and handled through the Student Complaints Hub.
          </p>
          <div className="mt-4">
            <Link
              to="/maintenance"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Go to Student Complaints →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16 antialiased">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/complaints" className="hover:text-slate-800 transition">
              My Complaints
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">New Issue</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report a Room or Facility Issue</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Tell the hostel warden and maintenance team what needs fixing in your room or hall.
          </p>
        </div>

        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Complaints</span>
        </Link>
      </div>

      {/* Alert Banner */}
      {toast && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-semibold text-sm">
              {toast.type === "success" ? "Complaint Submitted" : "Unable to Submit"}
            </p>
            <p className="mt-0.5 leading-relaxed">{toast.text}</p>
            {toast.ref && (
              <div className="mt-2.5 flex items-center gap-2">
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                  Ticket #{toast.ref}
                </span>
                <Link
                  to="/complaints"
                  className="font-medium text-emerald-800 underline hover:text-emerald-950"
                >
                  View in My Complaints →
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Fields (2 Columns) */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Issue Description Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Issue Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a category and briefly explain what is broken or malfunctioning.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bathroom sink pipe leaking under the tap"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  maxLength={100}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition ${
                    errors.title
                      ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600 ring-2 ring-transparent focus:ring-blue-50"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = form.category === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleChange("category", cat.name)}
                        className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/60 text-blue-900"
                            : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 w-full">
                          <Icon size={14} className={isSelected ? "text-blue-600" : "text-slate-400"} />
                          <span className="text-xs font-semibold truncate">{cat.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urgency Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRIORITIES.map((p) => {
                    const isSelected = form.priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleChange("priority", p.id)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                          <span className="text-xs font-semibold text-slate-800">{p.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{p.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe when the issue started, the exact fixture involved, and any relevant details..."
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  maxLength={MAX_DESC}
                  className={`w-full rounded-xl border bg-white p-3 text-xs sm:text-sm text-slate-800 outline-none leading-relaxed transition ${
                    errors.description
                      ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600 ring-2 ring-transparent focus:ring-blue-50"
                  }`}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  {errors.description ? (
                    <span className="text-rose-500 font-medium">{errors.description}</span>
                  ) : (
                    <span>Provide clear details for the technician</span>
                  )}
                  <span>
                    {form.description.length} / {MAX_DESC}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Room Location Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Room Location</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm where the technician needs to visit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hostel Building <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.building}
                    onChange={(e) => handleChange("building", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-600"
                  >
                    {BUILDINGS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Floor <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-600"
                  >
                    {FLOORS.map((fl) => (
                      <option key={fl} value={fl}>
                        {fl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B-204"
                    value={form.room}
                    onChange={(e) => handleChange("room", e.target.value)}
                    className={`w-full rounded-xl border bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-600 ${
                      errors.room ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {errors.room && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.room}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Spot (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near balcony, under study table"
                    value={form.spot}
                    onChange={(e) => handleChange("spot", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 3. Photos Card (Humanized - No Cloudinary / Storage Buzzwords) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Attach Photos (Optional)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add up to 3 photos showing the issue (leak, damage, or broken fixture).
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {images.length} of {MAX_IMG}
                </span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handlePhotoSelect(e.target.files);
                  e.target.value = "";
                }}
              />

              {images.length < MAX_IMG && (
                <div
                  onClick={() => !isUploading && fileRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-slate-50/50 transition cursor-pointer text-center"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={22} className="animate-spin text-blue-600" />
                      <p className="text-xs font-medium text-slate-600">Preparing photo...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <Upload size={20} className="text-slate-400" />
                      <p className="text-xs font-semibold text-slate-700">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-400">JPG, PNG, or WebP up to 10MB</p>
                    </div>
                  )}
                </div>
              )}

              {uploadMsg && (
                <p className="text-xs text-amber-600 font-medium">{uploadMsg}</p>
              )}

              {/* Photo Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(img.id)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-slate-900/75 text-white flex items-center justify-center hover:bg-rose-600 transition"
                      >
                        <X size={12} />
                      </button>
                      <div className="p-1.5 bg-white text-[10px] text-slate-500 truncate">
                        {img.name} ({img.size})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Student Details & Submit Action */}
          <div className="space-y-5 lg:sticky lg:top-24">
            {/* Student Info Card (Natural & Clean - No fake "Atlas Live" or "Verified" badges) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Reporting Student
              </h3>

              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {user?.initials || "AN"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{studentName}</p>
                  <p className="text-xs text-slate-500 truncate">{studentRegNo}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Hostel Block</span>
                  <span className="font-medium text-slate-800">{form.building}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Assigned Room</span>
                  <span className="font-medium text-slate-800">{form.room}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Handling Staff</span>
                  <span className="font-medium text-slate-800">Warden & Maintenance</span>
                </div>
              </div>
            </div>

            {/* Submit Action Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Submit Request</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your request will be recorded and forwarded to the hostel warden and facility supervisor.
              </p>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-98 transition disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Complaint</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/complaints")}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
