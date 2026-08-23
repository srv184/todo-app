import type { Task, SortMode } from '../types';

const PRIORITY_ORDER: Record<Task['priority'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/**
 * Bonus requirement: "Sort with time and deadline and priority mix algorithm."
 *
 * 'smart' mode uses the priorityScore computed on the backend (urgency + priority
 * blended into one number). This mirrors the server logic so the list still sorts
 * sensibly even before a fresh fetch, or if used offline with cached data.
 */
export function sortTasks(tasks: Task[], mode: SortMode = 'smart'): Task[] {
  const copy = [...tasks];

  if (mode === 'smart') {
    copy.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.priorityScore - a.priorityScore;
    });
  } else if (mode === 'deadline') {
    copy.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  } else if (mode === 'priority') {
    copy.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
  }

  return copy;
}
