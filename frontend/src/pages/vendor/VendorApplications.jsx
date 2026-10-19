import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Store,
  UserPlus,
  XCircle,
} from "lucide-react";

const initialApplications = [
  {
    id: "VAPP-2026-014",
    businessName: "Campus Diner & Cafe",
    ownerName: "Ahamed Nafeesh",
    email: "diner@example.com",
    phone: "+94 77 123 4567",
    category: "Meals",
    status: "Pending",
    submittedAt: "19 Oct 2026",
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

function VendorApplications() {
  const [applications, setApplications] = useState(readApplications);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Meals",
  });
  const [message, setMessage] = useState("");

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const application = {
      ...form,
      id: `VAPP-${Date.now()}`,
      status: "Pending",
      submittedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    const saved = saveApplications([application, ...applications]);
    setForm({
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      category: "Meals",
    });
    setMessage(
      saved
        ? "Vendor application submitted for review."
        : "The application was submitted for this session but could not be saved in this browser.",
    );
  };

  const updateStatus = (applicationId, status) => {
    const nextApplications = applications.map((application) =>
      application.id === applicationId
        ? { ...application, status }
        : application,
    );
    const saved = saveApplications(nextApplications);
    setMessage(
      saved
        ? `Application ${status.toLowerCase()}.`
        : `Application ${status.toLowerCase()} for this session but could not be saved in this browser.`,
    );
  };

  const pendingCount = applications.filter(
    (application) => application.status === "Pending",
  ).length;
  const approvedCount = applications.filter(
    (application) => application.status === "Approved",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header>
        <p className="text-sm font-semibold text-blue-600">
          Marketplace management
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Vendor Registration & Approval
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          Submit a campus food vendor application and review applications
          before allowing vendors to list menus or receive orders.
        </p>
      </header>

      <div
        role="note"
        className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"
      >
        Demo workflow: applications are saved in this browser only. Connect
        these actions to authenticated vendor and administrator APIs before
        using them for real approvals.
      </div>

      {message && (
        <p
          role="status"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
        >
          {message}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPlus size={20} />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Register as a vendor</h2>
              <p className="text-xs text-slate-500">
                Approval is required before listing food.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Business / shop name"
              value={form.businessName}
              onChange={(value) =>
                setForm({ ...form, businessName: value })
              }
              required
            />
            <FormField
              label="Owner name"
              value={form.ownerName}
              onChange={(value) => setForm({ ...form, ownerName: value })}
              required
            />
            <FormField
              label="Contact email"
              type="email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
            />
            <FormField
              label="Contact phone"
              type="tel"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              required
            />
            <div>
              <label
                htmlFor="vendor-category"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Vendor category
              </label>
              <select
                id="vendor-category"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
              >
                <option>Meals</option>
                <option>Snacks</option>
                <option>Beverages</option>
                <option>Grocery</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Submit application
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryCard
              icon={Clock3}
              label="Awaiting review"
              value={pendingCount}
              color="amber"
            />
            <SummaryCard
              icon={CheckCircle2}
              label="Approved vendors"
              value={approvedCount}
              color="emerald"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">Applications</h2>
              <p className="mt-1 text-xs text-slate-500">
                Check vendor details and approve or decline each request.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {applications.length ? (
                applications.map((application) => (
                  <article key={application.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <Store size={19} />
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {application.businessName}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {application.category} · {application.id}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          application.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : application.status === "Declined"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <dl className="mt-4 grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
                      <Detail label="Owner" value={application.ownerName} />
                      <Detail label="Submitted" value={application.submittedAt} />
                      <Detail label="Email" value={application.email} />
                      <Detail label="Phone" value={application.phone} />
                    </dl>

                    {application.status === "Pending" && (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        <button
                          onClick={() =>
                            updateStatus(application.id, "Approved")
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <CheckCircle2 size={15} />
                          Approve vendor
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(application.id, "Declined")
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          <XCircle size={15} />
                          Decline
                        </button>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <p className="p-8 text-center text-sm text-slate-500">
                  No vendor applications yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", required }) {
  const id = `vendor-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }) {
  const colors = {
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}
      >
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-slate-400">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold text-slate-700">{value}</dd>
    </div>
  );
}

export default VendorApplications;
