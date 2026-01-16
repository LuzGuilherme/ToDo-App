'use client';

import { useLocalStorage } from './useLocalStorage';
import { Task, ColumnType, TaskTag, createTask } from '@/types';

const STORAGE_KEY = 'accountability-tasks';

function migrateTask(task: Task): Task {
  return {
    ...task,
    tags: task.tags ?? [],
  };
}

export function useTaskStore() {
  const [rawTasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const tasks = rawTasks.map(migrateTask);

  const addTask = (title: string, deadline: string, notes: string = '', tags: TaskTag[] = []) => {
    const newTask = createTask(title, deadline, notes, tags);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const moveTask = (id: string, column: ColumnType) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const updates: Partial<Task> = { column };

        if (column === 'done' && !task.completedAt) {
          updates.completedAt = new Date().toISOString();
        } else if (column !== 'done' && task.completedAt) {
          updates.completedAt = null;
        }

        return { ...task, ...updates };
      })
    );
  };

  const getTasksByColumn = (column: ColumnType): Task[] => {
    return tasks
      .filter((task) => task.column === column)
      .sort((a, b) => {
        // Sort by deadline urgency
        const aDeadline = new Date(a.deadline).getTime();
        const bDeadline = new Date(b.deadline).getTime();
        return aDeadline - bDeadline;
      });
  };

  const getOverdueTasks = (): Task[] => {
    const now = new Date();
    return tasks.filter((task) => {
      if (task.column === 'done') return false;
      const deadline = new Date(task.deadline);
      return deadline < now;
    });
  };

  const getStaleTasks = (daysStale: number = 7): Task[] => {
    const now = new Date();
    const staleThreshold = now.getTime() - daysStale * 24 * 60 * 60 * 1000;

    return tasks.filter((task) => {
      if (task.column === 'done') return false;
      const createdAt = new Date(task.createdAt).getTime();
      return createdAt < staleThreshold;
    });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByColumn,
    getOverdueTasks,
    getStaleTasks,
  };
}
