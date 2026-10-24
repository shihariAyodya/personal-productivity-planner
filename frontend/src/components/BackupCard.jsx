import { useRef, useState } from "react";
import { todayString } from "../utils/dates";

const KEYS = ["tasks", "dailyLogs", "applications"];

export default function BackupCard() {
  const fileRef = useRef(null);
  const [message, setMessage] = useState("");

  function exportData() {
    const data = {};
    KEYS.forEach((key) => {
      const saved = localStorage.getItem(key);
      data[key] = saved ? JSON.parse(saved) : null;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `planner-backup-${todayString()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setMessage("Backup downloaded.");
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!KEYS.some((key) => key in data)) throw new Error("Not a backup");

        const ok = window.confirm(
          "This replaces the data on this device with the backup. Continue?"
        );
        if (!ok) return;

        KEYS.forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });
        window.location.reload();
      } catch {
        setMessage("That file is not a valid backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="goal-card backup-card">
      <div className="goal-label">
        Your data is saved in this browser only. Download a backup now and then.
      </div>

      <div className="backup-actions">
        <button className="btn" onClick={exportData}>
          Download backup
        </button>
        <button className="mini-btn" onClick={() => fileRef.current.click()}>
          Restore from file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={importData}
        />
      </div>

      {message && <p className="backup-note">{message}</p>}
    </div>
  );
}