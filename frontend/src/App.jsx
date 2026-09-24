function App() {
  return (
    <div className="min-h-screen bg-smart-background">
      <header className="bg-smart-primary px-6 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Smart<span className="text-smart-accent">Stay</span>
            </h1>

            <p className="text-sm text-gray-300">
              Smart Hostel & Co-Living Management System
            </p>
          </div>

          <button className="rounded-lg bg-smart-accent px-5 py-2.5 font-semibold text-white transition hover:opacity-90">
            Get Started
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-smart-accent/10 px-4 py-2 text-sm font-semibold text-smart-accent">
            Smart Hostel Management
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-smart-primary md:text-6xl">
            A smarter way to manage
            <span className="text-smart-accent"> hostel life.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-smart-secondary">
            SmartStay brings hostel management, payments, food ordering,
            services, security and student activities into one simple platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-smart-accent px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              Explore SmartStay
            </button>

            <button className="rounded-xl border-2 border-smart-primary bg-white px-6 py-3 font-semibold text-smart-primary transition hover:bg-smart-primary hover:text-white">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Easy Payments"
            description="Manage bills, payments, receipts and payment history in one place."
          />

          <FeatureCard
            title="Food Marketplace"
            description="Browse approved vendors, order food and track your orders."
          />

          <FeatureCard
            title="Smart Security"
            description="Use digital passes and QR verification for safer hostel access."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-smart-accent/10 text-smart-accent">
        ✓
      </div>

      <h3 className="text-xl font-bold text-smart-primary">{title}</h3>

      <p className="mt-3 leading-7 text-smart-secondary">{description}</p>
    </div>
  );
}

export default App;
