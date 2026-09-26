import { useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  UserRound,
  Building2,
  BedDouble,
  CalendarDays,
  MessageSquareText,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const initialTransfers = [
  {
    id: 1,
    studentName: "K. Arjun",
    studentId: "SEU/IS/22/ICT/069",
    currentRoom: "B-204",
    currentBed: "Bed 02",
    requestedRoom: "C-105",
    requestedBed: "Bed 01",
    reason: "Roommate compatibility issue",
    date: "25 Sep 2026",
    status: "Pending",
  },
  {
    id: 2,
    studentName: "M. Fathima",
    studentId: "SEU/IS/22/ICT/090",
    currentRoom: "A-302",
    currentBed: "Bed 03",
    requestedRoom: "A-205",
    requestedBed: "Bed 02",
    reason: "Closer to study area",
    date: "24 Sep 2026",
    status: "Approved",
  },
  {
    id: 3,
    studentName: "S. Niroshan",
    studentId: "SEU/IS/22/ICT/112",
    currentRoom: "C-110",
    currentBed: "Bed 01",
    requestedRoom: "B-210",
    requestedBed: "Bed 04",
    reason: "Maintenance issue in current room",
    date: "23 Sep 2026",
    status: "Pending",
  },
  {
    id: 4,
    studentName: "R. Kavin",
    studentId: "SEU/IS/22/ICT/102",
    currentRoom: "A-102",
    currentBed: "Bed 02",
    requestedRoom: "B-201",
    requestedBed: "Bed 02",
    reason: "Personal request",
    date: "22 Sep 2026",
    status: "Rejected",
  },
  {
    id: 5,
    studentName: "D. Nimal",
    studentId: "SEU/IS/22/ICT/074",
    currentRoom: "B-204",
    currentBed: "Bed 02",
    requestedRoom: "A-205",
    requestedBed: "Bed 04",
    reason: "Academic schedule",
    date: "20 Sep 2026",
    status: "Approved",
  },
];

function Transfers() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [searchTerm, setSearchTerm] = useState("");

  const pendingCount = transfers.filter(
    (transfer) => transfer.status === "Pending"
  ).length;

  const approvedCount = transfers.filter(
    (transfer) => transfer.status === "Approved"
  ).length;

  const rejectedCount = transfers.filter(
    (transfer) => transfer.status === "Rejected"
  ).length;

  const filteredTransfers = transfers.filter((transfer) => {
    const search = searchTerm.toLowerCase();

    return (
      transfer.studentName.toLowerCase().includes(search) ||
      transfer.studentId.toLowerCase().includes(search) ||
      transfer.currentRoom.toLowerCase().includes(search) ||
      transfer.requestedRoom.toLowerCase().includes(search)
    );
  });

  const handleStatusChange = (id, newStatus) => {
    setTransfers((currentTransfers) =>
      currentTransfers.map((transfer) =>
        transfer.id === id
          ? { ...transfer, status: newStatus }
          : transfer
      )
    );
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return <Badge variant="success">Approved</Badge>;
    }

    if (status === "Rejected") {
      return <Badge variant="danger">Rejected</Badge>;
    }

    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-smart-blue">
            Hostel Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
            Room Transfer Requests
          </h1>

          <p className="mt-2 text-sm text-smart-secondary">
            Review student room transfer requests and manage warden approvals.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-smart-blue/10 px-4 py-3 text-sm font-medium text-smart-blue">
          <ArrowRightLeft size={18} />
          Transfer Management
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">
                Total Requests
              </p>
              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {transfers.length}
              </h2>
            </div>

            <div className="rounded-xl bg-smart-blue/10 p-3 text-smart-blue">
              <ArrowRightLeft size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Pending</p>
              <h2 className="mt-2 text-3xl font-bold text-smart-warning">
                {pendingCount}
              </h2>
            </div>

            <div className="rounded-xl bg-smart-warning/10 p-3 text-smart-warning">
              <Clock3 size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Approved</p>
              <h2 className="mt-2 text-3xl font-bold text-smart-success">
                {approvedCount}
              </h2>
            </div>

            <div className="rounded-xl bg-smart-success/10 p-3 text-smart-success">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Rejected</p>
              <h2 className="mt-2 text-3xl font-bold text-smart-danger">
                {rejectedCount}
              </h2>
            </div>

            <div className="rounded-xl bg-smart-danger/10 p-3 text-smart-danger">
              <XCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card padding="p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
          />

          <input
            type="text"
            placeholder="Search by student, student ID, current room or requested room..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-smart-blue"
          />
        </div>
      </Card>

      {/* Desktop Table */}
      <Card padding="p-0">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Student
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Current
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Requested
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Reason
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTransfers.map((transfer) => (
                <tr
                  key={transfer.id}
                  className="border-b border-black/5 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <p className="font-semibold text-smart-primary">
                          {transfer.studentName}
                        </p>

                        <p className="text-xs text-smart-secondary">
                          {transfer.studentId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-smart-primary">
                        {transfer.currentRoom}
                      </p>

                      <p className="text-xs text-smart-secondary">
                        {transfer.currentBed}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-smart-blue">
                        {transfer.requestedRoom}
                      </p>

                      <p className="text-xs text-smart-secondary">
                        {transfer.requestedBed}
                      </p>
                    </div>
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <p className="text-sm text-smart-secondary">
                      {transfer.reason}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-smart-secondary">
                      <CalendarDays size={16} />
                      {transfer.date}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {getStatusBadge(transfer.status)}
                  </td>

                  <td className="px-5 py-4">
                    {transfer.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            handleStatusChange(transfer.id, "Approved")
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleStatusChange(transfer.id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-smart-secondary">
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {filteredTransfers.map((transfer) => (
            <div
              key={transfer.id}
              className="rounded-xl border border-black/5 bg-smart-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-smart-primary">
                      {transfer.studentName}
                    </p>

                    <p className="text-xs text-smart-secondary">
                      {transfer.studentId}
                    </p>
                  </div>
                </div>

                {getStatusBadge(transfer.status)}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-smart-secondary">
                    Current Room
                  </p>

                  <p className="mt-1 font-semibold text-smart-primary">
                    {transfer.currentRoom}
                  </p>

                  <p className="text-xs text-smart-secondary">
                    {transfer.currentBed}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-smart-secondary">
                    Requested Room
                  </p>

                  <p className="mt-1 font-semibold text-smart-blue">
                    {transfer.requestedRoom}
                  </p>

                  <p className="text-xs text-smart-secondary">
                    {transfer.requestedBed}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <MessageSquareText
                  size={17}
                  className="mt-0.5 shrink-0 text-smart-secondary"
                />

                <p className="text-sm text-smart-secondary">
                  {transfer.reason}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-smart-secondary">
                <CalendarDays size={15} />
                {transfer.date}
              </div>

              {transfer.status === "Pending" && (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() =>
                      handleStatusChange(transfer.id, "Approved")
                    }
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() =>
                      handleStatusChange(transfer.id, "Rejected")
                    }
                  >
                    <XCircle size={16} />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTransfers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ArrowRightLeft
              size={32}
              className="mx-auto text-smart-secondary"
            />

            <p className="mt-3 font-semibold text-smart-primary">
              No transfer requests found
            </p>

            <p className="mt-1 text-sm text-smart-secondary">
              Try changing your search.
            </p>
          </div>
        )}
      </Card>

      {/* Workflow Information */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-smart-teal/10 p-3 text-smart-teal">
            <Building2 size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-smart-primary">
              Transfer Workflow
            </h2>

            <p className="mt-1 text-sm leading-6 text-smart-secondary">
              Students submit a room transfer request with a reason. The
              warden reviews the requested room and bed availability. After
              approval, the old bed can be released and the requested bed can
              be assigned to the student.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-lg bg-smart-background px-3 py-2 text-smart-secondary">
                Student Request
              </span>

              <ArrowRightLeft
                size={15}
                className="text-smart-secondary"
              />

              <span className="rounded-lg bg-smart-warning/10 px-3 py-2 text-smart-warning">
                Warden Review
              </span>

              <ArrowRightLeft
                size={15}
                className="text-smart-secondary"
              />

              <span className="rounded-lg bg-smart-success/10 px-3 py-2 text-smart-success">
                Approve
              </span>

              <ArrowRightLeft
                size={15}
                className="text-smart-secondary"
              />

              <span className="rounded-lg bg-smart-blue/10 px-3 py-2 text-smart-blue">
                Reassign Bed
              </span>

              <BedDouble size={15} className="text-smart-blue" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Transfers;