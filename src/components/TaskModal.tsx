'use client';

import { useState, useEffect } from 'react';
import { Task, TaskTag, TagType, TAG_PRESETS, RecurrencePattern, RecurrenceConfig } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, deadline: string, notes: string, tags: TaskTag[], recurrence?: RecurrenceConfig) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  editingTask?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSave, onUpdate, editingTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>(null);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [hasEndDate, setHasEndDate] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDeadline(editingTask.deadline.split('T')[0]);
      setNotes(editingTask.notes);
      setSelectedTags(editingTask.tags?.map((t) => t.type) ?? []);
      setRecurrencePattern(editingTask.recurrencePattern);
      setRecurrenceEndDate(editingTask.recurrenceEndDate?.split('T')[0] ?? '');
      setHasEndDate(!!editingTask.recurrenceEndDate);
    } else {
      setTitle('');
      setDeadline(getTodayDate());
      setNotes('');
      setSelectedTags([]);
      setRecurrencePattern(null);
      setRecurrenceEndDate('');
      setHasEndDate(false);
    }
  }, [editingTask, isOpen]);

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  const handleToggleTag = (type: TagType) => {
    setSelectedTags((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    const deadlineISO = new Date(deadline).toISOString();
    const tags: TaskTag[] = selectedTags.map((type) => ({
      id: crypto.randomUUID(),
      label: TAG_PRESETS[type].label,
      type,
    }));

    const recurrence: RecurrenceConfig | undefined = recurrencePattern
      ? {
          pattern: recurrencePattern,
          endDate: hasEndDate && recurrenceEndDate ? new Date(recurrenceEndDate).toISOString() : null,
          dayOfWeek: recurrencePattern === 'weekly' ? new Date(deadline).getDay() : null,
          dayOfMonth: recurrencePattern === 'monthly' ? new Date(deadline).getDate() : null,
        }
      : undefined;

    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: title.trim(),
        deadline: deadlineISO,
        notes: notes.trim(),
        tags,
        recurrencePattern: recurrence?.pattern ?? null,
        recurrenceEndDate: recurrence?.endDate ?? null,
        recurrenceDayOfWeek: recurrence?.dayOfWeek ?? null,
        recurrenceDayOfMonth: recurrence?.dayOfMonth ?? null,
      });
    } else {
      onSave(title.trim(), deadlineISO, notes.trim(), tags, recurrence);
    }

    onClose();
  };

  if (!isOpen) return null;

  const tagTypes = Object.keys(TAG_PRESETS) as TagType[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1A1A1A] rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] border border-[#252525] w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-[#F5F5F5] mb-5">
          {editingTask ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Task Title <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Deadline <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tagTypes.map((type) => {
                const preset = TAG_PRESETS[type];
                const isSelected = selectedTags.includes(type);

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleToggleTag(type)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide
                      transition-all duration-150
                      ${isSelected
                        ? ''
                        : 'opacity-50 hover:opacity-80'
                      }
                    `}
                    style={{
                      backgroundColor: preset.bgColor,
                      color: preset.color,
                      boxShadow: isSelected ? `0 0 0 2px ${preset.color}` : undefined,
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recurrence Section */}
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Repeat
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                {[
                  { value: null, label: 'Never' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setRecurrencePattern(option.value as RecurrencePattern)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        recurrencePattern === option.value
                          ? 'bg-[#6366F1] text-white'
                          : 'bg-[#0D0D0D] text-[#A1A1AA] hover:bg-[#252525] border border-[#2A2A2A]'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {recurrencePattern && (
                <div className="pl-1 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={(e) => setHasEndDate(e.target.checked)}
                      className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#6366F1] focus:ring-[#6366F1]/30"
                    />
                    <span className="text-sm text-[#A1A1AA]">Set end date</span>
                  </label>

                  {hasEndDate && (
                    <input
                      type="date"
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      min={deadline}
                      className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
                    />
                  )}

                  <p className="text-xs text-[#52525B] italic">
                    {recurrencePattern === 'daily' && 'Task will repeat every day'}
                    {recurrencePattern === 'weekly' &&
                      `Task will repeat every ${new Date(deadline || Date.now()).toLocaleDateString('en-US', { weekday: 'long' })}`}
                    {recurrencePattern === 'monthly' &&
                      `Task will repeat on day ${new Date(deadline || Date.now()).getDate()} of each month`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#2A2A2A] text-[#A1A1AA] rounded-xl hover:bg-[#252525] hover:text-[#F5F5F5] transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !deadline}
              className="flex-1 px-4 py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-[#6366F1]/20"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
