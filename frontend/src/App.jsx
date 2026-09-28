import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DashboardLayout from "./components/layout/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Payments from "./pages/finance/Payments";
import Marketplace from "./pages/marketplace/Marketplace";
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

        {/* Student Application */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/utilities" element={<UtilitiesAnalytics />} />
          <Route path="/monitoring" element={<SmartMonitoring />} />
          <Route path="/notifications" element={<NotificationsCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
