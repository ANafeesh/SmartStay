import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Wrench,
  X,
  Image,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  getComplaintsFromDB,
  submitComplaintToDB,
} from "../../services/complaintApi";

const initialComplaints = [
  {
    id: "CMP-2026-001",
    title: "Bathroom water leakage",
    category: "Plumbing",
    description: "Water is leaking from the bathroom tap.",
    date: "24 Sep 2026",
    status: "Pending",
  },
  {
    id: "CMP-2026-002",
    title: "Room light not working",
    category: "Electrical",
    description: "The main ceiling light is not working.",
    date: "20 Sep 2026",
    status: "In Progress",
  },
  {
    id: "CMP-2026-003",
    title: "Study table repair",
    category: "Furniture",
    description: "The study table drawer needs repair.",
    date: "15 Sep 2026",
    status: "Resolved",
  },
];

const categories = [
  "Plumbing",
  "Electrical",
  "Furniture",
  "Internet",
  "Cleaning",
  "Other",
];

function Complaints() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getComplaintsFromDB()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d) => ({
            id: d.complaintId || d._id,
            title: d.title,
            category: d.category,
            description: d.description,
            date: new Date(d.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            status: d.status,
            images: d.images || [],
          }));
          setComplaints((prev) => {
            const existingIds = new Set(mapped.map((m) => m.id));
            const remaining = prev.filter((p) => !existingIds.has(p.id));
            return [...mapped, ...remaining];
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load complaints from MongoDB:", err.message);
      });
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    category: "Plumbing",
    description: "",
  });

  const pendingCount = complaints.filter(
    (item) => item.status === "Pending",
  ).length;

  const progressCount = complaints.filter(
    (item) => item.status === "In Progress",
  ).length;

  const resolvedCount = complaints.filter(
    (item) => item.status === "Resolved",
  ).length;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const saved = await submitComplaintToDB({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        priority: "Medium",
        building: "Block B – Horizon Hall",
        floor: "2nd Floor",
        room: "B-204",
      });

      const newComplaint = {
        id: saved.complaintId,
        title: saved.title,
        category: saved.category,
        description: saved.description,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: saved.status,
      };

      setComplaints((previous) => [newComplaint, ...previous]);
    } catch (e) {
      const newComplaint = {
        id: `CMP-2026-${String(complaints.length + 4).padStart(3, "0")}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        date: "Today",
        status: "Pending",
      };

      setComplaints((previous) => [newComplaint, ...previous]);
    }

    setFormData({
      title: "",
      category: "Plumbing",
      description: "",
    });

    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">
            Complaints &amp; Maintenance
          </h1>

          <p className="mt-2 text-smart-secondary">
            Report hostel issues, attach photo evidence, and track your maintenance requests in MongoDB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/maintenance/submit-complaint"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Submit Complaint with Photos</span>
          </Link>
          <Button onClick={() => setShowForm(true)} variant="secondary">
            Quick Complaint
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <SummaryCard
          title="Pending"
          value={pendingCount}
          icon={Clock3}
          color="text-smart-warning"
          bg="bg-smart-warning/10"
        />

        <SummaryCard
          title="In Progress"
          value={progressCount}
          icon={Wrench}
          color="text-smart-blue"
          bg="bg-smart-blue/10"
        />

        <SummaryCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
          color="text-smart-success"
          bg="bg-smart-success/10"
        />
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Submit New Complaint
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Tell the hostel staff about the issue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-smart-secondary transition hover:bg-smart-background hover:text-smart-primary"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-smart-primary">
                  Complaint Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Broken room fan"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-smart-primary">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-smart-primary">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the problem clearly..."
                className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Submit Complaint</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Complaints */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              My Complaints
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Track the status of your submitted requests.
            </p>
          </div>

          <div className="hidden rounded-xl bg-smart-blue/10 p-3 text-smart-blue sm:block">
            <AlertCircle size={22} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}
        >
          <Icon size={24} />
        </div>

        <p className="text-3xl font-bold text-smart-primary">{value}</p>
      </div>

      <p className="mt-4 text-sm font-medium text-smart-secondary">
        {title} Complaints
      </p>
    </div>
  );
}

function ComplaintCard({ complaint }) {
  const statusVariant = {
    Pending: "warning",
    "In Progress": "info",
    Resolved: "success",
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-smart-background p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-smart-primary">{complaint.title}</h3>

            <Badge variant={statusVariant[complaint.status]}>
              {complaint.status}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-smart-secondary">
            <span>#{complaint.id}</span>

            <span>{complaint.category}</span>

            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {complaint.date}
            </span>
          </div>

          <p className="mt-3 text-sm text-smart-secondary">
            {complaint.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {complaint.status === "Pending" && (
            <Badge variant="warning">Waiting for staff</Badge>
          )}

          {complaint.status === "In Progress" && (
            <Badge variant="info">Staff assigned</Badge>
          )}

          {complaint.status === "Resolved" && (
            <Badge variant="success">Issue fixed</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default Complaints;
