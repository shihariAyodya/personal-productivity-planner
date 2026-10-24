import useLocalStorage from "../hooks/useLocalStorage";
import {
  CATEGORIES,
  APPLICATION_STATUSES,
  STUDY_TARGET_MIN,
  CROCHET_TARGET_MIN,
} from "../utils/constants";
import { getWeekDates, toDateString, todayString } from "../utils/dates";
import { formatMinutes } from "../utils/format";

const CATEGORY_COLORS = {
  University: "var(--ash)",
  Career: "#b3aeaa",
  Shizelle: "var(--rose-dark)",
};

function ProgressCard({ title, minutes, target, color }) {
  const percent = Math.min(100, Math.round((minutes / target) * 100));

  return (
    <div className="goal-card">
      <div className="goal-label">{title}</div>
      <div className="goal-value">
        {formatMinutes(minutes)}
        <span> / {formatMinutes(target)}</span>
      </div>
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bar-fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tasks] = useLocalStorage("tasks", []);
  const [logs] = useLocalStorage("dailyLogs", {});
  const [applications] = useLocalStorage("applications", []);

  const today = todayString();
  const todayLog = logs[today] || { studyMinutes: 0, crochetMinutes: 0 };

  const todaysTasks = tasks.filter((t) => t.date === today);
  const todaysDone = todaysTasks.filter((t) => t.done).length;

  const weekDays = getWeekDates(0);
  const weekData = weekDays.map((d) => {
    const dateStr = toDateString(d);
    const log = logs[dateStr] || { studyMinutes: 0, crochetMinutes: 0 };
    return {
      dateStr,
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      study: log.studyMinutes,
      crochet: log.crochetMinutes,
    };
  });

  const studyDaysHit = weekData.filter((d) => d.study >= STUDY_TARGET_MIN).length;
  const crochetDaysHit = weekData.filter(
    (d) => d.crochet >= CROCHET_TARGET_MIN
  ).length;
  const weekStudyTotal = weekData.reduce((sum, d) => sum + d.study, 0);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="subtitle">
        {new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>

      <h2 className="section-title">Today</h2>
      <div className="goal-grid">
        <ProgressCard
          title="Study (outside lectures)"
          minutes={todayLog.studyMinutes}
          target={STUDY_TARGET_MIN}
          color="var(--rose)"
        />
        <ProgressCard
          title="Crochet hour"
          minutes={todayLog.crochetMinutes}
          target={CROCHET_TARGET_MIN}
          color="var(--rose-dark)"
        />
        <div className="goal-card">
          <div className="goal-label">Tasks done today</div>
          <div className="goal-value">
            {todaysDone}
            <span> / {todaysTasks.length}</span>
          </div>
        </div>
      </div>

      <h2 className="section-title">This week</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-number">{studyDaysHit}/7</div>
          <div className="stat-label">Study goal days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{crochetDaysHit}/7</div>
          <div className="stat-label">Crochet goal days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatMinutes(weekStudyTotal)}</div>
          <div className="stat-label">Total study time</div>
        </div>
      </div>

      <div className="goal-card chart-card">
        <div className="goal-label">Study time per day</div>
        <div className="chart">
          {weekData.map((d) => {
            const percent = Math.min(100, (d.study / STUDY_TARGET_MIN) * 100);
            return (
              <div
                key={d.dateStr}
                className={d.dateStr === today ? "chart-col today" : "chart-col"}
              >
                <div className="chart-track">
                  <div
                    className="chart-bar"
                    style={{ height: `${Math.max(4, percent)}px` }}
                  />
                </div>
                <span>{d.label}</span>
                <span>{formatMinutes(d.study)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="section-title">Task progress by category</h2>
      <div className="goal-card">
        {CATEGORIES.map((c) => {
          const all = tasks.filter((t) => t.category === c);
          const done = all.filter((t) => t.done).length;
          const percent = all.length ? Math.round((done / all.length) * 100) : 0;

          return (
            <div key={c} className="cat-row">
              <div className="cat-head">
                <span>{c}</span>
                <span>
                  {done}/{all.length} done
                </span>
              </div>
              <div
                className="bar"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="bar-fill"
                  style={{
                    width: `${percent}%`,
                    background: CATEGORY_COLORS[c],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="section-title">Internship applications</h2>
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
    </div>
  );
}