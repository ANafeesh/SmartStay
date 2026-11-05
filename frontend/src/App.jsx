import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const AuthPortal = lazy(() => import("./pages/auth/AuthPortal"));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const GateVerification = lazy(() => import("./pages/gate/GateVerification"));

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

const Payments = lazy(() => import("./pages/student/Payments"));
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));

const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const VendorApplications = lazy(
  () => import("./pages/vendor/VendorApplications"),
);
const FoodItems = lazy(() => import("./pages/vendor/FoodItems"));
const VendorOrders = lazy(() => import("./pages/vendor/VendorOrders"));
const VendorPass = lazy(() => import("./pages/vendor/VendorPass"));
const VendorEarnings = lazy(() => import("./pages/vendor/VendorEarnings"));
const VendorProfile = lazy(() => import("./pages/vendor/VendorProfile"));

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

const MaintenanceHome = lazy(
  () => import("./pages/maintance/MaintenanceHome"),
);
const SubmitComplaint = lazy(
  () => import("./pages/maintance/Student/SubmitComplaint"),
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

function AdaptiveProfile() {
  const { user } = useAuth();
  if (user?.role === "vendor") {
    return <VendorProfile />;
  }
  return <Profile />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* Primary Entry Point: Root URL navigates to Login page */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthPortal initialTab="login" />} />
            <Route path="/register" element={<AuthPortal initialTab="register" />} />
            <Route path="/signup" element={<AuthPortal initialTab="register" />} />
            <Route path="/login/:roleKey" element={<AuthPortal initialTab="login" />} />

            {/* Public Gatekeeper QR Scanner & Verification Terminal */}
            <Route path="/gate/verify" element={<GateVerification />} />
            <Route path="/gate-verify" element={<GateVerification />} />
            <Route path="/verify-pass" element={<GateVerification />} />
            <Route path="/verify" element={<GateVerification />} />

            {/* Authenticated Dashboard Workspace */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Module 2 & 3: Student Portal */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["student", "admin", "warden", "finance", "executive", "vendor"]} />
                }
              >
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/room" element={<Room />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<AdaptiveProfile />} />
                <Route path="/marketplace" element={<Marketplace />} />
              </Route>

              {/* Module 3: Vendor Portal */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["vendor", "admin"]} />
                }
              >
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route
                  path="/vendor/applications"
                  element={<VendorApplications />}
                />
                <Route path="/food-items" element={<FoodItems />} />
                <Route path="/vendor/food-items" element={<FoodItems />} />
                <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route path="/vendor/pass" element={<VendorPass />} />
                <Route path="/vendor/earnings" element={<VendorEarnings />} />
                <Route path="/vendor/profile" element={<VendorProfile />} />
              </Route>

              {/* Module 1: Hostel Management */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin", "warden"]} />
                }
              >
                <Route path="/hostel" element={<HostelDashboard />} />
                <Route path="/hostel/buildings" element={<Buildings />} />
                <Route path="/hostel/rooms" element={<RoomsBeds />} />
                <Route path="/hostel/allocations" element={<Allocations />} />
                <Route path="/hostel/transfers" element={<Transfers />} />
                <Route path="/hostel/occupancy" element={<Occupancy />} />
              </Route>

              {/* Module 4: Maintenance */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["maintenance", "admin", "warden", "student"]}
                  />
                }
              >
                <Route path="/maintenance" element={<MaintenanceHome />} />
                <Route
                  path="/maintenance/submit-complaint"
                  element={<SubmitComplaint />}
                />
              </Route>

              {/* Module 5: Smart Monitoring & Analytics */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "warden", "executive", "finance"]}
                  />
                }
              >
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/utilities" element={<UtilitiesAnalytics />} />
                <Route path="/monitoring" element={<SmartMonitoring />} />
                <Route
                  path="/notifications-center"
                  element={<NotificationsCenter />}
                />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
