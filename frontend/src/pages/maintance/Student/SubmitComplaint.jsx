import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, BedDouble, CreditCard, UtensilsCrossed, MessageSquareWarning,
  Ticket, Bell, User, Settings, Menu, ArrowLeft, ChevronDown, ChevronRight, Check,
  UploadCloud, X, AlertCircle, MapPin, Wrench, Zap, Armchair, Wifi, SprayCan,
  Hammer, MoreHorizontal, Info, CheckCircle2, Building2, ImagePlus, Home, Send,
} from "lucide-react";
import Logo from "../../../components/ui/Logo";

/* ---------- SmartStay theme ---------- */
const C = {
  navy: "#0F4C81", blue: "#1686D4", teal: "#06B6D4", bg: "#F8FAFC", white: "#FFFFFF",
  text: "#172033", muted: "#6E7575", green: "#10B981", orange: "#F59E0B", red: "#EF4444",
  line: "#E2E8F0", sidebar: "#0B2F52",
};

const css = `
.ss-root{font-family:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:${C.text};background:${C.bg}}
.ss-input{width:100%;background:#fff;border:1.5px solid ${C.line};border-radius:12px;padding:11px 14px;font-size:14px;color:${C.text};outline:none;transition:border-color .15s,box-shadow .15s}
.ss-input::placeholder{color:#94A3B8}
.ss-input:hover{border-color:#CBD5E1}
.ss-input:focus{border-color:${C.blue};box-shadow:0 0 0 4px rgba(22,134,212,.14)}
.ss-input.err{border-color:${C.red};box-shadow:0 0 0 4px rgba(239,68,68,.08)}
.ss-card{background:#fff;border:1px solid ${C.line};border-radius:18px;box-shadow:0 1px 2px rgba(15,76,129,.04),0 8px 24px -12px rgba(15,76,129,.10)}
.ss-nav{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;font-size:14px;font-weight:500;color:#B6CCE2;transition:background .15s,color .15s;cursor:pointer;width:100%;text-align:left}
.ss-nav:hover{background:rgba(255,255,255,.07);color:#fff}
.ss-nav.on{background:${C.blue};color:#fff;box-shadow:0 8px 18px -8px rgba(22,134,212,.8)}
.ss-btn-primary{background:linear-gradient(135deg,${C.blue},${C.navy});color:#fff;font-weight:600;font-size:14px;border-radius:12px;padding:12px 22px;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .15s,box-shadow .15s,filter .15s;box-shadow:0 10px 20px -10px rgba(15,76,129,.7)}
.ss-btn-primary:hover{filter:brightness(1.07);transform:translateY(-1px)}
.ss-btn-primary:active{transform:translateY(0)}
.ss-btn-ghost{background:#fff;border:1.5px solid ${C.line};color:${C.text};font-weight:600;font-size:14px;border-radius:12px;padding:11px 20px;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:background .15s,border-color .15s}
.ss-btn-ghost:hover{background:#F1F5F9;border-color:#CBD5E1}
.ss-pri{position:relative;text-align:left;border:1.5px solid ${C.line};border-radius:14px;padding:14px;background:#fff;transition:all .15s;cursor:pointer}
.ss-pri:hover{transform:translateY(-2px);box-shadow:0 10px 20px -12px rgba(23,32,51,.25)}
.ss-drop{border:2px dashed #CBD5E1;border-radius:16px;background:#F8FAFC;transition:all .15s;cursor:pointer}
.ss-drop:hover,.ss-drop.over{border-color:${C.blue};background:rgba(22,134,212,.05)}
@keyframes ssIn{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:none}}
.ss-pop{animation:ssIn .16s ease-out}
@keyframes ssToast{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
.ss-toast{animation:ssToast .3s ease-out}
.ss-label{display:block;font-size:13px;font-weight:600;margin-bottom:7px;color:${C.text}}
.ss-err{display:flex;align-items:center;gap:5px;font-size:12px;color:${C.red};margin-top:6px}
@media (prefers-reduced-motion:reduce){.ss-pop,.ss-toast{animation:none}.ss-pri,.ss-btn-primary{transition:none}}
`;

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Rooms", icon: BedDouble },
  { label: "Payments", icon: CreditCard },
  { label: "Food & Marketplace", icon: UtensilsCrossed },
  { label: "Complaints", icon: MessageSquareWarning },
  { label: "Visitor Pass", icon: Ticket },
  { label: "Notifications", icon: Bell },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

const CATEGORIES = [
  { name: "Plumbing", icon: Wrench }, { name: "Electrical", icon: Zap },
  { name: "Furniture", icon: Armchair }, { name: "Internet/Wi-Fi", icon: Wifi },
  { name: "Housekeeping", icon: SprayCan }, { name: "Building Maintenance", icon: Hammer },
  { name: "Other", icon: MoreHorizontal },
];

const PRIORITIES = [
  { id: "Low", color: C.green, hint: "Minor, can wait a few days" },
  { id: "Medium", color: C.blue, hint: "Needs attention this week" },
  { id: "High", color: C.orange, hint: "Affects daily living" },
  { id: "Urgent", color: C.red, hint: "Safety risk, act now" },
];

const BUILDINGS = ["Block A – Aurora Hall", "Block B – Horizon Hall", "Block C – Lakeside Residence", "Block D – Co-Living Annex"];
const FLOORS = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"];
const MAX_DESC = 500, MIN_DESC = 20, MAX_IMG = 3;

const EMPTY = { title: "", category: "", priority: "", description: "", building: "", floor: "", room: "", spot: "" };

/* ---------- Custom dropdown ---------- */
function Dropdown({ value, onChange, options, placeholder, error, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = options.map((o) => (typeof o === "string" ? { name: o } : o));
  const sel = items.find((i) => i.name === value);
  const SelIcon = sel?.icon || Icon;
  return (
    <div ref={ref} className="relative">
      <button
        type="button" onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={"ss-input flex items-center justify-between gap-2 text-left " + (error ? "err" : "")}
        aria-haspopup="listbox" aria-expanded={open}
      >
        <span className="flex items-center gap-2 truncate" style={{ color: sel ? C.text : "#94A3B8" }}>
          {SelIcon && <SelIcon size={16} style={{ color: sel ? C.blue : "#94A3B8" }} />}
          {sel ? sel.name : placeholder}
        </span>
        <ChevronDown size={16} style={{ color: C.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      {open && (
        <ul role="listbox" className="ss-pop absolute z-30 mt-2 w-full max-h-64 overflow-auto bg-white p-1.5"
          style={{ border: `1px solid ${C.line}`, borderRadius: 14, boxShadow: "0 18px 40px -12px rgba(15,76,129,.28)" }}>
          {items.map((it) => {
            const I = it.icon; const on = it.name === value;
            return (
              <li key={it.name} role="option" aria-selected={on}
                onClick={() => { onChange(it.name); setOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm hover:bg-slate-50"
                style={{ color: on ? C.blue : C.text, fontWeight: on ? 600 : 400, background: on ? "rgba(22,134,212,.07)" : undefined }}>
                {I && <I size={16} style={{ color: on ? C.blue : C.muted }} />}
                <span className="flex-1">{it.name}</span>
                {on && <Check size={15} />}
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
    <label className="ss-label">{label}{required && <span style={{ color: C.red }}> *</span>}</label>
    {children}
    {error ? <p className="ss-err"><AlertCircle size={13} />{error}</p> : hint ? <p className="text-xs mt-1.5" style={{ color: C.muted }}>{hint}</p> : null}
  </div>
);

const SectionTitle = ({ icon: Icon, title, sub }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 36, height: 36, background: "rgba(22,134,212,.10)", color: C.blue }}>
      <Icon size={18} />
    </div>
    <div>
      <h2 className="text-base font-semibold leading-tight">{title}</h2>
      {sub && <p className="text-xs mt-0.5" style={{ color: C.muted }}>{sub}</p>}
    </div>
  </div>
);

/* ---------- Page ---------- */
export default function SubmitComplaint() {
  const [f, setF] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [over, setOver] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (v) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const onText = (k) => (e) => set(k)(e.target.value);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 6000); return () => clearTimeout(t); } }, [toast]);
  useEffect(() => () => images.forEach((i) => URL.revokeObjectURL(i.url)), []); // eslint-disable-line

  const addFiles = (list) => {
    setUploadMsg("");
    const files = Array.from(list || []);
    const valid = files.filter((x) => x.type.startsWith("image/"));
    if (valid.length < files.length) setUploadMsg("Only image files (JPG, PNG, WebP) are supported.");
    const room = MAX_IMG - images.length;
    if (valid.length > room) setUploadMsg(`You can attach up to ${MAX_IMG} photos.`);
    const add = valid.slice(0, Math.max(room, 0)).map((file) => ({
      id: Math.random().toString(36).slice(2), name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), url: URL.createObjectURL(file),
    }));
    if (add.length) setImages((p) => [...p, ...add]);
  };
  const removeImg = (id) => {
    setImages((p) => { const g = p.find((i) => i.id === id); if (g) URL.revokeObjectURL(g.url); return p.filter((i) => i.id !== id); });
    setUploadMsg("");
  };

  const validate = () => {
    const e = {};
    if (!f.title.trim()) e.title = "Enter a short title for your complaint.";
    else if (f.title.trim().length < 5) e.title = "Title should be at least 5 characters.";
    if (!f.category) e.category = "Choose a category.";
    if (!f.priority) e.priority = "Select a priority level.";
    if (!f.description.trim()) e.description = "Describe the problem so staff know what to fix.";
    else if (f.description.trim().length < MIN_DESC) e.description = `Add a little more detail (at least ${MIN_DESC} characters).`;
    if (!f.building) e.building = "Select your building.";
    if (!f.floor) e.floor = "Select the floor.";
    if (!f.room.trim()) e.room = "Enter your room number.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setToast({ type: "error", text: "Please fix the highlighted fields and try again." });
      return;
    }
    const ref = "DEMO-" + Math.floor(1000 + Math.random() * 9000);
    setToast({ type: "success", text: `Demo only: complaint ${ref} was not saved anywhere. In SmartStay this is where it would be sent to maintenance.` });
    setF(EMPTY); setImages([]); setErrors({}); setUploadMsg("");
  };

  const cancel = () => { setF(EMPTY); setImages([]); setErrors({}); setUploadMsg(""); setToast(null); };

  const descLen = f.description.length;

  return (
    <div className="ss-root min-h-screen flex w-full">
      <style>{css}</style>

      {/* Mobile overlay */}
      {menuOpen && <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(11,47,82,.55)" }} onClick={() => setMenuOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={"fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0 flex flex-col transition-transform duration-200 " + (menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}
        style={{ width: 260, background: `linear-gradient(180deg, ${C.sidebar} 0%, #082440 100%)` }}
      >
        <div className="flex items-center justify-between gap-3 px-6 pt-7 pb-8">
          <Logo
            variant="horizontal"
            size="md"
            theme="dark"
            subtitle="Hostel &amp; Co-Living"
          />
          <button className="lg:hidden ml-auto text-white" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV.map(({ label, icon: I }) => (
            <button key={label} className={"ss-nav " + (label === "Complaints" ? "on" : "")} aria-current={label === "Complaints" ? "page" : undefined}>
              <I size={18} /><span>{label}</span>
              {label === "Notifications" && <span className="ml-auto text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: C.teal, color: "#04303a" }}>3</span>}
            </button>
          ))}
        </nav>
        <div className="m-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,.07)" }}>
          <p className="text-white text-sm font-semibold">Need help fast?</p>
          <p className="text-xs mt-1" style={{ color: "#9CBBD8" }}>Warden desk is open 8 AM – 10 PM.</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-8 h-16" style={{ background: "rgba(255,255,255,.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}` }}>
          <button className="p-2 rounded-lg hover:bg-slate-100" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="flex-1" />
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100" aria-label="Notifications">
            <Bell size={19} style={{ color: C.muted }} />
            <span className="absolute rounded-full" style={{ top: 8, right: 9, width: 9, height: 9, background: C.red, border: "2px solid #fff" }} />
          </button>
          <div className="flex items-center gap-3 pl-3" style={{ borderLeft: `1px solid ${C.line}` }}>
            <div className="flex items-center justify-center rounded-full text-white text-sm font-bold" style={{ width: 38, height: 38, background: `linear-gradient(135deg,${C.navy},${C.teal})` }}>NP</div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold">Nimali Perera</div>
              <div className="text-xs" style={{ color: C.muted }}>Student · Room B-214</div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-7 w-full" style={{ maxWidth: 1180 }}>
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm mb-4" style={{ color: C.muted }} aria-label="Breadcrumb">
            <span className="hover:underline cursor-pointer">Dashboard</span><ChevronRight size={14} />
            <span className="hover:underline cursor-pointer">Complaints & Services</span><ChevronRight size={14} />
            <span className="font-semibold" style={{ color: C.blue }}>Submit Complaint</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: C.navy }}>Submit New Complaint</h1>
              <p className="mt-1.5 text-sm sm:text-base" style={{ color: C.muted }}>Report maintenance issues or hostel service problems.</p>
            </div>
            <button type="button" className="ss-btn-ghost self-start sm:self-auto"><ArrowLeft size={16} />Back to Complaints</button>
          </div>

          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              {/* LEFT: main form */}
              <div className="xl:col-span-2 space-y-6">
                {/* Details */}
                <section className="ss-card p-5 sm:p-7">
                  <SectionTitle icon={MessageSquareWarning} title="Complaint details" sub="Tell us what's wrong and how serious it is." />
                  <div className="space-y-5">
                    <Field label="Complaint Title" required error={errors.title}>
                      <input className={"ss-input " + (errors.title ? "err" : "")} placeholder="e.g., Water leakage in bathroom" value={f.title} onChange={onText("title")} maxLength={80} />
                    </Field>

                    <Field label="Complaint Category" required error={errors.category}>
                      <Dropdown value={f.category} onChange={set("category")} options={CATEGORIES} placeholder="Select a category" error={errors.category} />
                    </Field>

                    <div>
                      <label className="ss-label">Priority Level <span style={{ color: C.red }}>*</span></label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="radiogroup" aria-label="Priority level">
                        {PRIORITIES.map((p) => {
                          const on = f.priority === p.id;
                          return (
                            <button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => set("priority")(p.id)} className="ss-pri"
                              style={on ? { borderColor: p.color, background: p.color + "14", boxShadow: `0 0 0 4px ${p.color}22` } : undefined}>
                              <span className="flex items-center justify-between mb-2">
                                <span className="rounded-full" style={{ width: 10, height: 10, background: p.color }} />
                                <span className="flex items-center justify-center rounded-full" style={{ width: 18, height: 18, border: `1.5px solid ${on ? p.color : "#CBD5E1"}`, background: on ? p.color : "#fff" }}>
                                  {on && <Check size={11} color="#fff" strokeWidth={3} />}
                                </span>
                              </span>
                              <span className="block text-sm font-semibold" style={{ color: on ? p.color : C.text }}>{p.id}</span>
                              <span className="block text-xs mt-0.5 leading-snug" style={{ color: C.muted }}>{p.hint}</span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.priority && <p className="ss-err"><AlertCircle size={13} />{errors.priority}</p>}
                    </div>

                    <Field label="Description" required error={errors.description}>
                      <textarea rows={6} className={"ss-input " + (errors.description ? "err" : "")} style={{ resize: "vertical", lineHeight: 1.55 }}
                        placeholder="Describe the issue: when it started, how often it happens and what you have already tried."
                        value={f.description} maxLength={MAX_DESC} onChange={onText("description")} />
                      <div className="flex justify-end mt-1.5">
                        <span className="text-xs font-medium" style={{ color: descLen > MAX_DESC - 40 ? C.orange : C.muted }}>{descLen} / {MAX_DESC}</span>
                      </div>
                    </Field>
                  </div>
                </section>

                {/* Location */}
                <section className="ss-card p-5 sm:p-7">
                  <SectionTitle icon={MapPin} title="Complaint location" sub="Help the maintenance team find the problem quickly." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Building / Hostel" required error={errors.building}>
                      <Dropdown value={f.building} onChange={set("building")} options={BUILDINGS} placeholder="Select building" error={errors.building} icon={Building2} />
                    </Field>
                    <Field label="Floor" required error={errors.floor}>
                      <Dropdown value={f.floor} onChange={set("floor")} options={FLOORS} placeholder="Select floor" error={errors.floor} />
                    </Field>
                    <Field label="Room Number" required error={errors.room}>
                      <input className={"ss-input " + (errors.room ? "err" : "")} placeholder="e.g., B-214" value={f.room} onChange={onText("room")} maxLength={10} />
                    </Field>
                    <Field label="Specific Location">
                      <input className="ss-input" placeholder="e.g., Attached bathroom, near the sink" value={f.spot} onChange={onText("spot")} maxLength={60} />
                    </Field>
                  </div>
                </section>

                {/* Photos */}
                <section className="ss-card p-5 sm:p-7">
                  <SectionTitle icon={ImagePlus} title="Photo evidence" sub={`Optional. Add up to ${MAX_IMG} photos (JPG, PNG or WebP).`} />
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                  {images.length < MAX_IMG && (
                    <div
                      className={"ss-drop flex flex-col items-center text-center px-4 py-9 " + (over ? "over" : "")}
                      role="button" tabIndex={0}
                      onClick={() => fileRef.current?.click()}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current?.click())}
                      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
                      onDragLeave={() => setOver(false)}
                      onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}
                    >
                      <div className="flex items-center justify-center rounded-full mb-3" style={{ width: 52, height: 52, background: "rgba(22,134,212,.12)", color: C.blue }}>
                        <UploadCloud size={26} />
                      </div>
                      <p className="text-sm font-semibold">Drag photos here, or <span style={{ color: C.blue }}>browse files</span></p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>{images.length} of {MAX_IMG} added</p>
                    </div>
                  )}
                  {uploadMsg && <p className="ss-err"><AlertCircle size={13} />{uploadMsg}</p>}
                  {images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      {images.map((img) => (
                        <div key={img.id} className="relative overflow-hidden group" style={{ borderRadius: 14, border: `1px solid ${C.line}` }}>
                          <img src={img.url} alt={img.name} className="w-full object-cover" style={{ height: 140 }} />
                          <button type="button" onClick={() => removeImg(img.id)} aria-label={`Remove ${img.name}`}
                            className="absolute flex items-center justify-center rounded-full transition-transform hover:scale-110"
                            style={{ top: 8, right: 8, width: 28, height: 28, background: "rgba(23,32,51,.78)", color: "#fff" }}>
                            <X size={15} />
                          </button>
                          <div className="px-3 py-2 bg-white">
                            <p className="text-xs font-medium truncate">{img.name}</p>
                            <p className="text-xs" style={{ color: C.muted }}>{img.size} MB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* RIGHT: student + actions */}
              <aside className="space-y-6 xl:sticky xl:top-24">
                <section className="ss-card p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold">Student information</h2>
                    <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: "rgba(245,158,11,.14)", color: "#B45309" }}>Demo data</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: `1px solid ${C.line}` }}>
                    <div className="flex items-center justify-center rounded-full text-white font-bold" style={{ width: 48, height: 48, background: `linear-gradient(135deg,${C.navy},${C.teal})` }}>NP</div>
                    <div>
                      <p className="font-semibold leading-tight">Nimali Perera</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>BSc (Hons) Software Engineering</p>
                    </div>
                  </div>
                  <dl className="space-y-3 text-sm">
                    {[["Student ID", "SS-2024-0417"], ["Hostel", "Block B – Horizon Hall"], ["Room", "B-214 (Twin sharing)"], ["Contact", "+94 77 123 4567"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt style={{ color: C.muted }}>{k}</dt>
                        <dd className="font-medium text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex gap-2 mt-4 p-3 rounded-xl text-xs leading-relaxed" style={{ background: "rgba(6,182,212,.08)", color: "#0E7490" }}>
                    <Info size={15} className="shrink-0 mt-0.5" />
                    <span>Sample details for preview only. They are read-only and not linked to a real account.</span>
                  </div>
                </section>

                <section className="ss-card p-5 sm:p-6">
                  <h2 className="text-base font-semibold mb-1">Ready to send?</h2>
                  <p className="text-xs mb-4" style={{ color: C.muted }}>Fields marked * are required.</p>
                  <div className="flex flex-col-reverse sm:flex-row xl:flex-col-reverse gap-3">
                    <button type="button" onClick={cancel} className="ss-btn-ghost flex-1">Cancel</button>
                    <button type="submit" className="ss-btn-primary flex-1"><Send size={16} />Submit Complaint</button>
                  </div>
                </section>
              </aside>
            </div>
          </form>
          <p className="text-center text-xs mt-10" style={{ color: C.muted }}>SmartStay · Maintenance, Complaints and Student Services · UI preview</p>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="ss-toast fixed z-50 flex gap-3 p-4 bg-white" role="status" aria-live="polite"
          style={{ top: 78, right: 16, left: 16, maxWidth: 400, marginLeft: "auto", borderRadius: 16, border: `1px solid ${C.line}`, borderLeft: `5px solid ${toast.type === "success" ? C.green : C.red}`, boxShadow: "0 20px 40px -12px rgba(15,76,129,.35)" }}>
          {toast.type === "success" ? <CheckCircle2 size={22} style={{ color: C.green }} className="shrink-0" /> : <AlertCircle size={22} style={{ color: C.red }} className="shrink-0" />}
          <div className="flex-1">
            <p className="text-sm font-semibold">{toast.type === "success" ? "Demo submission successful" : "Check your form"}</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{toast.text}</p>
          </div>
          <button onClick={() => setToast(null)} aria-label="Dismiss" className="self-start p-1 rounded hover:bg-slate-100"><X size={16} style={{ color: C.muted }} /></button>
        </div>
      )}
    </div>
  );
}
