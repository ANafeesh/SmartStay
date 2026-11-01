import {
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Store,
  Building2,
  Wrench,
  BarChart3,
  CheckCircle2,
  LogIn,
  QrCode,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/ui/Logo";

export default function Home() {
  const modules = [
    {
      title: "Payments, Food & Marketplace",
      tag: "Module 3 · Ahamed Nafeesh",
      studentId: "SEU/IS/22/ICT/090",
      icon: CreditCard,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200/80",
      href: "/payments",
      description:
        "Automated hostel fee billing, multi-gateway payments (card, bank slip, IPG), official bursary receipts, food ordering, crowd-control delivery slots, and QR vendor gate passes.",
      features: [
        "Room Rent & Utility Invoicing",
        "Digital Bursary Receipt with Anti-tamper QR",
        "Food Ordering with Delivery Slots",
        "QR Vendor Gate Verification",
      ],
      badge: "Primary Focus",
    },
    {
      title: "Smart Hostel & Room Management",
      tag: "Module 1 · A. Kanesalingam",
      studentId: "SEU/IS/22/ICT/069",
      icon: Building2,
      color: "from-sky-600 to-blue-700",
      textColor: "text-sky-600",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200/80",
      href: "/hostel",
      description:
        "Manage hostel buildings, floors, rooms, bed capacity, student allocations, room transfer workflows, check-in and check-out logs.",
      features: ["Building & Room Inventory", "Real-Time Bed Allocations", "Room Transfer Approval Workflow"],
    },
    {
      title: "Student Security & Digital Pass",
      tag: "Module 2 · M. H. U Hafrath",
      studentId: "SEU/IS/22/ICT/102",
      icon: ShieldCheck,
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200/80",
      href: "/dashboard",
      description:
        "Student digital QR passes, campus gate scanning, entry/exit logging, leave request submission, visitor registers, and hostel rule compliance.",
      features: ["Digital Student QR Pass", "Campus Gate Entry Logs", "Leave & Visitor Approvals"],
    },
    {
      title: "Maintenance & Student Services",
      tag: "Module 4 · A. Dhusanthika",
      studentId: "SEU/IS/22/ICT/074",
      icon: Wrench,
      color: "from-amber-600 to-orange-600",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/80",
      href: "/maintenance",
      description:
        "Complaint submission with photo evidence, maintenance technician dispatch, SLA escalation monitoring, resolution feedback, and lost-and-found board.",
      features: ["Maintenance Ticket Workflow", "Photo Evidence Upload", "Lost & Found Bulletin"],
    },
    {
      title: "Smart Monitoring & Analytics",
      tag: "Module 5 · M. I. M Izni",
      studentId: "SEU/IS/22/ICT/112",
      icon: BarChart3,
      color: "from-purple-600 to-indigo-700",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200/80",
      href: "/analytics",
      description:
        "Executive operational analytics, occupancy trends, fee collection reconciliation, complaint resolution SLA tracking, and utility consumption intelligence.",
      features: ["Occupancy Rate Analytics", "Financial Revenue Reports", "Utility Usage Telemetry"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <Logo
            variant="horizontal"
            size="md"
            badge="Group L"
            subtitle="South Eastern University of Sri Lanka"
            asLink
          />

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
            >
              <LogIn size={14} className="text-blue-600" />
              <span>Role Login</span>
            </Link>
            <Link
              to="/marketplace"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
            >
              <ShoppingBag size={14} className="text-emerald-600" />
              <span>Food Marketplace</span>
            </Link>

            <Link
              to="/payments"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-2.5 sm:px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
            >
              <CreditCard size={14} />
              <span className="hidden sm:inline">Payments Portal</span>
              <span className="sm:hidden">Payments</span>
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 px-3 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95"
            >
              <span className="hidden sm:inline">Open Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle radial background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-gradient-to-tr from-blue-400/10 via-indigo-300/10 to-teal-300/10 blur-3xl pointer-events-none rounded-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold text-blue-800 shadow-2xs mb-6">
              <Sparkles size={14} className="text-blue-600" />
              <span>SWT22022 Practical for Internet Application Development</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.12]">
              Smart Hostel &amp; Co-Living{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
              A comprehensive campus platform unifying student room administration, automated billing and payments, food marketplace delivery slots, digital QR gate security, and operational monitoring.
            </p>

            {/* Quick Action Badges */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 max-w-md sm:max-w-none mx-auto">
              <Link
                to="/payments"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30 transition cursor-pointer"
              >
                <CreditCard size={17} />
                <span>Explore Student Billing &amp; Receipts</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-300 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs cursor-pointer"
              >
                <ShoppingBag size={17} className="text-emerald-600" />
                <span>Food Marketplace &amp; Orders</span>
              </Link>

              <Link
                to="/vendor/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition shadow-md cursor-pointer"
              >
                <Store size={17} className="text-amber-400" />
                <span>Vendor Operations Hub</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 border border-blue-200/90 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-blue-700 hover:bg-blue-100 transition shadow-xs cursor-pointer"
              >
                <LogIn size={17} className="text-blue-600" />
                <span>Role Login Hub</span>
              </Link>
            </div>

            {/* Key Platform Stats */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-2xs backdrop-blur-xs">
                <span className="text-2xl font-black text-blue-600 block">5</span>
                <span className="text-xs font-bold text-slate-700">Integrated Modules</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Role-Based Architecture</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-2xs backdrop-blur-xs">
                <span className="text-2xl font-black text-emerald-600 block">100%</span>
                <span className="text-xs font-bold text-slate-700">Digital Receipts</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Anti-Tamper QR Verified</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-2xs backdrop-blur-xs">
                <span className="text-2xl font-black text-purple-600 block">Live</span>
                <span className="text-xs font-bold text-slate-700">Crowd Slots</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Controlled Gate Entry</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-2xs backdrop-blur-xs">
                <span className="text-2xl font-black text-amber-600 block">Fast</span>
                <span className="text-xs font-bold text-slate-700">QR Gate Passes</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Campus Security Clearance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Overview Section */}
      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Architecture &amp; Contribution Overview
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              South Eastern University Hostel Management Modules
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Each module is engineered to address university residential pain points including manual paper records, payment confusion, and unauthorized vendor entries.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className={`relative flex flex-col justify-between rounded-3xl border ${m.borderColor} bg-white p-6 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <div>
                    {m.badge && (
                      <span className="absolute top-5 right-5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                        {m.badge}
                      </span>
                    )}

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${m.bgColor} ${m.textColor} mb-5 shadow-2xs`}
                    >
                      <Icon size={24} />
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {m.tag}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-blue-600 block mt-0.5">
                      {m.studentId}
                    </span>

                    <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                      {m.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {m.description}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                      {m.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-[11px] font-medium text-slate-700"
                        >
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to={m.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group cursor-pointer"
                    >
                      <span>Open Module Workspace</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Logo
                variant="horizontal"
                size="sm"
                theme="dark"
                subtitle="Campus Accommodation"
                asLink
              />
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                SWT22022 Practical for Internet Application Development · CA1 Group Assignment (Group L)
                <br />
                South Eastern University of Sri Lanka
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <Link to="/payments" className="hover:text-white transition">
                Payments &amp; Billing
              </Link>
              <Link to="/marketplace" className="hover:text-white transition">
                Food Marketplace
              </Link>
              <Link to="/vendor/dashboard" className="hover:text-white transition">
                Vendor Portal
              </Link>
              <Link to="/dashboard" className="hover:text-white transition">
                Student Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              Lead Developer (Module 3): <strong>Ahamed Nafeesh</strong> (Reg:{" "}
              <span className="font-mono text-slate-400">SEU/IS/22/ICT/090</span>)
            </p>
            <p>© 2026 SmartStay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
