import React, { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../api/client';
import { sortTasks } from '../utils/sortTasks';
import type { Task, SortMode } from '../types';

interface TaskContextValue {
  tasks: Task[];
  sortMode: SortMode;
  setSortMode: (m: SortMode) => void;
  refreshTasks: () => Promise<void>;
  addTask: (payload: Partial<Task>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  logFocusMinutes: (id: string, minutes: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('smart');

  const refreshTasks = useCallback(async () => {
    const { data } = await api.get('/tasks', { params: { sortBy: sortMode } });
    setTasks(sortTasks(data, sortMode));
  }, [sortMode]);

  const addTask = async (payload: Partial<Task>) => {
    await api.post('/tasks', payload);
    await refreshTasks();
  };

  const toggleComplete = async (id: string) => {
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t)));
    await api.patch(`/tasks/${id}/toggle`);
    await refreshTasks();
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    await api.delete(`/tasks/${id}`);
  };

  const logFocusMinutes = async (id: string, minutes: number) => {
    await api.patch(`/tasks/${id}/focus`, { minutes });
    await refreshTasks();
  };

  return (
    <TaskContext.Provider
      value={{ tasks, sortMode, setSortMode, refreshTasks, addTask, toggleComplete, deleteTask, logFocusMinutes }}
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
