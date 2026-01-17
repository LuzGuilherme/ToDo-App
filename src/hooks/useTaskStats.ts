'use client';

import { useMemo } from 'react';
import { Task, TaskStats, TimeRange, ColumnType } from '@/types';

function getTimeRangeDays(range: TimeRange): number | null {
  switch (range) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case 'all': return null;
  }
}

function isInTimeRange(date: string, range: TimeRange): boolean {
  const days = getTimeRangeDays(range);
  if (days === null) return true;

  const taskDate = new Date(date);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);

  return taskDate >= cutoff;
}

function getDateKey(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

function calculateStreak(tasks: Task[]): number {
  const completedDates = new Set(
    tasks
      .filter(t => t.completedAt)
      .map(t => getDateKey(t.completedAt!))
  );

  if (completedDates.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from today and work backwards
  const current = new Date(today);

  // Check if today has completions, if not start from yesterday
  const todayKey = getDateKey(current.toISOString());
  if (!completedDates.has(todayKey)) {
    current.setDate(current.getDate() - 1);
  }

  while (true) {
    const dateKey = getDateKey(current.toISOString());
    if (completedDates.has(dateKey)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function useTaskStats(tasks: Task[], timeRange: TimeRange): TaskStats {
  return useMemo(() => {
    // Filter completed tasks by time range
    const completedInRange = tasks.filter(
      t => t.completedAt && isInTimeRange(t.completedAt, timeRange)
    );

    // Active tasks (not completed)
    const activeTasks = tasks.filter(t => t.column !== 'done');

    // Total completed
    const totalCompleted = completedInRange.length;
    const totalActive = activeTasks.length;

    // Completion rate
    const completionRate = tasks.length > 0
      ? Math.round((completedInRange.length / tasks.length) * 100)
      : 0;

    // On-time rate (completed before or on deadline)
    const onTimeCompletions = completedInRange.filter(t => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      const deadlineDate = new Date(t.deadline);
      // Compare dates only, ignoring time
      completedDate.setHours(23, 59, 59, 999);
      deadlineDate.setHours(23, 59, 59, 999);
      return completedDate <= deadlineDate;
    }).length;

    const onTimeRate = totalCompleted > 0
      ? Math.round((onTimeCompletions / totalCompleted) * 100)
      : 0;

    // Average completion time in days
    const completionTimes = completedInRange
      .filter(t => t.completedAt && t.createdAt)
      .map(t => {
        const created = new Date(t.createdAt).getTime();
        const completed = new Date(t.completedAt!).getTime();
        return (completed - created) / (1000 * 60 * 60 * 24);
      });

    const averageCompletionDays = completionTimes.length > 0
      ? Math.round((completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length) * 10) / 10
      : 0;

    // Current streak
    const currentStreak = calculateStreak(tasks);

    // Completions by day
    const completionsByDayMap: Record<string, number> = {};

    // Initialize all days in range
    const days = getTimeRangeDays(timeRange) || 30;
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date.toISOString());
      completionsByDayMap[dateKey] = 0;
    }

    // Count completions
    completedInRange.forEach(t => {
      if (t.completedAt) {
        const dateKey = getDateKey(t.completedAt);
        if (dateKey in completionsByDayMap) {
          completionsByDayMap[dateKey]++;
        }
      }
    });

    const completionsByDay = Object.entries(completionsByDayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Column distribution
    const columnDistribution: Record<ColumnType, number> = {
      today: 0,
      this_week: 0,
      later: 0,
      done: 0,
    };

    tasks.forEach(t => {
      columnDistribution[t.column]++;
    });

    return {
      totalCompleted,
      totalActive,
      completionRate,
      onTimeRate,
      averageCompletionDays,
      currentStreak,
      completionsByDay,
      columnDistribution,
    };
  }, [tasks, timeRange]);
}
