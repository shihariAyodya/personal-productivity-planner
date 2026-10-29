import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
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
        {/* App title links back to the landing page */}
        <Link
          to="/"
          className="app-name-link"
          onClick={() => setOpen(false)}
          title="Return to welcome page"
        >
          <h2 className="app-name">Daily Planner</h2>
        </Link>
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
            end={link.to === "/dashboard"}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
