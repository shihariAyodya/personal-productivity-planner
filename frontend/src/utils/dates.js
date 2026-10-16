export function toDateString(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function todayString() {
  return toDateString(new Date());
}

// Returns 7 Date objects, Monday to Sunday.
// weekOffset: 0 = this week, -1 = last week, 1 = next week
export function getWeekDates(weekOffset = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const toMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  return Array.from({ length: 7 }, (_, i) => {
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + toMonday + weekOffset * 7 + i
    );
  });
}