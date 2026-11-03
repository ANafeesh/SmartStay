
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  BedDouble,
  Users,
  DoorOpen,
  Wrench,
  Search,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import { API_BASE_URL, getAuthToken } from "../../services/apiClient";
import { SAMPLE_BUILDINGS, SAMPLE_ROOMS, SAMPLE_BEDS } from "../../services/hostelFallbackData";

const API_URL = API_BASE_URL;

// Extract an array from the API response.
function getList(result, key) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.[key])) return result[key];

  if (Array.isArray(result?.data?.[key])) {
    return result.data[key];
  }

  return [];
}

// Handle IDs that may be strings or populated MongoDB references.
function getId(value) {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }

  return String(value);
}

function normalizeStatus(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getBedCategory(bed) {
  const status = normalizeStatus(bed.status);

  if (
    status === "occupied" ||
    status === "allocated" ||
    status === "active"
  ) {
    return "occupied";
  }

  if (
    status === "maintenance" ||
    status === "under maintenance" ||
    status === "under_maintenance" ||
    bed.isActive === false
  ) {
    return "maintenance";
  }

  // Available, vacant, and other non-occupied statuses
  // are counted as available for this overview.
  return "available";
}

function getBuildingName(building) {
  return (
    building.name ??
    building.buildingName ??
    building.code ??
    "Unnamed Building"
  );
}

function getRoomNumber(room) {
  return String(
    room.roomNumber ??
    room.roomName ??
    room.name ??
    "Unnamed Room"
  );
}

function calculateBedCounts(beds) {
  return beds.reduce(
    (counts, bed) => {
      const category = getBedCategory(bed);
      counts[category] += 1;
      return counts;
    },
    { occupied: 0, available: 0, maintenance: 0 }
  );
}

function getPercentage(numerator, denominator) {
  return denominator > 0
    ? Number(((numerator / denominator) * 100).toFixed(1))
    : 0;
}

function Occupancy() {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const endpoints = [
        `${API_URL}/buildings`,
        `${API_URL}/rooms`,
        `${API_URL}/beds`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) => fetch(url, { headers, credentials: "include" }).catch(() => null))
      );

      const [buildingResult, roomResult, bedResult] = await Promise.all(
        responses.map(async (res) => (res && res.ok ? await res.json() : null))
      );

      const buildingList = getList(buildingResult, "buildings");
      const roomList = getList(roomResult, "rooms");
      const bedList = getList(bedResult, "beds");

      setBuildings(buildingList.length ? buildingList : SAMPLE_BUILDINGS);
      setRooms(roomList.length ? roomList : SAMPLE_ROOMS);
      setBeds(bedList.length ? bedList : SAMPLE_BEDS);
    } catch (err) {
      console.error("Failed to load occupancy data:", err);
      setError(
        err.message ||
          "Unable to load occupancy data. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Match each bed to its room and each room to its building.
  const buildingData = useMemo(() => {
    return buildings.map((building) => {
      const buildingId = getId(building._id ?? building.id);

      const buildingRooms = rooms.filter(
        (room) => getId(room.buildingId) === buildingId
      );

      const roomIds = new Set(
        buildingRooms.map((room) => getId(room._id ?? room.id))
      );

      const buildingBeds = beds.filter((bed) =>
        roomIds.has(getId(bed.roomId))
      );

      const counts = calculateBedCounts(buildingBeds);
      const percentage = getPercentage(
        counts.occupied,
        buildingBeds.length
      );

      let status = "Normal";

      if (
        buildingBeds.length > 0 &&
        counts.maintenance === buildingBeds.length
      ) {
        status = "Maintenance";
      } else if (percentage >= 85) {
        status = "High Occupancy";
      }

      if (building.isActive === false) {
        status = "Maintenance";
      }

      return {
        id: buildingId,
        name: getBuildingName(building),
        code: building.code ?? "",
        floors: Number(building.floors ?? 0),
        rooms: buildingRooms.length,
        beds: buildingBeds.length,
        ...counts,
        percentage,
        status,
      };
    });
  }, [buildings, rooms, beds]);

  // Calculate room-level occupancy.
  const roomData = useMemo(() => {
    return rooms.map((room) => {
      const roomId = getId(room._id ?? room.id);

      const roomBeds = beds.filter(
        (bed) => getId(bed.roomId) === roomId
      );

      const buildingId = getId(room.buildingId);

      const building = buildings.find(
        (item) => getId(item._id ?? item.id) === buildingId
      );

      const counts = calculateBedCounts(roomBeds);

      return {
        id: roomId,
        room: getRoomNumber(room),
        building: building
          ? getBuildingName(building)
          : "Unknown Building",
        floor: `Floor ${room.floor ?? 0}`,
        totalBeds: roomBeds.length,
        ...counts,
        percentage: getPercentage(
          counts.occupied,
          roomBeds.length
        ),
      };
    });
  }, [rooms, beds, buildings]);

  // Calculate hostel-wide totals directly from the beds collection.
  const totals = useMemo(() => {
    const counts = calculateBedCounts(beds);

    return {
      buildings: buildings.length,
      rooms: rooms.length,
      totalBeds: beds.length,
      ...counts,
      occupancyPercentage: getPercentage(
        counts.occupied,
        beds.length
      ),
      availablePercentage: getPercentage(
        counts.available,
        beds.length
      ),
      maintenancePercentage: getPercentage(
        counts.maintenance,
        beds.length
      ),
    };
  }, [buildings, rooms, beds]);

  // Search by room number, building, or floor.
  const filteredRooms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return roomData;

    return roomData.filter(
      (room) =>
        room.room.toLowerCase().includes(query) ||
        room.building.toLowerCase().includes(query) ||
        room.floor.toLowerCase().includes(query)
    );
  }, [roomData, searchTerm]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-smart-secondary">
          <RefreshCw size={20} className="animate-spin" />
          <p>Loading occupancy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-smart-blue">
            Hostel Management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
            Occupancy Overview
          </h1>
        </div>

        <Card>
          <div className="space-y-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-xl bg-smart-blue px-4 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-smart-primary hover:bg-smart-background disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Total Beds</p>
              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {totals.totalBeds}
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
                {totals.occupied}
              </h2>
              <p className="mt-1 text-xs text-smart-secondary">
                {totals.occupancyPercentage}% occupancy
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
                {totals.available}
              </h2>
              <p className="mt-1 text-xs text-smart-secondary">
                {totals.availablePercentage}% available
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
              <p className="text-sm text-smart-secondary">Maintenance Beds</p>
              <h2 className="mt-2 text-3xl font-bold text-smart-warning">
                {totals.maintenance}
              </h2>
              <p className="mt-1 text-xs text-smart-secondary">
                {totals.maintenancePercentage}% of total
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
              {totals.occupancyPercentage}%
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-4 overflow-hidden rounded-full bg-smart-background">
            <div
              className="h-full rounded-full bg-smart-blue transition-all"
              style={{ width: `${totals.occupancyPercentage}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-smart-secondary">
            <span>{totals.occupied} occupied</span>
            <span>{totals.available} available</span>
            <span>{totals.maintenance} maintenance</span>
            <span>{totals.totalBeds} total beds</span>
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

        {buildingData.length === 0 ? (
          <Card>
            <p className="text-sm text-smart-secondary">
              No buildings found. Add a building to see occupancy statistics.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {buildingData.map((building) => (
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
                    <p className="text-sm text-smart-secondary">Occupancy</p>
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
                    <p className="text-xs text-smart-secondary">Occupied</p>
                  </div>

                  <div className="rounded-xl bg-smart-blue/10 p-3 text-center">
                    <p className="text-lg font-bold text-smart-blue">
                      {building.available}
                    </p>
                    <p className="text-xs text-smart-secondary">Available</p>
                  </div>

                  <div className="rounded-xl bg-smart-warning/10 p-3 text-center">
                    <p className="text-lg font-bold text-smart-warning">
                      {building.maintenance}
                    </p>
                    <p className="text-xs text-smart-secondary">Maintenance</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search room, building, or floor..."
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
                {[
                  "Room",
                  "Building",
                  "Total Beds",
                  "Occupied",
                  "Available",
                  "Maintenance",
                  "Occupancy",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => (
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

                  <td className="px-5 py-4 font-medium text-smart-success">
                    {room.occupied}
                  </td>

                  <td className="px-5 py-4 font-medium text-smart-blue">
                    {room.available}
                  </td>

                  <td className="px-5 py-4 font-medium text-smart-warning">
                    {room.maintenance}
                  </td>

                  <td className="min-w-44 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-smart-background">
                        <div
                          className="h-full rounded-full bg-smart-blue"
                          style={{ width: `${room.percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-sm font-semibold text-smart-primary">
                        {room.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRooms.length === 0 && (
            <p className="p-6 text-center text-sm text-smart-secondary">
              {rooms.length === 0
                ? "No rooms found."
                : "No rooms match your search."}
            </p>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 lg:hidden">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-xl border border-black/5 bg-smart-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-smart-primary">
                    {room.room}
                  </p>
                  <p className="text-xs text-smart-secondary">
                    {room.building} · {room.floor}
                  </p>
                </div>

                <span className="text-lg font-bold text-smart-blue">
                  {room.percentage}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-smart-blue"
                  style={{ width: `${room.percentage}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-white p-2 text-center">
                  <p className="font-bold text-smart-success">
                    {room.occupied}
                  </p>
                  <p className="text-xs text-smart-secondary">Occupied</p>
                </div>

                <div className="rounded-lg bg-white p-2 text-center">
                  <p className="font-bold text-smart-blue">
                    {room.available}
                  </p>
                  <p className="text-xs text-smart-secondary">Available</p>
                </div>

                <div className="rounded-lg bg-white p-2 text-center">
                  <p className="font-bold text-smart-warning">
                    {room.maintenance}
                  </p>
                  <p className="text-xs text-smart-secondary">Maintenance</p>
                </div>
              </div>
            </div>
          ))}

          {filteredRooms.length === 0 && (
            <p className="py-6 text-center text-sm text-smart-secondary">
              {rooms.length === 0
                ? "No rooms found."
                : "No rooms match your search."}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Occupancy;
