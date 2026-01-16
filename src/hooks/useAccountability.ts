'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task } from '@/types';

interface AccountabilityState {
  lastCommitmentDate: string | null;
  focusModeUntil: string | null;
  vacationModeUntil: string | null;
  committedTaskIds: string[];
  dismissedStaleTaskIds: string[];
}

const STORAGE_KEY = 'accountability-state';
const STALE_DAYS_THRESHOLD = 7;

export function useAccountability(tasks: Task[]) {
  const [state, setState] = useLocalStorage<AccountabilityState>(STORAGE_KEY, {
    lastCommitmentDate: null,
    focusModeUntil: null,
    vacationModeUntil: null,
    committedTaskIds: [],
    dismissedStaleTaskIds: [],
  });

  // Use refs to avoid dependency issues
  const tasksRef = useRef(tasks);
  const stateRef = useRef(state);

  // Keep refs updated
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Check if morning commitment is needed
  const needsMorningCommitment = useCallback(() => {
    const today = new Date().toDateString();
    return stateRef.current.lastCommitmentDate !== today;
  }, []);

  // Check if in focus mode
  const isInFocusMode = useCallback(() => {
    if (!stateRef.current.focusModeUntil) return false;
    return new Date(stateRef.current.focusModeUntil) > new Date();
  }, []);

  // Check if in vacation mode
  const isInVacationMode = useCallback(() => {
    if (!stateRef.current.vacationModeUntil) return false;
    return new Date(stateRef.current.vacationModeUntil) > new Date();
  }, []);

  // Complete morning commitment
  const completeMorningCommitment = useCallback(
    (selectedTaskIds: string[]) => {
      const today = new Date().toDateString();
      setState((prev) => ({
        ...prev,
        lastCommitmentDate: today,
        committedTaskIds: selectedTaskIds,
      }));
    },
    [setState]
  );

  // Enter focus mode
  const enterFocusMode = useCallback(
    (durationMinutes: number) => {
      const until = new Date(Date.now() + durationMinutes * 60 * 1000);
      setState((prev) => ({
        ...prev,
        focusModeUntil: until.toISOString(),
      }));
    },
    [setState]
  );

  // Exit focus mode
  const exitFocusMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      focusModeUntil: null,
    }));
  }, [setState]);

  // Enter vacation mode
  const enterVacationMode = useCallback(
    (days: number) => {
      const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      setState((prev) => ({
        ...prev,
        vacationModeUntil: until.toISOString(),
      }));
    },
    [setState]
  );

  // Exit vacation mode
  const exitVacationMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      vacationModeUntil: null,
    }));
  }, [setState]);

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasksRef.current.filter((task) => {
      if (task.column === 'done') return false;
      const deadline = new Date(task.deadline);
      return deadline < now;
    });
  }, []);

  // Get stale tasks (created > X days ago and not done)
  const getStaleTasks = useCallback(() => {
    const now = new Date();
    const threshold = now.getTime() - STALE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;

    return tasksRef.current.filter((task) => {
      if (task.column === 'done') return false;
      if (stateRef.current.dismissedStaleTaskIds.includes(task.id)) return false;
      const createdAt = new Date(task.createdAt).getTime();
      return createdAt < threshold;
    });
  }, []);

  // Dismiss a stale task from the confrontation list
  const dismissStaleTask = useCallback(
    (taskId: string) => {
      setState((prev) => ({
        ...prev,
        dismissedStaleTaskIds: [...prev.dismissedStaleTaskIds, taskId],
      }));
    },
    [setState]
  );

  return {
    state,
    needsMorningCommitment,
    isInFocusMode,
    isInVacationMode,
    completeMorningCommitment,
    enterFocusMode,
    exitFocusMode,
    enterVacationMode,
    exitVacationMode,
    getOverdueTasks,
    getStaleTasks,
    dismissStaleTask,
    committedTaskIds: state.committedTaskIds,
  };
}
