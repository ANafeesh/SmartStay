import { Link } from "react-router-dom";
import { useAuth, isDemoUser } from "../../context/AuthContext";
import {
  BedDouble,
  Building2,
  Users,
  Wifi,
  Bath,
  Fan,
  Lightbulb,
  ShieldCheck,
  CalendarDays,
  Wrench,
  ArrowRight,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const roomDetails = [
  {
    label: "Room Number",
    value: "B-204",
    icon: BedDouble,
  },
  {
    label: "Block",
    value: "Block B",
    icon: Building2,
  },
  {
    label: "Floor",
    value: "Second Floor",
    icon: Building2,
  },
  {
    label: "Room Capacity",
    value: "4 Students",
    icon: Users,
  },
];

const facilities = [
  {
    name: "Wi-Fi",
    description: "Campus internet access",
    icon: Wifi,
  },
  {
    name: "Attached Bathroom",
    description: "Private bathroom facility",
    icon: Bath,
  },
  {
    name: "Ceiling Fan",
    description: "Individual room fan",
    icon: Fan,
  },
  {
    name: "Study Lights",
    description: "Individual study lighting",
    icon: Lightbulb,
  },
];

const roommates = [
  {
    name: "Kamal Perera",
    id: "ICT/2024/045",
    role: "Roommate",
  },
  {
    name: "Mohamed Rizwan",
    id: "ICT/2024/078",
    role: "Roommate",
  },
];

function Room() {
  const { user } = useAuth();
  const isDemo = isDemoUser(user) || user?.isDemo || user?.email === "nafeesh@campus.edu";
  const hasRoom = isDemo || !!user?.room;

  const displayRoom = user?.room || (isDemo ? "B-204" : "Not Allocated");
  const displayBlock = user?.building || (isDemo ? "Block B" : "Campus Residence");
  const activeRoommates = isDemo ? roommates : [];

  const dynamicRoomDetails = [
    {
      label: "Room Number",
      value: displayRoom,
      icon: BedDouble,
    },
    {
      label: "Block",
      value: displayBlock,
      icon: Building2,
    },
    {
      label: "Floor",
      value: isDemo ? "Second Floor" : "TBD",
      icon: Building2,
    },
    {
      label: "Room Capacity",
      value: isDemo ? "4 Students" : "4 Students",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-smart-primary">My Room</h1>
      </div>

      {/* Room Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-smart-blue/10 text-smart-blue">
                <BedDouble size={28} />
              </div>

              <div>
                <p className="text-sm text-smart-secondary">Current Room</p>

                <h2 className="mt-1 text-2xl font-bold text-smart-primary">
                  {hasRoom ? `Room ${displayRoom}` : "Allocation Pending"}
                </h2>

                <p className="mt-1 text-sm text-smart-secondary">
                  {hasRoom ? `${displayBlock} · Active Allocation` : "Pending allocation by the warden office"}
                </p>
              </div>
            </div>

            <Badge variant={hasRoom ? "success" : "neutral"}>
              {hasRoom ? "Active Allocation" : "Pending Allocation"}
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dynamicRoomDetails.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl bg-smart-background p-4"
                >
                  <Icon size={20} className="text-smart-blue" />

                  <p className="mt-3 text-xs text-smart-secondary">
                    {item.label}
                  </p>

                  <p className="mt-1 font-semibold text-smart-primary">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Allocation */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="font-bold text-smart-primary">Allocation</h2>

              <p className="text-sm text-smart-secondary">
                Current academic year
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs text-smart-secondary">Allocation Date</p>

              <p className="mt-1 font-semibold text-smart-primary">
                05 Jan 2026
              </p>
            </div>

            <div>
              <p className="text-xs text-smart-secondary">Academic Year</p>

              <p className="mt-1 font-semibold text-smart-primary">2026</p>
            </div>

            <div>
              <p className="text-xs text-smart-secondary">Status</p>

              <div className="mt-1">
                <Badge variant="success">Confirmed</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Roommates + Facilities */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Roommates */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Roommates
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Students currently sharing your room
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
              <Users size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {activeRoommates.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No roommates assigned yet. Room allocation is currently in progress.
              </p>
            ) : activeRoommates.map((roommate) => (
              <div
                key={roommate.id}
                className="flex items-center justify-between rounded-xl border border-black/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-smart-blue/10 font-bold text-smart-blue">
                    {roommate.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>

                  <div>
                    <p className="font-semibold text-smart-primary">
                      {roommate.name}
                    </p>

                    <p className="mt-1 text-xs text-smart-secondary">
                      {roommate.id}
                    </p>
                  </div>
                </div>

                <Badge variant="neutral">{roommate.role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Facilities */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Room Facilities
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Facilities available in your room
              </p>
            </div>

            <ShieldCheck size={22} className="text-smart-blue" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {facilities.map((facility) => {
              const Icon = facility.icon;

              return (
                <div
                  key={facility.name}
                  className="rounded-xl bg-smart-background p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-smart-blue shadow-sm">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-3 font-semibold text-smart-primary">
                    {facility.name}
                  </h3>

                  
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Maintenance */}
      <Card className="mt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
              <Wrench size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Need a Room Repair?
              </h2>

              <p className="mt-1 max-w-xl text-sm text-smart-secondary">
                Report problems with furniture, electrical items, water,
                internet, or other room facilities.
              </p>
            </div>
          </div>

          <Link
            to="/complaints"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            <span>Submit Repair Request</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Room;
