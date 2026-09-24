import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DashboardLayout from "./components/layout/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Payments from "./pages/finance/Payments";
import Marketplace from "./pages/marketplace/Marketplace";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
