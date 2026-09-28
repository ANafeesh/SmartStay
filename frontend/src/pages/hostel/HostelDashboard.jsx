import {
  Building2,
  DoorOpen,
  BedDouble,
  Users,
  ArrowUpRight,
  ArrowRightLeft,
  Wrench,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const stats = [
  {
    title: "Total Buildings",
    value: "04",
    description: "Active hostel buildings",
    icon: Building2,
    color: "text-smart-blue",
    bg: "bg-smart-blue/10",
  },
  {
    title: "Total Rooms",
    value: "128",
    description: "Across all buildings",
    icon: DoorOpen,
    color: "text-smart-teal",
    bg: "bg-smart-teal/10",
  },
  {
    title: "Total Beds",
    value: "512",
    description: "Registered hostel beds",
    icon: BedDouble,
    color: "text-smart-primary",
    bg: "bg-smart-primary/10",
  },
  {
    title: "Occupied Beds",
    value: "438",
    description: "85.5% occupancy",
    icon: Users,
    color: "text-smart-warning",
    bg: "bg-smart-warning/10",
  },
];

const recentTransfers = [
  {
    student: "K. Arjun",
    from: "B-204 / Bed 02",
    to: "C-105 / Bed 01",
    status: "Pending",
  },
  {
    student: "M. Fathima",
    from: "A-302 / Bed 03",
    to: "A-205 / Bed 02",
    status: "Approved",
  },
  {
    student: "S. Niroshan",
    from: "C-110 / Bed 01",
    to: "B-210 / Bed 04",
    status: "Pending",
  },
];

const maintenanceItems = [
  {
    room: "A-105",
    issue: "Bed frame repair",
    status: "Maintenance",
  },
  {
    room: "B-204",
    issue: "Room electrical repair",
    status: "Maintenance",
  },
  {
    room: "C-302",
    issue: "Bathroom maintenance",
    status: "Maintenance",
  },
];

function HostelDashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-smart-primary">
          Hostel Management
        </h1>

        <p className="mt-2 text-smart-secondary">
          Monitor hostel rooms, beds, allocations, and occupancy.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} padding="p-5">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
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
        {/* Recent Transfers */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Recent Transfer Requests
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Latest student room transfer requests
              </p>
            </div>

            <ArrowRightLeft
              size={22}
              className="text-smart-blue"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Student
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Current Bed
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Requested Bed
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentTransfers.map((transfer) => (
                  <tr
                    key={`${transfer.student}-${transfer.from}`}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="py-4 font-semibold text-smart-primary">
                      {transfer.student}
                    </td>

                    <td className="py-4 text-sm text-smart-secondary">
                      {transfer.from}
                    </td>

                    <td className="py-4 text-sm text-smart-secondary">
                      {transfer.to}
                    </td>

                    <td className="py-4">
                      <Badge
                        variant={
                          transfer.status === "Approved"
                            ? "success"
                            : "warning"
                        }
                      >
                        {transfer.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Occupancy Summary */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Occupancy
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Current bed availability
              </p>
            </div>

            <BedDouble
              size={22}
              className="text-smart-teal"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-smart-primary">
                  85.5%
                </p>

                <p className="mt-1 text-sm text-smart-secondary">
                  Overall occupancy
                </p>
              </div>

              <p className="text-sm font-semibold text-smart-success">
                74 available
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-smart-background">
              <div
                className="h-full rounded-full bg-smart-blue"
                style={{ width: "85.5%" }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-smart-success/10 p-4">
                <p className="text-xs text-smart-secondary">
                  Available
                </p>

                <p className="mt-1 text-xl font-bold text-smart-success">
                  74
                </p>
              </div>

              <div className="rounded-xl bg-smart-warning/10 p-4">
                <p className="text-xs text-smart-secondary">
                  Occupied
                </p>

                <p className="mt-1 text-xl font-bold text-smart-warning">
                  438
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              Maintenance
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Rooms and beds currently unavailable
            </p>
          </div>

          <Wrench
            size={22}
            className="text-smart-danger"
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {maintenanceItems.map((item) => (
            <div
              key={item.room}
              className="rounded-xl border border-black/5 bg-smart-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-smart-primary">
                    Room {item.room}
                  </p>

                  <p className="mt-1 text-sm text-smart-secondary">
                    {item.issue}
                  </p>
                </div>

                <Badge variant="danger">{item.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default HostelDashboard;