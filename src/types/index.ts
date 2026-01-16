export type ColumnType = 'today' | 'this_week' | 'later' | 'done';

export type ReminderFrequency = 'hourly' | 'few_hours' | 'twice_daily';

export type TagType = 'management' | 'design' | 'development' | 'research' | 'marketing';

export interface TaskTag {
  id: string;
  label: string;
  type: TagType;
}

export const TAG_PRESETS: Record<TagType, { label: string; color: string; bgColor: string }> = {
  management: { label: 'Management', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.2)' },
  design: { label: 'Design', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.2)' },
  development: { label: 'Development', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.2)' },
  research: { label: 'Research', color: '#A855F7', bgColor: 'rgba(168, 85, 247, 0.2)' },
  marketing: { label: 'Marketing', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.2)' },
};

export interface Task {
  id: string;
  title: string;
  notes: string;
  deadline: string; // ISO date string
  column: ColumnType;
  createdAt: string;
  completedAt: string | null;
  isWeekendTask: boolean;
  delegatedTo: string | null;
  reminderFrequency: ReminderFrequency;
  lastRemindedAt: string | null;
  escalationLevel: number; // 0 = none, 1 = gentle, 2 = firm, 3 = urgent
  tags: TaskTag[];
}

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}

export interface DailyCommitment {
  id: string;
  date: string;
  taskIds: string[];
  completedTaskIds: string[];
}

export interface AppState {
  tasks: Task[];
  dailyCommitment: DailyCommitment | null;
  lastCommitmentDate: string | null;
  focusModeActive: boolean;
  vacationModeUntil: string | null;
}

export const COLUMN_CONFIG: Record<ColumnType, { title: string; color: string; accentColor: string }> = {
  today: { title: 'To Do', color: 'text-[#6366F1]', accentColor: '#6366F1' },
  this_week: { title: 'In Progress', color: 'text-[#A855F7]', accentColor: '#A855F7' },
  later: { title: 'Later', color: 'text-[#6B7280]', accentColor: '#6B7280' },
  done: { title: 'Complete', color: 'text-[#22C55E]', accentColor: '#22C55E' },
};

export function createTask(title: string, deadline: string, notes: string = '', tags: TaskTag[] = []): Task {
  return {
    id: crypto.randomUUID(),
    title,
    notes,
    deadline,
    column: 'later',
    createdAt: new Date().toISOString(),
    completedAt: null,
    isWeekendTask: false,
    delegatedTo: null,
    reminderFrequency: 'hourly',
    lastRemindedAt: null,
    escalationLevel: 0,
    tags,
  };
}

export function getDeadlineUrgency(deadline: string): 'overdue' | 'today' | 'soon' | 'later' {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 3) return 'soon';
  return 'later';
}

export function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
