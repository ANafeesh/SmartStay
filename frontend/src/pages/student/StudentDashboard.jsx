import { Link } from "react-router-dom";

import {
  Wallet,
  BedDouble,
  ShoppingBag,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Outstanding Balance",
    value: "Rs. 12,500",
    icon: Wallet,
    color: "text-smart-blue",
    bg: "bg-smart-blue/10",
  },
  {
    title: "Room",
    value: "B-204",
    icon: BedDouble,
    color: "text-smart-teal",
    bg: "bg-smart-teal/10",
  },
  {
    title: "Food Orders",
    value: "08",
    icon: ShoppingBag,
    color: "text-smart-warning",
    bg: "bg-smart-warning/10",
  },
  {
    title: "Open Complaints",
    value: "02",
    icon: AlertCircle,
    color: "text-smart-danger",
    bg: "bg-smart-danger/10",
  },
];

function StudentDashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-smart-primary">
          Student Dashboard
        </h1>

        <p className="mt-2 text-smart-secondary">
          Here's what's happening with your hostel services.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={24} />
                </div>

                <ArrowUpRight size={18} className="text-smart-secondary" />
              </div>

              <p className="mt-5 text-sm text-smart-secondary">{stat.title}</p>

              <h3 className="mt-1 text-2xl font-bold text-smart-primary">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Recent Payments
              </h2>

              <p className="text-sm text-smart-secondary">
                Your latest payment activity
              </p>
            </div>

            <Link
              to="/payments"
              className="text-sm font-semibold text-smart-blue hover:text-smart-primary"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 divide-y divide-black/5">
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

        <div className="rounded-2xl border border-black/5 bg-smart-primary p-6 text-white shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <BedDouble size={24} />
          </div>

          <h2 className="mt-5 text-xl font-bold">Room B-204</h2>

          <p className="mt-2 text-sm text-white/60">Block B · Second Floor</p>

          <div className="mt-6 rounded-xl bg-white/10 p-4">
            <p className="text-xs text-white/50">Roommates</p>

            <p className="mt-1 font-semibold">2 Students</p>
          </div>

          <Link
            to="/room"
            className="mt-5 block w-full rounded-xl bg-smart-blue px-4 py-3 text-center font-semibold text-white transition hover:bg-smart-teal"
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
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="font-semibold text-smart-primary">{title}</p>

        <p className="mt-1 text-sm text-smart-secondary">{date}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-smart-primary">{amount}</p>

        <span
          className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPaid
              ? "bg-smart-success/10 text-smart-success"
              : "bg-smart-warning/10 text-smart-warning"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default StudentDashboard;
