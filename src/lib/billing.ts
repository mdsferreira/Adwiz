// lib/billing.ts
export const FREE_WEEKLY_AD_LIMIT = 3; // or 1 if you want it stricter

export function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getUTCDay(); // 0-6, 0 = Sunday
  const diff = now.getUTCDate() - day; // go back to Sunday
  const weekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff));
  weekStart.setUTCHours(0, 0, 0, 0);
  return weekStart;
}
