const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

export async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

export function formatReminderMessage(
  taskTitle: string,
  escalationLevel: number,
  deadline: string
): string {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isOverdue = deadlineDate < now;

  const urgencyEmoji = escalationLevel >= 3 ? '🚨' : escalationLevel >= 2 ? '⚠️' : '📋';
  const statusText = isOverdue ? '⏰ OVERDUE' : `Due: ${deadlineDate.toLocaleDateString()}`;

  const messages: Record<number, string> = {
    1: `${urgencyEmoji} <b>Friendly Reminder</b>\n\nHey! You said you'd work on:\n<b>${taskTitle}</b>\n\n${statusText}\n\nReady to start?`,
    2: `${urgencyEmoji} <b>Task Waiting</b>\n\nThis task is still waiting:\n<b>${taskTitle}</b>\n\n${statusText}\n\nWhat's blocking you?`,
    3: `${urgencyEmoji} <b>Urgent: Action Required!</b>\n\nThis task needs your attention NOW:\n<b>${taskTitle}</b>\n\n${statusText}\n\nDeal with it or reschedule!`,
  };

  return messages[Math.min(Math.max(escalationLevel, 1), 3)];
}

export function formatDailySummary(
  pendingCount: number,
  overdueCount: number,
  completedToday: number
): string {
  let message = `📊 <b>Daily Summary</b>\n\n`;

  if (overdueCount > 0) {
    message += `🚨 <b>${overdueCount}</b> overdue task${overdueCount > 1 ? 's' : ''}\n`;
  }
  message += `📋 <b>${pendingCount}</b> pending task${pendingCount > 1 ? 's' : ''}\n`;
  message += `✅ <b>${completedToday}</b> completed today\n\n`;

  if (overdueCount > 0) {
    message += `⚡ Time to take action on those overdue tasks!`;
  } else if (pendingCount > 0) {
    message += `💪 You've got this! Focus on your top priority.`;
  } else {
    message += `🎉 All caught up! Great job!`;
  }

  return message;
}

export function generateConnectCode(userId: string): string {
  // Create a simple code that encodes the user ID
  // In production, you'd want to use a more secure method with expiration
  const timestamp = Date.now();
  const data = `${userId}:${timestamp}`;
  return Buffer.from(data).toString('base64').replace(/[+/=]/g, '').substring(0, 12);
}

export function decodeConnectCode(code: string): { userId: string; timestamp: number } | null {
  try {
    // This is a simplified version - in production use a proper token system
    // For now, we'll handle the connection via deep link with user ID
    return null;
  } catch {
    return null;
  }
}
