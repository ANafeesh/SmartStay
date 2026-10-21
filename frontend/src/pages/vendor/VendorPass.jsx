import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Printer,
  Download,
  Clock,
  Scan,
  Sparkles,
  AlertTriangle,
  Camera,
  Car,
  User,
  Check,
} from "lucide-react";

const vendorPassDetails = {
  vendorId: "VND-2026-09",
  shopName: "Campus Diner & Cafe",
  ownerName: "Ahamed Nafeesh",
  regNo: "SEU/IS/22/ICT/090",
  deliveryPerson: "Kamal Perera",
  riderNic: "199420912401",
  vehicleNo: "WP BCD-4821",
  vehicleType: "Motorcycle / Delivery Courier",
  qrToken: "QR-SS-VND-88492019",
  status: "Active / Verified",
  validUntil: "10:00 PM Today",
  authorizedZones: "Hostel Block A, Hostel Block B, Main Gate Foyer",
  issuedBy: "Chief Security Officer & University Bursar",
};

const initialEntryLogs = [
  {
    id: "LOG-9041",
    time: "12:28 PM",
    deliveryPerson: "Kamal Perera",
    vehicleNo: "WP BCD-4821",
    gate: "Main Gate Security 01",
    dropZone: "Hostel Block B (Room 204)",
    status: "Granted",
  },
  {
    id: "LOG-8812",
    time: "11:45 AM",
    deliveryPerson: "Sunil Silva",
    vehicleNo: "CP CA-9012",
    gate: "Gate 02 (East)",
    dropZone: "Hostel Block A Foyer",
    status: "Granted",
  },
];

export default function VendorPass() {
  const [pass] = useState(vendorPassDetails);
  const [scannedToken, setScannedToken] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [entryLogs, setEntryLogs] = useState(initialEntryLogs);

  const handleVerifyPass = (tokenToVerify = scannedToken) => {
    const cleanToken = tokenToVerify.trim();
    if (cleanToken === pass.qrToken) {
      const newLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        deliveryPerson: pass.deliveryPerson,
        vehicleNo: pass.vehicleNo,
        gate: "Gate 01 Security Viewport",
        dropZone: "Hostel Block B",
        status: "Granted",
      };
      setEntryLogs([newLog, ...entryLogs]);
      setVerificationResult({
        valid: true,
        message: "Vendor QR Pass Verified & Campus Gate Access Authorized",
        shopName: pass.shopName,
        deliveryPerson: pass.deliveryPerson,
        vehicleNo: pass.vehicleNo,
        authorizedZones: pass.authorizedZones,
        timestamp: newLog.time,
        officer: "Officer K. Bandara (Badge #308)",
      });
    } else {
      const newLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        deliveryPerson: "Unregistered Courier",
        vehicleNo: "Unknown",
        gate: "Gate 01 Security Viewport",
        dropZone: "Denied Entry",
        status: "Denied",
      };
      setEntryLogs([newLog, ...entryLogs]);
      setVerificationResult({
        valid: false,
        message: "Access Denied: Invalid, expired, or tampered QR token",
        timestamp: newLog.time,
        officer: "Gate Security Automated Interlock",
      });
    }
  };

  const simulateCameraScan = (token) => {
    setIsScanning(true);
    setScannedToken(token);
    setTimeout(() => {
      setIsScanning(false);
      handleVerifyPass(token);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              QR Vendor Pass & Gate Verification
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Module 3 Security
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Proprietor: <strong className="text-slate-800">Ahamed Nafeesh</strong> (Reg:{" "}
            <span className="font-mono text-blue-600 font-semibold">SEU/IS/22/ICT/090</span>) · Real-time Security Gate Access Clearance
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
        >
          <Printer size={15} />
          <span>Print Digital Pass</span>
        </button>
      </div>

      {/* Main Grid: Digital Pass + Gate Scanner */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: DIGITAL QR VENDOR PASS CARD */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Holographic Security Top Bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500" />

          <div>
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {pass.shopName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Vendor ID: {pass.vendorId}
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold">
                    Proprietor: {pass.ownerName} ({pass.regNo})
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                {pass.status}
              </span>
            </div>

            {/* QR Code Graphic with Animation Ring */}
            <div className="my-6 flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-200/70 p-6 text-center shadow-2xs">
              <div className="relative rounded-2xl p-3 bg-white border-2 border-dashed border-blue-300 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${pass.qrToken}`}
                  alt="Vendor QR Pass"
                  className="h-44 w-44 object-contain"
                />
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Encrypted Gate Pass Token
                </span>
                <p className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg mt-1 inline-block">
                  {pass.qrToken}
                </p>
              </div>
            </div>

            {/* Rider & Vehicle Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white border border-slate-200/60 p-3">
                <span className="text-[11px] text-slate-400 block font-medium">
                  Delivery Rider
                </span>
                <span className="font-bold text-slate-800">{pass.deliveryPerson}</span>
                <span className="block text-[10px] text-slate-400 font-mono">NIC: {pass.riderNic}</span>
              </div>

              <div className="rounded-xl bg-white border border-slate-200/60 p-3">
                <span className="text-[11px] text-slate-400 block font-medium">
                  Authorized Vehicle
                </span>
                <span className="font-bold text-slate-800 font-mono">{pass.vehicleNo}</span>
                <span className="block text-[10px] text-slate-400">{pass.vehicleType}</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs">
              <span className="text-[11px] text-blue-700 font-bold block uppercase">
                Authorized Campus Drop Zones
              </span>
              <p className="text-slate-700 mt-0.5">{pass.authorizedZones}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <ShieldCheck size={14} /> Valid Until: {pass.validUntil}
            </span>
            <span className="text-[11px] text-slate-400">SmartStay Gate Seal</span>
          </div>
        </div>

        {/* Right: GATE SCANNER SIMULATOR */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Scan size={18} className="text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Gate 01 Security Scanner Terminal
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate campus security officer scanning food courier QR pass upon hostel gate entrance.
            </p>
          </div>

          {/* Camera Viewport Simulation */}
          <div className="relative h-48 w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
            <Camera size={32} className="text-slate-600 mb-2" />
            <p className="text-xs font-mono text-slate-400">
              {isScanning ? "Scanning Optical Sensor..." : "Point Scanner at QR Code or Choose Scenario"}
            </p>

            {/* Laser Scan Line Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-400/50" />
            )}

            <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE OPTICAL GATE
            </div>
          </div>

          {/* Preset Simulator Action Buttons */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Quick Test Simulation Scenarios
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => simulateCameraScan(pass.qrToken)}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 px-3 font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Valid Pass (Nafeesh)</span>
              </button>

              <button
                type="button"
                onClick={() => simulateCameraScan("QR-EXPIRED-TOKEN-000")}
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 py-2.5 px-3 font-bold text-rose-800 hover:bg-rose-100 transition cursor-pointer"
              >
                <XCircle size={15} />
                <span>Invalid / Expired Pass</span>
              </button>
            </div>
          </div>

          {/* Manual Input Verification */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyPass();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={scannedToken}
              onChange={(e) => setScannedToken(e.target.value)}
              placeholder="Or enter QR token e.g. QR-SS-VND-88492019"
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-xs cursor-pointer"
            >
              Verify Token
            </button>
          </form>

          {/* Verification Result Callout */}
          {verificationResult && (
            <div
              className={`rounded-2xl border p-4 transition-all animate-in fade-in duration-200 ${
                verificationResult.valid
                  ? "border-emerald-300 bg-emerald-50/90 text-emerald-950"
                  : "border-rose-300 bg-rose-50/90 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-3">
                {verificationResult.valid ? (
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <h4 className="font-bold">{verificationResult.message}</h4>
                  {verificationResult.valid && (
                    <div className="mt-1 space-y-0.5 text-[11px] text-emerald-900">
                      <p>Outlet: <strong>{verificationResult.shopName}</strong></p>
                      <p>Courier: <strong>{verificationResult.deliveryPerson}</strong> ({verificationResult.vehicleNo})</p>
                      <p>Clearance Stamp: <strong>{verificationResult.officer}</strong></p>
                    </div>
                  )}
                  <span className="block mt-2 text-[10px] text-slate-500">
                    Logged at {verificationResult.timestamp}
                  </span>
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
              Gate Access Verification Audit Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Terminal Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Delivery Personnel</th>
                <th className="py-3 px-4">Vehicle No</th>
                <th className="py-3 px-4">Drop Zone</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {entryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.deliveryPerson}</td>
                  <td className="py-3 px-4 font-mono">{log.vehicleNo}</td>
                  <td className="py-3 px-4">{log.dropZone}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        log.status === "Granted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {log.status === "Granted" ? "Access Granted" : "Access Denied"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
