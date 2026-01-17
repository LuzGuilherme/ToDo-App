'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, ColumnType, TaskTag, RecurrenceConfig } from '@/types';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { useAccountability } from '@/hooks/useAccountability';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuth } from '@/contexts/AuthContext';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import { Celebration } from './Celebration';
import { MorningCommitmentModal } from './MorningCommitmentModal';
import { StaleTaskModal } from './StaleTaskModal';
import { FocusModeToggle } from './FocusModeToggle';
import { TelegramConnect } from './TelegramConnect';
import { StatsModal } from './StatsModal';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

export function SupabaseKanbanBoard() {
  const { user, signOut } = useAuth();
  const { tasks, loading, addTask, updateTask, deleteTask, moveTask, getTasksByColumn } = useSupabaseTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMorningCommitment, setShowMorningCommitment] = useState(false);
  const [currentStaleTask, setCurrentStaleTask] = useState<Task | null>(null);
  const [showTelegramSettings, setShowTelegramSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const columns: ColumnType[] = ['today', 'this_week', 'later', 'done'];
  const modalFormRef = useRef<HTMLFormElement>(null);

  // Notifications hook
  const {
    permission: notificationPermission,
    requestPermission,
  } = useNotifications();

  // Accountability hook
  const {
    state: accountabilityState,
    needsMorningCommitment,
    isInFocusMode,
    isInVacationMode,
    completeMorningCommitment,
    enterFocusMode,
    exitFocusMode,
    enterVacationMode,
    exitVacationMode,
    getStaleTasks,
    dismissStaleTask,
  } = useAccountability(tasks);

  // Check if any modal is open (for keyboard shortcuts)
  const anyModalOpen = isModalOpen || showMorningCommitment || currentStaleTask !== null || showTelegramSettings || showStats;

  // Keyboard shortcuts hook
  const {
    focusState,
    setFocusState,
    focusedColumn,
    isKeyboardNavigating,
  } = useKeyboardShortcuts({
    columns,
    getTasksByColumn,
    onOpenModal: () => {
      setEditingTask(null);
      setIsModalOpen(true);
    },
    onEditTask: (task) => {
      setEditingTask(task);
      setIsModalOpen(true);
    },
    onCompleteTask: async (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const newColumn = task.column === 'done' ? 'today' : 'done';
      const wasNotDone = task.column !== 'done';
      const isNowDone = newColumn === 'done';
      await moveTask(id, newColumn);
      if (wasNotDone && isNowDone) {
        setShowCelebration(true);
      }
    },
    onDeleteTask: deleteTask,
    isModalOpen: anyModalOpen,
    onSaveModal: () => {
      modalFormRef.current?.requestSubmit();
    },
    onCloseModal: () => {
      setIsModalOpen(false);
      setEditingTask(null);
    },
  });

  // Check for morning commitment on mount (run once)
  const [hasCheckedMorning, setHasCheckedMorning] = useState(false);

  useEffect(() => {
    if (hasCheckedMorning || loading) return;

    const timer = setTimeout(() => {
      if (needsMorningCommitment() && tasks.length > 0 && !isInVacationMode()) {
        setShowMorningCommitment(true);
      }
      setHasCheckedMorning(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [hasCheckedMorning, loading, needsMorningCommitment, tasks.length, isInVacationMode]);

  // Check for stale tasks periodically
  const [hasCheckedStale, setHasCheckedStale] = useState(false);

  useEffect(() => {
    if (hasCheckedStale || loading) return;

    const timer = setTimeout(() => {
      if (!isInFocusMode() && !isInVacationMode()) {
        const staleTasks = getStaleTasks();
        if (staleTasks.length > 0) {
          setCurrentStaleTask(staleTasks[0]);
        }
      }
      setHasCheckedStale(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [hasCheckedStale, loading, getStaleTasks, isInFocusMode, isInVacationMode]);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, column: ColumnType) => {
    e.preventDefault();
    if (draggedTask && draggedTask.column !== column) {
      const wasNotDone = draggedTask.column !== 'done';
      const isNowDone = column === 'done';

      await moveTask(draggedTask.id, column);

      if (wasNotDone && isNowDone) {
        setShowCelebration(true);
      }
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragEnter = (column: ColumnType) => {
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newColumn = task.column === 'done' ? 'today' : 'done';
    const wasNotDone = task.column !== 'done';
    const isNowDone = newColumn === 'done';

    await moveTask(id, newColumn);

    if (wasNotDone && isNowDone) {
      setShowCelebration(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (
    title: string,
    deadline: string,
    notes: string,
    tags: TaskTag[] = [],
    recurrence?: RecurrenceConfig
  ) => {
    await addTask(title, deadline, notes, tags, recurrence);
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
  };

  // Morning commitment handler
  const handleMorningCommit = async (selectedTaskIds: string[]) => {
    completeMorningCommitment(selectedTaskIds);
    // Move selected tasks to "today" column
    for (const id of selectedTaskIds) {
      const task = tasks.find((t) => t.id === id);
      if (task && task.column !== 'done') {
        await moveTask(id, 'today');
      }
    }
    setShowMorningCommitment(false);
  };

  // Stale task handlers
  const handleRescheduleStale = async (taskId: string, newDeadline: string) => {
    await updateTask(taskId, {
      deadline: newDeadline,
      escalationLevel: 0,
      lastRemindedAt: null,
    });
    dismissStaleTask(taskId);
    setCurrentStaleTask(null);
  };

  const handleDelegateStale = async (taskId: string, delegateTo: string) => {
    await updateTask(taskId, { delegatedTo: delegateTo });
    dismissStaleTask(taskId);
    setCurrentStaleTask(null);
  };

  const handleBreakDownStale = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      dismissStaleTask(taskId);
      setCurrentStaleTask(null);
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  const handleDeleteStale = async (taskId: string) => {
    await deleteTask(taskId);
    setCurrentStaleTask(null);
  };

  const handleDismissStale = (taskId: string) => {
    dismissStaleTask(taskId);
    setCurrentStaleTask(null);
  };

  const totalTasks = tasks.filter((t) => t.column !== 'done').length;
  const overdueTasks = tasks.filter((t) => {
    if (t.column === 'done') return false;
    return new Date(t.deadline) < new Date();
  }).length;
  const completedToday = tasks.filter(
    (t) => t.column === 'done' && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#A1A1AA]">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading your tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F5]">Accountability</h1>
              <p className="text-sm text-[#A1A1AA] mt-0.5">
                {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA] mr-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                  {totalTasks} pending
                </span>
                {overdueTasks > 0 && (
                  <>
                    <span className="text-[#333333]">|</span>
                    <span className="flex items-center gap-1.5 text-[#EF4444]">
                      <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                      {overdueTasks} overdue
                    </span>
                  </>
                )}
                <span className="text-[#333333]">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  {completedToday} done today
                </span>
              </div>

              <FocusModeToggle
                isActive={isInFocusMode() || isInVacationMode()}
                focusUntil={accountabilityState.focusModeUntil}
                vacationUntil={accountabilityState.vacationModeUntil}
                onEnterFocus={enterFocusMode}
                onExitFocus={exitFocusMode}
                onEnterVacation={enterVacationMode}
                onExitVacation={exitVacationMode}
              />

              <button
                onClick={() => setShowStats(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#A1A1AA] rounded-lg hover:bg-[#252525] hover:text-[#F5F5F5] transition-all border border-[#2A2A2A]"
                title="View stats"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Stats
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-all font-medium shadow-lg shadow-[#6366F1]/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>

              <button
                onClick={() => setShowTelegramSettings(true)}
                className="p-2 text-[#71717A] hover:text-[#3B82F6] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                title="Telegram notifications"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.43 3.8-1.57 4.59-1.85 5.1-1.85.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
                </svg>
              </button>

              <button
                onClick={signOut}
                className="p-2 text-[#71717A] hover:text-[#F5F5F5] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((columnId, columnIndex) => (
            <div
              key={columnId}
              onDragEnter={() => handleDragEnter(columnId)}
              onDragLeave={handleDragLeave}
            >
              <Column
                columnId={columnId}
                tasks={getTasksByColumn(columnId)}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
                onCompleteTask={handleCompleteTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={dragOverColumn === columnId}
                onAddTask={() => setIsModalOpen(true)}
                draggedTaskId={draggedTask?.id ?? null}
                isFocusedColumn={isKeyboardNavigating && focusedColumn === columnId}
                focusedTaskIndex={isKeyboardNavigating && focusedColumn === columnId ? focusState.taskIndex : -1}
                onTaskFocus={(taskIndex) => {
                  setFocusState({
                    columnIndex,
                    taskIndex,
                  });
                }}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
        formRef={modalFormRef}
      />

      {/* Morning Commitment Modal */}
      <MorningCommitmentModal
        isOpen={showMorningCommitment}
        tasks={tasks}
        onCommit={handleMorningCommit}
        onRequestNotifications={requestPermission}
        notificationPermission={notificationPermission}
      />

      {/* Stale Task Confrontation Modal */}
      <StaleTaskModal
        task={currentStaleTask}
        onReschedule={handleRescheduleStale}
        onDelegate={handleDelegateStale}
        onBreakDown={handleBreakDownStale}
        onDelete={handleDeleteStale}
        onDismiss={handleDismissStale}
      />

      {/* Celebration */}
      <Celebration show={showCelebration} onComplete={() => setShowCelebration(false)} />

      {/* Stats Modal */}
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} tasks={tasks} />

      {/* Telegram Settings Modal */}
      {showTelegramSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTelegramSettings(false)}
          />
          <div className="relative z-10">
            <TelegramConnect onClose={() => setShowTelegramSettings(false)} />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />
    </div>
  );
}
