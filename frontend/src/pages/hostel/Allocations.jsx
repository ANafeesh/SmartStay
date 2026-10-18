
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  LogOut,
  Plus,
  Search,
  UserRound,
  X,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const API_URL = "http://localhost:5000/api";

const getRows = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};

const getId = (value) =>
  typeof value === "object" && value !== null
    ? String(value._id || value.id || "")
    : String(value || "");

const getRoomNumber = (room) =>
  room?.roomNumber ?? room?.roomName ?? room?.number ?? "Unknown room";

const getBedNumber = (bed) =>
  bed?.bedNumber ?? bed?.bedName ?? bed?.number ?? "Unknown bed";

const getBuildingName = (room, buildings) => {
  const building = room?.buildingId;

  if (building && typeof building === "object") {
    return building.name || building.buildingName || building.code || "Building";
  }

  const found = buildings.find((item) => getId(item) === getId(building));

  return found?.name || found?.buildingName || found?.code || "Building";
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const isReserved = (allocation) =>
  allocation.status === "Active" || allocation.status === "Pending";

const getStatusVariant = (status) => {
  if (status === "Active" || status === "Occupied") return "success";
  if (status === "Pending") return "warning";
  return "neutral";
};

function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [allocationDate, setAllocationDate] = useState(today());
  const [notes, setNotes] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message || result.error || `Request failed (${response.status})`
      );
    }

    return result;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [allocationResult, roomResult, bedResult, buildingResult] =
        await Promise.all([
          request(`${API_URL}/allocations`),
          request(`${API_URL}/rooms`),
          request(`${API_URL}/beds`),
          request(`${API_URL}/buildings`),
        ]);

      setAllocations(getRows(allocationResult));
      setRooms(getRows(roomResult));
      setBeds(getRows(bedResult));
      setBuildings(getRows(buildingResult));
    } catch (err) {
      setError(
        `${err.message}. Check that the backend is running and all four API routes are available.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const roomById = useMemo(
    () => new Map(rooms.map((room) => [getId(room), room])),
    [rooms]
  );

  const bedById = useMemo(
    () => new Map(beds.map((bed) => [getId(bed), bed])),
    [beds]
  );

  const buildingOptions = useMemo(
    () =>
      [...new Set(
        rooms.map((room) => getBuildingName(room, buildings))
      )].filter((name) => name !== "Building"),
    [rooms, buildings]
  );

  const floorOptions = useMemo(() => {
    return [
      ...new Set(
        rooms
          .filter(
            (room) => getBuildingName(room, buildings) === selectedBuilding
          )
          .map((room) => String(room.floor ?? "Not specified"))
      ),
    ];
  }, [rooms, buildings, selectedBuilding]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const sameBuilding =
        getBuildingName(room, buildings) === selectedBuilding;
      const sameFloor =
        !selectedFloor ||
        String(room.floor ?? "Not specified") === selectedFloor;

      return sameBuilding && sameFloor;
    });
  }, [rooms, buildings, selectedBuilding, selectedFloor]);

  const availableBedsForRoom = useMemo(() => {
    if (!selectedRoom) return [];

    return beds.filter((bed) => {
      const sameRoom = getId(bed.roomId) === selectedRoom;
      const available = bed.status === "Available";

      const alreadyReserved = allocations.some(
        (allocation) =>
          getId(allocation.bedId) === getId(bed) &&
          isReserved(allocation)
      );

      return sameRoom && available && !alreadyReserved;
    });
  }, [beds, selectedRoom, allocations]);

  const displayAllocations = useMemo(() => {
    return allocations.map((allocation) => {
      const roomId = getId(allocation.roomId);
      const bedId = getId(allocation.bedId);

      const room =
        typeof allocation.roomId === "object"
          ? allocation.roomId
          : roomById.get(roomId);

      const bed =
        typeof allocation.bedId === "object"
          ? allocation.bedId
          : bedById.get(bedId);

      return {
        ...allocation,
        id: getId(allocation),
        studentId: allocation.studentRegistrationId || "",
        student: allocation.studentName || "Unknown student",
        roomId,
        bedId,
        room: getRoomNumber(room),
        bed: getBedNumber(bed),
        building: getBuildingName(room, buildings),
        date: formatDate(allocation.allocationDate),
        notes: allocation.notes || "",
      };
    });
  }, [allocations, roomById, bedById, buildings]);

  const reservedBeds = useMemo(
    () => new Set(
      allocations
        .filter(isReserved)
        .map((allocation) => getId(allocation.bedId))
    ),
    [allocations]
  );

  const availableBedCount = beds.filter(
    (bed) => bed.status === "Available" && !reservedBeds.has(getId(bed))
  ).length;

  const activeCount = allocations.filter(
    (item) => item.status === "Active"
  ).length;

  const pendingCount = allocations.filter(
    (item) => item.status === "Pending"
  ).length;

  const filteredAllocations = displayAllocations.filter((allocation) => {
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !query ||
      allocation.student.toLowerCase().includes(query) ||
      allocation.studentId.toLowerCase().includes(query) ||
      allocation.room.toLowerCase().includes(query) ||
      allocation.building.toLowerCase().includes(query) ||
      allocation.bed.toLowerCase().includes(query);

    const matchesBuilding =
      buildingFilter === "All Buildings" ||
      allocation.building === buildingFilter;

    const matchesStatus =
      statusFilter === "All Status" ||
      allocation.status === statusFilter;

    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const resetForm = () => {
    setStudentId("");
    setStudentName("");
    setSelectedBuilding("");
    setSelectedFloor("");
    setSelectedRoom("");
    setSelectedBed("");
    setAllocationDate(today());
    setNotes("");
  };

  const openModal = () => {
    setMessage("");
    setError("");
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleBuildingChange = (event) => {
    setSelectedBuilding(event.target.value);
    setSelectedFloor("");
    setSelectedRoom("");
    setSelectedBed("");
  };

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
    setSelectedRoom("");
    setSelectedBed("");
  };

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    setSelectedBed("");
  };

  const handleAllocate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !studentId.trim() ||
      !studentName.trim() ||
      !selectedBuilding ||
      !selectedRoom ||
      !selectedBed ||
      !allocationDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const bed = beds.find((item) => getId(item) === selectedBed);

    if (!bed || bed.status !== "Available") {
      setError("This bed is no longer available. Refresh and choose another.");
      await loadData();
      return;
    }

    setSaving(true);

    try {
      await request(`${API_URL}/allocations`, {
        method: "POST",
        body: JSON.stringify({
          studentRegistrationId: studentId.trim(),
          studentName: studentName.trim(),
          roomId: selectedRoom,
          bedId: selectedBed,
          allocationDate,
          notes: notes.trim(),
        }),
      });

      setIsModalOpen(false);
      resetForm();
      setMessage("Student allocation created successfully.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckOut = async (allocation) => {
    if (allocation.status !== "Active") return;

    const confirmed = window.confirm(
      `Check out ${allocation.student} from ${allocation.room}, ${allocation.bed}?`
    );

    if (!confirmed) return;

    setBusyId(allocation.id);
    setMessage("");
    setError("");

    try {
      await request(
        `${API_URL}/allocations/${allocation.id}/checkout`,
        { method: "PATCH" }
      );

      setMessage(`${allocation.student} has been checked out successfully.`);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-smart-secondary">
            Hostel Management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
            Allocations
          </h1>
          <p className="mt-2 text-sm text-smart-secondary">
            Allocate students to available hostel beds and manage current
            allocations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="md" onClick={loadData}>
            <RefreshCw size={17} />
            Refresh
          </Button>
          <Button variant="primary" size="md" onClick={openModal}>
            <Plus size={18} />
            Allocate Student
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
            <X size={17} />
          </button>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-smart-blue/20 bg-smart-blue/5 p-4 text-sm text-smart-primary"
        >
          <p>{message}</p>
          <button type="button" onClick={() => setMessage("")} aria-label="Dismiss message">
            <X size={17} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Records",
            value: allocations.length,
            icon: ClipboardList,
            color: "smart-blue",
          },
          {
            label: "Active",
            value: activeCount,
            icon: CheckCircle2,
            color: "smart-success",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: CalendarDays,
            color: "smart-warning",
          },
          {
            label: "Available Beds",
            value: availableBedCount,
            icon: BedDouble,
            color: "smart-teal",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-${item.color}/10 text-${item.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-smart-secondary">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-smart-primary">
                  {loading ? "…" : item.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding="p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
              placeholder="Search student, ID, room or bed..."
              aria-label="Search allocations"
              className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
            />
          </div>

          <select
            value={buildingFilter}
            onChange={(event) => setBuildingFilter(event.target.value)}
            aria-label="Filter by building"
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none"
          >
            <option>All Buildings</option>
            {buildingOptions.map((building) => (
              <option key={building}>{building}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by allocation status"
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Checked Out</option>
          </select>
        </div>
      </Card>

      <Card padding="p-0">
        <div className="flex items-center justify-between border-b border-black/5 p-5">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              Allocation Records
            </h2>
            <p className="mt-1 text-sm text-smart-secondary">
              {filteredAllocations.length} record(s) match your filters.
            </p>
          </div>
          {loading && (
            <p className="text-sm text-smart-secondary">Loading…</p>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background text-left">
                {[
                  "Student",
                  "Building",
                  "Room",
                  "Bed",
                  "Allocation Date",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredAllocations.map((allocation) => (
                <tr
                  key={allocation.id}
                  className="border-b border-black/5 last:border-b-0 hover:bg-smart-background/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue/10 text-sm font-bold text-smart-blue">
                        {allocation.student
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-smart-primary">
                          {allocation.student}
                        </p>
                        <p className="mt-0.5 text-xs text-smart-secondary">
                          {allocation.studentId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-smart-primary">
                    {allocation.building}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-smart-primary">
                    {allocation.room}
                  </td>
                  <td className="px-5 py-4 text-sm text-smart-primary">
                    {allocation.bed}
                  </td>
                  <td className="px-5 py-4 text-sm text-smart-secondary">
                    {allocation.date}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={getStatusVariant(allocation.status)}>
                      {allocation.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    {allocation.status === "Active" ? (
                      <button
                        type="button"
                        disabled={busyId === allocation.id}
                        onClick={() => handleCheckOut(allocation)}
                        className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-smart-primary transition hover:bg-smart-background disabled:opacity-50"
                      >
                        <LogOut size={15} />
                        {busyId === allocation.id ? "Checking out…" : "Check out"}
                      </button>
                    ) : (
                      <span className="text-xs text-smart-secondary">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {!loading && filteredAllocations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-smart-secondary">
                    No allocation records found. Try changing your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filteredAllocations.map((allocation) => (
            <div
              key={allocation.id}
              className="rounded-xl border border-black/5 bg-smart-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-smart-primary">
                    {allocation.student}
                  </p>
                  <p className="mt-1 text-xs text-smart-secondary">
                    {allocation.studentId}
                  </p>
                </div>
                <Badge variant={getStatusVariant(allocation.status)}>
                  {allocation.status}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-smart-secondary">Building</p>
                  <p className="mt-1 text-sm font-semibold text-smart-primary">
                    {allocation.building}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-smart-secondary">Room / Bed</p>
                  <p className="mt-1 text-sm font-semibold text-smart-primary">
                    {allocation.room} / {allocation.bed}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-smart-secondary">Date</p>
                  <p className="mt-1 text-sm text-smart-primary">
                    {allocation.date}
                  </p>
                </div>
              </div>

              {allocation.notes && (
                <p className="mt-3 text-sm text-smart-secondary">
                  Notes: {allocation.notes}
                </p>
              )}

              {allocation.status === "Active" && (
                <button
                  type="button"
                  disabled={busyId === allocation.id}
                  onClick={() => handleCheckOut(allocation)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-smart-primary disabled:opacity-50"
                >
                  <LogOut size={15} />
                  {busyId === allocation.id ? "Checking out…" : "Check out student"}
                </button>
              )}
            </div>
          ))}

          {!loading && filteredAllocations.length === 0 && (
            <p className="py-8 text-center text-sm text-smart-secondary">
              No allocation records found.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
            <UserRound size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-smart-primary">
              Allocation Workflow
            </h3>
            <p className="mt-1 text-sm leading-6 text-smart-secondary">
              Allocations are loaded from the backend. New allocations are
              saved to MongoDB, and checking out an active student calls the
              checkout API to release the bed.
            </p>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="allocation-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-black/5 p-5">
              <div>
                <h2 id="allocation-modal-title" className="text-xl font-bold text-smart-primary">
                  Allocate Student
                </h2>
                <p className="mt-1 text-sm text-smart-secondary">
                  Enter the student's details and choose an available bed.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close allocation form"
                className="rounded-xl p-2 text-smart-secondary transition hover:bg-smart-background disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-5 p-5">
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="allocation-student-id" className="mb-2 block text-sm font-semibold text-smart-primary">
                    Student Registration ID
                  </label>
                  <input
                    id="allocation-student-id"
                    value={studentId}
                    onChange={(event) => setStudentId(event.target.value)}
                    placeholder="e.g. SEU/IS/22/ICT/069"
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-smart-blue"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="allocation-student-name" className="mb-2 block text-sm font-semibold text-smart-primary">
                    Student Name
                  </label>
                  <input
                    id="allocation-student-name"
                    value={studentName}
                    onChange={(event) => setStudentName(event.target.value)}
                    placeholder="Enter student's name"
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-smart-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="allocation-building" className="mb-2 block text-sm font-semibold text-smart-primary">
                    Building
                  </label>
                  <select
                    id="allocation-building"
                    value={selectedBuilding}
                    onChange={handleBuildingChange}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-smart-blue"
                    required
                  >
                    <option value="">Select building</option>
                    {buildingOptions.map((building) => (
                      <option key={building} value={building}>{building}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="allocation-floor" className="mb-2 block text-sm font-semibold text-smart-primary">
                    Floor
                  </label>
                  <select
                    id="allocation-floor"
                    value={selectedFloor}
                    onChange={handleFloorChange}
                    disabled={!selectedBuilding}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none disabled:bg-smart-background focus:border-smart-blue"
                  >
                    <option value="">All floors</option>
                    {floorOptions.map((floor) => (
                      <option key={floor} value={floor}>{floor}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="allocation-room" className="mb-2 block text-sm font-semibold text-smart-primary">
                    Room
                  </label>
                  <select
                    id="allocation-room"
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    disabled={!selectedBuilding}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none disabled:bg-smart-background focus:border-smart-blue"
                    required
                  >
                    <option value="">Select room</option>
                    {filteredRooms.map((room) => (
                      <option key={getId(room)} value={getId(room)}>
                        {getRoomNumber(room)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="allocation-bed" className="mb-2 block text-sm font-semibold text-smart-primary">
                    Available Bed
                  </label>
                  <select
                    id="allocation-bed"
                    value={selectedBed}
                    onChange={(event) => setSelectedBed(event.target.value)}
                    disabled={!selectedRoom}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none disabled:bg-smart-background focus:border-smart-blue"
                    required
                  >
                    <option value="">Select bed</option>
                    {availableBedsForRoom.map((bed) => (
                      <option key={getId(bed)} value={getId(bed)}>
                        {getBedNumber(bed)}
                      </option>
                    ))}
                  </select>
                  {selectedRoom && availableBedsForRoom.length === 0 && (
                    <p className="mt-2 text-xs text-smart-secondary">
                      No available beds in this room.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="allocation-date" className="mb-2 block text-sm font-semibold text-smart-primary">
                  Allocation Date
                </label>
                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary" />
                  <input
                    id="allocation-date"
                    type="date"
                    value={allocationDate}
                    onChange={(event) => setAllocationDate(event.target.value)}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none focus:border-smart-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="allocation-notes" className="mb-2 block text-sm font-semibold text-smart-primary">
                  Notes
                </label>
                <textarea
                  id="allocation-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Add any allocation notes..."
                  className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" size="md" onClick={closeModal} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={saving || loading}>
                  <CheckCircle2 size={18} />
                  {saving ? "Saving..." : "Confirm Allocation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Allocations;
