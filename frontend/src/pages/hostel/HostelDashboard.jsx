
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  DoorOpen,
  BedDouble,
  Users,
  ArrowUpRight,
  ArrowRightLeft,
  Wrench,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import { API_BASE_URL } from "../../services/apiClient";

const API_URL = API_BASE_URL;

const statStyles = [
  {
    title: "Total Buildings",
    description: "Active hostel buildings",
    icon: Building2,
    color: "text-smart-blue",
    bg: "bg-smart-blue/10",
  },
  {
    title: "Total Rooms",
    description: "Across all buildings",
    icon: DoorOpen,
    color: "text-smart-teal",
    bg: "bg-smart-teal/10",
  },
  {
    title: "Total Beds",
    description: "Registered hostel beds",
    icon: BedDouble,
    color: "text-smart-primary",
    bg: "bg-smart-primary/10",
  },
  {
    title: "Occupied Beds",
    description: "Currently occupied beds",
    icon: Users,
    color: "text-smart-warning",
    bg: "bg-smart-warning/10",
  },
];

function getList(result, key) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.[key])) return result[key];
  if (Array.isArray(result?.data?.[key])) return result.data[key];
  return [];
}

function getId(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }
  return String(value);
}

function getBedCategory(bed) {
  const status = String(bed?.status ?? "").toLowerCase().trim();

  if (
    ["occupied", "allocated", "active"].includes(status)
  ) {
    return "occupied";
  }

  if (
    [
      "maintenance",
      "under maintenance",
      "under_maintenance",
    ].includes(status) ||
    bed?.isActive === false
  ) {
    return "maintenance";
  }

  return "available";
}

function getRoomLabel(room) {
  if (!room) return "Unknown room";
  return String(room.roomNumber ?? room.name ?? room._id ?? "Unknown room");
}

function getBedLabel(bed, rooms) {
  if (!bed) return "Unknown bed";

  const roomId = getId(bed.roomId);
  const room = rooms.find((item) => getId(item) === roomId);
  const roomNumber = room ? getRoomLabel(room) : "";

  const bedNumber = bed.bedNumber ?? bed.name ?? bed._id ?? "Unknown bed";

  return roomNumber
    ? `${roomNumber} / Bed ${bedNumber}`
    : `Bed ${bedNumber}`;
}

function getStudentLabel(transfer) {
  const student =
    transfer.studentId ??
    transfer.student ??
    transfer.studentName ??
    transfer.registrationNumber;

  if (typeof student === "string") return student;

  if (student && typeof student === "object") {
    return (
      student.name ??
      student.fullName ??
      student.registrationNumber ??
      student.regNo ??
      student._id ??
      "Student"
    );
  }

  return "Student";
}

function getTransferStatus(transfer) {
  const status = String(transfer.status ?? "Unknown");
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getTransferVariant(status) {
  const normalized = String(status).toLowerCase();

  if (normalized === "approved" || normalized === "completed") {
    return "success";
  }

  if (normalized === "rejected" || normalized === "cancelled") {
    return "danger";
  }

  return "warning";
}

function getTransferBeds(transfer, rooms) {
  const from =
    transfer.fromBedId ??
    transfer.fromBed ??
    transfer.currentBed ??
    transfer.sourceBed;

  const to =
    transfer.toBedId ??
    transfer.toBed ??
    transfer.requestedBed ??
    transfer.destinationBed;

  return {
    from: getBedLabel(
      typeof from === "object" ? from : from ? { _id: from } : null,
      rooms
    ),
    to: getBedLabel(
      typeof to === "object" ? to : to ? { _id: to } : null,
      rooms
    ),
  };
}

function HostelDashboard() {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const endpoints = [
        `${API_URL}/buildings`,
        `${API_URL}/rooms`,
        `${API_URL}/beds`,
        `${API_URL}/transfers`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) => fetch(url))
      );

      const failedResponse = responses.find((response) => !response.ok);

      if (failedResponse) {
        throw new Error(
          `API request failed (${failedResponse.status}). Check that your backend is running.`
        );
      }

      const [buildingResult, roomResult, bedResult, transferResult] =
        await Promise.all(responses.map((response) => response.json()));

      setBuildings(getList(buildingResult, "buildings"));
      setRooms(getList(roomResult, "rooms"));
      setBeds(getList(bedResult, "beds"));
      setTransfers(getList(transferResult, "transfers"));
    } catch (err) {
      setError(
        err.message ||
          "Unable to load dashboard data. Check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const activeBuildings = useMemo(
    () => buildings.filter((building) => building.isActive !== false),
    [buildings]
  );

  const bedCounts = useMemo(() => {
    return beds.reduce(
      (counts, bed) => {
        counts[getBedCategory(bed)] += 1;
        return counts;
      },
      { occupied: 0, available: 0, maintenance: 0 }
    );
  }, [beds]);

  const occupancy = beds.length
    ? Math.round((bedCounts.occupied / beds.length) * 1000) / 10
    : 0;

  const maintenanceItems = useMemo(() => {
    return beds
      .filter((bed) => getBedCategory(bed) === "maintenance")
      .map((bed) => {
        const roomId = getId(bed.roomId);
        const room = rooms.find((item) => getId(item) === roomId);
        const buildingId = getId(room?.buildingId);
        const building = buildings.find(
          (item) => getId(item) === buildingId
        );

        return {
          id: getId(bed),
          room: getRoomLabel(room),
          bed: bed.bedNumber ?? "—",
          building: building?.name ?? "",
          issue: bed.maintenanceReason ?? bed.issue ?? bed.notes ?? "",
        };
      });
  }, [beds, rooms, buildings]);

  const recentTransfers = useMemo(
    () => [...transfers].slice(-5).reverse(),
    [transfers]
  );

  const stats = [
    {
      ...statStyles[0],
      value: String(activeBuildings.length).padStart(2, "0"),
      description: "Active hostel buildings",
    },
    {
      ...statStyles[1],
      value: String(rooms.length),
      description: "Registered hostel rooms",
    },
    {
      ...statStyles[2],
      value: String(beds.length),
      description: "Registered hostel beds",
    },
    {
      ...statStyles[3],
      value: String(bedCounts.occupied),
      description: `${occupancy}% occupancy`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">
            Hostel Management
          </h1>
          <p className="mt-2 text-smart-secondary">
            Monitor hostel rooms, beds, allocations, and occupancy.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-smart-primary hover:bg-smart-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            onClick={fetchDashboardData}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

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
                <ArrowUpRight size={18} className="text-smart-secondary" />
              </div>

              <p className="mt-5 text-sm text-smart-secondary">
                {stat.title}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-smart-primary">
                {loading ? "—" : stat.value}
              </h2>
              <p className="mt-1 text-xs text-smart-secondary">
                {loading ? "Loading data..." : stat.description}
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
            <ArrowRightLeft size={22} className="text-smart-blue" />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  {["Student", "Current Bed", "Requested Bed", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {!loading && recentTransfers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-smart-secondary"
                    >
                      No transfer requests found.
                    </td>
                  </tr>
                )}

                {recentTransfers.map((transfer, index) => {
                  const status = getTransferStatus(transfer);
                  const bedLabels = getTransferBeds(transfer, rooms);

                  return (
                    <tr
                      key={transfer._id ?? transfer.id ?? index}
                      className="border-b border-black/5 last:border-0"
                    >
                      <td className="py-4 font-semibold text-smart-primary">
                        {getStudentLabel(transfer)}
                      </td>
                      <td className="py-4 text-sm text-smart-secondary">
                        {bedLabels.from}
                      </td>
                      <td className="py-4 text-sm text-smart-secondary">
                        {bedLabels.to}
                      </td>
                      <td className="py-4">
                        <Badge variant={getTransferVariant(status)}>
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
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
            <BedDouble size={22} className="text-smart-teal" />
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-3xl font-bold text-smart-primary">
                  {loading ? "—" : `${occupancy}%`}
                </p>
                <p className="mt-1 text-sm text-smart-secondary">
                  Overall occupancy
                </p>
              </div>
              <p className="text-sm font-semibold text-smart-success">
                {loading ? "—" : `${bedCounts.available} available`}
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-smart-background">
              <div
                className="h-full rounded-full bg-smart-blue transition-all"
                style={{ width: `${loading ? 0 : occupancy}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-smart-success/10 p-4">
                <p className="text-xs text-smart-secondary">Available</p>
                <p className="mt-1 text-xl font-bold text-smart-success">
                  {loading ? "—" : bedCounts.available}
                </p>
              </div>
              <div className="rounded-xl bg-smart-warning/10 p-4">
                <p className="text-xs text-smart-secondary">Occupied</p>
                <p className="mt-1 text-xl font-bold text-smart-warning">
                  {loading ? "—" : bedCounts.occupied}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-smart-background p-4">
              <p className="text-xs text-smart-secondary">Under maintenance</p>
              <p className="mt-1 text-xl font-bold text-smart-primary">
                {loading ? "—" : bedCounts.maintenance}
              </p>
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
              Beds currently marked as under maintenance
            </p>
          </div>
          <Wrench size={22} className="text-smart-danger" />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {!loading && maintenanceItems.length === 0 && (
            <p className="text-sm text-smart-secondary">
              No beds are currently marked for maintenance.
            </p>
          )}

          {maintenanceItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-black/5 bg-smart-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-smart-primary">
                    Room {item.room}
                  </p>
                  {item.building && (
                    <p className="mt-1 text-xs text-smart-secondary">
                      {item.building}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-smart-secondary">
                    Bed {item.bed}
                  </p>
                  {item.issue && (
                    <p className="mt-1 text-sm text-smart-secondary">
                      {item.issue}
                    </p>
                  )}
                </div>
                <Badge variant="danger">Maintenance</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default HostelDashboard;
