
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  DoorOpen,
  Search,
  Users,
  Wrench,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

import { API_BASE_URL, getAuthToken } from "../../services/apiClient";
import {
  SAMPLE_BUILDINGS,
  SAMPLE_ROOMS,
  SAMPLE_BEDS,
  SAMPLE_ALLOCATIONS,
} from "../../services/hostelFallbackData";

const API_URL = API_BASE_URL;

async function fetchData(endpoint) {
  const token = getAuthToken();
  const headers = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    credentials: "include",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Failed to load ${endpoint}`);
  }

  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.buildings)) return result.buildings;
  if (Array.isArray(result.rooms)) return result.rooms;
  if (Array.isArray(result.beds)) return result.beds;
  if (Array.isArray(result.allocations)) return result.allocations;

  return [];
}

function getId(value) {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
}

function getOccupiedBeds(room) {
  return room.beds.filter((bed) => bed.status === "Occupied").length;
}

function getAvailableBeds(room) {
  return room.beds.filter((bed) => bed.status === "Available").length;
}

function getRoomStatus(room) {
  if (
    room.maintenance ||
    room.status?.toLowerCase() === "maintenance"
  ) {
    return { label: "Maintenance", variant: "warning" };
  }

  const occupied = getOccupiedBeds(room);

  if (room.capacity > 0 && occupied >= room.capacity) {
    return { label: "Full", variant: "danger" };
  }

  return { label: "Available", variant: "success" };
}

function getBedBadgeVariant(status) {
  if (status === "Occupied") return "danger";
  if (status === "Maintenance") return "warning";
  return "success";
}

function RoomsBeds() {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [beds, setBeds] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");
  const [floorFilter, setFloorFilter] = useState("All Floors");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [buildingData, roomData, bedData, allocationData] =
        await Promise.all([
          fetchData("/buildings").catch(() => null),
          fetchData("/rooms").catch(() => null),
          fetchData("/beds").catch(() => null),
          fetchData("/allocations").catch(() => null),
        ]);

      const finalBuildings =
        buildingData && buildingData.length ? buildingData : SAMPLE_BUILDINGS;
      const finalRooms =
        roomData && roomData.length ? roomData : SAMPLE_ROOMS;
      const finalBeds =
        bedData && bedData.length ? bedData : SAMPLE_BEDS;
      const finalAllocations =
        allocationData && allocationData.length ? allocationData : SAMPLE_ALLOCATIONS;

      setBuildings(finalBuildings);
      setRooms(finalRooms);
      setBeds(finalBeds);
      setAllocations(finalAllocations);
    } catch (err) {
      console.warn("Using sample hostel data fallback:", err.message);
      setBuildings(SAMPLE_BUILDINGS);
      setRooms(SAMPLE_ROOMS);
      setBeds(SAMPLE_BEDS);
      setAllocations(SAMPLE_ALLOCATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const roomData = useMemo(() => {
    return rooms.map((room) => {
      const roomId = getId(room._id || room.id);

      const building = buildings.find(
        (item) =>
          getId(item._id || item.id) === getId(room.buildingId)
      );

      const roomBeds = beds
        .filter((bed) => getId(bed.roomId) === roomId)
        .map((bed) => {
          const bedId = getId(bed._id || bed.id);

          const allocation = allocations.find((item) => {
            const allocationBedId = getId(item.bedId);
            const active = ["active", "pending"].includes(
              String(item.status || "").toLowerCase()
            );

            return allocationBedId === bedId && active;
          });

          const rawStatus = String(bed.status || "Available");
          const normalizedStatus =
            rawStatus.toLowerCase() === "maintenance"
              ? "Maintenance"
              : rawStatus.toLowerCase() === "occupied"
                ? "Occupied"
                : "Available";

          return {
            id: bedId,
            number:
              bed.bedNumber ||
              bed.number ||
              bed.name ||
              "Bed",
            status: normalizedStatus,
            student: allocation
              ? allocation.studentName ||
                allocation.studentRegistrationId ||
                ""
              : "",
          };
        });

      const roomStatus = String(room.status || "Available");

      return {
        id: roomId,
        building:
          building?.name ||
          building?.buildingName ||
          room.buildingName ||
          "Unknown Building",
        room:
          room.roomNumber ||
          room.roomName ||
          room.number ||
          room.name ||
          "Unnamed Room",
        floor: `Floor ${room.floor ?? 1}`,
        type: room.roomType || room.type || "Standard",
        capacity: Number(room.capacity ?? roomBeds.length),
        beds: roomBeds,
        maintenance:
          roomStatus.toLowerCase() === "maintenance" ||
          roomBeds.some((bed) => bed.status === "Maintenance"),
        status: roomStatus,
      };
    });
  }, [rooms, buildings, beds, allocations]);

  const buildingOptions = useMemo(() => {
    return [
      ...new Set(roomData.map((room) => room.building)),
    ];
  }, [roomData]);

  const floorOptions = useMemo(() => {
    return [
      ...new Set(roomData.map((room) => room.floor)),
    ].sort((a, b) => {
      return Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, ""));
    });
  }, [roomData]);

  const filteredRooms = useMemo(() => {
    return roomData.filter((room) => {
      const matchesSearch = room.room
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesBuilding =
        buildingFilter === "All Buildings" ||
        room.building === buildingFilter;

      const matchesFloor =
        floorFilter === "All Floors" || room.floor === floorFilter;

      const roomStatus = getRoomStatus(room).label;

      const matchesStatus =
        statusFilter === "All Status" || roomStatus === statusFilter;

      return (
        matchesSearch &&
        matchesBuilding &&
        matchesFloor &&
        matchesStatus
      );
    });
  }, [roomData, search, buildingFilter, floorFilter, statusFilter]);

  const totalRooms = roomData.length;

  const totalBeds = roomData.reduce(
    (total, room) => total + room.beds.length,
    0
  );

  const availableBeds = roomData.reduce(
    (total, room) => total + getAvailableBeds(room),
    0
  );

  const occupiedBeds = roomData.reduce(
    (total, room) => total + getOccupiedBeds(room),
    0
  );

  const maintenanceBeds = roomData.reduce(
    (total, room) =>
      total +
      room.beds.filter((bed) => bed.status === "Maintenance").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-smart-secondary">
            Hostel Management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
            Rooms & Beds
          </h1>
          <p className="mt-2 text-sm text-smart-secondary">
            Manage rooms, beds and their current availability.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={18} />
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Error and Loading */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <p className="text-sm text-smart-secondary">
          Loading rooms and beds from the database...
        </p>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
            <DoorOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Total Rooms</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {totalRooms}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
            <BedDouble size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Total Beds</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {totalBeds}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-success/10 text-smart-success">
            <BedDouble size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Available Beds</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {availableBeds}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-danger/10 text-smart-danger">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Occupied Beds</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {occupiedBeds}
            </p>
            {maintenanceBeds > 0 && (
              <p className="mt-1 text-xs text-smart-secondary">
                {maintenanceBeds} under maintenance
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search room number..."
              className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
            />
          </div>

          <select
            value={buildingFilter}
            onChange={(event) => setBuildingFilter(event.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
          >
            <option>All Buildings</option>
            {buildingOptions.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>

          <select
            value={floorFilter}
            onChange={(event) => setFloorFilter(event.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
          >
            <option>All Floors</option>
            {floorOptions.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
          >
            <option>All Status</option>
            <option>Available</option>
            <option>Full</option>
            <option>Maintenance</option>
          </select>
        </div>
      </Card>

      {/* Rooms */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              Room Availability
            </h2>
            <p className="mt-1 text-sm text-smart-secondary">
              Current room and bed status.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-smart-secondary sm:flex">
            <Building2 size={17} />
            <span>{filteredRooms.length} rooms</span>
          </div>
        </div>

        {!loading && !error && filteredRooms.length === 0 && (
          <Card>
            <p className="text-sm text-smart-secondary">
              No rooms found. Add rooms to the database or change your filters.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredRooms.map((room) => {
            const occupied = getOccupiedBeds(room);
            const available = getAvailableBeds(room);
            const status = getRoomStatus(room);

            const occupancyPercentage =
              room.capacity > 0
                ? Math.min((occupied / room.capacity) * 100, 100)
                : 0;

            return (
              <Card key={room.id} className="overflow-hidden" padding="p-0">
                {/* Room Header */}
                <div className="border-b border-black/5 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
                        <DoorOpen size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-smart-primary">
                          {room.room}
                        </h3>
                        <p className="text-sm text-smart-secondary">
                          {room.building} • {room.floor}
                        </p>
                      </div>
                    </div>

                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-smart-secondary">Room Type</p>
                      <p className="mt-1 text-sm font-semibold text-smart-primary">
                        {room.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-smart-secondary">Capacity</p>
                      <p className="mt-1 text-sm font-semibold text-smart-primary">
                        {room.capacity} Beds
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-smart-secondary">Occupied</p>
                      <p className="mt-1 text-sm font-semibold text-smart-danger">
                        {occupied}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-smart-secondary">Available</p>
                      <p className="mt-1 text-sm font-semibold text-smart-success">
                        {available}
                      </p>
                    </div>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-smart-secondary">
                        Occupancy
                      </span>
                      <span className="text-xs font-semibold text-smart-primary">
                        {Math.round(occupancyPercentage)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-smart-background">
                      <div
                        className="h-full rounded-full bg-smart-blue transition-all"
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Beds */}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-smart-primary">
                      Beds
                    </h4>

                    {room.maintenance && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-smart-warning">
                        <Wrench size={14} />
                        Maintenance
                      </div>
                    )}
                  </div>

                  {room.beds.length === 0 ? (
                    <p className="text-sm text-smart-secondary">
                      No beds have been added to this room yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {room.beds.map((bed) => (
                        <div
                          key={bed.id}
                          className="rounded-xl border border-black/5 bg-smart-background p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-smart-primary shadow-sm">
                                <BedDouble size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-smart-primary">
                                  {bed.number}
                                </p>
                                <p className="mt-0.5 text-xs text-smart-secondary">
                                  {bed.student || "No student assigned"}
                                </p>
                              </div>
                            </div>

                            <Badge variant={getBedBadgeVariant(bed.status)}>
                              {bed.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoomsBeds;
