import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Store,
  UserPlus,
  XCircle,
  ShieldCheck,
  FileText,
  Download,
  Eye,
  X,
  Printer,
  Sparkles,
  Search,
  Filter,
  Check,
} from "lucide-react";

const initialApplications = [
  {
    id: "VAPP-2026-014",
    vendorId: "VND-2026-09",
    businessName: "Campus Diner & Cafe",
    ownerName: "Ahamed Nafeesh",
    regNo: "SEU/IS/22/ICT/090",
    email: "diner@example.com",
    phone: "+94 77 123 4567",
    category: "Meals",
    hygieneCert: "MOH-EP-2026-904",
    vehicleNo: "WP BCD-4821",
    deliveryPerson: "Kamal Perera",
    status: "Approved",
    submittedAt: "19 Oct 2026",
    approvedAt: "20 Oct 2026",
    qrPassToken: "QR-SS-VND-88492019",
  },
  {
    id: "VAPP-2026-018",
    vendorId: null,
    businessName: "Royal Spice Biryani Point",
    ownerName: "M. Farhan",
    regNo: "SEU/IS/22/ICT/118",
    email: "farhan@royalspice.lk",
    phone: "+94 71 890 1234",
    category: "Meals",
    hygieneCert: "MOH-EP-2026-988",
    vehicleNo: "CP CA-9012",
    deliveryPerson: "Sunil Silva",
    status: "Pending",
    submittedAt: "21 Oct 2026",
    approvedAt: null,
    qrPassToken: null,
  },
];

function readApplications() {
  try {
    const storedApplications = window.localStorage.getItem(
      "smartstay-vendor-applications",
    );
    if (!storedApplications) return initialApplications;

    const parsedApplications = JSON.parse(storedApplications);
    return Array.isArray(parsedApplications)
      ? parsedApplications
      : initialApplications;
  } catch (error) {
    console.error("Unable to read saved vendor applications.", error);
    return initialApplications;
  }
}

export default function VendorApplications() {
  const [applications, setApplications] = useState(readApplications);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApplicationForView, setSelectedApplicationForView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    regNo: "SEU/IS/22/ICT/090",
    email: "",
    phone: "",
    category: "Meals",
    hygieneCert: "",
    vehicleNo: "",
    deliveryPerson: "",
  });

  const saveApplications = (nextApplications) => {
    setApplications(nextApplications);
    try {
      window.localStorage.setItem(
        "smartstay-vendor-applications",
        JSON.stringify(nextApplications),
      );
      return true;
    } catch (error) {
      console.error("Unable to save vendor applications.", error);
      return false;
    }
  };

  const handleAutofill = () => {
    setForm({
      businessName: "Campus Diner & Cafe",
      ownerName: "Ahamed Nafeesh",
      regNo: "SEU/IS/22/ICT/090",
      email: "ahamed.nafeesh@seu.ac.lk",
      phone: "+94 77 123 4567",
      category: "Meals",
      hygieneCert: "MOH-EP-2026-904",
      vehicleNo: "WP BCD-4821",
      deliveryPerson: "Kamal Perera",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newApp = {
      ...form,
      id: `VAPP-${Date.now()}`,
      vendorId: null,
      status: "Pending",
      submittedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      approvedAt: null,
      qrPassToken: null,
    };

    saveApplications([newApp, ...applications]);
    setForm({
      businessName: "",
      ownerName: "",
      regNo: "SEU/IS/22/ICT/090",
      email: "",
      phone: "",
      category: "Meals",
      hygieneCert: "",
      vehicleNo: "",
      deliveryPerson: "",
    });
    setMessage("Vendor registration application submitted successfully for Bursary review.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleApprove = (appId) => {
    const updated = applications.map((app) => {
      if (app.id === appId) {
        const vendorId = app.vendorId || `VND-2026-${Math.floor(10 + Math.random() * 90)}`;
        const qrPassToken = app.qrPassToken || `QR-SS-VND-${Math.floor(10000000 + Math.random() * 90000000)}`;
        return {
          ...app,
          status: "Approved",
          vendorId,
          qrPassToken,
          approvedAt: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        };
      }
      return app;
    });

    saveApplications(updated);
    setMessage("Vendor application officially APPROVED and campus delivery gate pass issued.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleReject = (appId) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, status: "Rejected" } : app,
    );
    saveApplications(updated);
    setMessage("Vendor application has been rejected.");
    setTimeout(() => setMessage(""), 4000);
  };

  const pendingCount = applications.filter((a) => a.status === "Pending").length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;

  const filteredApps = applications.filter((app) => {
    const matchesTab =
      activeTab === "all" || app.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Vendor Registration & Approval
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Module 3 Vendor Portal
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Developer: <strong className="text-slate-800">Ahamed Nafeesh</strong> (Reg:{" "}
            <span className="font-mono text-blue-600 font-semibold">SEU/IS/22/ICT/090</span>) · Food Merchant Permitting & Gate Security Pass Integration
          </p>
        </div>

        <button
          onClick={handleAutofill}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs cursor-pointer"
        >
          <Sparkles size={14} />
          <span>Autofill Sample (Nafeesh)</span>
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Applications</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{applications.length}</p>
          <span className="text-[11px] text-slate-400">All Time</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Awaiting Warden Audit</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Approved Vendors</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-slate-400">Active Gate Passes</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Health Compliance</span>
          <p className="text-2xl font-black text-blue-600 mt-1">100%</p>
          <span className="text-[11px] text-slate-400">MOH Certified</span>
        </div>
      </div>

      {/* Main Grid: Application Form + Reviews Table */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Store size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Register Campus Food Vendor
                </h3>
                <p className="text-[11px] text-slate-500">
                  Onboard merchant for marketplace menus & delivery slots
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Food Outlet / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="e.g. Campus Diner & Cafe"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    placeholder="Ahamed Nafeesh"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Student / NIC Reg
                  </label>
                  <input
                    type="text"
                    value={form.regNo}
                    onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Food Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Meals">Main Meals (Rice/Kottu)</option>
                    <option value="Fast Food">Fast Food & Burgers</option>
                    <option value="Beverages">Coffee & Beverages</option>
                    <option value="Bakery">Bakery & Pastries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Food Hygiene Certificate No. (MOH Audit)
                </label>
                <input
                  type="text"
                  required
                  value={form.hygieneCert}
                  onChange={(e) => setForm({ ...form, hygieneCert: e.target.value })}
                  placeholder="MOH-EP-2026-904"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Delivery Vehicle No.
                  </label>
                  <input
                    type="text"
                    required
                    value={form.vehicleNo}
                    onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })}
                    placeholder="WP BCD-4821"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Designated Rider
                  </label>
                  <input
                    type="text"
                    required
                    value={form.deliveryPerson}
                    onChange={(e) => setForm({ ...form, deliveryPerson: e.target.value })}
                    placeholder="Kamal Perera"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-2xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Submit Vendor Application
              </button>
            </form>
          </div>
        </div>

        {/* Applications List & Approvals Column */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Warden & Bursary Approval Center
              </h3>
              <p className="text-xs text-slate-500">
                Audit credentials, grant campus access, and generate QR Passes
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {["all", "pending", "approved"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor name, owner, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white"
            />
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {filteredApps.map((app) => (
              <div key={app.id} className="py-4 space-y-3 first:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{app.businessName}</h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          app.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : app.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Owner: <strong>{app.ownerName}</strong> ({app.regNo}) · Category: {app.category}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Hygiene Cert: {app.hygieneCert || "Pending"} · Rider: {app.deliveryPerson} ({app.vehicleNo})
                    </p>
                  </div>

                  {app.vendorId && (
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200/50 self-start">
                      {app.vendorId}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    Submitted: {app.submittedAt}
                  </span>

                  <div className="flex items-center gap-2">
                    {app.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
                        >
                          <Check size={13} />
                          <span>Approve & Issue Pass</span>
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {app.status === "Approved" && (
                      <button
                        onClick={() => setSelectedApplicationForView(app)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition shadow-2xs cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View Accreditation Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accreditation Certificate Modal */}
      {selectedApplicationForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-start justify-between border-b border-dashed border-slate-200 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={14} /> Official Campus Vendor Permit
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedApplicationForView.businessName}
                </h3>
                <p className="text-xs text-slate-500">
                  Authorized University Food Service Partner
                </p>
              </div>

              <button
                onClick={() => setSelectedApplicationForView(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Vendor ID</span>
                <span className="font-mono font-bold text-blue-600">
                  {selectedApplicationForView.vendorId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Proprietor</span>
                <span className="font-semibold text-slate-900">
                  {selectedApplicationForView.ownerName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Authorized Rider</span>
                <span className="font-semibold text-slate-900">
                  {selectedApplicationForView.deliveryPerson}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Delivery Vehicle</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedApplicationForView.vehicleNo}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedApplicationForView.qrPassToken || "QR-PASS"}`}
                  alt="Gate Token QR"
                  className="h-16 w-16 bg-white p-1 rounded-xl"
                />
                <div>
                  <p className="text-xs font-bold text-white">Cryptographic QR Gate Token</p>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    {selectedApplicationForView.qrPassToken}
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-emerald-400">
                    ✓ Valid for Hostel Drop-off
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setSelectedApplicationForView(null)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
