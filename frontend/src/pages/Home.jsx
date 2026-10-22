import { CreditCard, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: CreditCard,
    title: "Easy Payments",
    description:
      "Manage hostel bills, payments, receipts and payment history in one place.",
  },
  {
    icon: ShoppingBag,
    title: "Food Marketplace",
    description:
      "Browse approved vendors, order food and track your orders easily.",
  },
  {
    icon: ShieldCheck,
    title: "Smart Security",
    description:
      "Use digital passes and QR verification for safer hostel access.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-smart-background">
      <header className="bg-smart-primary px-6 py-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Smart<span className="text-smart-teal">Stay</span>
            </h1>

            <p className="text-sm text-white/70">
              Smart Hostel & Co-Living Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              <lord-icon
                src="/system-solid-1725-person-exit.json"
                trigger="hover"
                state="hover-pinch"
                colors="primary:#ffffff"
                style={{ width: "20px", height: "20px", transform: "scaleX(-1)" }}
              ></lord-icon>
              <span>Login</span>
            </Link>
            <Link
              to="/dashboard"
              className="rounded-xl bg-smart-blue px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-smart-teal active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-smart-blue/10 px-4 py-2 text-sm font-semibold text-smart-blue">
            Smart Hostel Management
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-smart-primary md:text-6xl">
            A smarter way to manage
            <span className="text-smart-blue"> hostel life.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-smart-secondary">
            SmartStay brings hostel management, payments, food ordering,
            services, security and student activities into one simple platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-smart-blue px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-smart-primary"
            >
              Explore SmartStay
              <ArrowRight size={18} />
            </a>

            <button className="rounded-xl border-2 border-smart-primary bg-white px-6 py-3 font-semibold text-smart-primary transition hover:bg-smart-primary hover:text-white">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
                  <Icon size={24} />
                </div>

                <h3 className="text-xl font-bold text-smart-primary">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-smart-secondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Home;
