// Creative Feature 1: "Smart Priority Score"
// Combines explicit priority + time-to-deadline urgency into a single 0-100 score,
// so the list can auto-sort by what actually needs attention right now,
// not just a static priority label.
// The two inputs make Smart sorting responsive to both the user's intent and
// the amount of time remaining before a task is due.

const PRIORITY_WEIGHT = { high: 50, medium: 30, low: 15 };

function computePriorityScore({ priority, deadline, completed }) {
  // Finished work is excluded from active prioritization regardless of urgency.
  if (completed) return 0;

  // Start with the user's explicit priority, using a conservative fallback for
  // any value that does not match the known priority weights.
  const base = PRIORITY_WEIGHT[priority] ?? 20;
  const hoursLeft = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60);

  let urgency;
  // Urgency increases within progressively shorter deadline windows; overdue
  // tasks receive the maximum urgency contribution to elevate them immediately.
  // The windows distinguish overdue, 6-hour, 24-hour, 72-hour, one-week, and
  // later deadlines so urgency rises as a deadline gets closer.
  if (hoursLeft <= 0) urgency = 50; // overdue -> max urgency
  else if (hoursLeft <= 6) urgency = 45;
  else if (hoursLeft <= 24) urgency = 35;
  else if (hoursLeft <= 72) urgency = 20;
  else if (hoursLeft <= 168) urgency = 10;
  else urgency = 3;

  // Cap the combined value to preserve a predictable 0-100 score range.
  return Math.min(100, base + urgency);
}

module.exports = { computePriorityScore };
