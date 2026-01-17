import { ParsedTask, ParseResult } from './taskParser';

type ColumnType = 'today' | 'this_week' | 'later' | 'done';

const COLUMN_NAMES: Record<ColumnType, string> = {
  today: 'Today',
  this_week: 'This Week',
  later: 'Later',
  done: 'Done',
};

const COLUMN_EMOJIS: Record<ColumnType, string> = {
  today: '🔴',
  this_week: '🟡',
  later: '🟢',
  done: '✅',
};

/**
 * Format deadline for display in Telegram
 */
function formatDeadlineForTelegram(deadline: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

  const diffTime = deadlineDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Format time if not end of day
  const hasTime = deadline.getHours() !== 23 || deadline.getMinutes() !== 59;
  const timeStr = hasTime
    ? ` at ${deadline.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : '';

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
  } else if (diffDays === 0) {
    return `Today${timeStr}`;
  } else if (diffDays === 1) {
    return `Tomorrow${timeStr}`;
  } else if (diffDays <= 7) {
    const dayName = deadline.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName}${timeStr}`;
  } else {
    const dateStr = deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dateStr}${timeStr}`;
  }
}

/**
 * Format task creation confirmation message
 */
export function formatTaskConfirmation(
  task: ParsedTask,
  column: ColumnType,
  warning?: string
): string {
  const tagText =
    task.tags.length > 0
      ? `\n🏷️ Tags: ${task.tags.map((t) => t.label).join(', ')}`
      : '';

  const deadlineText = formatDeadlineForTelegram(task.deadline);
  const confidenceNote =
    task.confidence === 'low' ? '\n\n<i>📅 No deadline detected - defaulting to today</i>' : '';

  const warningText = warning ? `\n\n⚠️ ${warning}` : '';

  return `✅ <b>Task Created!</b>

📝 ${task.title}
📅 ${deadlineText}
📊 Column: ${COLUMN_EMOJIS[column]} ${COLUMN_NAMES[column]}${tagText}${confidenceNote}${warningText}

<i>View in app to edit details</i>`;
}

/**
 * Format parse error message with help
 */
export function formatParseError(result: ParseResult): string {
  let message = `❌ <b>Couldn't create task</b>\n\n`;

  if (result.error) {
    message += `${result.error}\n\n`;
  }

  message += `<b>Try formats like:</b>
• "Buy groceries tomorrow"
• "Call mom Friday at 3pm"
• "Submit report by Jan 20th #work"

<i>Send /help for more examples</i>`;

  return message;
}

/**
 * Format help message
 */
export function formatHelpMessage(): string {
  return `📚 <b>Task Creation Help</b>

<b>Create tasks by sending a message:</b>
• "Buy groceries tomorrow"
• "Call mom on Friday"
• "Meeting at 3pm next Monday"
• "Submit report by Jan 20 #work"

<b>Supported tags:</b>
#management #design #development
#research #marketing

<b>Tag shortcuts:</b>
#work #dev #code #ui #learn

<b>Date formats:</b>
• "tomorrow", "today"
• "next Monday", "this Friday"
• "in 3 days", "in 2 weeks"
• "January 20th", "Jan 20"
• Times: "at 3pm", "at 14:00"

<b>Commands:</b>
/status - Check connection status
/disconnect - Unlink your account
/help - Show this message`;
}

/**
 * Format database error message
 */
export function formatDatabaseError(): string {
  return `❌ <b>Failed to create task</b>

Something went wrong while saving your task. Please try again.

If the problem persists, try creating the task directly in the app.`;
}

/**
 * Format not connected message
 */
export function formatNotConnectedMessage(): string {
  return `❌ <b>Account not connected</b>

Your Telegram is not linked to any account.

Please use the "Connect Telegram" button in the app to link your account first.`;
}
