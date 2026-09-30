import {
  Building2,
  BedDouble,
  Users,
  DoorOpen,
  Wrench,
  Search,
  TrendingUp,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const buildings = [
  {
    id: 1,
    name: "A Block",
    code: "A",
    floors: 3,
    rooms: 42,
    beds: 168,
    occupied: 151,
    available: 13,
    maintenance: 4,
    percentage: 89.9,
    status: "High Occupancy",
  },
  {
    id: 2,
    name: "B Block",
    code: "B",
    floors: 4,
    rooms: 48,
    beds: 192,
    occupied: 165,
    available: 22,
    maintenance: 5,
    percentage: 85.9,
    status: "Normal",
  },
  {
    id: 3,
    name: "C Block",
    code: "C",
    floors: 3,
    rooms: 38,
    beds: 152,
    occupied: 122,
    available: 26,
    maintenance: 4,
    percentage: 80.3,
    status: "Normal",
  },
  {
    id: 4,
    name: "D Block",
    code: "D",
    floors: 2,
    rooms: 24,
    beds: 96,
    occupied: 0,
    available: 0,
    maintenance: 96,
    percentage: 0,
    status: "Maintenance",
  },
];

const rooms = [
  {
    id: 1,
    room: "A-101",
    building: "A Block",
    floor: "Floor 1",
    totalBeds: 4,
    occupiedBeds: 2,
    availableBeds: 2,
    maintenanceBeds: 0,
  },
  {
    id: 2,
    room: "A-102",
    building: "A Block",
    floor: "Floor 1",
    totalBeds: 4,
    occupiedBeds: 4,
    availableBeds: 0,
    maintenanceBeds: 0,
  },
  {
    id: 3,
    room: "B-201",
    building: "B Block",
    floor: "Floor 2",
    totalBeds: 4,
    occupiedBeds: 2,
    availableBeds: 2,
    maintenanceBeds: 0,
  },
  {
    id: 4,
    room: "B-204",
    building: "B Block",
    floor: "Floor 2",
    totalBeds: 4,
    occupiedBeds: 2,
    availableBeds: 1,
    maintenanceBeds: 1,
  },
  {
    id: 5,
    room: "C-105",
    building: "C Block",
    floor: "Floor 1",
    totalBeds: 4,
    occupiedBeds: 2,
    availableBeds: 2,
    maintenanceBeds: 0,
  },
  {
    id: 6,
    room: "D-101",
    building: "D Block",
    floor: "Floor 1",
    totalBeds: 4,
    occupiedBeds: 0,
    availableBeds: 0,
    maintenanceBeds: 4,
  },
];

function Occupancy() {
  const totalBeds = buildings.reduce((sum, building) => sum + building.beds, 0);
  const occupiedBeds = buildings.reduce(
    (sum, building) => sum + building.occupied,
    0
  );
  const availableBeds = buildings.reduce(
    (sum, building) => sum + building.available,
    0
  );
  const maintenanceBeds = buildings.reduce(
    (sum, building) => sum + building.maintenance,
    0
  );

  const occupancyPercentage =
    totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  const availablePercentage =
    totalBeds > 0 ? ((availableBeds / totalBeds) * 100).toFixed(1) : 0;

  const maintenancePercentage =
    totalBeds > 0 ? ((maintenanceBeds / totalBeds) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-smart-blue">
          Hostel Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
          Occupancy Overview
        </h1>

        <p className="mt-2 text-sm text-smart-secondary">
          Monitor hostel occupancy, available beds, and maintenance status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Total Beds</p>

              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {totalBeds}
              </h2>
            </div>

            <div className="rounded-xl bg-smart-blue/10 p-3 text-smart-blue">
              <BedDouble size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Occupied Beds</p>

              <h2 className="mt-2 text-3xl font-bold text-smart-success">
                {occupiedBeds}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                {occupancyPercentage}% occupancy
              </p>
            </div>

            <div className="rounded-xl bg-smart-success/10 p-3 text-smart-success">
              <Users size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Available Beds</p>

              <h2 className="mt-2 text-3xl font-bold text-smart-blue">
                {availableBeds}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                {availablePercentage}% available
              </p>
            </div>

            <div className="rounded-xl bg-smart-blue/10 p-3 text-smart-blue">
              <DoorOpen size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">
                Maintenance Beds
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-warning">
                {maintenanceBeds}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                {maintenancePercentage}% of total
              </p>
            </div>

            <div className="rounded-xl bg-smart-warning/10 p-3 text-smart-warning">
              <Wrench size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Occupancy */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-smart-primary">
              Overall Hostel Occupancy
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Current occupancy across all hostel buildings.
            </p>
          </div>

          <div className="flex items-center gap-2 text-smart-success">
            <TrendingUp size={20} />

            <span className="text-2xl font-bold">
              {occupancyPercentage}%
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-4 overflow-hidden rounded-full bg-smart-background">
            <div
              className="h-full rounded-full bg-smart-blue transition-all"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-smart-secondary">
            <span>
              {occupiedBeds} occupied
            </span>

            <span>
              {availableBeds} available
            </span>

            <span>
              {maintenanceBeds} maintenance
            </span>

            <span>
              {totalBeds} total beds
            </span>
          </div>
        </div>
      </Card>

      {/* Building Occupancy */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-smart-primary">
            Building-wise Occupancy
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            Compare occupancy levels across hostel buildings.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {buildings.map((building) => (
            <Card key={building.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-smart-blue/10 p-3 text-smart-blue">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-smart-primary">
                      {building.name}
                    </h3>

                    <p className="text-xs text-smart-secondary">
                      {building.floors} floors · {building.rooms} rooms
                    </p>
                  </div>
                </div>

                {building.status === "Maintenance" ? (
                  <Badge variant="warning">Maintenance</Badge>
                ) : building.status === "High Occupancy" ? (
                  <Badge variant="danger">High Occupancy</Badge>
                ) : (
                  <Badge variant="success">Normal</Badge>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-smart-secondary">
                    Occupancy
                  </p>

                  <p className="mt-1 text-2xl font-bold text-smart-primary">
                    {building.percentage}%
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p className="font-semibold text-smart-primary">
                    {building.occupied} / {building.beds}
                  </p>

                  <p className="text-xs text-smart-secondary">
                    occupied beds
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-smart-background">
                <div
                  className="h-full rounded-full bg-smart-blue transition-all"
                  style={{ width: `${building.percentage}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-smart-success/10 p-3 text-center">
                  <p className="text-lg font-bold text-smart-success">
                    {building.occupied}
                  </p>

                  <p className="text-xs text-smart-secondary">
                    Occupied
                  </p>
                </div>

                <div className="rounded-xl bg-smart-blue/10 p-3 text-center">
                  <p className="text-lg font-bold text-smart-blue">
                    {building.available}
                  </p>

                  <p className="text-xs text-smart-secondary">
                    Available
                  </p>
                </div>

                <div className="rounded-xl bg-smart-warning/10 p-3 text-center">
                  <p className="text-lg font-bold text-smart-warning">
                    {building.maintenance}
                  </p>

                  <p className="text-xs text-smart-secondary">
                    Maintenance
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Room Occupancy */}
      <Card padding="p-0">
        <div className="border-b border-black/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-smart-primary">
                Room Occupancy
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Room-level occupancy and bed availability.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
              />

              <input
                type="text"
                placeholder="Search room..."
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-smart-blue"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Room
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Building
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Total Beds
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Occupied
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Available
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Maintenance
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Occupancy
                </th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((room) => {
                const percentage =
                  room.totalBeds > 0
                    ? ((room.occupiedBeds / room.totalBeds) * 100).toFixed(0)
                    : 0;

                return (
                  <tr
                    key={room.id}
                    className="border-b border-black/5 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-smart-primary">
                        {room.room}
                      </p>

                      <p className="text-xs text-smart-secondary">
                        {room.floor}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-smart-secondary">
                      {room.building}
                    </td>

                    <td className="px-5 py-4 font-medium text-smart-primary">
                      {room.totalBeds}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-smart-success">
                        {room.occupiedBeds}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-smart-blue">
                        {room.availableBeds}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-smart-warning">
                        {room.maintenanceBeds}
                      </span>
                    </td>

                    <td className="min-w-44 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-smart-background">
                          <div
                            className="h-full rounded-full bg-smart-blue"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <span className="w-10 text-right text-sm font-semibold text-smart-primary">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 lg:hidden">
          {rooms.map((room) => {
            const percentage =
              room.totalBeds > 0
                ? ((room.occupiedBeds / room.totalBeds) * 100).toFixed(0)
                : 0;

            return (
              <div
                key={room.id}
                className="rounded-xl border border-black/5 bg-smart-background p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-smart-primary">
                      {room.room}
                    </p>

                    <p className="text-xs text-smart-secondary">
                      {room.building} · {room.floor}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-smart-blue">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-smart-blue"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="font-bold text-smart-success">
                      {room.occupiedBeds}
                    </p>

                    <p className="text-xs text-smart-secondary">
                      Occupied
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="font-bold text-smart-blue">
                      {room.availableBeds}
                    </p>

                    <p className="text-xs text-smart-secondary">
                      Available
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="font-bold text-smart-warning">
                      {room.maintenanceBeds}
                    </p>

                    <p className="text-xs text-smart-secondary">
                      Maintenance
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default Occupancy;