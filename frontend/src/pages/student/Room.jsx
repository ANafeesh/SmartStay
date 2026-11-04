import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
  ArrowRightLeft,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  FileText,
  Sparkles,
  Loader2,
  Info,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/AuthContext";
import {
  getMyAllocation,
  getStudentTransfers,
  submitTransferRequest,
  cancelTransferRequest,
  getBuildingsList,
  getRoomsByBuilding,
  getAvailableBedsByRoom,
} from "../../services/transferService";

const defaultFacilities = [
  { name: "Wi-Fi", description: "Campus high-speed network", icon: Wifi },
  { name: "Attached Bathroom", description: "Ensuite sanitation facility", icon: Bath },
  { name: "Ceiling Fan", description: "Individual room climate control", icon: Fan },
  { name: "Study Lights", description: "Dedicated desk lighting", icon: Lightbulb },
];

const REASON_CATEGORIES = [
  "Medical & Accessibility Need (e.g., Ground floor required)",
  "Academic Quiet Study Floor (Final year project / dissertation)",
  "Roommate Incompatibility / Mutual Relocation",
  "Room Maintenance / Ventilation / Environmental Issue",
  "Other Justified Personal / Academic Circumstances",
];

function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Room() {
  const { user } = useAuth();
  const studentRegId = user?.studentId || user?.registrationNumber || "STD-2026-090";

  const [allocationData, setAllocationData] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Modal Form State
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [beds, setBeds] = useState([]);
  const [selectedBedId, setSelectedBedId] = useState("");
  const [reasonCategory, setReasonCategory] = useState(REASON_CATEGORIES[0]);
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState("");

  // Load Allocation and Transfers
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [alloc, trs] = await Promise.all([
        getMyAllocation(studentRegId),
        getStudentTransfers(studentRegId),
      ]);
      setAllocationData(alloc);
      setTransfers(trs);
    } catch (err) {
      console.warn("Load room data error:", err);
    } finally {
      setLoading(false);
    }
  }, [studentRegId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load Buildings when modal opens
  useEffect(() => {
    if (isModalOpen) {
      getBuildingsList().then((list) => {
        setBuildings(list);
        if (list.length > 0 && !selectedBuildingId) {
          setSelectedBuildingId(list[0]._id);
        }
      });
    }
  }, [isModalOpen, selectedBuildingId]);

  // Load Rooms when building changes
  useEffect(() => {
    if (selectedBuildingId) {
      getRoomsByBuilding(selectedBuildingId).then((rList) => {
        setRooms(rList);
        if (rList.length > 0) {
          setSelectedRoomId(rList[0]._id);
        } else {
          setSelectedRoomId("");
          setBeds([]);
          setSelectedBedId("");
        }
      });
    }
  }, [selectedBuildingId]);

  // Load Available Beds when room changes
  useEffect(() => {
    if (selectedRoomId) {
      getAvailableBedsByRoom(selectedRoomId).then((bList) => {
        setBeds(bList);
        if (bList.length > 0) {
          setSelectedBedId(bList[0]._id);
        } else {
          setSelectedBedId("");
        }
      });
    }
  }, [selectedRoomId]);

  // Handle Submit Transfer
  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedRoomId || !selectedBedId) {
      setFormError("Please select both a destination room and an available bed.");
      return;
    }

    if (!reason.trim() || reason.trim().length < 10) {
      setFormError("Please provide a valid, detailed justification (at least 10 characters).");
      return;
    }

    if (!confirmed) {
      setFormError("Please confirm the declaration before submitting your request.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        allocationId: allocationData?.allocation?._id,
        studentRegistrationId: studentRegId,
        toRoomId: selectedRoomId,
        toBedId: selectedBedId,
        reasonCategory,
        reason: reason.trim(),
        urgency,
        contactPhone: contactPhone.trim(),
      };

      const result = await submitTransferRequest(payload);

      // Record student notification in local storage
      try {
        const destRoom = rooms.find((r) => r._id === selectedRoomId);
        const destBed = beds.find((b) => b._id === selectedBedId);
        const notifMsg = `Your room transfer request to ${destRoom?.roomNumber || "requested room"} (${destBed?.bedNumber || "Bed"}) has been submitted and is pending Warden review.`;

        const existingNotifs = JSON.parse(
          localStorage.getItem("smartstay_student_notifications") || "[]"
        );
        const newNotif = {
          id: `transfer-sub-${Date.now()}`,
          type: "room",
          title: "Transfer Request Submitted",
          message: notifMsg,
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
          recipientRegId: studentRegId,
        };
        const updated = [newNotif, ...existingNotifs];
        localStorage.setItem("smartstay_student_notifications", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("smartstay-notifications-updated", { detail: updated }));
      } catch (notifErr) {
        console.warn("Could not dispatch submit notification:", notifErr);
      }

      setFeedback({
        type: "success",
        message: result.message || "Room transfer request submitted successfully!",
      });
      setIsModalOpen(false);
      setReason("");
      setConfirmed(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || "Failed to submit room transfer request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Cancel Transfer
  const handleCancelTransfer = async (transferId) => {
    if (!window.confirm("Are you sure you want to cancel this pending room transfer request?")) {
      return;
    }

    setCancellingId(transferId);
    try {
      await cancelTransferRequest(transferId);
      setFeedback({
        type: "success",
        message: "Room transfer request cancelled successfully.",
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to cancel transfer request.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Active or Latest Transfer
  const pendingTransfer = transfers.find((t) => t.status === "Pending");
  const latestTransfer = transfers[0]; // sorted newest first

  // Resolve room details
  const currentRoomNumber =
    allocationData?.room?.roomNumber ||
    (user?.room ? user.room.replace(/^Block\s+[A-Za-z]\s*-\s*Room\s*/i, "") : "B-204");
  const currentBuildingName =
    allocationData?.building?.name ||
    allocationData?.room?.buildingId?.name ||
    user?.building ||
    "Block B - Horizon Hall";
  const currentFloor =
    allocationData?.room?.floor != null
      ? `Floor ${allocationData.room.floor}`
      : "Second Floor";
  const currentBedNumber =
    allocationData?.bed?.bedNumber || user?.bed || "Bed 2";
  const roomCapacity =
    allocationData?.room?.capacity || 3;
  const roomType =
    allocationData?.room?.roomType || "Shared Accommodation";

  const roomSummaryItems = [
    { label: "Room Number", value: currentRoomNumber, icon: BedDouble },
    { label: "Hostel Block", value: currentBuildingName, icon: Building2 },
    { label: "Floor Level", value: currentFloor, icon: Building2 },
    { label: "Allocated Bed", value: currentBedNumber, icon: BedDouble },
  ];

  // Roommates
  const roommates =
    allocationData?.roommates && allocationData.roommates.length > 0
      ? allocationData.roommates.map((r) => ({
          name: r.studentName,
          id: r.studentRegistrationId,
          role: "Roommate",
        }))
      : [
          { name: "Kamal Perera", id: "STD-2026-045", role: "Roommate" },
          { name: "Mohamed Rizwan", id: "STD-2026-078", role: "Roommate" },
        ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Title & Transfer CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-smart-blue">
            <span>Student Accommodation</span>
            <span>·</span>
            <span>Module 1</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
            My Room & Bed Allocation
          </h1>
          <p className="mt-1 text-sm text-smart-secondary">
            View your current allocated hostel room, roommates, and manage room transfer applications.
          </p>
        </div>

        <div>
          {!pendingTransfer ? (
            <Button
              variant="primary"
              onClick={() => {
                setFormError("");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <ArrowRightLeft size={16} />
              <span>Request Room Transfer</span>
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 border border-amber-200">
              <Clock3 size={15} />
              <span>Transfer Pending Warden Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback.message && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: "", message: "" })}
            className="text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Post-Allocation / Transfer Status Banner */}
      {pendingTransfer && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <Clock3 size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-amber-950 sm:text-lg">
                    Room Transfer Application Under Review
                  </h3>
                  <Badge variant="warning">Pending Warden Review</Badge>
                  {pendingTransfer.urgency && pendingTransfer.urgency !== "Normal" && (
                    <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-800">
                      {pendingTransfer.urgency} Urgency
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-amber-900">
                  You requested to move from <strong>{currentRoomNumber} ({currentBedNumber})</strong> to{" "}
                  <strong>
                    {pendingTransfer.toRoomId?.roomNumber || "Target Room"} (
                    {pendingTransfer.toBedId?.bedNumber || "Target Bed"})
                  </strong>
                  .
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-amber-800">
                  <span>
                    <strong>Category:</strong> {pendingTransfer.reasonCategory || "General Request"}
                  </span>
                  <span>·</span>
                  <span>
                    <strong>Date Applied:</strong> {formatDate(pendingTransfer.createdAt)}
                  </span>
                </div>

                <div className="mt-2 rounded-lg bg-white/80 p-3 text-xs text-slate-700 border border-amber-200/60">
                  <strong>Stated Reason:</strong> &ldquo;{pendingTransfer.reason}&rdquo;
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={cancellingId === pendingTransfer._id}
                onClick={() => handleCancelTransfer(pendingTransfer._id)}
              >
                {cancellingId === pendingTransfer._id ? "Cancelling..." : "Cancel Request"}
              </Button>
            </div>
          </div>

          {/* Transfer Workflow Progress */}
          <div className="mt-4 border-t border-amber-200/80 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Workflow Status
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-100/70 px-3 py-1.5 font-semibold text-emerald-800">
                <CheckCircle2 size={14} /> 1. Request Submitted
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-200/80 px-3 py-1.5 font-bold text-amber-900 animate-pulse">
                <Clock3 size={14} /> 2. Warden Assessment
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-slate-500">
                <BedDouble size={14} /> 3. Bed Reallocation & Key Handover
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approved Transfer Notice */}
      {!pendingTransfer && latestTransfer && latestTransfer.status === "Approved" && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-emerald-950 sm:text-lg">
                  Room Transfer Approved & Reallocated
                </h3>
                <Badge variant="success">Approved</Badge>
              </div>
              <p className="mt-1 text-sm text-emerald-900">
                Your transfer request has been <strong>approved</strong> by the Hostel Warden! Your active room allocation has been updated to <strong>{currentRoomNumber} ({currentBedNumber})</strong>.
              </p>
              <div className="mt-2 text-xs text-emerald-800 font-medium">
                Please visit the Hostel Warden Office with your student ID to collect your new room key and complete the physical room move.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Overview Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-smart-blue/10 text-smart-blue">
                <BedDouble size={28} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-smart-secondary">
                  Current Room Assignment
                </p>
                <h2 className="mt-0.5 text-2xl font-bold text-smart-primary">
                  Room {currentRoomNumber}
                </h2>
                <p className="text-xs text-smart-secondary">
                  {currentBuildingName} · {currentFloor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success">Active Allocation</Badge>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {roomType}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roomSummaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl bg-smart-background p-4 border border-black/5">
                  <Icon size={18} className="text-smart-blue" />
                  <p className="mt-2 text-xs text-smart-secondary">{item.label}</p>
                  <p className="mt-1 font-semibold text-smart-primary text-sm truncate">{item.value}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Allocation Info Card */}
        <Card>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="font-bold text-smart-primary">Semester Allocation</h2>
              <p className="text-xs text-smart-secondary">Academic Year 2026</p>
            </div>
          </div>

          <div className="mt-4 space-y-3.5 text-sm">
            <div>
              <p className="text-xs text-smart-secondary">Student Registration ID</p>
              <p className="mt-0.5 font-semibold text-smart-primary">{studentRegId}</p>
            </div>
            <div>
              <p className="text-xs text-smart-secondary">Allocation Status</p>
              <div className="mt-1">
                <Badge variant="success">Confirmed & In Residence</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-smart-secondary">Room Capacity</p>
              <p className="mt-0.5 font-semibold text-smart-primary">{roomCapacity} Beds Total</p>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-smart-secondary">Room Transfer Option</p>
              <p className="mt-1 text-xs text-slate-600">
                Eligible students may submit a transfer application for medical, academic, or personal needs.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Roommates & Facilities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Roommates Card */}
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">Roommates</h2>
              <p className="text-xs text-smart-secondary">Students sharing your current room</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
              <Users size={18} />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {roommates.map((roommate) => (
              <div
                key={roommate.id}
                className="flex items-center justify-between rounded-xl border border-black/5 bg-slate-50/50 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-smart-blue/10 font-bold text-smart-blue text-sm">
                    {roommate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-smart-primary text-sm">{roommate.name}</p>
                    <p className="text-xs text-smart-secondary">{roommate.id}</p>
                  </div>
                </div>
                <Badge variant="neutral">{roommate.role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Room Facilities */}
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">Room Facilities</h2>
              <p className="text-xs text-smart-secondary">Amenities provided in your current room</p>
            </div>
            <ShieldCheck size={20} className="text-smart-blue" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {defaultFacilities.map((facility) => {
              const Icon = facility.icon;
              return (
                <div key={facility.name} className="rounded-xl bg-smart-background p-3.5 border border-black/5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-smart-blue shadow-xs">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-semibold text-smart-primary text-sm">{facility.name}</h3>
                  </div>
                  <p className="mt-2 text-xs text-smart-secondary">{facility.description}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Room Repair CTA */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
              <Wrench size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-smart-primary">Need a Room Maintenance Repair?</h2>
              <p className="mt-0.5 max-w-xl text-sm text-smart-secondary">
                Report electrical faults, plumbing leakage, ceiling fan repairs, or furniture replacements directly to the hostel maintenance desk.
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

      {/* Transfer Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsModalOpen(false);
            setFormError("");
          }
        }}
        title="Apply for Room Transfer"
        subtitle="Submit a formal room change request to the Hostel Warden Office"
        size="lg"
      >
        <form onSubmit={handleSubmitTransfer} className="space-y-5">
          {formError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Current Allocation Snapshot */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Current Room Assignment
            </p>
            <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-blue-700">Hostel Block</p>
                <p className="font-semibold text-blue-950 truncate">{currentBuildingName}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Current Room</p>
                <p className="font-semibold text-blue-950">{currentRoomNumber}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Current Bed</p>
                <p className="font-semibold text-blue-950">{currentBedNumber}</p>
              </div>
            </div>
          </div>

          {/* Step 1: Destination Preferences */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Choose Destination Room & Bed
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* Block Selection */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Target Hostel Block *
                </label>
                <select
                  value={selectedBuildingId}
                  onChange={(e) => setSelectedBuildingId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {buildings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Selection */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Target Room *
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  disabled={rooms.length === 0}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {rooms.length === 0 ? (
                    <option value="">No rooms available</option>
                  ) : (
                    rooms.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roomNumber} (Floor {r.floor} · {r.capacity} Beds)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Available Bed Selection */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Target Bed (Available Only) *
                </label>
                <select
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  disabled={beds.length === 0}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {beds.length === 0 ? (
                    <option value="">No free beds in this room</option>
                  ) : (
                    beds.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.bedNumber} (Status: Available)
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {beds.length === 0 && selectedRoomId && (
              <p className="text-xs text-amber-700 flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <Info size={14} />
                <span>All beds in this room are currently occupied. Please choose another room with available bed capacity.</span>
              </p>
            )}
          </div>

          {/* Step 2: Reason Category & Urgency */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Transfer Justification & Urgency
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Reason Category *
                </label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {REASON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Priority / Urgency Level *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Normal", "High", "Critical"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`rounded-xl py-2 text-xs font-bold transition border cursor-pointer ${
                        urgency === lvl
                          ? lvl === "Critical"
                            ? "bg-rose-600 text-white border-rose-600"
                            : lvl === "High"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Statement */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Detailed Reason & Statement for Warden Review *
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you are requesting this transfer (e.g. medical doctor recommendation for ground floor, quiet study need for thesis, etc.)..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-[11px] text-slate-400 text-right">
                {reason.length} characters (minimum 10)
              </p>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Contact Phone for Warden Inspection / Interview
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I confirm that the information provided is genuine and understand that room transfers are subject to bed availability and Warden approval.
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="neutral"
              disabled={submitting}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || beds.length === 0}
              className="flex items-center gap-2"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              <span>{submitting ? "Submitting..." : "Submit Transfer Request"}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Room;
