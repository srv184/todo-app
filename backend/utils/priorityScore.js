// Creative Feature 1: "Smart Priority Score"
// Combines explicit priority + time-to-deadline urgency into a single 0-100 score,
// so the list can auto-sort by what actually needs attention right now,
// not just a static priority label.

const PRIORITY_WEIGHT = { high: 50, medium: 30, low: 15 };

function computePriorityScore({ priority, deadline, completed }) {
  if (completed) return 0;

  const base = PRIORITY_WEIGHT[priority] ?? 20;
  const hoursLeft = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60);

  let urgency;
  if (hoursLeft <= 0) urgency = 50; // overdue -> max urgency
  else if (hoursLeft <= 6) urgency = 45;
  else if (hoursLeft <= 24) urgency = 35;
  else if (hoursLeft <= 72) urgency = 20;
  else if (hoursLeft <= 168) urgency = 10;
  else urgency = 3;

  return Math.min(100, base + urgency);
}

module.exports = { computePriorityScore };
