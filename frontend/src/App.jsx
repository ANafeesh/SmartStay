import { BrowserRouter, Routes, Route } from "react-router-dom";

// Hostel Management
import HostelDashboard from "./pages/hostel/HostelDashboard";
import Buildings from "./pages/hostel/Buildings";
import RoomsBeds from "./pages/hostel/RoomsBeds";
import Allocations from "./pages/hostel/Allocations";
import Transfers from "./pages/hostel/Transfers";
import Occupancy from "./pages/hostel/Occupancy";

// Home & Layout
import Home from "./pages/Home";
import DashboardLayout from "./components/layout/DashboardLayout";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import Room from "./pages/student/Room";
import Complaints from "./pages/student/Complaints";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

// Finance & Marketplace
import Payments from "./pages/finance/Payments";
import Marketplace from "./pages/marketplace/Marketplace";

// Vendor
import VendorDashboard from "./pages/vendor/VendorDashboard";
import FoodItems from "./pages/vendor/FoodItems";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorPass from "./pages/vendor/VendorPass";
import VendorEarnings from "./pages/vendor/VendorEarnings";

// Analytics
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import Reports from "./pages/analytics/Reports";
import UtilitiesAnalytics from "./pages/analytics/UtilitiesAnalytics";
import SmartMonitoring from "./pages/analytics/SmartMonitoring";
import NotificationsCenter from "./pages/analytics/NotificationsCenter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          {/* Student Routes */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/room" element={<Room />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/marketplace" element={<Marketplace />} />

          {/* Vendor Routes */}
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/food-items" element={<FoodItems />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/pass" element={<VendorPass />} />
          <Route path="/vendor/earnings" element={<VendorEarnings />} />

          {/* Hostel Management Routes */}
          <Route path="/hostel" element={<HostelDashboard />} />
          <Route path="/hostel/buildings" element={<Buildings />} />
          <Route path="/hostel/rooms" element={<RoomsBeds />} />
          <Route path="/hostel/allocations" element={<Allocations />} />
          <Route path="/hostel/transfers" element={<Transfers />} />
          <Route path="/hostel/occupancy" element={<Occupancy />} />

          {/* Analytics Routes */}
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
    </BrowserRouter>
  );
}

export default App;
