'use client';

import { useState, useEffect } from 'react';
import { Task, TaskTag, TagType, TAG_PRESETS } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, deadline: string, notes: string, tags: TaskTag[]) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  editingTask?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSave, onUpdate, editingTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDeadline(editingTask.deadline.split('T')[0]);
      setNotes(editingTask.notes);
      setSelectedTags(editingTask.tags?.map((t) => t.type) ?? []);
    } else {
      setTitle('');
      setDeadline(getTomorrowDate());
      setNotes('');
      setSelectedTags([]);
    }
  }, [editingTask, isOpen]);

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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

    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: title.trim(),
        deadline: deadlineISO,
        notes: notes.trim(),
        tags,
      });
    } else {
      onSave(title.trim(), deadlineISO, notes.trim(), tags);
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
