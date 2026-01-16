'use client';

import { useState, useEffect } from 'react';
import { Task, ColumnType, TaskTag } from '@/types';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useAccountability } from '@/hooks/useAccountability';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import { Celebration } from './Celebration';
import { MorningCommitmentModal } from './MorningCommitmentModal';
import { StaleTaskModal } from './StaleTaskModal';
import { FocusModeToggle } from './FocusModeToggle';

export function KanbanBoard() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, getTasksByColumn } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMorningCommitment, setShowMorningCommitment] = useState(false);
  const [currentStaleTask, setCurrentStaleTask] = useState<Task | null>(null);

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

  // Check for morning commitment on mount (run once)
  const [hasCheckedMorning, setHasCheckedMorning] = useState(false);

  useEffect(() => {
    if (hasCheckedMorning) return;

    const timer = setTimeout(() => {
      if (needsMorningCommitment() && tasks.length > 0 && !isInVacationMode()) {
        setShowMorningCommitment(true);
      }
      setHasCheckedMorning(true);
    }, 500);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedMorning]);

  // Check for stale tasks periodically
  const [hasCheckedStale, setHasCheckedStale] = useState(false);

  useEffect(() => {
    if (hasCheckedStale) return;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedStale]);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, column: ColumnType) => {
    e.preventDefault();
    if (draggedTask && draggedTask.column !== column) {
      const wasNotDone = draggedTask.column !== 'done';
      const isNowDone = column === 'done';

      moveTask(draggedTask.id, column);

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

  const handleCompleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newColumn = task.column === 'done' ? 'today' : 'done';
    const wasNotDone = task.column !== 'done';
    const isNowDone = newColumn === 'done';

    moveTask(id, newColumn);

    if (wasNotDone && isNowDone) {
      setShowCelebration(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (title: string, deadline: string, notes: string, tags: TaskTag[] = []) => {
    addTask(title, deadline, notes, tags);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
  };

  // Morning commitment handler
  const handleMorningCommit = (selectedTaskIds: string[]) => {
    completeMorningCommitment(selectedTaskIds);
    // Move selected tasks to "today" column
    selectedTaskIds.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task && task.column !== 'done') {
        moveTask(id, 'today');
      }
    });
    setShowMorningCommitment(false);
  };

  // Stale task handlers
  const handleRescheduleStale = (taskId: string, newDeadline: string) => {
    updateTask(taskId, {
      deadline: newDeadline,
      escalationLevel: 0,
      lastRemindedAt: null,
    });
    dismissStaleTask(taskId);
    setCurrentStaleTask(null);
  };

  const handleDelegateStale = (taskId: string, delegateTo: string) => {
    updateTask(taskId, { delegatedTo: delegateTo });
    dismissStaleTask(taskId);
    setCurrentStaleTask(null);
  };

  const handleBreakDownStale = (taskId: string) => {
    // Open edit modal for the task (user can break it down manually)
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      dismissStaleTask(taskId);
      setCurrentStaleTask(null);
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  const handleDeleteStale = (taskId: string) => {
    deleteTask(taskId);
    setCurrentStaleTask(null);
  };

  const handleDismissStale = (taskId: string) => {
    dismissStaleTask(taskId);
    setCurrentStaleTask(null);
  };

  const columns: ColumnType[] = ['today', 'this_week', 'later', 'done'];

  const totalTasks = tasks.filter((t) => t.column !== 'done').length;
  const overdueTasks = tasks.filter((t) => {
    if (t.column === 'done') return false;
    return new Date(t.deadline) < new Date();
  }).length;
  const completedToday = tasks.filter(
    (t) => t.column === 'done' && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F5]">Accountability</h1>
              <p className="text-sm text-[#A1A1AA] mt-0.5">
                Stay focused and get things done
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
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-all font-medium shadow-lg shadow-[#6366F1]/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((columnId) => (
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
    </div>
  );
}
