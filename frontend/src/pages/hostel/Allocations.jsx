
import { useState } from "react";
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
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const initialAllocations = [
  {
    id: 1,
    studentId: "SEU/IS/22/ICT/069",
    student: "K. Arjun",
    room: "A-101",
    bed: "Bed 01",
    building: "A Block",
    date: "25 Sep 2026",
    status: "Active",
    notes: "",
  },
  {
    id: 2,
    studentId: "SEU/IS/22/ICT/090",
    student: "M. Fathima",
    room: "A-102",
    bed: "Bed 03",
    building: "A Block",
    date: "24 Sep 2026",
    status: "Active",
    notes: "",
  },
  {
    id: 3,
    studentId: "SEU/IS/22/ICT/112",
    student: "S. Niroshan",
    room: "B-201",
    bed: "Bed 01",
    building: "B Block",
    date: "23 Sep 2026",
    status: "Active",
    notes: "",
  },
  {
    id: 4,
    studentId: "SEU/IS/22/ICT/102",
    student: "R. Kavin",
    room: "A-102",
    bed: "Bed 02",
    building: "A Block",
    date: "22 Sep 2026",
    status: "Pending",
    notes: "",
  },
  {
    id: 5,
    studentId: "SEU/IS/22/ICT/074",
    student: "D. Nimal",
    room: "B-204",
    bed: "Bed 02",
    building: "B Block",
    date: "20 Sep 2026",
    status: "Active",
    notes: "",
  },
];

const students = [
  { id: "SEU/IS/22/ICT/121", name: "A. Kavinth" },
  { id: "SEU/IS/22/ICT/125", name: "S. Mohamed" },
  { id: "SEU/IS/22/ICT/130", name: "R. Tharushi" },
  { id: "SEU/IS/22/ICT/135", name: "M. Rizwan" },
];

const initialAvailableRooms = [
  {
    building: "A Block",
    floor: "Floor 1",
    room: "A-101",
    beds: ["Bed 02", "Bed 04"],
  },
  {
    building: "B Block",
    floor: "Floor 2",
    room: "B-201",
    beds: ["Bed 02", "Bed 04"],
  },
  {
    building: "B Block",
    floor: "Floor 2",
    room: "B-204",
    beds: ["Bed 04"],
  },
  {
    building: "C Block",
    floor: "Floor 1",
    room: "C-105",
    beds: ["Bed 01", "Bed 03"],
  },
];

const isReserved = (allocation) =>
  allocation.status === "Active" || allocation.status === "Pending";

const getStatusVariant = (status) => {
  if (status === "Active") return "success";
  if (status === "Pending") return "warning";
  return "neutral";
};

function Allocations() {
  const [allocations, setAllocations] = useState(initialAllocations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [allocationDate, setAllocationDate] = useState("2026-09-26");
  const [notes, setNotes] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [message, setMessage] = useState("");

  // Build a room inventory from known available beds and allocation records.
  // This allows a checked-out bed to become available again.
  const roomInventory = [];

  const addRoom = (building, floor, room) => {
    let existing = roomInventory.find(
      (item) => item.building === building && item.room === room
    );

    if (!existing) {
      existing = { building, floor, room, beds: [] };
      roomInventory.push(existing);
    } else if (
      existing.floor === "Floor not specified" &&
      floor !== "Floor not specified"
    ) {
      existing.floor = floor;
    }

    return existing;
  };

  initialAvailableRooms.forEach((room) => {
    const entry = addRoom(room.building, room.floor, room.room);
    room.beds.forEach((bed) => {
      if (!entry.beds.includes(bed)) entry.beds.push(bed);
    });
  });

  allocations.forEach((allocation) => {
    const entry = addRoom(
      allocation.building,
      "Floor not specified",
      allocation.room
    );

    if (!entry.beds.includes(allocation.bed)) {
      entry.beds.push(allocation.bed);
    }
  });

  const reservedBeds = allocations.filter(isReserved);

  const getBedKey = (building, room, bed) =>
    `${building}::${room}::${bed}`;

  const reservedBedKeys = new Set(
    reservedBeds.map((item) =>
      getBedKey(item.building, item.room, item.bed)
    )
  );

  const availableBedCount = roomInventory.reduce(
    (total, room) =>
      total +
      room.beds.filter(
        (bed) =>
          !reservedBedKeys.has(
            getBedKey(room.building, room.room, bed)
          )
      ).length,
    0
  );

  const activeCount = allocations.filter(
    (item) => item.status === "Active"
  ).length;

  const pendingCount = allocations.filter(
    (item) => item.status === "Pending"
  ).length;

  const buildingOptions = [
    ...new Set(roomInventory.map((room) => room.building)),
  ];

  const buildingRooms = roomInventory.filter(
    (room) =>
      room.building === selectedBuilding &&
      (!selectedFloor || room.floor === selectedFloor)
  );

  const floorOptions = [
    ...new Set(
      roomInventory
        .filter((room) => room.building === selectedBuilding)
        .map((room) => room.floor)
    ),
  ];

  const selectedRoomData = roomInventory.find(
    (room) =>
      room.building === selectedBuilding &&
      room.room === selectedRoom
  );

  const availableBedsForRoom = selectedRoomData
    ? selectedRoomData.beds.filter(
        (bed) =>
          !reservedBedKeys.has(
            getBedKey(selectedBuilding, selectedRoom, bed)
          )
      )
    : [];

  const eligibleStudents = students.filter(
    (student) =>
      !allocations.some(
        (allocation) =>
          allocation.studentId === student.id &&
          isReserved(allocation)
      )
  );

  const filteredAllocations = allocations.filter((allocation) => {
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
    setSelectedStudent("");
    setSelectedBuilding("");
    setSelectedFloor("");
    setSelectedRoom("");
    setSelectedBed("");
    setAllocationDate("2026-09-26");
    setNotes("");
  };

  const openModal = () => {
    setMessage("");
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

  const handleAllocate = (event) => {
    event.preventDefault();
    setMessage("");

    if (
      !selectedStudent ||
      !selectedBuilding ||
      !selectedRoom ||
      !selectedBed ||
      !allocationDate
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    const student = students.find(
      (item) => item.id === selectedStudent
    );

    if (!student) {
      setMessage("The selected student could not be found.");
      return;
    }

    const alreadyAllocated = allocations.some(
      (item) =>
        item.studentId === selectedStudent && isReserved(item)
    );

    if (alreadyAllocated) {
      setMessage(
        "This student already has an active or pending allocation."
      );
      return;
    }

    const bedStillAvailable = !allocations.some(
      (item) =>
        item.building === selectedBuilding &&
        item.room === selectedRoom &&
        item.bed === selectedBed &&
        isReserved(item)
    );

    if (!bedStillAvailable) {
      setMessage(
        "This bed is no longer available. Please select another bed."
      );
      setSelectedBed("");
      return;
    }

    const roomExists = roomInventory.some(
      (room) =>
        room.building === selectedBuilding &&
        room.room === selectedRoom &&
        room.beds.includes(selectedBed)
    );

    if (!roomExists) {
      setMessage("The selected room or bed is invalid.");
      return;
    }

    const formattedDate = new Date(
      `${allocationDate}T12:00:00`
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newAllocation = {
      id: Date.now(),
      studentId: student.id,
      student: student.name,
      room: selectedRoom,
      bed: selectedBed,
      building: selectedBuilding,
      date: formattedDate,
      status: "Active",
      notes: notes.trim(),
    };

    setAllocations((current) => [newAllocation, ...current]);
    setIsModalOpen(false);
    resetForm();
    setMessage(`Successfully allocated ${student.name} to ${selectedRoom}.`);
  };

  const handleCheckOut = (allocationId) => {
    const allocation = allocations.find(
      (item) => item.id === allocationId
    );

    if (!allocation || allocation.status !== "Active") return;

    const confirmed = window.confirm(
      `Check out ${allocation.student} from ${allocation.room}, ${allocation.bed}?`
    );

    if (!confirmed) return;

    setAllocations((current) =>
      current.map((item) =>
        item.id === allocationId
          ? { ...item, status: "Checked Out" }
          : item
      )
    );

    setMessage(
      `${allocation.student} has been checked out. The bed is now available.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

        <Button variant="primary" size="md" onClick={openModal}>
          <Plus size={18} />
          Allocate Student
        </Button>
      </div>

      {/* Feedback */}
      {message && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-smart-blue/20 bg-smart-blue/5 p-4 text-sm text-smart-primary"
        >
          <p>{message}</p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setMessage("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Total Records</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {allocations.length}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-success/10 text-smart-success">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Active</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {activeCount}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Pending</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {pendingCount}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
            <BedDouble size={24} />
          </div>
          <div>
            <p className="text-sm text-smart-secondary">Available Beds</p>
            <p className="mt-1 text-2xl font-bold text-smart-primary">
              {availableBedCount}
            </p>
          </div>
        </Card>
      </div>

      {/* Search and filters */}
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
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
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
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Checked Out</option>
          </select>
        </div>
      </Card>

      {/* Allocation table */}
      <Card padding="p-0">
        <div className="border-b border-black/5 p-5">
          <h2 className="text-lg font-bold text-smart-primary">
            Allocation Records
          </h2>
          <p className="mt-1 text-sm text-smart-secondary">
            {filteredAllocations.length} record(s) match your filters.
          </p>
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
                        onClick={() => handleCheckOut(allocation.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-smart-primary transition hover:bg-smart-background"
                      >
                        <LogOut size={15} />
                        Check out
                      </button>
                    ) : (
                      <span className="text-xs text-smart-secondary">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredAllocations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-smart-secondary"
                  >
                    No allocation records found. Try changing your search or
                    filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile records */}
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
                  onClick={() => handleCheckOut(allocation.id)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-smart-primary"
                >
                  <LogOut size={15} />
                  Check out student
                </button>
              )}
            </div>
          ))}

          {filteredAllocations.length === 0 && (
            <p className="py-8 text-center text-sm text-smart-secondary">
              No allocation records found.
            </p>
          )}
        </div>
      </Card>

      {/* Workflow information */}
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
              Select a student, choose a building, floor, room and available
              bed, then confirm the allocation. Active and pending records
              reserve their beds. Checking out an active student releases the
              bed in this frontend demo. Data is currently held in React state
              and is not persisted to a database.
            </p>
          </div>
        </div>
      </Card>

      {/* Allocation modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
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
                <h2
                  id="allocation-modal-title"
                  className="text-xl font-bold text-smart-primary"
                >
                  Allocate Student
                </h2>
                <p className="mt-1 text-sm text-smart-secondary">
                  Assign an eligible student to an available hostel bed.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close allocation form"
                className="rounded-xl p-2 text-smart-secondary transition hover:bg-smart-background hover:text-smart-primary"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-5 p-5">
              {message && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {message}
                </p>
              )}

              <div>
                <label
                  htmlFor="allocation-student"
                  className="mb-2 block text-sm font-semibold text-smart-primary"
                >
                  Student
                </label>
                <select
                  id="allocation-student"
                  value={selectedStudent}
                  onChange={(event) => setSelectedStudent(event.target.value)}
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
                  required
                >
                  <option value="">Select student</option>
                  {eligibleStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} — {student.id}
                    </option>
                  ))}
                </select>
                {eligibleStudents.length === 0 && (
                  <p className="mt-2 text-xs text-smart-secondary">
                    All sample students already have active or pending
                    allocations.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="allocation-building"
                    className="mb-2 block text-sm font-semibold text-smart-primary"
                  >
                    Building
                  </label>
                  <select
                    id="allocation-building"
                    value={selectedBuilding}
                    onChange={handleBuildingChange}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
                    required
                  >
                    <option value="">Select building</option>
                    {buildingOptions.map((building) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="allocation-floor"
                    className="mb-2 block text-sm font-semibold text-smart-primary"
                  >
                    Floor
                  </label>
                  <select
                    id="allocation-floor"
                    value={selectedFloor}
                    onChange={handleFloorChange}
                    disabled={!selectedBuilding}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none disabled:cursor-not-allowed disabled:bg-smart-background focus:border-smart-blue"
                  >
                    <option value="">All floors</option>
                    {floorOptions.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="allocation-room"
                    className="mb-2 block text-sm font-semibold text-smart-primary"
                  >
                    Room
                  </label>
                  <select
                    id="allocation-room"
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    disabled={!selectedBuilding}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none disabled:cursor-not-allowed disabled:bg-smart-background focus:border-smart-blue"
                    required
                  >
                    <option value="">Select room</option>
                    {buildingRooms.map((room) => (
                      <option key={room.room} value={room.room}>
                        {room.room}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="allocation-bed"
                    className="mb-2 block text-sm font-semibold text-smart-primary"
                  >
                    Available Bed
                  </label>
                  <select
                    id="allocation-bed"
                    value={selectedBed}
                    onChange={(event) => setSelectedBed(event.target.value)}
                    disabled={!selectedRoom}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none disabled:cursor-not-allowed disabled:bg-smart-background focus:border-smart-blue"
                    required
                  >
                    <option value="">Select bed</option>
                    {availableBedsForRoom.map((bed) => (
                      <option key={bed} value={bed}>
                        {bed}
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
                <label
                  htmlFor="allocation-date"
                  className="mb-2 block text-sm font-semibold text-smart-primary"
                >
                  Allocation Date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
                  />
                  <input
                    id="allocation-date"
                    type="date"
                    value={allocationDate}
                    onChange={(event) => setAllocationDate(event.target.value)}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm text-smart-primary outline-none focus:border-smart-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="allocation-notes"
                  className="mb-2 block text-sm font-semibold text-smart-primary"
                >
                  Notes
                </label>
                <textarea
                  id="allocation-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Add any allocation notes..."
                  className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-smart-primary outline-none focus:border-smart-blue"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={eligibleStudents.length === 0}
                >
                  <CheckCircle2 size={18} />
                  Confirm Allocation
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
