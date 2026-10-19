import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";

const vendorPassDetails = {
  vendorId: "VND-2026-09",
  shopName: "Campus Diner & Cafe",
  ownerName: "Ahamed Nafeesh",
  deliveryPerson: "Kamal Perera",
  vehicleNo: "WP BCD-4821",
  qrToken: "QR-SS-VND-88492019",
  status: "Active / Verified",
  validUntil: "10:00 PM Today",
};

function VendorPass() {
  const [pass] = useState(vendorPassDetails);
  const [scannedToken, setScannedToken] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyPass = (e) => {
    e.preventDefault();

    if (scannedToken.trim() === pass.qrToken) {
      setVerificationResult({
        valid: true,
        message: "Vendor QR Pass Verified & Access Granted",
        shopName: pass.shopName,
        deliveryPerson: pass.deliveryPerson,
        vehicleNo: pass.vehicleNo,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } else {
      setVerificationResult({
        valid: false,
        message: "Invalid or Expired Vendor Pass Token",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Vendor QR Pass & Security Gate Verification
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Digital QR pass identification and campus entrance authorization for
            food deliveries.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
          <ShieldCheck size={16} />
          Authorized Delivery Personnel
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* VENDOR DIGITAL QR PASS CARD */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {pass.shopName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    ID: {pass.vendorId}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                {pass.status}
              </span>
            </div>

            {/* QR Visual Card */}
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/70 p-6 text-center">
              <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${pass.qrToken}`}
                  alt="Vendor QR Pass"
                  className="h-44 w-44 object-contain"
                />
              </div>
              <p className="mt-3 text-xs font-mono font-bold text-slate-600">
                {pass.qrToken}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Scan at Security Gate Entrance
              </p>
            </div>

            {/* Details List */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-400">Delivery Driver</p>
                <p className="mt-0.5 font-bold text-slate-800">
                  {pass.deliveryPerson}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-400">Vehicle Number</p>
                <p className="mt-0.5 font-bold text-slate-800">
                  {pass.vehicleNo}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-400">Vendor Owner</p>
                <p className="mt-0.5 font-bold text-slate-800">
                  {pass.ownerName}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-400">Valid Unitl</p>
                <p className="mt-0.5 font-bold text-slate-800">
                  {pass.validUntil}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY OFFICER SCANNER INTERFACE */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                Security Gate Scanner Mode
              </h2>
              <p className="text-xs text-slate-500">
                Enter or scan vendor QR token to verify entrance eligibility.
              </p>
            </div>

            <form onSubmit={handleVerifyPass} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Scan / Enter Vendor QR Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. QR-SS-VND-88492019"
                    value={scannedToken}
                    onChange={(e) => setScannedToken(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition shrink-0"
                  >
                    <Search size={16} />
                    <span>Verify</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setScannedToken(pass.qrToken)}
                  className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Auto-fill sample active QR code
                </button>
              </div>
            </form>

            {/* Scan Verification Result Alert */}
            {verificationResult && (
              <div
                className={`mt-6 rounded-2xl p-5 border ${
                  verificationResult.valid
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                    : "bg-rose-50/80 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  {verificationResult.valid ? (
                    <CheckCircle2
                      size={24}
                      className="text-emerald-600 shrink-0"
                    />
                  ) : (
                    <XCircle size={24} className="text-rose-600 shrink-0" />
                  )}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">
                      {verificationResult.message}
                    </h4>
                    {verificationResult.valid && (
                      <div className="text-xs space-y-1 pt-1 text-emerald-900">
                        <p>
                          Shop: <strong>{verificationResult.shopName}</strong>
                        </p>
                        <p>
                          Driver:{" "}
                          <strong>{verificationResult.deliveryPerson}</strong> (
                          {verificationResult.vehicleNo})
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          Verified at {verificationResult.timestamp}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">
              Security Gate Operational Note:
            </p>
            <p>
              Only food vendors registered and approved by the Hostel
              Administrator are granted QR passes. Unverified vendors must be
              turned away at campus gates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorPass;
