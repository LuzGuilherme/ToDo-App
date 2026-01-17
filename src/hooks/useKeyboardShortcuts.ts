'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, ColumnType, FocusState } from '@/types';

interface UseKeyboardShortcutsProps {
  columns: ColumnType[];
  getTasksByColumn: (column: ColumnType) => Task[];
  onOpenModal: (column?: ColumnType) => void;
  onEditTask: (task: Task) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isModalOpen: boolean;
  onSaveModal?: () => void;
  onCloseModal: () => void;
}

interface UseKeyboardShortcutsReturn {
  focusState: FocusState;
  setFocusState: React.Dispatch<React.SetStateAction<FocusState>>;
  focusedTask: Task | null;
  focusedColumn: ColumnType;
  isKeyboardNavigating: boolean;
}

export function useKeyboardShortcuts({
  columns,
  getTasksByColumn,
  onOpenModal,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  isModalOpen,
  onSaveModal,
  onCloseModal,
}: UseKeyboardShortcutsProps): UseKeyboardShortcutsReturn {
  const [focusState, setFocusState] = useState<FocusState>({
    columnIndex: 0,
    taskIndex: 0,
  });

  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);

  const focusedColumn = columns[focusState.columnIndex];

  const tasksInColumn = useMemo(
    () => getTasksByColumn(focusedColumn),
    [getTasksByColumn, focusedColumn]
  );

  const focusedTask = useMemo(() => {
    if (focusState.taskIndex >= 0 && focusState.taskIndex < tasksInColumn.length) {
      return tasksInColumn[focusState.taskIndex];
    }
    return null;
  }, [focusState.taskIndex, tasksInColumn]);

  const shouldIgnoreKeyboard = useCallback((e: KeyboardEvent): boolean => {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isEditable = target.isContentEditable;
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
    return isEditable || isInput;
  }, []);

  const moveUp = useCallback(() => {
    setFocusState((prev) => {
      if (prev.taskIndex <= 0) {
        return prev;
      }
      return { ...prev, taskIndex: prev.taskIndex - 1 };
    });
  }, []);

  const moveDown = useCallback(() => {
    setFocusState((prev) => {
      const maxIndex = tasksInColumn.length - 1;
      if (prev.taskIndex >= maxIndex) {
        return prev;
      }
      return { ...prev, taskIndex: prev.taskIndex + 1 };
    });
  }, [tasksInColumn.length]);

  const moveLeft = useCallback(() => {
    setFocusState((prev) => {
      if (prev.columnIndex <= 0) return prev;
      const newColumnIndex = prev.columnIndex - 1;
      const newColumnTasks = getTasksByColumn(columns[newColumnIndex]);
      const newTaskIndex = Math.min(prev.taskIndex, Math.max(0, newColumnTasks.length - 1));
      return {
        columnIndex: newColumnIndex,
        taskIndex: newTaskIndex,
      };
    });
  }, [columns, getTasksByColumn]);

  const moveRight = useCallback(() => {
    setFocusState((prev) => {
      if (prev.columnIndex >= columns.length - 1) return prev;
      const newColumnIndex = prev.columnIndex + 1;
      const newColumnTasks = getTasksByColumn(columns[newColumnIndex]);
      const newTaskIndex = Math.min(prev.taskIndex, Math.max(0, newColumnTasks.length - 1));
      return {
        columnIndex: newColumnIndex,
        taskIndex: newTaskIndex,
      };
    });
  }, [columns, getTasksByColumn]);

  const jumpToColumn = useCallback((index: number) => {
    if (index >= 0 && index < columns.length) {
      const columnTasks = getTasksByColumn(columns[index]);
      setFocusState({
        columnIndex: index,
        taskIndex: columnTasks.length > 0 ? 0 : 0,
      });
    }
  }, [columns, getTasksByColumn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Always handle Escape for modals
      if (e.key === 'Escape' && isModalOpen) {
        e.preventDefault();
        onCloseModal();
        return;
      }

      // Handle Ctrl+Enter for modal save
      if (e.key === 'Enter' && e.ctrlKey && isModalOpen) {
        e.preventDefault();
        onSaveModal?.();
        return;
      }

      // Don't handle other shortcuts when modal is open or typing
      if (isModalOpen || shouldIgnoreKeyboard(e)) {
        return;
      }

      setIsKeyboardNavigating(true);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;

        case '1':
          e.preventDefault();
          jumpToColumn(0);
          break;
        case '2':
          e.preventDefault();
          jumpToColumn(1);
          break;
        case '3':
          e.preventDefault();
          jumpToColumn(2);
          break;
        case '4':
          e.preventDefault();
          jumpToColumn(3);
          break;

        case 'n':
          e.preventDefault();
          onOpenModal(focusedColumn);
          break;

        case 'Enter':
          if (focusedTask) {
            e.preventDefault();
            onEditTask(focusedTask);
          }
          break;
        case ' ':
        case 'd':
          if (focusedTask) {
            e.preventDefault();
            onCompleteTask(focusedTask.id);
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (focusedTask) {
            e.preventDefault();
            onDeleteTask(focusedTask.id);
            setFocusState((prev) => ({
              ...prev,
              taskIndex: Math.max(0, prev.taskIndex - 1),
            }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isModalOpen,
    shouldIgnoreKeyboard,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    jumpToColumn,
    focusedColumn,
    focusedTask,
    onOpenModal,
    onEditTask,
    onCompleteTask,
    onDeleteTask,
    onCloseModal,
    onSaveModal,
  ]);

  // Adjust focus when tasks change (e.g., after deletion)
  useEffect(() => {
    setFocusState((prev) => {
      const currentTasks = getTasksByColumn(columns[prev.columnIndex]);
      if (currentTasks.length === 0) {
        return { ...prev, taskIndex: 0 };
      }
      if (prev.taskIndex >= currentTasks.length) {
        return { ...prev, taskIndex: currentTasks.length - 1 };
      }
      return prev;
    });
  }, [columns, getTasksByColumn]);

  // Clear keyboard navigating state on mouse click
  useEffect(() => {
    const handleMouseDown = () => {
      setIsKeyboardNavigating(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, []);

  return {
    focusState,
    setFocusState,
    focusedTask,
    focusedColumn,
    isKeyboardNavigating,
  };
}
