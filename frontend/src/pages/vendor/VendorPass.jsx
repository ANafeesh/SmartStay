import { useState, useEffect, useRef } from "react";
import QRCodeLib from "qrcode";
import { Html5Qrcode } from "html5-qrcode";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Printer,
  Clock,
  Scan,
  AlertTriangle,
  Camera,
  CameraOff,
  LogIn,
  LogOut,
  Copy,
  Check,
  Download,
  RefreshCw,
  Car,
  UserCheck,
  MapPin,
  Radio,
} from "lucide-react";
import {
  fetchActiveVendorPass,
  recordVendorGateMovement,
  defaultVendorPass,
} from "../../services/vendorPassService";

export default function VendorPass() {
  const [pass, setPass] = useState(defaultVendorPass);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [scannedToken, setScannedToken] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [movementMode, setMovementMode] = useState("AUTO"); // "AUTO" | "IN" | "OUT"
  const [selectedGate, setSelectedGate] = useState("Gate 01 Security Viewport");
  const [entryLogs, setEntryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(false);

  const html5QrCodeRef = useRef(null);

  // Load pass and initial audit logs on mount
  useEffect(() => {
    let isMounted = true;
    const loadPassData = async () => {
      setIsLoading(true);
      const res = await fetchActiveVendorPass();
      if (isMounted && res?.data) {
        setPass(res.data);
        if (res.logs && res.logs.length > 0) {
          // Normalize logs
          const normalized = res.logs.map((l) => ({
            id: l.logId || l.id || `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
            time: l.scannedAt
              ? new Date(l.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : (l.time || "Recent"),
            direction: l.direction || (l.status === "Granted" ? "IN" : "OUT"),
            deliveryPerson: l.deliveryPerson || res.data.deliveryPerson,
            vehicleNo: l.vehicleNo || res.data.vehicleNo,
            gate: l.gate || "Gate 01 Security Viewport",
            dropZone: l.dropZone || "Hostel Block B",
            status: l.status || "Granted",
            remarks: l.remarks || "",
          }));
          setEntryLogs(normalized);
        }
      }
      setIsLoading(false);
    };

    loadPassData();
    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // Generate real dynamic QR Code whenever pass token changes
  useEffect(() => {
    const generateQrCode = async () => {
      const token = pass.qrToken || "QR-SS-VND-88492019";
      try {
        // High quality authentic QR Code
        const url = await QRCodeLib.toDataURL(token, {
          width: 240,
          margin: 2,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    };

    generateQrCode();
  }, [pass.qrToken]);

  // Handle Camera QR Scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch {}
      }

      const html5QrCode = new Html5Qrcode("vendor-qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleVerifyAndRecord(decodedText);
          stopCamera();
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera start error:", err);
      setCameraError(
        "Camera sensor unavailable or permission denied. You can trigger the optical gate scanner below or enter the token."
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch {}
      try {
        html5QrCodeRef.current.clear();
      } catch {}
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Perform Real Verification and Save to Database
  const handleVerifyAndRecord = async (tokenToVerify = scannedToken) => {
    const cleanToken = (tokenToVerify || pass.qrToken).trim();
    if (!cleanToken) return;

    setIsScanning(true);
    setVerificationResult(null);

    try {
      const res = await recordVendorGateMovement({
        token: cleanToken,
        direction: movementMode,
        gate: selectedGate,
        dropZone: "Hostel Block B",
      });

      if (res?.success) {
        const isEntry = res.movement === "ENTRY" || res.direction === "IN";
        const newLocation = isEntry ? "Inside" : "Outside";

        // Update active pass state
        setPass((prev) => ({
          ...prev,
          currentLocation: newLocation,
        }));

        const newLog = {
          id: res.data?.log?.logId || `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          direction: isEntry ? "IN" : "OUT",
          deliveryPerson: res.data?.deliveryPerson || pass.deliveryPerson,
          vehicleNo: res.data?.vehicleNo || pass.vehicleNo,
          gate: selectedGate,
          dropZone: "Hostel Block B",
          status: "Granted",
          remarks: isEntry ? "Vendor Entry - Delivery Authorized" : "Vendor Exit - Campus Departure Logged",
        };

        setEntryLogs((prev) => [newLog, ...prev]);

        setVerificationResult({
          valid: true,
          movement: isEntry ? "ENTRY" : "EXIT",
          direction: isEntry ? "IN" : "OUT",
          currentLocation: newLocation,
          message: isEntry
            ? "VENDOR ENTRY RECORDED — ACCESS GRANTED"
            : "VENDOR EXIT RECORDED — CHECKOUT SUCCESSFUL",
          description: isEntry
            ? "Courier delivery entrance authenticated. Welcome to campus!"
            : "Vendor campus departure logged. Exit barrier clearance authorized.",
          shopName: res.data?.shopName || pass.shopName,
          deliveryPerson: res.data?.deliveryPerson || pass.deliveryPerson,
          vehicleNo: res.data?.vehicleNo || pass.vehicleNo,
          gate: selectedGate,
          timestamp: newLog.time,
          officer: res.officer || "Officer K. Bandara (Badge #308)",
        });
      } else {
        const deniedLog = {
          id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          direction: "DENIED",
          deliveryPerson: "Unregistered Courier",
          vehicleNo: "Unknown",
          gate: selectedGate,
          dropZone: "Denied Entry",
          status: "Denied",
          remarks: "Access Denied: Invalid QR Token",
        };

        setEntryLogs((prev) => [deniedLog, ...prev]);

        setVerificationResult({
          valid: false,
          movement: "DENIED",
          direction: "DENIED",
          message: "ACCESS DENIED — INVALID QR PASS TOKEN",
          description: res?.message || "Token not recognized, expired, or clearance suspended.",
          timestamp: deniedLog.time,
          officer: "Gate Security Automated Interlock",
        });
      }
    } catch (err) {
      console.error("Scan recording error:", err);
      setVerificationResult({
        valid: false,
        movement: "ERROR",
        direction: "ERROR",
        message: "COMMUNICATION ERROR",
        description: "Could not reach gate server. Check connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        officer: "Security Viewport Gateway",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyToken = () => {
    if (pass.qrToken) {
      navigator.clipboard.writeText(pass.qrToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement("a");
    a.href = qrCodeDataUrl;
    a.download = `Vendor-Pass-${pass.vendorId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isInside = pass.currentLocation === "Inside";

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Vendor Gate Pass & Verification
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Real-time Gate Access
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Official Commercial Courier Clearance &middot; Live Campus Movement Tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <Download size={15} />
            <span>Save QR Image</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Digital Pass + Security Scanner Terminal */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: DIGITAL QR VENDOR PASS CARD */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Holographic Security Top Bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500" />

          <div>
            {/* Vendor Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{pass.shopName}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Vendor ID: {pass.vendorId}
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold">
                    Proprietor: {pass.ownerName} ({pass.regNo})
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  {pass.status}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isInside
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isInside ? "bg-blue-600 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {isInside ? "Currently Inside Campus" : "Currently Outside"}
                </span>
              </div>
            </div>

            {/* Real Dynamic QR Code Canvas */}
            <div className="my-6 flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-200/70 p-6 text-center shadow-2xs">
              <div className="relative rounded-2xl p-3 bg-white border-2 border-dashed border-blue-300 shadow-sm">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Vendor Gate Pass QR Code"
                    className="h-44 w-44 object-contain"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center">
                    <RefreshCw className="animate-spin text-slate-400" size={24} />
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Authentic Gate Pass Token
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <p className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {pass.qrToken}
                  </p>
                  <button
                    onClick={handleCopyToken}
                    title="Copy Token"
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                  >
                    {copiedToken ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Rider & Vehicle Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white border border-slate-200/60 p-3">
                <span className="text-[11px] text-slate-400 block font-medium flex items-center gap-1">
                  <UserCheck size={12} /> Delivery Rider
                </span>
                <span className="font-bold text-slate-800">{pass.deliveryPerson}</span>
                <span className="block text-[10px] text-slate-400 font-mono">NIC: {pass.riderNic}</span>
              </div>

              <div className="rounded-xl bg-white border border-slate-200/60 p-3">
                <span className="text-[11px] text-slate-400 block font-medium flex items-center gap-1">
                  <Car size={12} /> Authorized Vehicle
                </span>
                <span className="font-bold text-slate-800 font-mono">{pass.vehicleNo}</span>
                <span className="block text-[10px] text-slate-400">{pass.vehicleType}</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs">
              <span className="text-[11px] text-blue-700 font-bold block uppercase flex items-center gap-1">
                <MapPin size={12} /> Authorized Campus Drop Zones
              </span>
              <p className="text-slate-700 mt-0.5">{pass.authorizedZones}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <ShieldCheck size={14} /> Valid Until: {pass.validUntil}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <img src="/smartstay-mark.png" alt="" className="h-4 w-4 rounded object-cover border border-slate-200" />
              <span>SmartStay Gate Seal</span>
            </div>
          </div>
        </div>

        {/* Right: REAL SECURITY GATE SCANNER TERMINAL */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Terminal Header */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scan size={20} className="text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Gate 01 Security Scanner Terminal
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  <Radio size={12} className="animate-pulse" />
                  <span>ONLINE SENSOR</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Official campus gate checkpoint. Validates courier QR pass, determines Enter/Exit status, and writes real movements to the database.
              </p>
            </div>

            {/* Movement Direction Mode Selector */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Movement Verification Mode
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {movementMode === "AUTO"
                    ? `Auto-Toggle (${isInside ? "Next: EXIT" : "Next: ENTRY"})`
                    : movementMode === "IN"
                    ? "Forced Entry (IN)"
                    : "Forced Exit (OUT)"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMovementMode("AUTO")}
                  className={`rounded-xl py-2 px-3 text-center transition cursor-pointer border ${
                    movementMode === "AUTO"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ⚡ Auto Detect
                </button>
                <button
                  type="button"
                  onClick={() => setMovementMode("IN")}
                  className={`rounded-xl py-2 px-3 text-center transition cursor-pointer border flex items-center justify-center gap-1 ${
                    movementMode === "IN"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <LogIn size={13} />
                  <span>Record Entry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMovementMode("OUT")}
                  className={`rounded-xl py-2 px-3 text-center transition cursor-pointer border flex items-center justify-center gap-1 ${
                    movementMode === "OUT"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <LogOut size={13} />
                  <span>Record Exit</span>
                </button>
              </div>
            </div>

            {/* Checkpoint Gate Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600 shrink-0">Checkpoint Gate:</span>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:border-blue-600 focus:outline-none"
              >
                <option value="Gate 01 Security Viewport">Gate 01 (Main Gate & Administration)</option>
                <option value="Gate 02 (East Hostel Viewport)">Gate 02 (East Hostel Viewport)</option>
                <option value="Gate 03 (Cafeteria Service Gate)">Gate 03 (Cafeteria Service Gate)</option>
              </select>
            </div>

            {/* Camera Viewport / Scanner Interlock */}
            <div className="relative h-48 w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              {/* If camera is active */}
              {isCameraActive ? (
                <div id="vendor-qr-reader" className="w-full h-full" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400 mb-2">
                    <Camera size={26} />
                  </div>
                  <p className="text-xs font-mono text-slate-200 font-semibold">
                    {isScanning
                      ? "Scanning & Validating Optical Pass..."
                      : "Optical Gate Sensor Ready"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Trigger checkpoint laser scan or use optical webcam scanner to log entry/exit.
                  </p>
                </div>
              )}

              {/* Laser Scan Line Animation */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-400/50" />
              )}

              {/* Badges in viewport */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                LIVE OPTICAL GATE
              </div>

              <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                {isInside ? "STATUS: INSIDE" : "STATUS: OUTSIDE"}
              </div>
            </div>

            {cameraError && (
              <p className="text-[11px] text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                {cameraError}
              </p>
            )}

            {/* Checkpoint Action Controls */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleVerifyAndRecord(pass.qrToken)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-4 font-bold text-white hover:bg-blue-500 active:scale-98 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Scan size={15} />
                )}
                <span>Scan Pass ({isInside ? "Log Exit" : "Log Entry"})</span>
              </button>

              <button
                type="button"
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-4 font-bold transition cursor-pointer ${
                  isCameraActive
                    ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isCameraActive ? <CameraOff size={15} /> : <Camera size={15} />}
                <span>{isCameraActive ? "Stop Camera" : "Open Camera"}</span>
              </button>
            </div>

            {/* Manual Token or Barcode Gun Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyAndRecord();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={scannedToken}
                onChange={(e) => setScannedToken(e.target.value)}
                placeholder="Scan QR barcode gun or enter token (e.g. QR-SS-VND-88492019)"
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isScanning || !scannedToken.trim()}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs cursor-pointer disabled:opacity-40"
              >
                Submit
              </button>
            </form>
          </div>

          {/* REAL ENTER / EXIT MESSAGE BANNER */}
          {verificationResult && (
            <div
              className={`rounded-2xl border p-4.5 transition-all animate-in fade-in duration-300 shadow-xs ${
                verificationResult.valid
                  ? verificationResult.direction === "IN"
                    ? "border-emerald-300 bg-emerald-50/95 text-emerald-950"
                    : "border-blue-300 bg-blue-50/95 text-blue-950"
                  : "border-rose-300 bg-rose-50/95 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-3">
                {verificationResult.valid ? (
                  verificationResult.direction === "IN" ? (
                    <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <LogIn size={20} />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <LogOut size={20} />
                    </div>
                  )
                ) : (
                  <div className="h-9 w-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <XCircle size={20} />
                  </div>
                )}

                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-sm tracking-tight">
                      {verificationResult.message}
                    </h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        verificationResult.direction === "IN"
                          ? "bg-emerald-200 text-emerald-900"
                          : verificationResult.direction === "OUT"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-rose-200 text-rose-900"
                      }`}
                    >
                      {verificationResult.direction === "IN"
                        ? "ENTRY / IN"
                        : verificationResult.direction === "OUT"
                        ? "EXIT / OUT"
                        : "DENIED"}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] opacity-90 font-medium">
                    {verificationResult.description}
                  </p>

                  {verificationResult.valid && (
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] rounded-xl bg-white/70 p-2.5 border border-black/5">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Vendor Outlet</span>
                        <strong className="text-slate-900">{verificationResult.shopName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Courier & Vehicle</span>
                        <strong className="text-slate-900">
                          {verificationResult.deliveryPerson} ({verificationResult.vehicleNo})
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Security Gate</span>
                        <strong className="text-slate-900">{verificationResult.gate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Current Status</span>
                        <strong
                          className={
                            verificationResult.currentLocation === "Inside"
                              ? "text-emerald-700 font-bold"
                              : "text-blue-700 font-bold"
                          }
                        >
                          {verificationResult.currentLocation === "Inside"
                            ? "Inside Campus"
                            : "Departed Campus"}
                        </strong>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Officer Stamp: {verificationResult.officer}</span>
                    <span>Logged at {verificationResult.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Gate Audit Entry Logs Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Gate Access & Movement Audit Log (Database Records)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {entryLogs.length} Movements Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Movement</th>
                <th className="py-3 px-4">Delivery Personnel</th>
                <th className="py-3 px-4">Vehicle No</th>
                <th className="py-3 px-4">Gate Checkpoint</th>
                <th className="py-3 px-4">Drop Zone</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {entryLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    No movements recorded yet. Scan a pass to log entry/exit.
                  </td>
                </tr>
              ) : (
                entryLogs.map((log) => {
                  const isEntry = log.direction === "IN" || log.direction === "ENTRY";
                  const isDenied = log.status === "Denied" || log.direction === "DENIED";

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                      <td className="py-3 px-4 text-slate-500">{log.time}</td>
                      <td className="py-3 px-4">
                        {isDenied ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold border border-rose-200">
                            DENIED
                          </span>
                        ) : isEntry ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                            <LogIn size={11} /> ENTRY (IN)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold border border-blue-200">
                            <LogOut size={11} /> EXIT (OUT)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{log.deliveryPerson}</td>
                      <td className="py-3 px-4 font-mono">{log.vehicleNo}</td>
                      <td className="py-3 px-4 text-slate-600">{log.gate}</td>
                      <td className="py-3 px-4">{log.dropZone}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            !isDenied
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {!isDenied ? "Access Granted" : "Access Denied"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
