import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramMessage, formatDailySummary } from '@/lib/telegram';

// Create Supabase client lazily to avoid build-time errors
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables not configured');
  }

  return createClient(url, key);
}

interface UserSettings {
  user_id: string;
  telegram_chat_id: string | null;
  vacation_mode_until: string | null;
}

interface Task {
  id: string;
  column_type: string;
  deadline: string;
  completed_at: string | null;
}

export async function POST(request: NextRequest) {
  // Verify API key for security
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.REMINDER_API_KEY;

  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let sentCount = 0;
    let errorCount = 0;

    // Get all users with telegram connected and not in vacation mode
    const { data: users, error: usersError } = await supabase
      .from('user_settings')
      .select('user_id, telegram_chat_id, vacation_mode_until')
      .not('telegram_chat_id', 'is', null);

    if (usersError) {
      throw usersError;
    }

    // Filter users not in vacation mode
    const activeUsers = (users as UserSettings[]).filter((user) => {
      if (user.vacation_mode_until && new Date(user.vacation_mode_until) > now) {
        return false;
      }
      return true;
    });

    // Process each user
    for (const user of activeUsers) {
      if (!user.telegram_chat_id) continue;

      // Get user's tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, column_type, deadline, completed_at')
        .eq('user_id', user.user_id);

      if (tasksError) {
        console.error(`Error fetching tasks for user ${user.user_id}:`, tasksError);
        errorCount++;
        continue;
      }

      // Calculate summary stats
      const allTasks = tasks as Task[];

      const pendingCount = allTasks.filter((t) => t.column_type !== 'done').length;

      const overdueCount = allTasks.filter((t) => {
        if (t.column_type === 'done') return false;
        return new Date(t.deadline) < now;
      }).length;

      const completedToday = allTasks.filter((t) => {
        if (t.column_type !== 'done' || !t.completed_at) return false;
        return new Date(t.completed_at) >= todayStart;
      }).length;

      // Only send if there's something to report
      if (pendingCount > 0 || completedToday > 0) {
        const message = formatDailySummary(pendingCount, overdueCount, completedToday);
        const sent = await sendTelegramMessage(user.telegram_chat_id, message);

        if (sent) {
          sentCount++;
        } else {
          errorCount++;
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
    console.error('Daily summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send daily summaries' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Daily summary processor active',
    note: 'Use POST to send daily summaries',
  });
}
