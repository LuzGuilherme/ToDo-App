'use client';

import { Task, ColumnType, COLUMN_CONFIG } from '@/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  columnId: ColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, column: ColumnType) => void;
  isDragOver: boolean;
  onAddTask?: (column: ColumnType) => void;
  draggedTaskId?: string | null;
  isFocusedColumn?: boolean;
  focusedTaskIndex?: number;
  onTaskFocus?: (taskIndex: number) => void;
}

export function Column({
  columnId,
  tasks,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
  onAddTask,
  draggedTaskId,
  isFocusedColumn = false,
  focusedTaskIndex = -1,
  onTaskFocus,
}: ColumnProps) {
  const config = COLUMN_CONFIG[columnId];

  // Column-specific accent colors for drag-over effect
  const dragOverStyles: Record<ColumnType, string> = {
    today: 'bg-[#6366F1]/15 ring-2 ring-[#6366F1]/50',
    this_week: 'bg-[#A855F7]/15 ring-2 ring-[#A855F7]/50',
    later: 'bg-[#6B7280]/15 ring-2 ring-[#6B7280]/50',
    done: 'bg-[#22C55E]/15 ring-2 ring-[#22C55E]/50',
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnId)}
      role="region"
      aria-label={`${config.title} column with ${tasks.length} tasks`}
      className={`
        flex flex-col min-w-[300px] max-w-[340px] flex-1
        rounded-xl transition-all overflow-hidden
        ${isDragOver
          ? `${dragOverStyles[columnId]} scale-[1.01]`
          : isFocusedColumn
            ? 'bg-[#141414] border-2 border-[#6366F1]/50'
            : 'bg-[#141414] border border-[#1F1F1F]'
        }
      `}
    >
      <div
        className="h-1 w-full"
        style={{ backgroundColor: config.accentColor }}
      />

      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2.5">
          <h2 className={`font-semibold text-sm ${config.color}`}>{config.title}</h2>
          <span className="text-xs text-[#A1A1AA] bg-[#252525] px-2.5 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(columnId)}
            className="p-1.5 text-[#71717A] hover:text-[#F5F5F5] hover:bg-[#252525] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-220px)]" role="list">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-[#52525B] text-sm">
            {columnId === 'done' ? 'Complete tasks to see them here' : 'No tasks yet'}
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onComplete={onCompleteTask}
              onDragStart={onDragStart}
              isDragging={draggedTaskId === task.id}
              isFocused={isFocusedColumn && focusedTaskIndex === index}
              onFocus={() => onTaskFocus?.(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}
