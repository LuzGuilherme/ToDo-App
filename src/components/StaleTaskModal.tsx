'use client';

import { useState } from 'react';
import { Task, TAG_PRESETS } from '@/types';

interface StaleTaskModalProps {
  task: Task | null;
  onReschedule: (taskId: string, newDeadline: string) => void;
  onDelegate: (taskId: string, delegateTo: string) => void;
  onBreakDown: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDismiss: (taskId: string) => void;
}

export function StaleTaskModal({
  task,
  onReschedule,
  onDelegate,
  onBreakDown,
  onDelete,
  onDismiss,
}: StaleTaskModalProps) {
  const [action, setAction] = useState<'reschedule' | 'delegate' | null>(null);
  const [newDeadline, setNewDeadline] = useState('');
  const [delegateTo, setDelegateTo] = useState('');

  if (!task) return null;

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleReschedule = () => {
    if (!newDeadline) return;
    onReschedule(task.id, new Date(newDeadline).toISOString());
    setAction(null);
    setNewDeadline('');
  };

  const handleDelegate = () => {
    if (!delegateTo.trim()) return;
    onDelegate(task.id, delegateTo.trim());
    setAction(null);
    setDelegateTo('');
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#EF4444]/30 w-full max-w-md overflow-hidden">
        {/* Warning Header */}
        <div className="p-6 bg-gradient-to-r from-[#EF4444]/10 to-transparent border-b border-[#252525]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F5F5F5]">Time to Decide</h2>
              <p className="text-sm text-[#EF4444]">
                This task has been sitting for {daysSinceCreated} days
              </p>
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="p-6 border-b border-[#252525]">
          <h3 className="font-semibold text-[#F5F5F5] text-lg">{task.title}</h3>
          {task.notes && (
            <p className="text-sm text-[#71717A] mt-2">{task.notes}</p>
          )}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {task.tags.map((tag) => {
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

        {/* Action Selection */}
        {!action && (
          <div className="p-6">
            <p className="text-[#A1A1AA] text-sm mb-4">
              Be honest with yourself. What will you do about this task?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setAction('reschedule')}
                className="w-full p-4 rounded-xl bg-[#141414] border border-[#252525] hover:border-[#6366F1] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6366F1]/20 flex items-center justify-center group-hover:bg-[#6366F1]/30 transition-colors">
                    <svg className="w-5 h-5 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#F5F5F5]">Reschedule</h4>
                    <p className="text-xs text-[#71717A]">Set a new realistic deadline</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setAction('delegate')}
                className="w-full p-4 rounded-xl bg-[#141414] border border-[#252525] hover:border-[#A855F7] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#A855F7]/20 flex items-center justify-center group-hover:bg-[#A855F7]/30 transition-colors">
                    <svg className="w-5 h-5 text-[#A855F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#F5F5F5]">Delegate / Waiting</h4>
                    <p className="text-xs text-[#71717A]">Mark as waiting on someone else</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onBreakDown(task.id)}
                className="w-full p-4 rounded-xl bg-[#141414] border border-[#252525] hover:border-[#22C55E] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 flex items-center justify-center group-hover:bg-[#22C55E]/30 transition-colors">
                    <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#F5F5F5]">Break It Down</h4>
                    <p className="text-xs text-[#71717A]">Task too big? Create smaller subtasks</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onDelete(task.id)}
                className="w-full p-4 rounded-xl bg-[#141414] border border-[#252525] hover:border-[#EF4444] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EF4444]/20 flex items-center justify-center group-hover:bg-[#EF4444]/30 transition-colors">
                    <svg className="w-5 h-5 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#F5F5F5]">Delete Task</h4>
                    <p className="text-xs text-[#71717A]">Admit you won't do it and remove</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => onDismiss(task.id)}
              className="w-full mt-4 py-2 text-sm text-[#71717A] hover:text-[#A1A1AA] transition-colors"
            >
              Skip for now (will ask again later)
            </button>
          </div>
        )}

        {/* Reschedule Form */}
        {action === 'reschedule' && (
          <div className="p-6">
            <button
              onClick={() => setAction(null)}
              className="flex items-center gap-1 text-sm text-[#71717A] hover:text-[#A1A1AA] mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              New Deadline
            </label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              min={getTomorrowDate()}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all mb-4"
            />

            <button
              onClick={handleReschedule}
              disabled={!newDeadline}
              className="w-full px-4 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Reschedule Task
            </button>
          </div>
        )}

        {/* Delegate Form */}
        {action === 'delegate' && (
          <div className="p-6">
            <button
              onClick={() => setAction(null)}
              className="flex items-center gap-1 text-sm text-[#71717A] hover:text-[#A1A1AA] mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Who are you waiting on?
            </label>
            <input
              type="text"
              value={delegateTo}
              onChange={(e) => setDelegateTo(e.target.value)}
              placeholder="e.g., John, Design Team, Client"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/30 transition-all mb-4"
            />

            <button
              onClick={handleDelegate}
              disabled={!delegateTo.trim()}
              className="w-full px-4 py-3 bg-[#A855F7] text-white rounded-xl hover:bg-[#9333EA] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Mark as Waiting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
