import { useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/daily", label: "Daily Plan" },
  { to: "/tasks", label: "Tasks" },
  { to: "/weekly", label: "Weekly Planner" },
  { to: "/internships", label: "Internships" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <h2 className="app-name">Daily Planner</h2>
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      <div className={open ? "nav-links open" : "nav-links"}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}