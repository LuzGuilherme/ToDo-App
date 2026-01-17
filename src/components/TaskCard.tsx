'use client';

import { Task, getDeadlineUrgency, formatDeadline, TAG_PRESETS } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
  draggable = true,
  onDragStart,
  isDragging = false,
}: TaskCardProps) {
  const urgency = getDeadlineUrgency(task.deadline);
  const isCompleted = task.column === 'done';

  const urgencyColors = {
    overdue: 'text-[#EF4444] bg-[#EF4444]/20',
    today: 'text-[#F97316] bg-[#F97316]/20',
    soon: 'text-[#EAB308] bg-[#EAB308]/20',
    later: 'text-[#71717A] bg-[#71717A]/20',
  };

  const visibleTags = task.tags?.slice(0, 3) ?? [];
  const extraTagCount = (task.tags?.length ?? 0) - 3;

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      className={`
        group relative p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing
        ${isDragging
          ? 'opacity-50 scale-95 ring-2 ring-dashed ring-[#6366F1] bg-[#1A1A1A] border-transparent'
          : isCompleted
            ? 'bg-[#1A1A1A]/60 border-[#252525] opacity-60'
            : 'bg-[#1A1A1A] border-[#252525] hover:border-[#333333] hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)]'
        }
      `}
    >
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {visibleTags.map((tag) => {
            const preset = TAG_PRESETS[tag.type];
            return (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: preset.bgColor,
                  color: preset.color,
                }}
              >
                {tag.label}
              </span>
            );
          })}
          {extraTagCount > 0 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-[#71717A] bg-[#71717A]/20">
              +{extraTagCount}
            </span>
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(task.id)}
          className={`
            mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-colors flex-shrink-0
            ${isCompleted
              ? 'bg-[#22C55E] border-[#22C55E] text-white'
              : 'border-[#404040] hover:border-[#22C55E]'
            }
          `}
        >
          {isCompleted && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-[#52525B]' : 'text-[#F5F5F5]'}`}>
            {task.title}
          </h4>

          {task.notes && (
            <p className="text-xs text-[#71717A] mt-1.5 line-clamp-2">{task.notes}</p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg ${urgencyColors[urgency]}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDeadline(task.deadline)}
            </span>

            {task.recurrencePattern && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {task.recurrencePattern === 'daily' ? 'Daily' : task.recurrencePattern === 'weekly' ? 'Weekly' : 'Monthly'}
              </span>
            )}

            {task.delegatedTo && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
                Waiting: {task.delegatedTo}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-[#52525B] hover:text-[#F5F5F5] hover:bg-[#252525] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-[#52525B] hover:text-[#EF4444] hover:bg-[#252525] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
