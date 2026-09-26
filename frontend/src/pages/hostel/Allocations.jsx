import { useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
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
  },
];

const students = [
  {
    id: "SEU/IS/22/ICT/121",
    name: "A. Kavinth",
  },
  {
    id: "SEU/IS/22/ICT/125",
    name: "S. Mohamed",
  },
  {
    id: "SEU/IS/22/ICT/130",
    name: "R. Tharushi",
  },
  {
    id: "SEU/IS/22/ICT/135",
    name: "M. Rizwan",
  },
];

const availableRooms = [
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

function Allocations() {
  const [allocations, setAllocations] = useState(initialAllocations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [allocationDate, setAllocationDate] = useState("2026-09-26");
  const [notes, setNotes] = useState("");

  const activeCount = allocations.filter(
    (allocation) => allocation.status === "Active"
  ).length;

  const pendingCount = allocations.filter(
    (allocation) => allocation.status === "Pending"
  ).length;

  const availableBeds = availableRooms.reduce(
    (total, room) => total + room.beds.length,
    0
  );

  const buildingRooms = availableRooms.filter(
    (room) => room.building === selectedBuilding
  );

  const selectedRoomData = availableRooms.find(
    (room) =>
      room.building === selectedBuilding && room.room === selectedRoom
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedBuilding("");
    setSelectedRoom("");
    setSelectedBed("");
    setAllocationDate("2026-09-26");
    setNotes("");
  };

  const handleBuildingChange = (event) => {
    setSelectedBuilding(event.target.value);
    setSelectedRoom("");
    setSelectedBed("");
  };

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    setSelectedBed("");
  };

  const handleAllocate = (event) => {
    event.preventDefault();

    if (
      !selectedStudent ||
      !selectedBuilding ||
      !selectedRoom ||
      !selectedBed ||
      !allocationDate
    ) {
      return;
    }

    const student = students.find(
      (item) => item.id === selectedStudent
    );

    const newAllocation = {
      id: Date.now(),
      studentId: student.id,
      student: student.name,
      room: selectedRoom,
      bed: selectedBed,
      building: selectedBuilding,
      date: new Date(allocationDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Active",
    };

    setAllocations((current) => [newAllocation, ...current]);

    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
            <ClipboardList size={24} />
          </div>

          <div>
            <p className="text-sm text-smart-secondary">
              Total Allocations
            </p>

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
              {availableBeds}
            </p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card padding="p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
            />

            <input
              type="text"
              placeholder="Search student, ID or room..."
              className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
            />
          </div>

          <select className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue">
            <option>All Buildings</option>
            <option>A Block</option>
            <option>B Block</option>
            <option>C Block</option>
            <option>D Block</option>
          </select>

          <select className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>
      </Card>

      {/* Allocation Table */}
      <Card padding="p-0">
        <div className="border-b border-black/5 p-5">
          <h2 className="text-lg font-bold text-smart-primary">
            Current Allocations
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            Students currently assigned to hostel beds.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Building
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Room
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Bed
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Allocation Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {allocations.map((allocation) => (
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

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-smart-background px-3 py-1.5 text-sm font-semibold text-smart-primary">
                      {allocation.room}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-smart-primary">
                    {allocation.bed}
                  </td>

                  <td className="px-5 py-4 text-sm text-smart-secondary">
                    {allocation.date}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        allocation.status === "Active"
                          ? "success"
                          : "warning"
                      }
                    >
                      {allocation.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 md:hidden">
          {allocations.map((allocation) => (
            <div
              key={allocation.id}
              className="rounded-xl border border-black/5 bg-smart-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
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

                <Badge
                  variant={
                    allocation.status === "Active" ? "success" : "warning"
                  }
                >
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
                  <p className="text-xs text-smart-secondary">Room</p>
                  <p className="mt-1 text-sm font-semibold text-smart-primary">
                    {allocation.room}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-smart-secondary">Bed</p>
                  <p className="mt-1 text-sm font-semibold text-smart-primary">
                    {allocation.bed}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-smart-secondary">Date</p>
                  <p className="mt-1 text-sm font-semibold text-smart-primary">
                    {allocation.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Allocation Workflow */}
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
              Select a student, choose an available room and bed, then confirm
              the allocation. The selected bed is assigned to the student in
              this frontend demo. Backend validation and database updates will
              be added later.
            </p>
          </div>
        </div>
      </Card>

      {/* Allocation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/5 p-5">
              <div>
                <h2 className="text-xl font-bold text-smart-primary">
                  Allocate Student
                </h2>

                <p className="mt-1 text-sm text-smart-secondary">
                  Assign a student to an available hostel bed.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-2 text-smart-secondary transition hover:bg-smart-background hover:text-smart-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAllocate} className="space-y-5 p-5">
              {/* Student */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-smart-primary">
                  Student
                </label>

                <select
                  value={selectedStudent}
                  onChange={(event) =>
                    setSelectedStudent(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                  required
                >
                  <option value="">Select student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} — {student.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Building and Floor */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-smart-primary">
                    Building
                  </label>

                  <select
                    value={selectedBuilding}
                    onChange={handleBuildingChange}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                    required
                  >
                    <option value="">Select building</option>

                    {[...new Set(availableRooms.map((room) => room.building))].map(
                      (building) => (
                        <option key={building} value={building}>
                          {building}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-smart-primary">
                    Floor
                  </label>

                  <select
                    value={
                      availableRooms.find(
                        (room) => room.room === selectedRoom
                      )?.floor || ""
                    }
                    disabled={!selectedBuilding}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none disabled:cursor-not-allowed disabled:bg-smart-background focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                  >
                    <option value="">Select floor</option>

                    {[...new Set(buildingRooms.map((room) => room.floor))].map(
                      (floor) => (
                        <option key={floor} value={floor}>
                          {floor}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Room and Bed */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-smart-primary">
                    Room
                  </label>

                  <select
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    disabled={!selectedBuilding}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none disabled:cursor-not-allowed disabled:bg-smart-background focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
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
                  <label className="mb-2 block text-sm font-semibold text-smart-primary">
                    Available Bed
                  </label>

                  <select
                    value={selectedBed}
                    onChange={(event) => setSelectedBed(event.target.value)}
                    disabled={!selectedRoom}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none disabled:cursor-not-allowed disabled:bg-smart-background focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                    required
                  >
                    <option value="">Select bed</option>

                    {selectedRoomData?.beds.map((bed) => (
                      <option key={bed} value={bed}>
                        {bed}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Allocation Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-smart-primary">
                  Allocation Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
                  />

                  <input
                    type="date"
                    value={allocationDate}
                    onChange={(event) =>
                      setAllocationDate(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm text-smart-primary outline-none focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-smart-primary">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows="3"
                  placeholder="Add any allocation notes..."
                  className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-smart-primary outline-none focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={closeModal}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="primary" size="md">
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