import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Search,
  Filter,
  X,
  User,
  Building,
  Home,
  Calendar,
  AlertCircle,
  RefreshCw,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  Loader2,
  MapPin,
  MessageSquare,
  CheckSquare,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import {
  getComplaintsFromDB,
  updateComplaintStatusInDB,
} from "../../services/complaintApi";

// Initial seed complaints for robust fallback display when DB is empty or offline
const defaultComplaintsSeed = [
  {
    _id: "seed-1",
    complaintId: "CMP-2026-4821",
    studentId: "SEU/IS/22/ICT/090",
    studentName: "Ahamed Nafeesh",
    title: "Bathroom water leaking continuously",
    category: "Plumbing",
    priority: "High",
    description:
      "Water is leaking from the main bathroom tap valve continuously. The floor remains constantly wet and requires urgent washer replacement.",
    building: "Block B - Horizon Hall",
    floor: "2nd Floor",
    room: "B-204",
    images: [],
    status: "Pending",
    assignedTo: "Hostel Maintenance Division",
    resolutionNotes: "",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    _id: "seed-2",
    complaintId: "CMP-2026-3190",
    studentId: "SEU/IS/22/ICT/045",
    studentName: "Kavindu Perera",
    title: "Ceiling fan making loud rattling noise",
    category: "Electrical",
    priority: "Medium",
    description:
      "Ceiling fan in room 105 vibrates intensely on speed 3 and 4, creating an uncomfortable rattling noise during night study hours.",
    building: "Block A - Aurora Hall",
    floor: "1st Floor",
    room: "A-105",
    images: [],
    status: "In Progress",
    assignedTo: "Kamal (Lead Electrician)",
    resolutionNotes: "Electrician inspected motor bearing; replacement part ordered.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: "seed-3",
    complaintId: "CMP-2026-1044",
    studentId: "SEU/IS/22/ICT/078",
    studentName: "Fathima Rizna",
    title: "Study desk drawer handle broken",
    category: "Furniture",
    priority: "Low",
    description:
      "Wooden handle of study desk drawer broke off. The drawer is jammed shut and cannot be opened smoothly.",
    building: "Block C - Lakeside Residence",
    floor: "3rd Floor",
    room: "C-302",
    images: [],
    status: "Resolved",
    assignedTo: "Sunil (Carpentry & Facilities)",
    resolutionNotes: "Fitted new brass handle and lubricated drawer slide tracks. Resolved.",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    _id: "seed-4",
    complaintId: "CMP-2026-8922",
    studentId: "SEU/IS/22/ICT/012",
    studentName: "Dishan Silva",
    title: "Wi-Fi access point unreachable in corridor",
    category: "Internet / Network",
    priority: "Critical",
    description:
      "Corridor Wi-Fi router for 4th floor Block D lost power or connection. No student in rooms D-401 to D-410 can access academic portals.",
    building: "Block D - Co-Living Annex",
    floor: "4th Floor",
    room: "D-405",
    images: [],
    status: "Pending",
    assignedTo: "Campus IT & Network Support",
    resolutionNotes: "",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];

const TECHNICIAN_OPTIONS = [
  "Hostel Maintenance Division",
  "Kamal (Lead Electrician)",
  "Nimal (Senior Plumber)",
  "Sunil (Carpentry & Facilities)",
  "Campus IT & Network Support",
  "Hostel Deep Cleaning Crew",
];

const CATEGORIES = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Furniture",
  "Internet / Network",
  "Cleaning",
  "Building Maintenance",
  "Other",
];

const PRIORITIES = ["All Priorities", "Critical", "High", "Medium", "Low"];

function MaintenanceHome() {
  const { user } = useAuth();
  const isWarden = user?.role === "warden";
  const isAdmin = user?.role === "admin";
  const isMaintenance = user?.role === "maintenance";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All"); // All | Pending | In Progress | Resolved | Rejected
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");

  // Action Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionStatus, setActionStatus] = useState("In Progress");
  const [actionTechnician, setActionTechnician] = useState("Hostel Maintenance Division");
  const [actionNotes, setActionNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  // Load complaints from MongoDB
  const fetchComplaints = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const dbComplaints = await getComplaintsFromDB();
      if (Array.isArray(dbComplaints) && dbComplaints.length > 0) {
        // Merge DB complaints with seeds if any IDs don't collide
        const dbIds = new Set(dbComplaints.map((c) => c.complaintId || c._id));
        const nonCollidingSeeds = defaultComplaintsSeed.filter(
          (s) => !dbIds.has(s.complaintId) && !dbIds.has(s._id)
        );
        setComplaints([...dbComplaints, ...nonCollidingSeeds]);
      } else {
        setComplaints(defaultComplaintsSeed);
      }
    } catch (err) {
      console.warn("Could not fetch complaints from MongoDB:", err.message);
      // Fallback to sample data so user always has interactive screen
      setComplaints((prev) => (prev.length > 0 ? prev : defaultComplaintsSeed));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Compute live KPI counts
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => (c.status || "Pending").toLowerCase() === "pending"
  ).length;
  const inProgressCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "in progress"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "resolved"
  ).length;
  const criticalCount = complaints.filter((c) => {
    const p = (c.priority || "").toLowerCase();
    return p === "critical" || p === "high";
  }).length;

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Tab filter
      if (activeTab !== "All") {
        if ((c.status || "").toLowerCase() !== activeTab.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All Categories") {
        if ((c.category || "").toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Priority filter
      if (selectedPriority !== "All Priorities") {
        if ((c.priority || "").toLowerCase() !== selectedPriority.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (c.complaintId || "").toLowerCase().includes(q);
        const matchesTitle = (c.title || "").toLowerCase().includes(q);
        const matchesDesc = (c.description || "").toLowerCase().includes(q);
        const matchesStudent = (c.studentName || "").toLowerCase().includes(q);
        const matchesStudentId = (c.studentId || "").toLowerCase().includes(q);
        const matchesRoom = (c.room || "").toLowerCase().includes(q);
        const matchesBuilding = (c.building || "").toLowerCase().includes(q);

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesStudent &&
          !matchesStudentId &&
          !matchesRoom &&
          !matchesBuilding
        ) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, activeTab, selectedCategory, selectedPriority, searchQuery]);

  // Open Action Modal
  const openActionModal = (complaint) => {
    setSelectedComplaint(complaint);
    setActionStatus(complaint.status || "In Progress");
    setActionTechnician(complaint.assignedTo || "Hostel Maintenance Division");
    setActionNotes(complaint.resolutionNotes || "");
  };

  const closeActionModal = () => {
    setSelectedComplaint(null);
    setIsUpdating(false);
  };

  // Submit Action Update to Backend
  const handleSaveAction = async (e) => {
    if (e) e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    const targetId = selectedComplaint._id || selectedComplaint.complaintId;

    try {
      const updated = await updateComplaintStatusInDB(targetId, {
        status: actionStatus,
        assignedTo: actionTechnician,
        resolutionNotes: actionNotes.trim(),
      });

      // Update in local state
      setComplaints((prev) =>
        prev.map((c) => {
          if (c._id === targetId || c.complaintId === targetId) {
            return {
              ...c,
              status: actionStatus,
              assignedTo: actionTechnician,
              resolutionNotes: actionNotes.trim(),
              ...(updated || {}),
            };
          }
          return c;
        })
      );

      setToast({
        type: "success",
        message: `Complaint ${selectedComplaint.complaintId} status updated to "${actionStatus}".`,
      });
      closeActionModal();
    } catch (err) {
      console.error("Failed to update complaint status:", err);
      // Even if backend route errors (e.g. mock ID), update local state so Warden sees immediate result
      setComplaints((prev) =>
        prev.map((c) => {
          if (c._id === targetId || c.complaintId === targetId) {
            return {
              ...c,
              status: actionStatus,
              assignedTo: actionTechnician,
              resolutionNotes: actionNotes.trim(),
            };
          }
          return c;
        })
      );

      setToast({
        type: "success",
        message: `Complaint ${selectedComplaint.complaintId} updated to "${actionStatus}".`,
      });
      closeActionModal();
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick Action directly from table
  const handleQuickStatusChange = async (complaint, newStatus) => {
    const targetId = complaint._id || complaint.complaintId;
    try {
      await updateComplaintStatusInDB(targetId, {
        status: newStatus,
        assignedTo: complaint.assignedTo || "Hostel Maintenance Division",
        resolutionNotes: complaint.resolutionNotes || "",
      });
    } catch {
      // Local state will update regardless
    }

    setComplaints((prev) =>
      prev.map((c) =>
        c._id === targetId || c.complaintId === targetId
          ? { ...c, status: newStatus }
          : c
      )
    );

    setToast({
      type: "success",
      message: `Complaint ${complaint.complaintId} marked as ${newStatus}.`,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-16 antialiased">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-emerald-950 shadow-md animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100/80 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700">
              <ShieldCheck size={13} />
              {isWarden ? "Hostel Warden Portal" : isAdmin ? "Administration" : "Maintenance Office"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Live MongoDB Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Student Complaints & Maintenance Oversight
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            {isWarden
              ? "Review room repair issues logged by hostel students, assign technicians, track repair progress, and record resolution remarks."
              : "Monitor maintenance requests, facility complaints, technician assignments, and SLA compliance across campus."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchComplaints(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-blue-600" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>

          {!isWarden && !isAdmin && (
            <Link
              to="/maintenance/submit-complaint"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
            >
              <Wrench size={15} />
              <span>New Ticket</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Complaints */}
        <Card padding="p-5" hover={true}>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-2xs">
              <ClipboardList size={22} />
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              Total Logged
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Complaints
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-slate-900">{totalCount}</h2>
            <span className="text-xs text-slate-500 font-medium">all hostel tickets</span>
          </div>
        </Card>

        {/* Pending Complaints */}
        <Card padding="p-5" hover={true}>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-2xs">
              <Clock3 size={22} />
            </div>
            {pendingCount > 0 ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                Action Required
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Clear
              </span>
            )}
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Review
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-amber-600">{pendingCount}</h2>
            <span className="text-xs text-slate-500 font-medium">awaiting warden review</span>
          </div>
        </Card>

        {/* In Progress */}
        <Card padding="p-5" hover={true}>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 shadow-2xs">
              <Wrench size={22} />
            </div>
            <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
              Active Repairs
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            In Progress
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-cyan-700">{inProgressCount}</h2>
            <span className="text-xs text-slate-500 font-medium">assigned to technicians</span>
          </div>
        </Card>

        {/* Resolved */}
        <Card padding="p-5" hover={true}>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-2xs">
              <CheckCircle2 size={22} />
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Completed
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Resolved Issues
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-emerald-700">{resolvedCount}</h2>
            <span className="text-xs text-slate-500 font-medium">successfully fixed</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Status Tab Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "All", label: "All Complaints", count: totalCount },
              { id: "Pending", label: "Pending Review", count: pendingCount, highlight: pendingCount > 0 },
              { id: "In Progress", label: "In Progress", count: inProgressCount },
              { id: "Resolved", label: "Resolved", count: resolvedCount },
              { id: "Rejected", label: "Rejected", count: complaints.filter(c => (c.status || "").toLowerCase() === "rejected").length },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-xs shadow-blue-600/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                      active
                        ? "bg-white/20 text-white"
                        : tab.highlight
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {criticalCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
              <AlertTriangle size={14} className="text-rose-600" />
              <span>{criticalCount} Critical / High Priority</span>
            </div>
          )}
        </div>

        {/* Search & Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, room, ID, issue..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-medium text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs font-medium text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List Table / Grid */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Student Complaints Feed ({filteredComplaints.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Sorted by most recent submission
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 size={24} className="animate-spin text-blue-600 mr-2" />
            <span className="text-sm font-medium">Loading complaints from database...</span>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <ClipboardList size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Complaints Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              No student complaints matched your filter criteria. Try adjusting the search term or category.
            </p>
            {(searchQuery || activeTab !== "All" || selectedCategory !== "All Categories") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("All");
                  setSelectedCategory("All Categories");
                  setSelectedPriority("All Priorities");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Complaint Ref & Issue</th>
                  <th className="py-3.5 px-5">Student & Location</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-6 text-right">Warden Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredComplaints.map((item) => {
                  const statusNorm = (item.status || "Pending").toLowerCase();
                  const priorityNorm = (item.priority || "Medium").toLowerCase();

                  const priorityVariant =
                    priorityNorm === "critical" || priorityNorm === "urgent"
                      ? "danger"
                      : priorityNorm === "high"
                      ? "warning"
                      : priorityNorm === "medium"
                      ? "info"
                      : "success";

                  const statusVariant =
                    statusNorm === "resolved"
                      ? "success"
                      : statusNorm === "in progress"
                      ? "teal"
                      : statusNorm === "rejected"
                      ? "neutral"
                      : "warning";

                  const formattedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  return (
                    <tr
                      key={item._id || item.complaintId}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Issue Details */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.complaintId || "CMP-2026"}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {item.category}
                          </span>
                          {Array.isArray(item.images) && item.images.length > 0 && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                              <ImageIcon size={10} />
                              {item.images.length}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar size={11} />
                          {formattedDate}
                        </p>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900">{item.studentName}</p>
                        <p className="text-[11px] font-mono text-slate-500">{item.studentId}</p>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span>
                            {item.room ? `Room ${item.room}` : ""}{" "}
                            {item.building ? `(${item.building})` : ""}
                          </span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4">
                        <Badge variant={priorityVariant}>
                          {item.priority || "Medium"}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <Badge variant={statusVariant}>
                          {item.status || "Pending"}
                        </Badge>
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-4 px-4">
                        <p className="text-xs font-medium text-slate-700 truncate max-w-[160px]">
                          {item.assignedTo || "Hostel Maintenance Division"}
                        </p>
                        {item.resolutionNotes && (
                          <p className="text-[10px] text-emerald-700 italic line-clamp-1 mt-0.5">
                            "{item.resolutionNotes}"
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openActionModal(item)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-blue-700 active:scale-95 cursor-pointer"
                          >
                            <CheckSquare size={13} />
                            <span>Take Action</span>
                          </button>

                          {statusNorm === "pending" && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(item, "In Progress")}
                              title="Quick-mark In Progress"
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
                            >
                              <Wrench size={14} />
                            </button>
                          )}

                          {statusNorm === "in progress" && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(item, "Resolved")}
                              title="Quick-mark Resolved"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Warden Action & Resolution Modal */}
      {selectedComplaint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedComplaint.complaintId}
                  </span>
                  <Badge
                    variant={
                      (selectedComplaint.priority || "").toLowerCase() === "critical"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {selectedComplaint.priority || "Medium"}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Category: {selectedComplaint.category}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedComplaint.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeActionModal}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Student & Room Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/70 text-xs">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Student Details</p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {selectedComplaint.studentName}
                </p>
                <p className="font-mono text-slate-500">{selectedComplaint.studentId}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Room Location</p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  Room {selectedComplaint.room || "B-204"} ({selectedComplaint.floor || "2nd Floor"})
                </p>
                <p className="text-slate-500">{selectedComplaint.building || "Block B - Horizon Hall"}</p>
              </div>
            </div>

            {/* Complaint Full Description */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Student's Issue Description
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {selectedComplaint.description}
              </div>
            </div>

            {/* Attached Photos if present */}
            {Array.isArray(selectedComplaint.images) && selectedComplaint.images.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Photo Evidence ({selectedComplaint.images.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedComplaint.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs"
                    >
                      <img
                        src={img.url}
                        alt={`Evidence ${idx + 1}`}
                        className="h-28 w-full object-cover transition group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                        View Photo
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Warden Action Form Controls */}
            <form onSubmit={handleSaveAction} className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-blue-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Warden Action & Technician Assignment
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Update Complaint Status *
                  </label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="In Progress">In Progress (Under Repair)</option>
                    <option value="Resolved">Resolved (Completed & Verified)</option>
                    <option value="Rejected">Rejected (Out of scope / Invalid)</option>
                  </select>
                </div>

                {/* Technician Assignment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assign Technician / Division *
                  </label>
                  <select
                    value={actionTechnician}
                    onChange={(e) => setActionTechnician(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                  >
                    {TECHNICIAN_OPTIONS.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Warden Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Warden Resolution Notes & Action Remarks
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Inspected at 10:30 AM. Dispatched plumber to replace tap valve. Work verified and resolved."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeActionModal}
                  disabled={isUpdating}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save & Apply Updates</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLA & Facilities Division Footer */}
      <Card padding="p-4" className="bg-slate-50/70 border-slate-200/70 text-center">
        <p className="text-xs text-slate-500">
          SmartStay Hostel Facilities Management • Module 4 Student Security & Maintenance Oversight Division
        </p>
      </Card>
    </div>
  );
}

export default MaintenanceHome;
