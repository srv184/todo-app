export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dateTime: string; // ISO string
  deadline: string; // ISO string
  priority: Priority;
  category: string;
  tags?: string[];
  completed: boolean;
  priorityScore: number;
  focusMinutes: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type SortMode = 'smart' | 'deadline' | 'priority';
