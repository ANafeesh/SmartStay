import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DashboardLayout from "./components/layout/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Payments from "./pages/finance/Payments";
import Marketplace from "./pages/marketplace/Marketplace";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import FoodItems from "./pages/vendor/FoodItems";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorPass from "./pages/vendor/VendorPass";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Student Application */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/food-items" element={<FoodItems />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/pass" element={<VendorPass />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
