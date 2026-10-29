import { useEffect } from "react";

// Subtle CSS-only confetti celebration component
// Displays gentle fluttering confetti pieces in the app's palette
export default function Celebration({ message, onDone }) {
  useEffect(() => {
    // Automatically finish celebration after 3 seconds
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  // Generate 32 confetti pieces with random positions, delays, and colors from our palette
  const colors = [
    "var(--rose)",
    "var(--rose-dark)",
    "var(--rose-light)",
    "var(--ash-light)",
    "#e5b882", // warm gold
    "var(--cream)",
  ];

  const pieces = Array.from({ length: 32 }, (_, i) => {
    const left = `${(i / 32) * 100 + (Math.random() * 4 - 2)}%`;
    const drift = `${(Math.random() - 0.5) * 120}px`;
    const delay = `${Math.random() * 0.4}s`;
    const duration = `${2.2 + Math.random() * 0.8}s`;
    const rot = `${(Math.random() - 0.5) * 720}deg`;
    const color = colors[i % colors.length];
    const size = `${6 + (i % 4) * 2}px`;

    return { id: i, left, drift, delay, duration, rot, color, size };
  });

  return (
    <div className="celebration-container" aria-live="polite" role="status">
      <div className="celebration-banner">{message}</div>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: `calc(${p.size} * 1.4)`,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            "--drift": p.drift,
            "--rot": p.rot,
          }}
        />
      ))}
    </div>
  );
}

