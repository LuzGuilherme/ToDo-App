'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Task, ColumnType, TaskTag, RecurrenceConfig } from '@/types';
import { calculateNextDeadline } from '@/utils/recurrence';

// Database row type
interface DbTask {
  id: string;
  user_id: string;
  title: string;
  notes: string;
  deadline: string;
  column_type: 'today' | 'this_week' | 'later' | 'done';
  created_at: string;
  completed_at: string | null;
  is_weekend_task: boolean;
  delegated_to: string | null;
  reminder_frequency: 'hourly' | 'few_hours' | 'twice_daily';
  last_reminded_at: string | null;
  escalation_level: number;
  tags: unknown;
  recurrence_pattern: 'daily' | 'weekly' | 'monthly' | null;
  recurrence_end_date: string | null;
  recurrence_day_of_week: number | null;
  recurrence_day_of_month: number | null;
}

// Convert database row to app Task type
function dbToTask(dbTask: DbTask): Task {
  // Handle tags - could be an array, JSON string, or null
  let tags: TaskTag[] = [];
  if (dbTask.tags) {
    if (typeof dbTask.tags === 'string') {
      try {
        tags = JSON.parse(dbTask.tags);
      } catch {
        tags = [];
      }
    } else if (Array.isArray(dbTask.tags)) {
      tags = dbTask.tags as TaskTag[];
    }
  }

  return {
    id: dbTask.id,
    title: dbTask.title,
    notes: dbTask.notes,
    deadline: dbTask.deadline,
    column: dbTask.column_type,
    createdAt: dbTask.created_at,
    completedAt: dbTask.completed_at,
    isWeekendTask: dbTask.is_weekend_task,
    delegatedTo: dbTask.delegated_to,
    reminderFrequency: dbTask.reminder_frequency,
    lastRemindedAt: dbTask.last_reminded_at,
    escalationLevel: dbTask.escalation_level,
    tags,
    recurrencePattern: dbTask.recurrence_pattern,
    recurrenceEndDate: dbTask.recurrence_end_date,
    recurrenceDayOfWeek: dbTask.recurrence_day_of_week,
    recurrenceDayOfMonth: dbTask.recurrence_day_of_month,
  };
}

export function useSupabaseTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (error) throw error;

      setTasks(((data || []) as DbTask[]).map(dbToTask));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchTasks]);

  const addTask = useCallback(
    async (
      title: string,
      deadline: string,
      notes: string = '',
      tags: TaskTag[] = [],
      recurrence?: RecurrenceConfig
    ) => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title,
            notes,
            deadline,
            tags: JSON.stringify(tags),
            recurrence_pattern: recurrence?.pattern ?? null,
            recurrence_end_date: recurrence?.endDate ?? null,
            recurrence_day_of_week: recurrence?.dayOfWeek ?? null,
            recurrence_day_of_month: recurrence?.dayOfMonth ?? null,
          })
          .select()
          .single();

        if (error) throw error;

        const newTask = dbToTask(data as DbTask);
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add task');
        return null;
      }
    },
    [user, supabase]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      if (!user) return;

      try {
        // Convert app Task fields to database column names
        const dbUpdates: Record<string, unknown> = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
        if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
        if (updates.column !== undefined) dbUpdates.column_type = updates.column;
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
        if (updates.isWeekendTask !== undefined) dbUpdates.is_weekend_task = updates.isWeekendTask;
        if (updates.delegatedTo !== undefined) dbUpdates.delegated_to = updates.delegatedTo;
        if (updates.reminderFrequency !== undefined) dbUpdates.reminder_frequency = updates.reminderFrequency;
        if (updates.lastRemindedAt !== undefined) dbUpdates.last_reminded_at = updates.lastRemindedAt;
        if (updates.escalationLevel !== undefined) dbUpdates.escalation_level = updates.escalationLevel;
        if (updates.tags !== undefined) dbUpdates.tags = JSON.stringify(updates.tags);
        if (updates.recurrencePattern !== undefined) dbUpdates.recurrence_pattern = updates.recurrencePattern;
        if (updates.recurrenceEndDate !== undefined) dbUpdates.recurrence_end_date = updates.recurrenceEndDate;
        if (updates.recurrenceDayOfWeek !== undefined) dbUpdates.recurrence_day_of_week = updates.recurrenceDayOfWeek;
        if (updates.recurrenceDayOfMonth !== undefined) dbUpdates.recurrence_day_of_month = updates.recurrenceDayOfMonth;

        const { error } = await supabase
          .from('tasks')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setTasks((prev) =>
          prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    },
    [user, supabase]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setTasks((prev) => prev.filter((task) => task.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    },
    [user, supabase]
  );

  // Create next instance of a recurring task
  const createNextRecurringInstance = useCallback(
    async (completedTask: Task) => {
      if (!user || !completedTask.recurrencePattern) return;

      const nextDeadline = calculateNextDeadline({
        pattern: completedTask.recurrencePattern,
        currentDeadline: completedTask.deadline,
        endDate: completedTask.recurrenceEndDate,
        dayOfWeek: completedTask.recurrenceDayOfWeek,
        dayOfMonth: completedTask.recurrenceDayOfMonth,
      });

      // Don't create if past end date
      if (!nextDeadline) return;

      try {
        const { error } = await supabase.from('tasks').insert({
          user_id: user.id,
          title: completedTask.title,
          notes: completedTask.notes,
          deadline: nextDeadline,
          column_type: 'later',
          tags: JSON.stringify(completedTask.tags),
          recurrence_pattern: completedTask.recurrencePattern,
          recurrence_end_date: completedTask.recurrenceEndDate,
          recurrence_day_of_week: completedTask.recurrenceDayOfWeek,
          recurrence_day_of_month: completedTask.recurrenceDayOfMonth,
        });

        if (error) {
          console.error('Failed to create recurring task instance:', error);
        }
        // Real-time subscription will auto-refresh the task list
      } catch (err) {
        console.error('Failed to create recurring task instance:', err);
      }
    },
    [user, supabase]
  );

  const moveTask = useCallback(
    async (id: string, column: ColumnType) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updates: Partial<Task> = { column };

      if (column === 'done' && !task.completedAt) {
        updates.completedAt = new Date().toISOString();

        // Create next instance for recurring tasks
        if (task.recurrencePattern) {
          await createNextRecurringInstance(task);
        }
      } else if (column !== 'done' && task.completedAt) {
        updates.completedAt = null;
      }

      await updateTask(id, updates);
    },
    [tasks, updateTask, createNextRecurringInstance]
  );

  const getTasksByColumn = useCallback(
    (column: ColumnType): Task[] => {
      return tasks
        .filter((task) => task.column === column)
        .sort((a, b) => {
          const aDeadline = new Date(a.deadline).getTime();
          const bDeadline = new Date(b.deadline).getTime();
          return aDeadline - bDeadline;
        });
    },
    [tasks]
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByColumn,
    refetch: fetchTasks,
  };
}
