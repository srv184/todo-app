import React, { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../api/client';
import { sortTasks } from '../utils/sortTasks';
import type { Task, SortMode } from '../types';

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  sortMode: SortMode;
  setSortMode: (m: SortMode) => void;
  refreshTasks: () => Promise<void>;
  addTask: (payload: Partial<Task>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  logFocusMinutes: (id: string, minutes: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

// Centralize task data and mutations so all task screens stay consistent with
// the backend instead of maintaining competing local copies of the list.
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('smart');

  const refreshTasks = useCallback(async () => {
    // Fetch the user's current tasks for the selected order; the local sorter
    // preserves that presentation even if the API response order changes.
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/tasks', { params: { sortBy: sortMode } });
      setTasks(sortTasks(data, sortMode));
    } catch (err: any) {
      // Preserve the server's useful message when available so the list can
      // present a retryable failure rather than silently showing stale data.
      setError(err?.response?.data?.message ?? 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [sortMode]);

  const addTask = async (payload: Partial<Task>) => {
    // Refresh after the server creates the task so computed fields and the
    // active sort order come from the authoritative backend response.
    await api.post('/tasks', payload);
    await refreshTasks();
  };

  const toggleComplete = async (id: string) => {
    // Optimistically reflect completion for immediate feedback, then reload to
    // reconcile the final status and recalculated priority score with the API.
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t)));
    await api.patch(`/tasks/${id}/toggle`);
    await refreshTasks();
  };

  const deleteTask = async (id: string) => {
    // Remove the item locally first to keep the list responsive while the
    // delete request commits against the backend.
    setTasks((prev) => prev.filter((t) => t._id !== id));
    await api.delete(`/tasks/${id}`);
  };

  const logFocusMinutes = async (id: string, minutes: number) => {
    // Focus time is recorded by the task API, then refreshed so its persisted
    // total is shared by every screen using this Context.
    await api.patch(`/tasks/${id}/focus`, { minutes });
    await refreshTasks();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        sortMode,
        setSortMode,
        refreshTasks,
        addTask,
        toggleComplete,
        deleteTask,
        logFocusMinutes,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
