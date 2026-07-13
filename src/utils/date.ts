/**
 * Parses a short "MMM DD" style date string (e.g. "Aug 14") against the
 * current year. Returns null if it can't be parsed as a valid date —
 * callers should fall back to displaying the raw string in that case.
 */
export function parseShortDate(value: string): Date | null {
  const withYear = `${value} ${new Date().getFullYear()}`;
  const parsed = new Date(withYear);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export interface DaysRemainingInfo {
  label: string;
  overdue: boolean;
  dueSoon: boolean;
}

/** Returns a human label like "3 days left", "Due today", or "Overdue by 2d". */
export function getDaysRemaining(dueDate: string): DaysRemainingInfo | null {
  const parsed = parseShortDate(dueDate);
  if (!parsed) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((parsed.getTime() - startOfToday.getTime()) / 86_400_000);

  if (diffDays < 0) {
    return { label: `Overdue by ${Math.abs(diffDays)}d`, overdue: true, dueSoon: false };
  }
  if (diffDays === 0) {
    return { label: "Due today", overdue: false, dueSoon: true };
  }
  if (diffDays <= 3) {
    return { label: `${diffDays}d left`, overdue: false, dueSoon: true };
  }
  return { label: `${diffDays}d left`, overdue: false, dueSoon: false };
}

/** Returns a human relative time like "2 hours ago" or "5 days ago". */
export function getRelativeTime(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  const diffMs = Date.now() - parsed.getTime();
  const diffMinutes = Math.round(diffMs / 60_000);
  const diffHours = Math.round(diffMs / 3_600_000);
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
