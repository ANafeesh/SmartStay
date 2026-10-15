
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock3,
  Wrench,
  CheckCircle2,
  Users,
  PackageSearch,
  Star,
  ArrowRight,
  Search,
  Eye,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  CalendarDays,
  Activity,
} from "lucide-react";

// DEMO DATA - Replace with backend API data later
const initialComplaints = [
  {
    id: "CMP-001",
    title: "Water Leakage",
    student: "Student A",
    category: "Plumbing",
    location: "Block A - Room A203",
    priority: "High",
    status: "In Progress",
    date: "2026-10-08",
  },
  {
    id: "CMP-002",
    title: "Broken Ceiling Fan",
    student: "Student B",
    category: "Electrical",
    location: "Block B - Room B105",
    priority: "Medium",
    status: "Submitted",
    date: "2026-10-09",
  },
  {
    id: "CMP-003",
    title: "Damaged Door Lock",
    student: "Student C",
    category: "Carpentry",
    location: "Block A - Room A108",
    priority: "High",
    status: "Resolved",
    date: "2026-10-05",
  },
  {
    id: "CMP-004",
    title: "Wi-Fi Connection Issue",
    student: "Student D",
    category: "Network",
    location: "Block C - Room C201",
    priority: "Medium",
    status: "Assigned",
    date: "2026-10-07",
  },
  {
    id: "CMP-005",
    title: "Broken Window",
    student: "Student E",
    category: "Carpentry",
    location: "Block B - Room B110",
    priority: "Urgent",
    status: "Submitted",
    date: "2026-10-10",
  },
  {
    id: "CMP-006",
    title: "Bathroom Light Not Working",
    student: "Student F",
    category: "Electrical",
    location: "Block A - Room A205",
    priority: "Low",
    status: "Closed",
    date: "2026-10-04",
  },
];

const managementServices = [
  {
    title: "Manage Complaints",
    description: "Review, filter and prioritize student complaints.",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
    path: "/maintenance/admin/complaints",
  },
  {
    title: "Assign Maintenance Staff",
    description: "Allocate maintenance tasks to available staff.",
    icon: Users,
    color: "bg-purple-50 text-purple-600",
    path: "/maintenance/admin/assign-staff",
  },
  {
  title: "Manage Lost & Found",
  description: "Review item reports and verify ownership claims.",
  icon: PackageSearch,
  color: "bg-orange-50 text-orange-600",
  path: "/maintenance/admin/lost-and-found",
},
  {
  title: "Resolution Feedback",
  description: "Review student feedback and service ratings.",
  icon: Star,
  color: "bg-green-50 text-green-600",
  path: "/maintenance/admin/feedback",
},
];

const statusColors = {
  Submitted: "bg-amber-50 text-amber-700",
  Assigned: "bg-indigo-50 text-indigo-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Resolved: "bg-green-50 text-green-700",
  Closed: "bg-slate-100 text-slate-600",
};

const priorityColors = {
  Low: "bg-green-50 text-green-700",
  Medium: "bg-yellow-50 text-yellow-700",
  High: "bg-orange-50 text-orange-700",
  Urgent: "bg-red-50 text-red-700",
};

function AdminMaintenanceDashboard() {
  const [complaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(
        (item) =>
          item.status === "Submitted" ||
          item.status === "Assigned"
      ).length,
      inProgress: complaints.filter(
        (item) => item.status === "In Progress"
      ).length,
      resolved: complaints.filter(
        (item) =>
          item.status === "Resolved" ||
          item.status === "Closed"
      ).length,
      urgent: complaints.filter(
        (item) =>
          item.priority === "Urgent" &&
          item.status !== "Resolved" &&
          item.status !== "Closed"
      ).length,
    };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return complaints.filter((item) =>
      [
        item.id,
        item.title,
        item.student,
        item.category,
        item.location,
        item.status,
      ].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    );
  }, [complaints, search]);

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Wrench,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Resolved / Closed",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <ShieldCheck size={18} />
            Maintenance Administration
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Admin Maintenance Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor complaints, maintenance activities and student
            services from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <Activity size={18} className="text-green-600" />
          Demo Overview
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={23} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* URGENT ALERT */}
      {stats.urgent > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={22}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <h3 className="font-bold text-red-800">
                Urgent Complaints Require Attention
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {stats.urgent} urgent complaint(s) are awaiting
                resolution.
              </p>
            </div>
          </div>

          <Link
            to="/maintenance/admin/complaints"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Review Complaints
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/maintenance/admin/escalated-complaints"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
          >
            <AlertTriangle size={18} />
              View Escalated Complaints
          </Link>
        </div>
      )}

      
{/* MANAGEMENT SERVICES */}
<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="mb-5">
    <h2 className="text-lg font-bold text-slate-900">
      Management Services
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Select a service to manage maintenance operations.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {managementServices.map((service) => {
      const Icon = service.icon;

      return (
        <Link
          key={service.title}
          to={service.path}
          className="group flex items-start gap-4 rounded-xl border border-slate-200 p-5 transition duration-200 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md"
        >
          {/* SERVICE ICON */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${service.color}`}
          >
            <Icon size={23} />
          </div>

          {/* SERVICE DETAILS */}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900">
              {service.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {service.description}
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
              Open Service
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </div>
        </Link>
      );
    })}
  </div>
</section>


      {/* RECENT COMPLAINTS */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Complaints
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest maintenance requests submitted by students.
            </p>
          </div>

          <Link
            to="/maintenance/admin/complaints"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            View All Complaints
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* COMPLAINT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Complaint</th>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {complaint.title}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <ClipboardList size={13} />
                        {complaint.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {complaint.student}
                    </td>

                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin size={15} />
                        {complaint.location}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays size={13} />
                        {complaint.date}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityColors[complaint.priority] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColors[complaint.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to={`/maintenance/admin/complaints/${complaint.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={15} />
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No matching complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* BOTTOM QUICK LINKS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          to="/maintenance/admin/assign-staff"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <Users size={22} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Staff Assignment
              </h3>
              <p className="text-sm text-slate-500">
                Allocate pending tasks
              </p>
            </div>
          </div>

          <ArrowRight size={18} className="text-slate-400" />
        </Link>

        <Link
          to="/maintenance/admin/feedback"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <Star size={22} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Student Feedback
              </h3>
              <p className="text-sm text-slate-500">
                Review service satisfaction
              </p>
            </div>
          </div>

          <ArrowRight size={18} className="text-slate-400" />
        </Link>
      </div>

      <p className="text-center text-xs text-slate-400">
        Demo dashboard — complaint statistics and records are
        sample data. Backend integration is required for live
        updates.
      </p>
    </div>
  );
}

export default AdminMaintenanceDashboard;
