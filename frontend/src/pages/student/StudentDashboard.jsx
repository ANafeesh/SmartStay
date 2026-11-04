import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  BedDouble,
  ShoppingBag,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  LogIn,
  LogOut,
  ExternalLink,
  Scan,
  RefreshCw,
  Check,
  Clock,
} from "lucide-react";
import { useAuth, isDemoUser } from "../../context/AuthContext";
import QRCodeLib from "qrcode";
import Modal from "../../components/ui/Modal";
import QRCode from "../../utils/qrCode";
import {
  getStudentPassDetails,
  getGateMovementState,
  fetchMyDigitalPass,
} from "../../services/gatePassService";

function StudentDashboard() {
  const { user } = useAuth();
  const [showPassModal, setShowPassModal] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const isDemo = isDemoUser(user) || user?.isDemo || user?.email === "nafeesh@campus.edu";
  const studentName = user?.name || (isDemo ? "Ahamed Nafeesh" : "Student User");
  const studentRegId = user?.studentId || user?.registrationNumber || (isDemo ? "STD-2026-090" : "Unassigned");
  const roomNumber = user?.room || (isDemo ? "B-204" : "Not Allocated");

  const dynamicStats = [
    {
      title: "Outstanding balance",
      value: isDemo ? "LKR 12,500" : "LKR 0",
      badge: isDemo ? "Due soon" : "Settled",
      badgeColor: isDemo ? "bg-amber-50 text-amber-800 border-amber-200/80" : "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      icon: Wallet,
      link: "/payments",
    },
    {
      title: "Room assigned",
      value: roomNumber,
      badge: user?.room || isDemo ? "Allocated" : "Pending",
      badgeColor: user?.room || isDemo ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-slate-100 text-slate-500 border-slate-200",
      icon: BedDouble,
      link: "/room",
    },
    {
      title: "Food orders",
      value: isDemo ? "08" : "00",
      badge: isDemo ? "October" : "None",
      badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
      icon: ShoppingBag,
      link: "/marketplace",
    },
    {
      title: "Open complaints",
      value: isDemo ? "02" : "00",
      badge: isDemo ? "In review" : "None",
      badgeColor: isDemo ? "bg-rose-50 text-rose-700 border-rose-200/70" : "bg-slate-100 text-slate-600 border-slate-200",
      icon: AlertCircle,
      link: "/complaints",
    },
  ];

  const passDetails = getStudentPassDetails(user);
  const [gateState, setGateState] = useState(() =>
    getGateMovementState(studentRegId)
  );

  // Real backend digital pass state
  const getInitialVerificationUrl = () => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const routePrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    return `${origin}${routePrefix}/gate/verify?token=${encodeURIComponent(
      passDetails.passToken
    )}&passNumber=${encodeURIComponent(
      passDetails.passNumber
    )}&studentId=${encodeURIComponent(studentRegId)}&name=${encodeURIComponent(
      studentName
    )}&room=${encodeURIComponent(roomNumber)}&status=Active`;
  };

  const [realPassData, setRealPassData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [verificationDirectUrl, setVerificationDirectUrl] = useState(getInitialVerificationUrl);
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [passError, setPassError] = useState(null);

  const loadBackendPass = async () => {
    setIsLoadingPass(true);
    setPassError(null);
    try {
      const data = await fetchMyDigitalPass();
      setRealPassData(data);
      const pass = data?.pass;

      const hostIp =
        window.location.hostname &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
          ? window.location.hostname
          : data?.lanIp || "localhost";

      const origin =
        window.location.hostname &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
          ? window.location.origin
          : `http://${hostIp}:${window.location.port || "5173"}`;

      const tokenVal = data?.qrToken || pass?.qrToken || passDetails.passToken;
      const passNum = pass?.passNumber || passDetails.passNumber;
      const sId = pass?.studentRegistrationId || studentRegId;
      const sName = pass?.studentName || studentName;
      const sRoom = pass?.room || roomNumber;
      const sStatus = pass?.status || "Active";

      const routePrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      const verificationUrl = `${origin}${routePrefix}/gate/verify?token=${encodeURIComponent(
        tokenVal
      )}&passNumber=${encodeURIComponent(passNum)}&studentId=${encodeURIComponent(
        sId
      )}&name=${encodeURIComponent(sName)}&room=${encodeURIComponent(
        sRoom
      )}&status=${encodeURIComponent(sStatus)}`;

      setVerificationDirectUrl(verificationUrl);

      const url = await QRCodeLib.toDataURL(verificationUrl, {
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

      const hostIp =
        window.location.hostname &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
          ? window.location.hostname
          : "localhost";

      const origin =
        window.location.hostname &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
          ? window.location.origin
          : `http://${hostIp}:${window.location.port || "5173"}`;

      const routePrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      const fallbackVerificationUrl = `${origin}${routePrefix}/gate/verify?token=${encodeURIComponent(
        passDetails.passToken
      )}&passNumber=${encodeURIComponent(
        passDetails.passNumber
      )}&studentId=${encodeURIComponent(studentRegId)}&name=${encodeURIComponent(
        studentName
      )}&room=${encodeURIComponent(roomNumber)}&status=Active`;

      setVerificationDirectUrl(fallbackVerificationUrl);

      try {
        const fallbackUrl = await QRCodeLib.toDataURL(fallbackVerificationUrl, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        setQrDataUrl(fallbackUrl);
      } catch {}
    } finally {
      setIsLoadingPass(false);
    }
  };

  useEffect(() => {
    loadBackendPass();
  }, [studentRegId]);

  useEffect(() => {
    if (!showPassModal) return;

    loadBackendPass();

    const pollTimer = setInterval(() => {
      loadBackendPass();
    }, 3000);

    const onFocus = () => loadBackendPass();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("focus", onFocus);
    };
  }, [showPassModal, studentRegId]);

  useEffect(() => {
    setGateState(getGateMovementState(studentRegId));
  }, [studentRegId, showPassModal]);

  const isCurrentlyInside =
    realPassData?.pass?.lastMovementDirection
      ? realPassData.pass.lastMovementDirection !== "OUT" && realPassData.pass.status !== "OnLeave"
      : gateState?.currentLocation === "INSIDE";

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Title Header with Pass Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Hostel residency, billing records, and gate security tokens
          </p>
        </div>

        <button
          onClick={() => {
            setScanResult(null);
            setShowPassModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <QrCode size={15} />
          <span>Digital Gate Pass</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">
            {isCurrentlyInside ? "INSIDE" : "OUTSIDE"}
          </span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {dynamicStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              to={stat.link || "#"}
              className="rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-blue-400 hover:shadow-sm cursor-pointer block group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-1 text-2xl font-semibold font-mono tabular-nums tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Payments & Room */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Invoices Section */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Billing Invoices
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Semester room rent, utilities, and maintenance charges</p>
            </div>
            <Link
              to="/payments"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>View all invoices</span>
              <ChevronRight size={14} className="text-slate-400" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            <PaymentRow
              title="Hostel fee and room rent (Semester 2)"
              date="05 Oct 2026"
              amount="LKR 15,000"
              status="Pending"
            />
            <PaymentRow
              title="Electricity and AC surcharge (August)"
              date="20 Sep 2026"
              amount="LKR 3,050"
              status="Overdue"
            />
            <PaymentRow
              title="Water service and common maintenance"
              date="15 Oct 2026"
              amount="LKR 1,200"
              status="Pending"
            />
          </div>
        </div>

        {/* Room & Allocation Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                Room allocation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Registered resident
              </span>
            </div>

            <div className="py-4">
              <p className="text-xs text-slate-400">Assigned hostel room</p>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 mt-1 font-mono">
                Room {roomNumber}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Hostel Block B · Bed 02 (Olu Block)
              </p>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Room type</span>
                <span className="font-medium text-slate-800">Double Non-AC</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Gate status</span>
                <span className="font-medium text-slate-800 font-mono">
                  {isCurrentlyInside ? "Inside Campus" : "Outside Campus"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Last gate log</span>
                <span className="font-mono text-[11px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {gateState?.lastMovement?.time || "Today 08:30 AM"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 flex gap-2">
            <button
              onClick={() => {
                setScanResult(null);
                setShowPassModal(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <QrCode size={14} />
              <span>Show Gate Pass</span>
            </button>
            <Link
              to="/room"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACCESSIBLE DIGITAL STUDENT GATE PASS MODAL */}
      {/* ========================================================= */}
      {showPassModal && (
        <Modal
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
          size="md"
          title="Digital Student Gate Pass"
          subtitle="Authorized QR token for campus security checkpoints"
        >
          <div className="space-y-4">
            {/* Live Movement Notification Banner */}
            {scanResult && (
              <div
                className={`rounded-xl border p-3.5 text-xs transition-colors ${
                  scanResult.success === false || scanResult.error
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : scanResult.direction === "OUT"
                    ? "bg-slate-100 border-slate-200 text-slate-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                      scanResult.success === false || scanResult.error
                        ? "bg-rose-600"
                        : scanResult.direction === "OUT"
                        ? "bg-slate-700"
                        : "bg-emerald-600"
                    }`}
                  >
                    {scanResult.success === false || scanResult.error ? (
                      <AlertCircle size={15} />
                    ) : scanResult.direction === "OUT" ? (
                      <LogOut size={15} />
                    ) : (
                      <LogIn size={15} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">
                        Gate movement response
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] text-white ${
                          scanResult.success === false || scanResult.error
                            ? "bg-rose-600"
                            : scanResult.direction === "OUT"
                            ? "bg-slate-700"
                            : "bg-emerald-600"
                        }`}
                      >
                        {scanResult.success === false || scanResult.error
                          ? "REJECTED"
                          : scanResult.actionLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-700">
                      {scanResult.message}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      Recorded at {scanResult.gateName} · {scanResult.time}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pass Card Container */}
            <div className="relative rounded-xl border border-slate-200 bg-white p-5 text-center">
              {/* Scannable QR Code */}
              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-xl bg-white border-2 border-dashed border-emerald-300 p-2 shadow-xs">
                {verificationDirectUrl ? (
                  <QRCode
                    value={verificationDirectUrl}
                    size={190}
                    title={`Digital Gate Pass QR code for ${studentName}`}
                  />
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Digital Gate Pass QR code for ${studentName}`}
                    className="h-48 w-48 rounded object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <RefreshCw className="h-5 w-5 animate-spin text-slate-600" />
                    <span className="text-xs">Generating QR...</span>
                  </div>
                )}
              </div>

              {/* Student Identity Data */}
              <div className="mt-4">
                <h3 className="text-base font-semibold text-slate-900">
                  {realPassData?.pass?.studentName || studentName}
                </h3>
                <p className="font-mono text-xs text-slate-600 mt-0.5">
                  {realPassData?.pass?.studentRegistrationId || studentRegId}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Hostel Room {realPassData?.pass?.room || roomNumber} · Pass #
                  {realPassData?.pass?.passNumber || passDetails.passNumber}
                </p>
              </div>

              {/* Security Clearance and Live Campus Location Indicators */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                  <CheckCircle2 size={12} />
                  <span>
                    Status: {realPassData?.pass?.status || "Active"}
                  </span>
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${
                    isCurrentlyInside
                      ? "bg-slate-100 border-slate-200 text-slate-800"
                      : "bg-amber-50 border-amber-200/80 text-amber-800"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isCurrentlyInside ? "bg-slate-700" : "bg-amber-600"
                    }`}
                  />
                  <span>
                    Location: {isCurrentlyInside ? "Inside Campus" : "Outside Campus"}
                  </span>
                </span>
              </div>

              {/* Approved Leave Notice if student has active leave */}
              {realPassData?.hasActiveLeave && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 text-left">
                  <p className="font-medium">Approved Leave Active</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Destination: {realPassData?.activeLeave?.destination || "Home"} · Expected return:{" "}
                    {new Date(realPassData?.activeLeave?.expectedReturnDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="mt-3 text-center">
                <p className="text-[11px] text-slate-400">
                  Scan with camera to verify pass credentials
                </p>
                <div className="mt-2">
                  <a
                    href={verificationDirectUrl || `${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/gate/verify`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>Open verification interface</span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Gate Terminal and Checkpoint Details */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <ShieldCheck size={14} className="text-slate-700" />
                  <span>Campus Gate Checkpoint</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Security Terminal
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed text-left">
                Present this QR code to security at any campus entrance or exit checkpoint. Movement is verified and recorded atomically in university gate logs.
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                <Link
                  to="/gate/verify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Scan size={13} className="text-slate-500" />
                  <span>Open Gatekeeper Verification Terminal</span>
                  <ExternalLink size={11} className="text-slate-400" />
                </Link>

                <span className="text-[10px] font-mono font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Current: {isCurrentlyInside ? "IN" : "OUT"}
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
    <Link to="/payments" className="flex items-center justify-between py-3.5 hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md ${
            isPaid
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
              : isOverdue
              ? "bg-rose-50 text-rose-700 border border-rose-200/50"
              : "bg-slate-100 text-slate-600 border border-slate-200/60"
          }`}
        >
          {isPaid ? (
            <Check size={14} strokeWidth={2} />
          ) : isOverdue ? (
            <AlertCircle size={14} strokeWidth={2} />
          ) : (
            <Clock size={14} strokeWidth={2} />
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-800">{title}</p>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">Due {date}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs font-medium font-mono tabular-nums text-slate-900">{amount}</p>
        <span
          className={`text-[11px] font-medium ${
            isPaid
              ? "text-emerald-700"
              : isOverdue
              ? "text-rose-700"
              : "text-slate-500"
          }`}
        >
          {status}
        </span>
      </div>
    </Link>
  );
}

export default StudentDashboard;
