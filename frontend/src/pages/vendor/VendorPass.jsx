import {
  CheckCircle2,
  ShieldCheck,
  CalendarDays,
  Building2,
  UserRound,
  QrCode,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

function VendorPass() {
  const vendor = {
    name: "Campus Kitchen",
    vendorId: "VEN-00124",
    owner: "Kamal Perera",
    status: "Verified",
    passStatus: "Active",
    issuedDate: "January 01, 2026",
    expiryDate: "December 31, 2026",
    category: "Food & Beverage",
    location: "SEUSL Main Campus",
  };

  const accessPermissions = [
    "Food delivery to authorized campus locations",
    "Access during approved operating hours",
    "Food marketplace order fulfilment",
    "Entry through designated vendor entrance",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-smart-primary sm:text-3xl">
              Vendor Pass
            </h1>
            <p className="mt-1 text-sm text-smart-secondary">
              Manage your campus access pass and verification details.
            </p>
          </div>

          <Badge variant="success">
            <CheckCircle2 size={14} className="mr-1" />
            Verified Vendor
          </Badge>
        </div>
      </div>

      {/* Pass Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vendor Information */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-smart-blue/10 text-smart-blue">
              <Building2 size={38} />
            </div>

            <div className="flex-1">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h2 className="text-xl font-bold text-smart-primary">
                    {vendor.name}
                  </h2>
                  <p className="mt-1 text-sm text-smart-secondary">
                    Vendor ID: {vendor.vendorId}
                  </p>
                </div>

                <Badge variant="success">
                  <CheckCircle2 size={14} className="mr-1" />
                  {vendor.passStatus}
                </Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={UserRound}
                  label="Vendor Owner"
                  value={vendor.owner}
                />

                <InfoItem
                  icon={Building2}
                  label="Business Category"
                  value={vendor.category}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Issued Date"
                  value={vendor.issuedDate}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Expiry Date"
                  value={vendor.expiryDate}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* QR Pass */}
        <Card className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-smart-teal/10 text-smart-teal">
            <QrCode size={34} />
          </div>

          <h2 className="text-lg font-bold text-smart-primary">
            Campus Access QR
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            Show this QR code at the campus entrance.
          </p>

          {/* QR Placeholder */}
          <div className="mt-5 flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-smart-primary bg-white">
            <div className="grid grid-cols-5 gap-1">
              {[...Array(25)].map((_, index) => (
                <div
                  key={index}
                  className={`h-5 w-5 ${
                    index % 2 === 0 || index % 5 === 0
                      ? "bg-smart-primary"
                      : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-smart-secondary">
            QR generation will be connected to the backend later.
          </p>
        </Card>
      </div>

      {/* Status + Access */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verification Status */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-success/10 text-smart-success">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 className="font-bold text-smart-primary">
                Verification Status
              </h2>
              <p className="text-sm text-smart-secondary">
                Your vendor account has been verified.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <StatusRow label="Vendor Verification" value="Verified" />
            <StatusRow label="Campus Access" value="Authorized" />
            <StatusRow label="Pass Status" value="Active" />
            <StatusRow label="Access Location" value={vendor.location} />
          </div>
        </Card>

        {/* Access Permissions */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 className="font-bold text-smart-primary">
                Access Permissions
              </h2>
              <p className="text-sm text-smart-secondary">
                Current permissions for this vendor pass.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {accessPermissions.map((permission) => (
              <div
                key={permission}
                className="flex items-start gap-3 rounded-xl bg-smart-background p-3"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-smart-success"
                />

                <span className="text-sm text-smart-primary">{permission}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pass Expiry */}
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
              <Clock3 size={22} />
            </div>

            <div>
              <h2 className="font-bold text-smart-primary">Pass Expiry</h2>

              <p className="mt-1 text-sm text-smart-secondary">
                This vendor pass is currently active and expires on{" "}
                <span className="font-semibold text-smart-primary">
                  {vendor.expiryDate}
                </span>
                .
              </p>
            </div>
          </div>

          <Button variant="outline">Request Renewal</Button>
        </div>
      </Card>

      {/* Important Notice */}
      <div className="flex gap-3 rounded-2xl border border-smart-warning/20 bg-smart-warning/5 p-5">
        <AlertTriangle
          size={22}
          className="mt-0.5 shrink-0 text-smart-warning"
        />

        <div>
          <h3 className="font-semibold text-smart-primary">Important</h3>

          <p className="mt-1 text-sm leading-6 text-smart-secondary">
            Only verified vendors with an active campus pass are permitted to
            enter the campus for food delivery and marketplace operations.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-smart-background text-smart-blue">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs font-medium text-smart-secondary">{label}</p>
        <p className="mt-1 text-sm font-semibold text-smart-primary">{value}</p>
      </div>
    </div>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-smart-secondary">{label}</span>

      <span className="flex items-center gap-1.5 text-sm font-semibold text-smart-success">
        <CheckCircle2 size={16} />
        {value}
      </span>
    </div>
  );
}

export default VendorPass;
