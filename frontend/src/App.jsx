import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import DailyPlan from "./pages/DailyPlan";
import Tasks from "./pages/Tasks";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import Internships from "./pages/Internships";
import { ToastProvider } from "./components/Toast";
import QuickAddButton from "./components/QuickAddButton";

export default function App() {
  const location = useLocation();
  // Landing page at "/" is full-screen without sidebar or quick-add button
  const isLanding = location.pathname === "/";

  return (
    <ToastProvider>
      <div className={isLanding ? "landing-page-wrap" : "layout"}>
        {!isLanding && <Sidebar />}

        <main
          key={location.pathname}
          className={isLanding ? "landing-main page-enter" : "main-content page-enter"}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/daily" element={<DailyPlan />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/weekly" element={<WeeklyPlanner />} />
            <Route path="/internships" element={<Internships />} />
          </Routes>
        </main>

        {!isLanding && <QuickAddButton />}
      </div>
    </ToastProvider>
  );
}
