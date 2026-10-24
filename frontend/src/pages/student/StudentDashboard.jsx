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
} from "lucide-react";

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
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Student Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is a quick overview of your hostel services and balance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${stat.badgeColor}`}
                >
                  {stat.badge}
                </span>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                {stat.title}
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </h3>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition-colors group-hover:text-slate-600"
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
                  Your latest payment activity & receipts
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
                Room B-204
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
