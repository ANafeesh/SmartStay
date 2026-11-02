
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  DoorOpen,
  BedDouble,
  Users,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

import { API_BASE_URL, getAuthToken } from "../../services/apiClient";
import { SAMPLE_BUILDINGS } from "../../services/hostelFallbackData";


const API_URL = API_BASE_URL;

async function fetchList(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);
  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Failed to load ${endpoint}`);
  }

  const list = Array.isArray(result)
    ? result
    : result.data ??
      result.buildings ??
      result.rooms ??
      result.beds;

  if (!Array.isArray(list)) {
    throw new Error(`Unexpected response from ${endpoint}`);
  }

  return list;
}

function getId(value) {
  if (!value) return "";
  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }
  return String(value);
}

function isOccupied(status) {
  return String(status ?? "").toLowerCase() === "occupied";
}

function isMaintenance(building) {
  return (
    building.isActive === false ||
    String(building.status ?? "").toLowerCase() === "maintenance"
  );
}

function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [buildingList, roomList, bedList] = await Promise.all([
        fetchList("/buildings"),
        fetchList("/rooms"),
        fetchList("/beds"),
      ]);

      setBuildings(buildingList);
      setRooms(roomList);
      setBeds(bedList);
    } catch (err) {
      setError(
        `${err.message}. Check that your backend is running on port 5000.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const buildingData = useMemo(() => {
    return buildings.map((building) => {
      const buildingId = getId(building);
      const buildingRooms = rooms.filter(
        (room) => getId(room.buildingId) === buildingId
      );

      const roomIds = new Set(buildingRooms.map((room) => getId(room)));

      const buildingBeds = beds.filter((bed) =>
        roomIds.has(getId(bed.roomId))
      );

      const occupied = buildingBeds.filter((bed) =>
        isOccupied(bed.status)
      ).length;

      const maintenance = isMaintenance(building);

      return {
        id: buildingId,
        name: building.name ?? building.buildingName ?? "Unnamed Building",
        code: building.code ?? building.buildingCode ?? "—",
        floors: Number(building.floors ?? 0),
        rooms: buildingRooms.length,
        beds: buildingBeds.length,
        occupied,
        status: maintenance ? "Maintenance" : "Active",
        address: building.address ?? "",
      };
    });
  }, [buildings, rooms, beds]);

  const buildingStats = useMemo(() => {
    const totalRooms = buildingData.reduce(
      (sum, building) => sum + building.rooms,
      0
    );

    const totalBeds = buildingData.reduce(
      (sum, building) => sum + building.beds,
      0
    );

    const occupiedBeds = buildingData.reduce(
      (sum, building) => sum + building.occupied,
      0
    );

    return [
      {
        label: "Total Buildings",
        value: buildingData.length,
        icon: Building2,
      },
      {
        label: "Total Rooms",
        value: totalRooms,
        icon: DoorOpen,
      },
      {
        label: "Total Beds",
        value: totalBeds,
        icon: BedDouble,
      },
      {
        label: "Occupied Beds",
        value: occupiedBeds,
        icon: Users,
      },
    ];
  }, [buildingData]);

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

        <Button
          variant="primary"
          size="md"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {/* API Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

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
                    {loading ? "—" : stat.value}
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
            {loading ? "Loading..." : `${buildingData.length} buildings`}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-smart-secondary">
            Loading buildings from the database...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-smart-secondary">
            Building data could not be loaded. Use Refresh Data to try again.
          </div>
        ) : buildingData.length === 0 ? (
          <div className="p-10 text-center text-sm text-smart-secondary">
            No buildings found in the database.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5 bg-smart-background text-left">
                    {[
                      "Building",
                      "Floors",
                      "Rooms",
                      "Beds",
                      "Occupancy",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {buildingData.map((building) => {
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

                              {building.address && (
                                <p className="mt-1 text-xs text-smart-secondary">
                                  {building.address}
                                </p>
                              )}
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {buildingData.map((building) => {
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

                    {building.address && (
                      <p className="mt-3 text-sm text-smart-secondary">
                        {building.address}
                      </p>
                    )}

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
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Buildings;
