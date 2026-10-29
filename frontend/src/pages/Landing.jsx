import { Link } from "react-router-dom";

// Welcome landing page shown at path "/".
// Provides a clean, friendly entry point to open the planner.
export default function Landing() {
  return (
    <div className="landing-content">
      {/* Hero section */}
      <header className="landing-header">
        <span className="landing-badge">Personal Productivity</span>
        <h1 className="landing-title">Daily Planner</h1>
        <p className="landing-tagline">
          Your calm, focused space to track daily study hours, crochet time, and
          internship applications.
        </p>

        <div className="landing-actions">
          <Link to="/dashboard" className="btn landing-cta-btn">
            Open my planner →
          </Link>
        </div>

        <p className="landing-privacy-note">
          <span aria-hidden="true">🔒</span> Your data stays in your browser.
        </p>
      </header>

      {/* Feature highlights */}
      <section className="landing-features" aria-label="Planner features">
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">
            ⏱️
          </div>
          <h2 className="feature-title">Daily Plan & Goals</h2>
          <p className="feature-desc">
            Log your study and crochet sessions, use the live focus timer, and
            check off today's tasks — all in one place.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">
            🗓️
          </div>
          <h2 className="feature-title">Weekly Planner</h2>
          <p className="feature-desc">
            See your whole week at a glance, drag tasks between days, and keep
            a clear picture of what's coming up.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">
            💼
          </div>
          <h2 className="feature-title">Internship Tracker</h2>
          <p className="feature-desc">
            Track every application from first send to final answer — companies,
            roles, interview stages, and outcomes.
          </p>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="landing-footer">
        <p>Built with React</p>
      </footer>
    </div>
  );
}

