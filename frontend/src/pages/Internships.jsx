import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "../components/Toast";
import EmptyState from "../components/EmptyState";
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
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  function resetForm() {
    setEditingId(null);
    setCompany("");
    setRole("");
    setStatus(APPLICATION_STATUSES[0]);
    setDateApplied(todayString());
    setNotes("");
  }

  function saveApplication(e) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const appData = {
      company: company.trim(),
      role: role.trim(),
      status,
      dateApplied,
      notes: notes.trim(),
    };

    if (editingId) {
      setApplications(
        applications.map((a) =>
          a.id === editingId ? { ...a, ...appData } : a
        )
      );
      showToast("Application updated");
    } else {
      setApplications([{ id: Date.now(), ...appData }, ...applications]);
      showToast("Application added");
    }

    resetForm();
  }

  function startEdit(app) {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setDateApplied(app.dateApplied);
    setNotes(app.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateStatus(id, newStatus) {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Status updated to ${newStatus}`);
  }

  function deleteApplication(id) {
    const appToDelete = applications.find((a) => a.id === id);
    const originalApps = applications;
    setApplications(applications.filter((a) => a.id !== id));
    if (id === editingId) resetForm();

    showToast({
      message: `Deleted "${appToDelete?.company || "Application"}"`,
      actionLabel: "Undo",
      onAction: () => {
        setApplications(originalApps);
        showToast("Application restored");
      },
    });
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

      <form className="task-form" onSubmit={saveApplication}>
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
          {editingId ? "Save changes" : "+ Add application"}
        </button>

        {editingId && (
          <button type="button" className="mini-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
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
        {visibleApps.length === 0 ? (
          filter !== "All" ? (
            <EmptyState
              icon="🔍"
              title={`No ${filter} applications`}
              message="There are no applications matching this status filter."
              actionLabel="Show all applications"
              onAction={() => setFilter("All")}
            />
          ) : (
            <EmptyState
              icon="💼"
              title="No applications tracked yet"
              message="Keep track of companies, roles, interviews, and offers in one place."
              actionLabel="+ Add an application"
              onAction={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                document.querySelector('.task-form input[type="text"]')?.focus();
              }}
            />
          )
        ) : (
          visibleApps.map((a) => (
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
                className="edit-btn"
                onClick={() => startEdit(a)}
                aria-label={`Edit ${a.company}`}
              >
                Edit
              </button>

              <button
                className="delete"
                onClick={() => deleteApplication(a.id)}
                aria-label={`Delete ${a.company}`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
