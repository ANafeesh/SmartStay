import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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

  const studentName = user?.name || "Student User";
  const studentRegId = user?.studentId || "STD-2026-090";
  const roomNumber = user?.room || "B-204";

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6 pb-12">
      {/* Title Header with Pass Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Overview of hostel services, fees, room allocation, and security pass.
          </p>
        </div>

        <button
          onClick={() => setShowPassModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition cursor-pointer self-start sm:self-auto"
        >
          <QrCode size={16} />
          <span>Digital Gate Pass</span>
          <span className="rounded-full bg-emerald-700/60 px-1.5 py-0.5 text-[10px]">
            Active
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
                  className={`rounded-full border px-2 py-0.5 text-[9px] sm:text-[11px] font-semibold truncate ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>

              <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                {stat.title}
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                  {stat.value}
                </h3>
                <ArrowUpRight
                  size={16}
                  className="hidden sm:block text-slate-300 transition-colors group-hover:text-slate-600"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower Section Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Recent Payments Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs lg:col-span-2">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Payments
                </h2>
                <p className="text-xs text-slate-500">
                  Your latest payment activity &amp; receipts
                </p>
              </div>

              <Link
                to="/payments"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              <PaymentRow
                title="September Hostel Fee"
                date="24 Sep 2026"
                amount="Rs. 8,000"
                status="Paid"
              />
              <PaymentRow
                title="Utility Charge"
                date="20 Sep 2026"
                amount="Rs. 2,500"
                status="Paid"
              />
              <PaymentRow
                title="Semester Fee"
                date="15 Sep 2026"
                amount="Rs. 2,000"
                status="Pending"
              />
            </div>
          </div>
        </div>

        {/* Room Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-6 text-slate-800 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <BedDouble size={20} className="text-blue-600" />
              </div>
              <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <ShieldCheck size={12} />
                Occupied
              </span>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Current Room
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Room {roomNumber}
              </h2>
              <p className="text-xs text-slate-500">Block B · Second Floor</p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users size={15} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Roommates</p>
                  <p className="text-xs font-semibold text-slate-800">2 Students</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Cap: 3
              </span>
            </div>
          </div>

          <Link
            to="/room"
            className="mt-5 block w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700"
          >
            View Room Details
          </Link>
        </div>
      </div>

      {/* Digital Gate Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Digital Student Gate Pass
                </h3>
              </div>
              <button
                onClick={() => setShowPassModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-5">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-300 p-3">
                <QrCode size={120} className="text-slate-800" />
              </div>

              <div className="mt-4">
                <h4 className="text-base font-bold text-slate-900">{studentName}</h4>
                <p className="font-mono text-xs text-blue-600 font-semibold">{studentRegId}</p>
                <p className="text-xs text-slate-500 mt-1">Hostel Room {roomNumber}</p>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={13} />
                <span>Security Clearance: ACTIVE</span>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 pb-1">
              Present this pass at campus security checkpoints.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentRow({ title, date, amount, status }) {
  const isPaid = status === "Paid";

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400">{date}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">{amount}</p>
        <span
          className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isPaid
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default StudentDashboard;
