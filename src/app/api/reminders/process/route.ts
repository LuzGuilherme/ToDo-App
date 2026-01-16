import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramMessage, formatReminderMessage, formatDailySummary } from '@/lib/telegram';

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Reminder intervals in milliseconds
const REMINDER_INTERVALS = {
  hourly: 60 * 60 * 1000, // 1 hour
  few_hours: 3 * 60 * 60 * 1000, // 3 hours
  twice_daily: 12 * 60 * 60 * 1000, // 12 hours
};

interface Task {
  id: string;
  user_id: string;
  title: string;
  deadline: string;
  column_type: string;
  reminder_frequency: 'hourly' | 'few_hours' | 'twice_daily';
  last_reminded_at: string | null;
  escalation_level: number;
}

interface UserSettings {
  user_id: string;
  telegram_chat_id: string | null;
  focus_mode_until: string | null;
  vacation_mode_until: string | null;
}

export async function POST(request: NextRequest) {
  // Verify API key for security (use a secret key to protect this endpoint)
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.REMINDER_API_KEY;

  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    let sentCount = 0;
    let errorCount = 0;

    // Get all users with telegram connected and not in focus/vacation mode
    const { data: users, error: usersError } = await supabase
      .from('user_settings')
      .select('user_id, telegram_chat_id, focus_mode_until, vacation_mode_until')
      .not('telegram_chat_id', 'is', null);

    if (usersError) {
      throw usersError;
    }

    // Filter users who are not in focus or vacation mode
    const activeUsers = (users as UserSettings[]).filter((user) => {
      if (user.focus_mode_until && new Date(user.focus_mode_until) > now) {
        return false;
      }
      if (user.vacation_mode_until && new Date(user.vacation_mode_until) > now) {
        return false;
      }
      return true;
    });

    // Process each user
    for (const user of activeUsers) {
      if (!user.telegram_chat_id) continue;

      // Get user's pending/overdue tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, user_id, title, deadline, column_type, reminder_frequency, last_reminded_at, escalation_level')
        .eq('user_id', user.user_id)
        .neq('column_type', 'done');

      if (tasksError) {
        console.error(`Error fetching tasks for user ${user.user_id}:`, tasksError);
        errorCount++;
        continue;
      }

      // Check each task for reminders
      for (const task of tasks as Task[]) {
        const deadline = new Date(task.deadline);
        const isOverdue = deadline < now;
        const lastReminded = task.last_reminded_at ? new Date(task.last_reminded_at) : null;
        const interval = REMINDER_INTERVALS[task.reminder_frequency];

        // Determine if we should send a reminder
        let shouldRemind = false;

        if (isOverdue) {
          // For overdue tasks, always check interval
          if (!lastReminded || now.getTime() - lastReminded.getTime() >= interval) {
            shouldRemind = true;
          }
        } else if (task.column_type === 'today') {
          // For today's tasks, remind based on interval
          if (!lastReminded || now.getTime() - lastReminded.getTime() >= interval) {
            shouldRemind = true;
          }
        }

        if (shouldRemind) {
          // Calculate new escalation level
          const newEscalation = Math.min((task.escalation_level || 0) + 1, 3);

          // Format and send the reminder message
          const message = formatReminderMessage(task.title, newEscalation, task.deadline);
          const sent = await sendTelegramMessage(user.telegram_chat_id, message);

          if (sent) {
            // Update task's last reminded time and escalation level
            await supabase
              .from('tasks')
              .update({
                last_reminded_at: now.toISOString(),
                escalation_level: newEscalation,
              })
              .eq('id', task.id);

            sentCount++;
          } else {
            errorCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: activeUsers.length,
      sent: sentCount,
      errors: errorCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Reminder processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing/debugging
export async function GET() {
  return NextResponse.json({
    status: 'Reminder processor active',
    note: 'Use POST to process reminders',
  });
}
