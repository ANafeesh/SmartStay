import { BrowserRouter, Routes, Route } from "react-router-dom";

import HostelDashboard from "./pages/hostel/HostelDashboard";
import Buildings from "./pages/hostel/Buildings";
import RoomsBeds from "./pages/hostel/RoomsBeds";
import Home from "./pages/Home";
import DashboardLayout from "./components/layout/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Payments from "./pages/finance/Payments";
import Marketplace from "./pages/marketplace/Marketplace";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import FoodItems from "./pages/vendor/FoodItems";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorPass from "./pages/vendor/VendorPass";
import VendorEarnings from "./pages/vendor/VendorEarnings";
import Room from "./pages/student/Room";
import Complaints from "./pages/student/Complaints";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Student Application */}
        <Route element={<DashboardLayout />}>
        <Route element={<DashboardLayout />}></Route>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
