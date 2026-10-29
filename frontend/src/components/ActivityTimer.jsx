import { useState, useEffect, useRef } from "react";

// Timer component for tracking Study or Crochet sessions in real time.
// Stopping the timer calculates elapsed minutes and logs them to today's dailyLogs.
export default function ActivityTimer({ onLogMinutes }) {
  const [mode, setMode] = useState("study"); // "study" | "crochet"
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const timerRef = useRef(null);

  // Keep timer ticking every second when active
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  function handleStart() {
    setIsRunning(true);
    setStatusMessage("");
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleStop() {
    setIsRunning(false);
    // Convert elapsed seconds into minutes (sessions >= 30s count as at least 1 min)
    const elapsedMinutes = Math.round(seconds / 60) || (seconds >= 30 ? 1 : 0);
    const field = mode === "study" ? "studyMinutes" : "crochetMinutes";
    const label = mode === "study" ? "study" : "crochet";

    if (elapsedMinutes > 0) {
      onLogMinutes(field, elapsedMinutes);
      setStatusMessage(`Logged +${elapsedMinutes} min to today's ${label}!`);
    } else if (seconds > 0) {
      setStatusMessage("Session was under 30 seconds; no minutes added.");
    }
    setSeconds(0);
  }

  function handleReset() {
    setIsRunning(false);
    setSeconds(0);
    setStatusMessage("");
  }

  // Format seconds as MM:SS (or HH:MM:SS if over an hour)
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeDisplay =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="goal-card timer-card">
      <div className="timer-header">
        <span className="goal-label">Focus Timer</span>
        {/* Toggle between Study and Crochet */}
        <div className="timer-mode-toggle" role="group" aria-label="Timer mode">
          <button
            type="button"
            className={mode === "study" ? "timer-mode-btn active" : "timer-mode-btn"}
            onClick={() => {
              if (!isRunning) setMode("study");
            }}
            disabled={isRunning}
            aria-pressed={mode === "study"}
          >
            Study
          </button>
          <button
            type="button"
            className={mode === "crochet" ? "timer-mode-btn active" : "timer-mode-btn"}
            onClick={() => {
              if (!isRunning) setMode("crochet");
            }}
            disabled={isRunning}
            aria-pressed={mode === "crochet"}
          >
            Crochet
          </button>
        </div>
      </div>

      {/* Large digital display */}
      <div className="timer-display" aria-live="off">
        {timeDisplay}
      </div>

      {/* Action controls */}
      <div className="timer-controls">
        {!isRunning && seconds === 0 && (
          <button
            type="button"
            className="btn timer-btn start"
            onClick={handleStart}
            aria-label={`Start ${mode} timer`}
          >
            ▶ Start {mode === "study" ? "Study" : "Crochet"}
          </button>
        )}

        {isRunning && (
          <>
            <button
              type="button"
              className="mini-btn timer-btn"
              onClick={handlePause}
              aria-label="Pause timer"
            >
              ⏸ Pause
            </button>
            <button
              type="button"
              className="btn timer-btn stop"
              onClick={handleStop}
              aria-label="Stop timer and log minutes"
            >
              ⏹ Stop & Save
            </button>
          </>
        )}

        {!isRunning && seconds > 0 && (
          <>
            <button
              type="button"
              className="btn timer-btn resume"
              onClick={handleStart}
              aria-label="Resume timer"
            >
              ▶ Resume
            </button>
            <button
              type="button"
              className="btn timer-btn stop"
              onClick={handleStop}
              aria-label="Stop timer and log minutes"
            >
              ⏹ Stop & Save
            </button>
            <button
              type="button"
              className="mini-btn timer-btn"
              onClick={handleReset}
              aria-label="Reset timer without saving"
            >
              ↺ Reset
            </button>
          </>
        )}
      </div>

      {statusMessage && (
        <p className="timer-status" role="status">
          {statusMessage}
        </p>
      )}
    </div>
  );
}

