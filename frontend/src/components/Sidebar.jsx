import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h2 className="app-name">My Planner</h2>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/daily">Daily Plan</NavLink>
      <NavLink to="/tasks">Tasks</NavLink>
      <NavLink to="/weekly">Weekly Planner</NavLink>
      <NavLink to="/internships">Internships</NavLink>
    </nav>
  );
}