import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  BedDouble,
  ShoppingBag,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Users,
  QrCode,
  X,
  CheckCircle2,
  LogIn,
  LogOut,
  ExternalLink,
  Printer,
  Scan,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import QRCodeLib from "qrcode";
import Modal from "../../components/ui/Modal";
import {
  getStudentPassDetails,
  getGateMovementState,
  recordStudentMovement,
  fetchMyDigitalPass,
} from "../../services/gatePassService";

const stats = [
  {
    title: "Outstanding Balance",
    value: "Rs. 12,500",
    badge: "Due Soon",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    icon: Wallet,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Room Assigned",
    value: "B-204",
    badge: "Active",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    icon: BedDouble,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    title: "Food Orders",
    value: "08",
    badge: "This Month",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
    icon: ShoppingBag,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Open Complaints",
    value: "02",
    badge: "In Progress",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/60",
    icon: AlertCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

function StudentDashboard() {
  const { user } = useAuth();
  const [showPassModal, setShowPassModal] = useState(false);

  const studentName = user?.name || "Ahamed Nafeesh";
  const studentRegId = user?.studentId || "STD-2026-090";
  const roomNumber = user?.room || "B-204";

  const passDetails = getStudentPassDetails(user);
  const [gateState, setGateState] = useState(() =>
    getGateMovementState(studentRegId)
  );
  const [scanResult, setScanResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Real backend digital pass state
  const [realPassData, setRealPassData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [passError, setPassError] = useState(null);

  const loadBackendPass = async () => {
    setIsLoadingPass(true);
    setPassError(null);
    try {
      const data = await fetchMyDigitalPass();
      setRealPassData(data);
      const pass = data.pass;
      const qrPayload = JSON.stringify({
        protocol: "SMARTSTAY_PASS_V1",
        qrToken: data.qrToken,
        passNumber: pass?.passNumber,
        studentRegistrationId: pass?.studentRegistrationId || studentRegId,
      });

      const url = await QRCodeLib.toDataURL(qrPayload, {
        width: 240,
        margin: 2,
        errorCorrectionLevel: "M",
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.warn("Could not load backend pass, fallback to display helper:", err);
      setPassError(err.message || "Failed to retrieve live pass from backend.");
      // Fallback QR code with passToken
      try {
        const fallbackUrl = await QRCodeLib.toDataURL(
          JSON.stringify({
            protocol: "SMARTSTAY_PASS_V1",
            qrToken: passDetails.passToken,
            passNumber: passDetails.passNumber,
            studentRegistrationId: studentRegId,
          }),
          { width: 240, margin: 2, errorCorrectionLevel: "M" }
        );
        setQrDataUrl(fallbackUrl);
      } catch {}
    } finally {
      setIsLoadingPass(false);
    }
  };

  useEffect(() => {
    if (showPassModal) {
      loadBackendPass();
    }
  }, [showPassModal, studentRegId]);

  useEffect(() => {
    setGateState(getGateMovementState(studentRegId));
  }, [studentRegId, showPassModal]);

  // Interactive Gatekeeper Scan Simulator (Test Actions)
  const handleSimulateScan = async (forcedDirection = null) => {
    setIsSimulating(true);
    try {
      const res = await recordStudentMovement({
        studentId: studentRegId,
        studentName,
        room: roomNumber,
        targetDirection: forcedDirection,
        gateName: "Main Campus Gate 01",
        officerName: "Officer on Duty (Gate 01)",
        qrToken: realPassData?.qrToken,
        passNumber: realPassData?.pass?.passNumber,
      });

      setScanResult(res);
      if (res.state) {
        setGateState(res.state);
      }
      if (res.success) {
        loadBackendPass();
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const isCurrentlyInside =
    realPassData?.pass?.lastMovementDirection
      ? realPassData.pass.lastMovementDirection === "IN"
      : gateState?.currentLocation === "INSIDE";

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6 pb-12">
      {/* Title Header with Pass Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Overview of hostel services, fees, room allocation, and digital gate pass.
          </p>
        </div>

        <button
          onClick={() => {
            setScanResult(null);
            setShowPassModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition cursor-pointer self-start sm:self-auto"
        >
          <QrCode size={16} />
          <span>Digital Gate Pass</span>
          <span className="rounded-full bg-emerald-700/60 px-1.5 py-0.5 text-[10px]">
            {isCurrentlyInside ? "Inside" : "Outside"}
          </span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-1">
                <div
                  className={`flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-1 text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Payments & Room */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Payments Section */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Billing Invoices
              </h2>
            </div>
            <Link
              to="/payments"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>View Invoices</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            <PaymentRow
              title="Hostel Fee & Room Rent (Semester 2)"
              date="05 Oct 2026"
              amount="LKR 15,000"
              status="Pending"
            />
            <PaymentRow
              title="Electricity & AC Surcharge (August)"
              date="20 Sep 2026"
              amount="LKR 3,050"
              status="Overdue"
            />
            <PaymentRow
              title="Water Service & Common Maintenance"
              date="15 Oct 2026"
              amount="LKR 1,200"
              status="Pending"
            />
          </div>
        </div>

        {/* Room & Allocation Card */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/60 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                Assigned Quarters
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Resident
              </span>
            </div>

            <div className="py-4">
              <p className="text-xs text-slate-400 font-medium">Hostel Room</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                Room {roomNumber}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Hostel Block B • Bed 02 (Olu Block)
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Room Type:</span>
                <span className="font-bold text-slate-800">Double Non-AC</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Gate Pass Status:</span>
                <span className="font-bold text-emerald-600">
                  {isCurrentlyInside ? "Inside Campus" : "Outside Campus"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Last Gate Log:</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {gateState?.lastMovement?.time || "Today 08:30 AM"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={() => {
                setScanResult(null);
                setShowPassModal(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              <QrCode size={14} />
              <span>Show Gate Pass</span>
            </button>
            <Link
              to="/room"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* UPGRADED ACCESSIBLE DIGITAL STUDENT GATE PASS MODAL */}
      {/* ========================================================= */}
      {showPassModal && (
        <Modal
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
          size="md"
          title="Digital Student Gate Pass"
          subtitle="Authorized QR Token for Campus Security Checkpoints"
        >
          <div className="space-y-4">
            {/* Live Movement Notification Banner */}
            {scanResult && (
              <div
                className={`rounded-2xl border p-3.5 text-xs transition-all animate-in fade-in duration-200 ${
                  scanResult.success === false || scanResult.error
                    ? "bg-rose-50 border-rose-200 text-rose-950"
                    : scanResult.direction === "OUT"
                    ? "bg-blue-50 border-blue-200 text-blue-950"
                    : "bg-emerald-50 border-emerald-200 text-emerald-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${
                      scanResult.success === false || scanResult.error
                        ? "bg-rose-600"
                        : scanResult.direction === "OUT"
                        ? "bg-blue-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    {scanResult.success === false || scanResult.error ? (
                      <AlertCircle size={16} />
                    ) : scanResult.direction === "OUT" ? (
                      <LogOut size={16} />
                    ) : (
                      <LogIn size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold uppercase tracking-wide">
                        Gate Movement Response:
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-black text-[10px] text-white ${
                          scanResult.success === false || scanResult.error
                            ? "bg-rose-600"
                            : scanResult.direction === "OUT"
                            ? "bg-blue-600"
                            : "bg-emerald-600"
                        }`}
                      >
                        {scanResult.success === false || scanResult.error
                          ? "REJECTED"
                          : scanResult.actionLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold leading-tight">
                      {scanResult.message}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Recorded at {scanResult.gateName} • {scanResult.time}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pass Card Container */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/70 to-white p-5 text-center shadow-xs">
              {/* Actual Camera-Scannable QR Code */}
              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl bg-white border-2 border-dashed border-emerald-300 p-2 shadow-xs">
                {isLoadingPass ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                    <span className="text-[11px] font-semibold">Generating QR...</span>
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Digital Gate Pass QR code for ${studentName}`}
                    className="h-48 w-48 rounded-xl object-contain"
                  />
                ) : (
                  <div className="text-xs text-rose-500 p-4">
                    Failed to render QR.
                  </div>
                )}
              </div>

              {/* Student Identity Card Data */}
              <div className="mt-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  {realPassData?.pass?.studentName || studentName}
                </h3>
                <p className="font-mono text-xs font-bold text-blue-600">
                  {realPassData?.pass?.studentRegistrationId || studentRegId}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hostel Room {realPassData?.pass?.room || roomNumber} • Pass #
                  {realPassData?.pass?.passNumber || passDetails.passNumber}
                </p>
              </div>

              {/* Security Clearance and Live Campus Location Indicators */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 size={12} />
                  <span>
                    Status: {realPassData?.pass?.status || "Active"}
                  </span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    isCurrentlyInside
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isCurrentlyInside ? "bg-blue-600" : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  <span>
                    Location: {isCurrentlyInside ? "Inside Campus" : "Outside Campus"}
                  </span>
                </span>
              </div>

              {/* Approved Leave Notice if student has active leave */}
              {realPassData?.hasActiveLeave && (
                <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/80 p-2.5 text-xs text-indigo-900">
                  <div className="font-bold flex items-center justify-center gap-1">
                    <span>Approved Leave Active</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Destination: {realPassData?.activeLeave?.destination || "Home"} • Expected Return:{" "}
                    {new Date(realPassData?.activeLeave?.expectedReturnDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                Present this high-contrast QR code to campus gate security
              </p>
            </div>

            {/* GATEKEEPER SCAN SIMULATOR CONTROLS */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Scan size={15} className="text-blue-600" />
                  <span>Testing Simulator (Module 2 Verification)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Simulated Scan Actions
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateScan("OUT")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
                    scanResult?.direction === "OUT"
                      ? "bg-blue-600 text-white ring-2 ring-blue-400"
                      : "bg-white border border-slate-200 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <LogOut size={14} />
                  <span>🧪 Test Simulator: EXIT</span>
                </button>

                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateScan("IN")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
                    scanResult?.direction === "IN"
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                      : "bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <LogIn size={14} />
                  <span>🧪 Test Simulator: ENTER</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/gate/verify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <span>Open Real Camera Gatekeeper Terminal</span>
                  <ExternalLink size={12} />
                </Link>

                <span className="text-[10px] font-mono text-slate-400">
                  State: {isCurrentlyInside ? "IN" : "OUT"}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PaymentRow({ title, date, amount, status }) {
  const isPaid = status === "Paid";
  const isOverdue = status === "Overdue";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
            isPaid
              ? "bg-emerald-50 text-emerald-600"
              : isOverdue
              ? "bg-rose-50 text-rose-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {isPaid ? "✓" : "!"}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">{title}</p>
          <p className="text-[10px] text-slate-400">Due: {date}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs font-bold text-slate-900">{amount}</p>
        <span
          className={`text-[10px] font-semibold ${
            isPaid
              ? "text-emerald-600"
              : isOverdue
              ? "text-rose-600"
              : "text-amber-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default StudentDashboard;
