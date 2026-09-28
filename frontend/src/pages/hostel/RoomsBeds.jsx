import {
  BedDouble,
  Building2,
  DoorOpen,
  Search,
  Users,
  Wrench,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const roomData = [
  {
    id: 1,
    building: "A Block",
    room: "A-101",
    floor: "Floor 1",
    type: "Standard",
    capacity: 4,
    beds: [
      { number: "Bed 01", status: "Occupied", student: "K. Arjun" },
      { number: "Bed 02", status: "Available", student: "" },
      { number: "Bed 03", status: "Occupied", student: "M. Fathima" },
      { number: "Bed 04", status: "Available", student: "" },
    ],
    maintenance: false,
  },
  {
    id: 2,
    building: "A Block",
    room: "A-102",
    floor: "Floor 1",
    type: "Standard",
    capacity: 4,
    beds: [
      { number: "Bed 01", status: "Occupied", student: "S. Niroshan" },
      { number: "Bed 02", status: "Occupied", student: "R. Kavin" },
      { number: "Bed 03", status: "Occupied", student: "A. Mohamed" },
      { number: "Bed 04", status: "Occupied", student: "P. Sahan" },
    ],
    maintenance: false,
  },
  {
    id: 3,
    building: "B Block",
    room: "B-201",
    floor: "Floor 2",
    type: "Standard",
    capacity: 4,
    beds: [
      { number: "Bed 01", status: "Occupied", student: "T. Kumar" },
      { number: "Bed 02", status: "Available", student: "" },
      { number: "Bed 03", status: "Occupied", student: "F. Rizwan" },
      { number: "Bed 04", status: "Available", student: "" },
    ],
    maintenance: false,
  },
  {
    id: 4,
    building: "B Block",
    room: "B-204",
    floor: "Floor 2",
    type: "Standard",
    capacity: 4,
    beds: [
      { number: "Bed 01", status: "Maintenance", student: "" },
      { number: "Bed 02", status: "Occupied", student: "D. Nimal" },
      { number: "Bed 03", status: "Occupied", student: "M. Iqbal" },
      { number: "Bed 04", status: "Available", student: "" },
    ],
    maintenance: true,
  },
  {
    id: 5,
    building: "C Block",
    room: "C-105",
    floor: "Floor 1",
    type: "Standard",
    capacity: 4,
    beds: [
      { number: "Bed 01", status: "Available", student: "" },
      { number: "Bed 02", status: "Occupied", student: "K. Tharindu" },
      { number: "Bed 03", status: "Available", student: "" },
      { number: "Bed 04", status: "Occupied", student: "S. Ahamed" },
    ],
    maintenance: false,
  },
  {
    id: 6,
    building: "D Block",
    room: "D-101",
    floor: "Floor 1",
    type: "Maintenance",
    capacity: 4,
    beds: [
      { number: "Bed 01", status: "Maintenance", student: "" },
      { number: "Bed 02", status: "Maintenance", student: "" },
      { number: "Bed 03", status: "Maintenance", student: "" },
      { number: "Bed 04", status: "Maintenance", student: "" },
    ],
    maintenance: true,
  },
];

function getOccupiedBeds(room) {
  return room.beds.filter((bed) => bed.status === "Occupied").length;
}

function getAvailableBeds(room) {
  return room.beds.filter((bed) => bed.status === "Available").length;
}

function getRoomStatus(room) {
  if (room.maintenance) {
    return {
      label: "Maintenance",
      variant: "warning",
    };
  }

  const occupied = getOccupiedBeds(room);

  if (occupied === room.capacity) {
    return {
      label: "Full",
      variant: "danger",
    };
  }

  return {
    label: "Available",
    variant: "success",
  };
}

function getBedBadgeVariant(status) {
  if (status === "Occupied") {
    return "danger";
  }

  if (status === "Maintenance") {
    return "warning";
  }

  return "success";
}

function RoomsBeds() {
  const totalRooms = roomData.length;
  const totalBeds = roomData.reduce((total, room) => total + room.beds.length, 0);
  const availableBeds = roomData.reduce(
    (total, room) => total + getAvailableBeds(room),
    0
  );
  const occupiedBeds = roomData.reduce(
    (total, room) => total + getOccupiedBeds(room),
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

        <Button variant="primary" size="md">
          <DoorOpen size={18} />
          Add Room
        </Button>
      </div>

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
              placeholder="Search room number..."
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
            <option>All Floors</option>
            <option>Floor 1</option>
            <option>Floor 2</option>
            <option>Floor 3</option>
            <option>Floor 4</option>
          </select>

          <select className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-smart-primary outline-none focus:border-smart-blue">
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
            <span>{totalRooms} rooms</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {roomData.map((room) => {
            const occupied = getOccupiedBeds(room);
            const available = getAvailableBeds(room);
            const status = getRoomStatus(room);
            const occupancyPercentage =
              room.capacity > 0 ? (occupied / room.capacity) * 100 : 0;

            return (
              <Card key={room.id} className="overflow-hidden" padding="p-0">
                {/* Room Header */}
                <div className="border-b border-black/5 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
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

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {room.beds.map((bed) => (
                      <div
                        key={bed.number}
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

                              {bed.student ? (
                                <p className="mt-0.5 text-xs text-smart-secondary">
                                  {bed.student}
                                </p>
                              ) : (
                                <p className="mt-0.5 text-xs text-smart-secondary">
                                  No student assigned
                                </p>
                              )}
                            </div>
                          </div>

                          <Badge variant={getBedBadgeVariant(bed.status)}>
                            {bed.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
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