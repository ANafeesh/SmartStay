import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  Clock,
  ArrowRight,
  RefreshCw,
  Building2,
  User,
  ArrowLeft,
  Scan,
  Camera,
  CameraOff,
  Upload,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import {
  verifyDigitalPass,
  recordGateMovementApi,
  fetchGateLogsApi,
  getGateMovementState,
} from "../../services/gatePassService";

export default function GateVerification() {
  const [searchParams] = useSearchParams();

  // URL fallback params
  const paramStudentId = searchParams.get("studentId");
  const paramToken = searchParams.get("token");

  // Camera & Scanner State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanningLocked, setIsScanningLocked] = useState(false);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Verification & Movement State
  const [activeToken, setActiveToken] = useState(paramToken || "");
  const [verificationResult, setVerificationResult] = useState(null);
  const [movementResult, setMovementResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRecordingMovement, setIsRecordingMovement] = useState(false);
  const [gateLogs, setGateLogs] = useState([]);
  const [manualQuery, setManualQuery] = useState(paramStudentId || "");

  // Load audit trail on mount
  const refreshLogs = async () => {
    try {
      const res = await fetchGateLogsApi({ limit: 10 });
      if (res?.data) {
        setGateLogs(res.data);
      }
    } catch {
      // Fallback to local logs
      const local = getGateMovementState(paramStudentId || "STD-2026-090");
      if (local?.logs) {
        setGateLogs(
          local.logs.map((l) => ({
            _id: l.id,
            movementDirection: l.direction,
            timestamp: new Date().toISOString(),
            gateName: l.gate,
            officer: { name: l.officer },
            remarks: l.remarks,
          }))
        );
      }
    }
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  // If token was passed via URL parameter on initial load, auto-verify it
  useEffect(() => {
    if (paramToken) {
      handleVerifyToken(paramToken);
    }
  }, [paramToken]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // ----------------------------------------------------
  // Camera Control Functions
  // ----------------------------------------------------
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraLoading(true);

    try {
      // Stop and clear any existing instance first
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch {}
        try {
          html5QrCodeRef.current.clear();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.max(180, Math.floor(minEdge * 0.72));
            return { width: edge, height: edge };
          },
          aspectRatio: 1.0,
        },
        onQrCodeScanned,
        () => {} // Silent on individual frame non-detections
      );

      setIsCameraActive(true);
      setIsScanningLocked(false);
    } catch (err) {
      console.error("Camera startup error:", err);
      let errorMsg = "Could not activate camera device.";
      if (err.name === "NotAllowedError" || err.message?.includes("Permission")) {
        errorMsg =
          "Camera access permission was denied. Please allow camera permissions in your browser bar. Modern mobile browsers require localhost or an HTTPS connection to access the camera.";
      } else if (err.name === "NotFoundError" || err.message?.includes("device")) {
        errorMsg =
          "No physical camera device was detected on this terminal. You can upload a QR image or enter the pass number manually.";
      } else {
        errorMsg = `Camera initialization error: ${err.message || "Unknown error"}`;
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (e) {
        console.warn("Scanner stop issue:", e);
      }
      try {
        html5QrCodeRef.current.clear();
      } catch {}
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  // ----------------------------------------------------
  // QR Code Decode Handler
  // ----------------------------------------------------
  const onQrCodeScanned = async (decodedText) => {
    if (isScanningLocked || isVerifying || isRecordingMovement) return;
    setIsScanningLocked(true);

    // Audio confirmation beep
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {}

    // Extract token
    let token = decodedText.trim();
    let passNum = null;
    let regId = null;

    try {
      const parsed = JSON.parse(decodedText);
      if (parsed.qrToken || parsed.token) {
        token = parsed.qrToken || parsed.token;
      }
      if (parsed.passNumber) passNum = parsed.passNumber;
      if (parsed.studentRegistrationId) regId = parsed.studentRegistrationId;
    } catch {
      // Check if URL encoded
      try {
        const url = new URL(decodedText);
        const urlToken = url.searchParams.get("token");
        if (urlToken) token = urlToken;
      } catch {}
    }

    setActiveToken(token);
    await handleVerifyToken(token, passNum, regId);
  };

  // Image Upload Scanner Fallback
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCameraError(null);
    setIsCameraLoading(true);

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-file-hidden");
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      onQrCodeScanned(decodedText);
    } catch (err) {
      console.warn("Upload scan error:", err);
      setCameraError(
        "Could not detect a valid QR code in the uploaded image. Please ensure the QR code is clearly visible and unblurred."
      );
    } finally {
      setIsCameraLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------------------
  // Backend Pass Verification
  // ----------------------------------------------------
  const handleVerifyToken = async (token, passNumber = null, studentRegistrationId = null) => {
    setIsVerifying(true);
    setMovementResult(null);

    try {
      const payload = {};
      if (token) payload.qrToken = token;
      else if (passNumber) payload.passNumber = passNumber;
      else if (studentRegistrationId) payload.studentRegistrationId = studentRegistrationId;

      const res = await verifyDigitalPass(payload);
      setVerificationResult(res);
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationResult({
        success: false,
        authorized: false,
        message: err.data?.message || err.message || "Failed to verify digital pass credentials.",
        denialReason: err.data?.message || "Invalid or unrecognized pass token.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Manual query submission
  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;
    const q = manualQuery.trim();
    if (q.toUpperCase().startsWith("SP-")) {
      handleVerifyToken(null, q, null);
    } else {
      handleVerifyToken(null, null, q);
    }
  };

  // ----------------------------------------------------
  // Record Gate Entry or Exit Movement
  // ----------------------------------------------------
  const handleRecordMovement = async (direction) => {
    if (!verificationResult?.data?.passNumber && !activeToken) return;
    setIsRecordingMovement(true);

    try {
      const payload = {
        direction,
        gateName: "Main Campus Gate 01",
        remarks: `Recorded via Gatekeeper Terminal (${direction})`,
      };
      if (activeToken) payload.qrToken = activeToken;
      else payload.passNumber = verificationResult.data.passNumber;

      const res = await recordGateMovementApi(payload);
      setMovementResult({
        success: true,
        direction,
        message: res.message || `Successfully registered student ${direction}.`,
        data: res.data,
      });

      // Refresh pass data and logs
      if (activeToken) {
        handleVerifyToken(activeToken);
      } else if (verificationResult.data.passNumber) {
        handleVerifyToken(null, verificationResult.data.passNumber);
      }
      refreshLogs();
    } catch (err) {
      console.error("Record movement error:", err);
      setMovementResult({
        success: false,
        direction,
        message: err.data?.message || err.message || `Failed to record ${direction} movement.`,
        error: err.data?.message || err.message,
      });
    } finally {
      setIsRecordingMovement(false);
    }
  };

  // Reset and Scan Another Pass
  const handleResetScan = () => {
    setVerificationResult(null);
    setMovementResult(null);
    setActiveToken("");
    setIsScanningLocked(false);
    setCameraError(null);
  };

  const pass = verificationResult?.data;
  const isAuthorized = verificationResult?.authorized;
  const student = pass?.student;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Hidden file scanner container for html5-qrcode */}
      <div id="qr-reader-file-hidden" className="hidden" />

      {/* Terminal Top Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <Scan size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  Campus Security Gate 01
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white">
                Student Gate Pass Verification Terminal
              </h1>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Terminal Body */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8 space-y-6">
        {/* ======================================================== */}
        {/* SCANNER CONTROLLER CARD */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Real Camera Preview & Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Camera size={18} className="text-blue-400" />
                  <span>Real Camera Scanner</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isCameraActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isCameraActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"
                    }`}
                  />
                  {isCameraActive ? "LIVE CAMERA" : "STANDBY"}
                </span>
              </div>

              {/* Camera Video Viewport */}
              <div className="mt-4 relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center border border-slate-800">
                {/* HTML5 QR Code Mount Node */}
                <div id="qr-reader" className="w-full h-full" />

                {/* Overlay placeholder when camera is stopped */}
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 z-10">
                    <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                      <Scan size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-200">
                      Camera Scanner Offline
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Click below to request camera permission and scan student QR codes in real-time.
                    </p>
                  </div>
                )}

                {/* Animated Scanner Reticle Overlay when active */}
                {isCameraActive && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6">
                    <div className="relative w-56 h-56 border-2 border-emerald-400/80 rounded-2xl shadow-emerald-500/20 shadow-2xl">
                      {/* Corner Target Accents */}
                      <span className="absolute -top-1 -left-1 h-4 w-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm" />
                      <span className="absolute -bottom-1 -left-1 h-4 w-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm" />
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-4 border-r-4 border-emerald-400 rounded-br-sm" />
                      {/* Laser Line */}
                      <div className="absolute left-2 right-2 top-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 shadow-lg shadow-emerald-400 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="mt-3 rounded-xl border border-rose-900/60 bg-rose-950/60 p-3 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                  <p className="leading-relaxed">{cameraError}</p>
                </div>
              )}

              {/* Action Buttons for Camera */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {!isCameraActive ? (
                  <button
                    type="button"
                    disabled={isCameraLoading}
                    onClick={startCamera}
                    className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer disabled:opacity-50"
                  >
                    {isCameraLoading ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <Camera size={15} />
                    )}
                    <span>Start Camera Scanner</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                    >
                      <CameraOff size={14} />
                      <span>Stop Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsScanningLocked(false)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Resume Scan</span>
                    </button>
                  </>
                )}

                {/* Upload QR Image Fallback */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isCameraLoading}
                  onClick={() => fileInputRef.current?.click()}
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                >
                  <Upload size={14} className="text-blue-400" />
                  <span>Upload QR Image / Photo</span>
                </button>
              </div>

              {/* Informational Browser Requirement Note */}
              <div className="mt-3.5 flex items-start gap-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                <Info size={13} className="shrink-0 text-slate-500 mt-0.5" />
                <span>
                  Modern mobile browsers strictly require <strong>HTTPS</strong> or <strong>localhost</strong> to access camera hardware.
                </span>
              </div>
            </div>

            {/* Manual Verification Search Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-bold text-slate-300 mb-2">
                Manual Pass / Registration Search
              </p>
              <form onSubmit={handleManualSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pass # (SP-2026-...) or Reg ID"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isVerifying || !manualQuery.trim()}
                  className="rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-bold text-blue-400 hover:bg-slate-700 hover:text-white transition disabled:opacity-50 cursor-pointer"
                >
                  Verify
                </button>
              </form>
            </div>
          </div>

          {/* ======================================================== */}
          {/* VERIFICATION & MOVEMENT RESULT PANEL (Section 6) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Movement Confirmation Banner */}
            {movementResult && (
              <div
                className={`rounded-2xl border p-4 sm:p-5 shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200 ${
                  movementResult.success
                    ? movementResult.direction === "OUT"
                      ? "bg-gradient-to-br from-blue-950/90 via-slate-900 to-indigo-950/90 border-blue-500/50 shadow-blue-950/40"
                      : "bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border-emerald-500/50 shadow-emerald-950/40"
                    : "bg-gradient-to-br from-rose-950/90 via-slate-900 to-red-950/90 border-rose-500/50 shadow-rose-950/40"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
                      movementResult.success
                        ? movementResult.direction === "OUT"
                          ? "bg-blue-600 text-white"
                          : "bg-emerald-500 text-slate-950"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    {movementResult.success ? (
                      movementResult.direction === "OUT" ? (
                        <LogOut size={22} />
                      ) : (
                        <LogIn size={22} />
                      )
                    ) : (
                      <XCircle size={22} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          movementResult.success
                            ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300"
                            : "bg-rose-500/20 border border-rose-400 text-rose-300"
                        }`}
                      >
                        {movementResult.success ? "MOVEMENT ACCEPTED" : "MOVEMENT REJECTED"}
                      </span>
                    </div>

                    <h3 className="mt-1 text-base font-bold text-white">
                      {movementResult.message}
                    </h3>

                    {movementResult.data?.log && (
                      <p className="text-xs text-slate-400 mt-1">
                        Movement ID: {movementResult.data.log._id} • Recorded at {movementResult.data.log.gateName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Verification Card */}
            {isVerifying ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center">
                <RefreshCw size={32} className="animate-spin text-blue-400 mb-3" />
                <p className="text-sm font-bold text-white">Verifying Student Digital Pass...</p>
                <p className="text-xs text-slate-400 mt-1">
                  Checking pass cryptographic hash, account status, and campus curfew rules.
                </p>
              </div>
            ) : verificationResult ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-5">
                {/* Visual Status Header (Green/Amber/Red) */}
                <div
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isAuthorized
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isAuthorized ? (
                      <div className="h-10 w-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                        <CheckCircle2 size={24} />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
                        <XCircle size={24} />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm sm:text-base font-bold">
                        {isAuthorized
                          ? "Pass Verified & Authorized"
                          : "Digital Pass Authorization Denied"}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {isAuthorized
                          ? "Credential matches university cryptographic record."
                          : verificationResult.denialReason || verificationResult.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetScan}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition cursor-pointer self-start sm:self-auto"
                  >
                    <RotateCcw size={13} />
                    <span>Scan Next Pass</span>
                  </button>
                </div>

                {/* Student Details Grid */}
                {pass && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Identity Details */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Student Identity
                      </p>
                      <h4 className="text-lg font-black text-white">
                        {student?.name || "Student Name"}
                      </h4>
                      <p className="font-mono text-xs font-bold text-blue-400">
                        {student?.registrationNumber || "STD-ID"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Room {student?.room || pass.room || "Assigned"} • {student?.building || pass.building || "Hostel Block"}
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Account Status:</span>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                          {student?.accountStatus?.toUpperCase() || "ACTIVE"}
                        </span>
                      </div>
                    </div>

                    {/* Pass Status Details */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Credential & Campus Location
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Pass Number:</span>
                        <span className="font-mono text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {pass.passNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Pass Validity:</span>
                        <span className="text-xs font-semibold text-emerald-400">
                          {pass.status} (Valid until {new Date(pass.validUntil).toLocaleDateString()})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Current Campus Location:</span>
                        <span className="text-xs font-bold text-blue-300">
                          {pass.currentLocation || "Inside Campus"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Last Movement:</span>
                        <span className="text-xs font-mono text-slate-300">
                          {pass.lastMovementDirection || "NONE"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approved Leave Notification if student has active leave */}
                {pass?.hasApprovedLeave && pass.activeLeave && (
                  <div className="rounded-2xl border border-indigo-900/60 bg-indigo-950/50 p-4 text-xs text-indigo-200">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1">
                      <CheckCircle2 size={15} />
                      <span>Approved Leave Granted</span>
                    </div>
                    <p>
                      Destination: <strong>{pass.activeLeave.destination}</strong> • Reason: {pass.activeLeave.reason}
                    </p>
                    <p className="text-indigo-400 text-[11px] mt-0.5">
                      Departure: {new Date(pass.activeLeave.departureDate).toLocaleDateString()} • Return Expected:{" "}
                      {new Date(pass.activeLeave.expectedReturnDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Gatekeeper Direction Action Buttons (Section 5) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Record Campus Gate Movement
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select movement direction. The backend will enforce duplicate movement and pass validity rules.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isRecordingMovement || !pass?.canExitCampus}
                      onClick={() => handleRecordMovement("OUT")}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-black transition cursor-pointer ${
                        pass?.canExitCampus
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                          : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <LogOut size={16} />
                      <span>Record EXIT (Out of Campus)</span>
                    </button>

                    <button
                      type="button"
                      disabled={isRecordingMovement || !pass?.canEnterCampus}
                      onClick={() => handleRecordMovement("IN")}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-black transition cursor-pointer ${
                        pass?.canEnterCampus
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500"
                          : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <LogIn size={16} />
                      <span>Record ENTRY (Into Campus)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Awaiting Scan State */
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
                  <Scan size={30} />
                </div>
                <h3 className="text-base font-bold text-white">Awaiting Pass Scan</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Aim the camera scanner at the student's digital gate pass QR code, upload a QR image, or use the manual search above.
                </p>
              </div>
            )}

            {/* Audit Log Trail */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Gate Movement Audit Trail
                </h4>
                <button
                  type="button"
                  onClick={refreshLogs}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800/60 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
                {gateLogs && gateLogs.length > 0 ? (
                  gateLogs.slice(0, 5).map((log) => (
                    <div
                      key={log._id || log.id}
                      className="flex items-center justify-between px-4 py-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                            (log.movementDirection || log.direction) === "OUT"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {(log.movementDirection || log.direction) === "OUT" ? (
                            <LogOut size={14} />
                          ) : (
                            <LogIn size={14} />
                          )}
                        </span>
                        <div>
                          <span className="font-bold text-white">
                            {(log.movementDirection || log.direction) === "OUT"
                              ? "Campus Exit (Checked Out)"
                              : "Campus Entry (Checked In)"}
                          </span>
                          <p className="text-[11px] text-slate-400">
                            {log.studentName || log.studentRegistrationId || "Student"} • {log.gateName || "Main Gate"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-slate-300 font-semibold text-[11px]">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today"}
                        </span>
                        <span className="block text-[10px] font-bold text-emerald-400">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No recent gate entries recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
