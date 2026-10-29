import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DailyPlan from "./pages/DailyPlan";
import Tasks from "./pages/Tasks";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import Internships from "./pages/Internships";
import { ToastProvider } from "./components/Toast";
import QuickAddButton from "./components/QuickAddButton";

export default function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <div className="layout">
        <Sidebar />
        {/* key ensures a gentle fade-in animation triggers when changing pages */}
        <main key={location.pathname} className="main-content page-enter">
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily" element={<DailyPlan />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/weekly" element={<WeeklyPlanner />} />
            <Route path="/internships" element={<Internships />} />
          </Routes>
        </main>
        {/* Floating Quick Add button on mobile and desktop 'N' shortcut */}
        <QuickAddButton />
      </div>
    </ToastProvider>
  );
}
