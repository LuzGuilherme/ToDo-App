'use client';

import { useState, useMemo } from 'react';
import { Task, formatDeadline, getDeadlineUrgency, TAG_PRESETS } from '@/types';

interface MorningCommitmentModalProps {
  isOpen: boolean;
  tasks: Task[];
  onCommit: (selectedTaskIds: string[]) => void;
  onRequestNotifications: () => Promise<boolean>;
  notificationPermission: 'default' | 'granted' | 'denied';
}

export function MorningCommitmentModal({
  isOpen,
  tasks,
  onCommit,
  onRequestNotifications,
  notificationPermission,
}: MorningCommitmentModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get non-completed tasks sorted by deadline urgency
  const availableTasks = useMemo(() => {
    return tasks
      .filter((t) => t.column !== 'done')
      .sort((a, b) => {
        const aDate = new Date(a.deadline).getTime();
        const bDate = new Date(b.deadline).getTime();
        return aDate - bDate;
      });
  }, [tasks]);

  // AI-suggested tasks (overdue + due today/soon)
  const suggestedTasks = useMemo(() => {
    return availableTasks.filter((t) => {
      const urgency = getDeadlineUrgency(t.deadline);
      return urgency === 'overdue' || urgency === 'today' || urgency === 'soon';
    });
  }, [availableTasks]);

  const toggleTask = (taskId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleCommit = () => {
    if (selectedIds.size === 0) return;
    onCommit(Array.from(selectedIds));
  };

  const handleEnableNotifications = async () => {
    await onRequestNotifications();
  };

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#252525] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F5F5F5]">Good Morning!</h2>
              <p className="text-sm text-[#A1A1AA]">{today}</p>
            </div>
          </div>
          <p className="text-[#A1A1AA] mt-3">
            What will you commit to accomplishing today? Select at least one task to continue.
          </p>
        </div>

        {/* Notification Banner */}
        {notificationPermission !== 'granted' && (
          <div className="px-6 py-3 bg-[#6366F1]/10 border-b border-[#252525]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm text-[#A1A1AA]">Enable notifications for reminders</span>
              </div>
              <button
                onClick={handleEnableNotifications}
                className="text-sm font-medium text-[#6366F1] hover:text-[#818CF8] transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI Suggestions */}
          {suggestedTasks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded bg-[#F97316]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-[#F97316]">Suggested for Today</h3>
              </div>
              <div className="space-y-2">
                {suggestedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isSelected={selectedIds.has(task.id)}
                    onToggle={() => toggleTask(task.id)}
                    isSuggested
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Tasks */}
          <div>
            <h3 className="text-sm font-semibold text-[#71717A] mb-3">All Tasks</h3>
            {availableTasks.length === 0 ? (
              <div className="text-center py-8 text-[#52525B]">
                <p>No tasks yet. Add some tasks to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableTasks
                  .filter((t) => !suggestedTasks.find((s) => s.id === t.id))
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isSelected={selectedIds.has(task.id)}
                      onToggle={() => toggleTask(task.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#252525] bg-[#141414]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#71717A]">
              {selectedIds.size === 0
                ? 'Select at least one task'
                : `${selectedIds.size} task${selectedIds.size > 1 ? 's' : ''} selected`}
            </p>
            <button
              onClick={handleCommit}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-[#6366F1]/20"
            >
              Commit to Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskItem({
  task,
  isSelected,
  onToggle,
  isSuggested = false,
}: {
  task: Task;
  isSelected: boolean;
  onToggle: () => void;
  isSuggested?: boolean;
}) {
  const urgency = getDeadlineUrgency(task.deadline);
  const urgencyColors = {
    overdue: 'text-[#EF4444]',
    today: 'text-[#F97316]',
    soon: 'text-[#EAB308]',
    later: 'text-[#71717A]',
  };

  return (
    <button
      onClick={onToggle}
      className={`
        w-full p-4 rounded-xl border text-left transition-all
        ${isSelected
          ? 'bg-[#6366F1]/10 border-[#6366F1] ring-1 ring-[#6366F1]/30'
          : 'bg-[#141414] border-[#252525] hover:border-[#333333]'
        }
        ${isSuggested && !isSelected ? 'border-[#F97316]/30' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
            ${isSelected ? 'bg-[#6366F1] border-[#6366F1] text-white' : 'border-[#404040]'}
          `}
        >
          {isSelected && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-[#F5F5F5]">{task.title}</h4>
            <span className={`text-xs ${urgencyColors[urgency]} whitespace-nowrap`}>
              {formatDeadline(task.deadline)}
            </span>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {task.tags.slice(0, 3).map((tag) => {
                const preset = TAG_PRESETS[tag.type];
                return (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
                    style={{ backgroundColor: preset.bgColor, color: preset.color }}
                  >
                    {tag.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
