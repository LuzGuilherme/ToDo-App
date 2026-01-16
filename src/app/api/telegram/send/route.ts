import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramMessage } from '@/lib/telegram';

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or message' },
        { status: 400 }
      );
    }

    // Get user's telegram chat ID
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('telegram_chat_id')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json(
        { success: false, error: 'User settings not found' },
        { status: 404 }
      );
    }

    if (!settings.telegram_chat_id) {
      return NextResponse.json(
        { success: false, error: 'Telegram not connected' },
        { status: 400 }
      );
    }

    // Send the message
    const sent = await sendTelegramMessage(settings.telegram_chat_id, message);

    if (!sent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send Telegram error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
