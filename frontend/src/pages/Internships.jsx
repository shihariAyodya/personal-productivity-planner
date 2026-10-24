import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { APPLICATION_STATUSES } from "../utils/constants";
import { todayString } from "../utils/dates";

export default function Internships() {
  const [applications, setApplications] = useLocalStorage("applications", []);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(APPLICATION_STATUSES[0]);
  const [dateApplied, setDateApplied] = useState(todayString());
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("All");

  function addApplication(e) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      status,
      dateApplied,
      notes: notes.trim(),
    };

    setApplications([newApp, ...applications]);
    setCompany("");
    setRole("");
    setNotes("");
  }

  function updateStatus(id, newStatus) {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  function deleteApplication(id) {
    setApplications(applications.filter((a) => a.id !== id));
  }

  const visibleApps =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div>
      <h1>Internships</h1>

      <div className="stat-grid">
        {APPLICATION_STATUSES.map((s) => (
          <div key={s} className="stat-card">
            <div className="stat-number">
              {applications.filter((a) => a.status === s).length}
            </div>
            <div className="stat-label">{s}</div>
          </div>
        ))}
      </div>

      <form className="task-form" onSubmit={addApplication}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role (e.g. Data Analyst Intern)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit" className="btn">
          + Add application
        </button>
      </form>

      <div className="filters">
        {["All", ...APPLICATION_STATUSES].map((s) => (
          <button
            key={s}
            className={filter === s ? "filter active" : "filter"}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="task-list">
        {visibleApps.length === 0 && (
          <p className="empty">No applications here yet.</p>
        )}

        {visibleApps.map((a) => (
          <div key={a.id} className="task">
            <div className="task-main">
              <span className="task-title">
                {a.company} · {a.role}
              </span>
              <span className="task-date">
                Applied {a.dateApplied}
                {a.notes && ` · ${a.notes}`}
              </span>
            </div>

            <select
              className={`status-select status-${a.status.toLowerCase()}`}
              value={a.status}
              onChange={(e) => updateStatus(a.id, e.target.value)}
              aria-label={`Status for ${a.company}`}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              className="delete"
              onClick={() => deleteApplication(a.id)}
              aria-label="Delete application"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}