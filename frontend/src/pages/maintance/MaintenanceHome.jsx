
import { Link } from "react-router-dom";
import {
  Wrench,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  GraduationCap,
  HardHat,
  ShieldCheck,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

// Sample data for frontend development
const stats = [
  {
    title: "Total Complaints",
    value: "128",
    description: "All submitted complaints",
    icon: ClipboardList,
    color: "text-smart-blue",
    bg: "bg-smart-blue/10",
  },
  {
    title: "Pending Complaints",
    value: "24",
    description: "Waiting for action",
    icon: Clock3,
    color: "text-smart-warning",
    bg: "bg-smart-warning/10",
  },
  {
    title: "In Progress",
    value: "18",
    description: "Currently being handled",
    icon: Wrench,
    color: "text-smart-teal",
    bg: "bg-smart-teal/10",
  },
  {
    title: "Resolved Complaints",
    value: "86",
    description: "Successfully resolved",
    icon: CheckCircle2,
    color: "text-smart-success",
    bg: "bg-smart-success/10",
  },
];

const recentComplaints = [
  {
    id: "CMP-001",
    issue: "Water leakage in bathroom",
    room: "B-214",
    priority: "High",
    status: "Pending",
  },
  {
    id: "CMP-002",
    issue: "Wi-Fi connection problem",
    room: "A-105",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "CMP-003",
    issue: "Broken study chair",
    room: "C-302",
    priority: "Low",
    status: "Resolved",
  },
  {
    id: "CMP-004",
    issue: "Electrical socket damaged",
    room: "D-201",
    priority: "Urgent",
    status: "Assigned",
  },
];

const dashboards = [
  {
    title: "Student Dashboard",
    description: "Submit complaints, track status and report lost items.",
    icon: GraduationCap,
    path: "/maintenance/student",
    color: "text-smart-blue",
    bg: "bg-smart-blue/10",
  },
  {
    title: "Maintenance Staff",
    description: "Manage assigned tasks and update repair progress.",
    icon: HardHat,
    path: "/maintenance/staff",
    color: "text-smart-teal",
    bg: "bg-smart-teal/10",
  },
  {
    title: "Admin Dashboard",
    description: "Assign staff, manage priorities and monitor escalations.",
    icon: ShieldCheck,
    path: "/maintenance/admin",
    color: "text-smart-primary",
    bg: "bg-smart-primary/10",
  },
];

function MaintenanceHome() {
  return (
    <div className="mx-auto max-w-7xl">

      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">
            Maintenance & Complaints
          </h1>

          <p className="mt-2 text-smart-secondary">
            Monitor maintenance requests, complaint resolution,
            and student services.
          </p>
        </div>

        <Link
          to="/maintenance/submit-complaint"
          className="flex items-center gap-2 rounded-xl
                     bg-smart-blue px-5 py-3 font-semibold text-white
                     transition hover:opacity-90"
        >
          <Wrench size={18} />
          New Complaint
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} padding="p-5">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center
                              justify-center rounded-xl
                              ${stat.bg} ${stat.color}`}
                >
                  <Icon size={24} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-smart-secondary"
                />
              </div>

              <p className="mt-5 text-sm text-smart-secondary">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-smart-primary">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                {stat.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* Recent Complaints */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Recent Complaints
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Latest maintenance requests
              </p>
            </div>

            <ClipboardList
              size={22}
              className="text-smart-blue"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[580px]">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  {["Complaint", "Room", "Priority", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="pb-3 text-xs font-semibold
                                   uppercase tracking-wide
                                   text-smart-secondary"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {recentComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="py-4">
                      <p className="font-semibold text-smart-primary">
                        {complaint.issue}
                      </p>
                      <p className="text-xs text-smart-secondary">
                        {complaint.id}
                      </p>
                    </td>

                    <td className="py-4 text-sm text-smart-secondary">
                      {complaint.room}
                    </td>

                    <td className="py-4">
                      <Badge
                        variant={
                          complaint.priority === "Urgent" ||
                          complaint.priority === "High"
                            ? "danger"
                            : complaint.priority === "Medium"
                            ? "warning"
                            : "success"
                        }
                      >
                        {complaint.priority}
                      </Badge>
                    </td>

                    <td className="py-4">
                      <Badge
                        variant={
                          complaint.status === "Resolved"
                            ? "success"
                            : complaint.status === "In Progress"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {complaint.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Priority Summary */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Priority Overview
              </h2>
              <p className="mt-1 text-sm text-smart-secondary">
                Complaint urgency levels
              </p>
            </div>

            <AlertTriangle
              size={22}
              className="text-smart-warning"
            />
          </div>

          <div className="mt-6 space-y-5">
            {[
              { label: "Urgent", count: 8, color: "bg-smart-danger" },
              { label: "High", count: 20, color: "bg-smart-warning" },
              { label: "Medium", count: 45, color: "bg-smart-blue" },
              { label: "Low", count: 55, color: "bg-smart-success" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-smart-primary">
                    {item.label}
                  </span>
                  <span className="text-smart-secondary">
                    {item.count}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-smart-background">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${(item.count / 128) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Role Dashboards */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold text-smart-primary">
          Maintenance Services
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;

            return (
              <Link key={dashboard.title} to={dashboard.path}>
                <Card className="h-full transition hover:shadow-lg">
                  <div
                    className={`flex h-12 w-12 items-center
                                justify-center rounded-xl
                                ${dashboard.bg} ${dashboard.color}`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-smart-primary">
                    {dashboard.title}
                  </h3>

                  <p className="mt-2 text-sm text-smart-secondary">
                    {dashboard.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2
                                  font-semibold text-smart-blue">
                    Open Dashboard
                    <ArrowRight size={17} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SLA Monitoring */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              SLA Monitoring
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Complaints requiring attention within 48 hours
            </p>
          </div>

          <Clock3 size={22} className="text-smart-danger" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Within SLA", value: "102", color: "text-smart-success" },
            { title: "Approaching Deadline", value: "18", color: "text-smart-warning" },
            { title: "Escalated", value: "8", color: "text-smart-danger" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-black/5
                         bg-smart-background p-4"
            >
              <p className="text-sm text-smart-secondary">
                {item.title}
              </p>
              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-smart-secondary">
        Demo data for UI development. Live complaint data
        will be connected through the backend API.
      </p>
    </div>
  );
}

export default MaintenanceHome;
