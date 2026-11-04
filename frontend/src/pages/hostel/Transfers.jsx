
import { useCallback, useEffect, useState } from "react";
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
  Phone,
  AlertTriangle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

import { API_BASE_URL, getAuthToken } from "../../services/apiClient";
import { SAMPLE_TRANSFERS } from "../../services/hostelFallbackData";

const API_URL = `${API_BASE_URL}/transfers`;

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function roomLabel(room) {
  if (!room) return "—";

  const roomNumber = room.roomNumber ?? "Unknown";
  const buildingCode =
    room.buildingId?.code ?? room.buildingId?.name;

  return buildingCode
    ? `${buildingCode} - ${roomNumber}`
    : roomNumber;
}

function formatBedLabel(bed) {
  if (!bed) return "—";
  const label = typeof bed === "object" ? (bed.bedNumber || bed.name || bed.number) : bed;
  if (!label) return "—";
  return String(label).toLowerCase().startsWith("bed") ? String(label) : `Bed ${label}`;
}

function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(API_URL, { headers, credentials: "include" }).catch(() => null);
      if (!response || !response.ok) {
        console.warn("Transfer API notice, fallback to sample transfers");
        setTransfers(SAMPLE_TRANSFERS);
        return;
      }

      const result = await response.json();
      const list = Array.isArray(result) ? result : result.data;
      setTransfers(Array.isArray(list) && list.length ? list : SAMPLE_TRANSFERS);
    } catch (err) {
      setError(
        `${err.message}. Check that your backend is running on port 5000.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleStatusChange = async (transfer, newStatus) => {
    if (transfer.status !== "Pending") return;

    const action = newStatus === "Approved" ? "approve" : "reject";

    setBusyId(transfer._id);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/${transfer._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || `Failed to ${action} transfer`);
      }

      setSuccess(
        result.message || `Transfer ${newStatus.toLowerCase()} successfully`
      );

      // Record student notification in local storage
      try {
        const studentReg = transfer.studentRegistrationId;
        const destRoomText = roomLabel(transfer.toRoomId);
        const destBedText = formatBedLabel(transfer.toBedId);

        const notifTitle =
          newStatus === "Approved"
            ? "Room Transfer Approved - New Bed Allocated"
            : "Room Transfer Request Rejected";

        const notifMsg =
          newStatus === "Approved"
            ? `Great news! Your room transfer request to ${destRoomText} (${destBedText}) has been approved by the Warden and your room is now officially allocated.`
            : `Your room transfer request to ${destRoomText} was reviewed and rejected by the Warden. Please consult the Hostel Office if you have questions.`;

        const existingRaw = localStorage.getItem("smartstay_student_notifications");
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const newNotif = {
          id: `transfer-${action}-${Date.now()}`,
          type: "room",
          title: notifTitle,
          message: notifMsg,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          recipientRegId: studentReg,
        };

        const updatedList = [newNotif, ...existingList];
        localStorage.setItem(
          "smartstay_student_notifications",
          JSON.stringify(updatedList)
        );
        window.dispatchEvent(
          new CustomEvent("smartstay-notifications-updated", {
            detail: updatedList,
          })
        );
      } catch (notifErr) {
        console.warn("Could not dispatch transfer student notification:", notifErr);
      }

      // Reload from MongoDB instead of only changing local state.
      await fetchTransfers();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = transfers.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = transfers.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = transfers.filter(
    (item) => item.status === "Rejected"
  ).length;

  const filteredTransfers = transfers.filter((transfer) => {
    const allocation = transfer.allocationId || {};

    const studentName =
      allocation.studentName || transfer.studentName || "";

    const studentId = transfer.studentRegistrationId || "";

    const currentRoom = roomLabel(transfer.fromRoomId);
    const requestedRoom = roomLabel(transfer.toRoomId);

    const search = searchTerm.toLowerCase();

    return [
      studentName,
      studentId,
      currentRoom,
      requestedRoom,
    ].some((value) => value.toLowerCase().includes(search));
  });

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return <Badge variant="success">Approved</Badge>;
    }

    if (status === "Rejected") {
      return <Badge variant="danger">Rejected</Badge>;
    }

    return <Badge variant="warning">{status || "Pending"}</Badge>;
  };

  const renderActions = (transfer) => {
    if (transfer.status !== "Pending") {
      return (
        <span className="text-xs text-smart-secondary">
          Reviewed
        </span>
      );
    }

    const isBusy = busyId === transfer._id;

    return (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="primary"
          disabled={busyId !== null}
          onClick={() => handleStatusChange(transfer, "Approved")}
        >
          <CheckCircle2 size={15} />
          {isBusy ? "Processing..." : "Approve"}
        </Button>

        <Button
          size="sm"
          variant="danger"
          disabled={busyId !== null}
          onClick={() => handleStatusChange(transfer, "Rejected")}
        >
          <XCircle size={15} />
          Reject
        </Button>
      </div>
    );
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

      {/* API messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={fetchTransfers}
          >
            Retry
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-smart-secondary">Total Requests</p>
          <h2 className="mt-2 text-3xl font-bold text-smart-primary">
            {transfers.length}
          </h2>
          <ArrowRightLeft className="mt-3 text-smart-blue" size={24} />
        </Card>

        <Card>
          <p className="text-sm text-smart-secondary">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-smart-warning">
            {pendingCount}
          </h2>
          <Clock3 className="mt-3 text-smart-warning" size={24} />
        </Card>

        <Card>
          <p className="text-sm text-smart-secondary">Approved</p>
          <h2 className="mt-2 text-3xl font-bold text-smart-success">
            {approvedCount}
          </h2>
          <CheckCircle2 className="mt-3 text-smart-success" size={24} />
        </Card>

        <Card>
          <p className="text-sm text-smart-secondary">Rejected</p>
          <h2 className="mt-2 text-3xl font-bold text-smart-danger">
            {rejectedCount}
          </h2>
          <XCircle className="mt-3 text-smart-danger" size={24} />
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
            placeholder="Search by student, registration ID or room..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-smart-blue"
          />
        </div>
      </Card>

      {/* Transfer Requests */}
      <Card padding="p-0">
        {loading ? (
          <div className="p-10 text-center text-sm text-smart-secondary">
            Loading transfer requests...
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5 bg-smart-background">
                    {[
                      "Student",
                      "Current",
                      "Requested",
                      "Reason",
                      "Date",
                      "Status",
                      "Action",
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
                  {filteredTransfers.map((transfer) => {
                    const allocation = transfer.allocationId || {};

                    return (
                      <tr
                        key={transfer._id}
                        className="border-b border-black/5 last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
                              <UserRound size={18} />
                            </div>

                            <div>
                              <p className="font-semibold text-smart-primary">
                                {allocation.studentName ||
                                  transfer.studentName ||
                                  "Student"}
                              </p>
                              <p className="text-xs text-smart-secondary">
                                {transfer.studentRegistrationId}
                              </p>
                              {transfer.contactPhone && (
                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-smart-secondary">
                                  <Phone size={11} className="text-smart-secondary/70" />
                                  <span>{transfer.contactPhone}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-smart-primary">
                            {roomLabel(transfer.fromRoomId)}
                          </p>
                          <p className="text-xs text-smart-secondary">
                            {formatBedLabel(transfer.fromBedId)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-smart-blue">
                            {roomLabel(transfer.toRoomId)}
                          </p>
                          <p className="text-xs text-smart-secondary">
                            {formatBedLabel(transfer.toBedId)}
                          </p>
                        </td>

                        <td className="max-w-xs px-5 py-4">
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            {transfer.reasonCategory && (
                              <span className="inline-block rounded-md bg-smart-blue/10 px-2 py-0.5 text-[11px] font-medium text-smart-blue">
                                {transfer.reasonCategory}
                              </span>
                            )}
                            {transfer.urgency && transfer.urgency !== "Normal" && (
                              <span
                                className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                  transfer.urgency === "Critical"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {transfer.urgency} Urgency
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-smart-secondary leading-snug line-clamp-2" title={transfer.reason}>
                            {transfer.reason}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-smart-secondary">
                            <CalendarDays size={16} />
                            {formatDate(transfer.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {getStatusBadge(transfer.status)}
                        </td>

                        <td className="px-5 py-4">
                          {renderActions(transfer)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 lg:hidden">
              {filteredTransfers.map((transfer) => {
                const allocation = transfer.allocationId || {};

                return (
                  <div
                    key={transfer._id}
                    className="rounded-xl border border-black/5 bg-smart-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
                          <UserRound size={18} />
                        </div>

                        <div>
                          <p className="font-semibold text-smart-primary">
                            {allocation.studentName ||
                              transfer.studentName ||
                              "Student"}
                          </p>
                          <p className="text-xs text-smart-secondary">
                            {transfer.studentRegistrationId}
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
                          {roomLabel(transfer.fromRoomId)}
                        </p>
                        <p className="text-xs text-smart-secondary">
                          {formatBedLabel(transfer.fromBedId)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs text-smart-secondary">
                          Requested Room
                        </p>
                        <p className="mt-1 font-semibold text-smart-blue">
                          {roomLabel(transfer.toRoomId)}
                        </p>
                        <p className="text-xs text-smart-secondary">
                          {formatBedLabel(transfer.toBedId)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {transfer.reasonCategory && (
                          <span className="inline-block rounded-md bg-smart-blue/10 px-2 py-0.5 text-[11px] font-medium text-smart-blue">
                            {transfer.reasonCategory}
                          </span>
                        )}
                        {transfer.urgency && transfer.urgency !== "Normal" && (
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              transfer.urgency === "Critical"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {transfer.urgency} Urgency
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageSquareText
                          size={17}
                          className="mt-0.5 shrink-0 text-smart-secondary"
                        />
                        <p className="text-sm text-smart-secondary">
                          {transfer.reason}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-smart-secondary">
                      <CalendarDays size={15} />
                      {formatDate(transfer.createdAt)}
                    </div>

                    <div className="mt-4">
                      {renderActions(transfer)}
                    </div>
                  </div>
                );
              })}
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
                  {transfers.length === 0
                    ? "No requests have been created in the database yet."
                    : "Try changing your search."}
                </p>
              </div>
            )}
          </>
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
              Wardens review requests and destination bed availability.
              Approving a request updates the student's allocation in the
              backend. Rejecting a request leaves the allocation unchanged.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-lg bg-smart-background px-3 py-2 text-smart-secondary">
                Student Request
              </span>
              <ArrowRightLeft size={15} className="text-smart-secondary" />
              <span className="rounded-lg bg-smart-warning/10 px-3 py-2 text-smart-warning">
                Warden Review
              </span>
              <ArrowRightLeft size={15} className="text-smart-secondary" />
              <span className="rounded-lg bg-smart-success/10 px-3 py-2 text-smart-success">
                Approve
              </span>
              <ArrowRightLeft size={15} className="text-smart-secondary" />
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
