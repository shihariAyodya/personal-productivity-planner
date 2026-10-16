import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DailyPlan from "./pages/DailyPlan";
import Tasks from "./pages/Tasks";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import Internships from "./pages/Internships";

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily" element={<DailyPlan />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/weekly" element={<WeeklyPlanner />} />
          <Route path="/internships" element={<Internships />} />
        </Routes>
      </main>
    </div>
  );
}