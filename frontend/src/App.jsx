import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));

const HostelDashboard = lazy(() => import("./pages/hostel/HostelDashboard"));
const Buildings = lazy(() => import("./pages/hostel/Buildings"));
const RoomsBeds = lazy(() => import("./pages/hostel/RoomsBeds"));
const Allocations = lazy(() => import("./pages/hostel/Allocations"));
const Transfers = lazy(() => import("./pages/hostel/Transfers"));
const Occupancy = lazy(() => import("./pages/hostel/Occupancy"));

const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const Room = lazy(() => import("./pages/student/Room"));
const Complaints = lazy(() => import("./pages/student/Complaints"));
const Notifications = lazy(() => import("./pages/student/Notifications"));
const Profile = lazy(() => import("./pages/student/Profile"));

const Payments = lazy(() => import("./pages/finance/Payments"));
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));

const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const FoodItems = lazy(() => import("./pages/vendor/FoodItems"));
const VendorOrders = lazy(() => import("./pages/vendor/VendorOrders"));
const VendorPass = lazy(() => import("./pages/vendor/VendorPass"));
const VendorEarnings = lazy(() => import("./pages/vendor/VendorEarnings"));

const AnalyticsDashboard = lazy(
  () => import("./pages/analytics/AnalyticsDashboard"),
);
const Reports = lazy(() => import("./pages/analytics/Reports"));
const UtilitiesAnalytics = lazy(
  () => import("./pages/analytics/UtilitiesAnalytics"),
);
const SmartMonitoring = lazy(
  () => import("./pages/analytics/SmartMonitoring"),
);
const NotificationsCenter = lazy(
  () => import("./pages/analytics/NotificationsCenter"),
);

function RouteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] items-center justify-center"
    >
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
        />
        Loading page...
      </div>
    </div>
  );
}

const MaintenanceHome = lazy(
  () => import("./pages/maintance/MaintenanceHome"),
);
const SubmitComplaint = lazy(
  () => import("./pages/maintance/Student/SubmitComplaint"),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/room" element={<Room />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace" element={<Marketplace />} />

            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/food-items" element={<FoodItems />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/pass" element={<VendorPass />} />
            <Route path="/vendor/earnings" element={<VendorEarnings />} />

            <Route path="/hostel" element={<HostelDashboard />} />
            <Route path="/hostel/buildings" element={<Buildings />} />
            <Route path="/hostel/rooms" element={<RoomsBeds />} />
            <Route path="/hostel/allocations" element={<Allocations />} />
            <Route path="/hostel/transfers" element={<Transfers />} />
            <Route path="/hostel/occupancy" element={<Occupancy />} />

            <Route path="/maintenance" element={<MaintenanceHome />} />
            <Route
              path="/maintenance/submit-complaint"
              element={<SubmitComplaint />}
            />

            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/utilities" element={<UtilitiesAnalytics />} />
            <Route path="/monitoring" element={<SmartMonitoring />} />
            <Route
              path="/notifications-center"
              element={<NotificationsCenter />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
