
import {
  Building2,
  DoorOpen,
  BedDouble,
  Users,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const buildingStats = [
  {
    label: "Total Buildings",
    value: "04",
    icon: Building2,
  },
  {
    label: "Total Rooms",
    value: "128",
    icon: DoorOpen,
  },
  {
    label: "Total Beds",
    value: "512",
    icon: BedDouble,
  },
  {
    label: "Occupied Beds",
    value: "438",
    icon: Users,
  },
];

const buildings = [
  {
    id: 1,
    name: "A Block",
    code: "A",
    floors: 3,
    rooms: 42,
    beds: 168,
    occupied: 151,
    status: "Active",
  },
  {
    id: 2,
    name: "B Block",
    code: "B",
    floors: 4,
    rooms: 48,
    beds: 192,
    occupied: 165,
    status: "Active",
  },
  {
    id: 3,
    name: "C Block",
    code: "C",
    floors: 3,
    rooms: 38,
    beds: 152,
    occupied: 122,
    status: "Active",
  },
  {
    id: 4,
    name: "D Block",
    code: "D",
    floors: 2,
    rooms: 24,
    beds: 96,
    occupied: 0,
    status: "Maintenance",
  },
];

function Buildings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-smart-secondary">
            Hostel Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-smart-primary">
            Buildings
          </h1>

          <p className="mt-1 text-sm text-smart-secondary">
            Manage hostel buildings, floors, rooms and bed capacity.
          </p>
        </div>

        <Button variant="primary" size="md">
          <Plus size={18} />
          Add Building
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildingStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} padding="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-smart-secondary">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-smart-primary">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Buildings List */}
      <Card padding="p-0">
        <div className="flex flex-col gap-3 border-b border-black/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-smart-primary">
              Hostel Buildings
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Overview of all registered hostel buildings.
            </p>
          </div>

          <span className="text-sm font-medium text-smart-secondary">
            {buildings.length} buildings
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Building
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Floors
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Rooms
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Beds
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Occupancy
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {buildings.map((building) => {
                const occupancy =
                  building.beds === 0
                    ? 0
                    : Math.round(
                        (building.occupied / building.beds) * 100
                      );

                return (
                  <tr
                    key={building.id}
                    className="border-b border-black/5 last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
                          <Building2 size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-smart-primary">
                            {building.name}
                          </p>

                          <p className="text-xs text-smart-secondary">
                            Building {building.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-smart-secondary">
                      {building.floors}
                    </td>

                    <td className="px-6 py-5 text-sm text-smart-secondary">
                      {building.rooms}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-smart-primary">
                        {building.occupied} / {building.beds}
                      </p>

                      <p className="text-xs text-smart-secondary">
                        {building.beds - building.occupied} available
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-black/5">
                          <div
                            className="h-full rounded-full bg-smart-blue"
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>

                        <span className="text-sm font-medium text-smart-primary">
                          {occupancy}%
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {building.status === "Active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Maintenance</Badge>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-sm font-medium text-smart-blue transition hover:underline"
                      >
                        View
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 p-4 md:hidden">
          {buildings.map((building) => {
            const occupancy =
              building.beds === 0
                ? 0
                : Math.round(
                    (building.occupied / building.beds) * 100
                  );

            return (
              <div
                key={building.id}
                className="rounded-xl border border-black/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-smart-primary">
                        {building.name}
                      </p>

                      <p className="text-xs text-smart-secondary">
                        Building {building.code}
                      </p>
                    </div>
                  </div>

                  {building.status === "Active" ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="warning">Maintenance</Badge>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-smart-secondary">Floors</p>
                    <p className="mt-1 font-semibold text-smart-primary">
                      {building.floors}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-smart-secondary">Rooms</p>
                    <p className="mt-1 font-semibold text-smart-primary">
                      {building.rooms}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-smart-secondary">Beds</p>
                    <p className="mt-1 font-semibold text-smart-primary">
                      {building.beds}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-smart-secondary">
                      Occupancy
                    </span>

                    <span className="font-medium text-smart-primary">
                      {building.occupied} / {building.beds} ({occupancy}%)
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
                    <div
                      className="h-full rounded-full bg-smart-blue"
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-smart-blue"
                >
                  View details
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default Buildings;
