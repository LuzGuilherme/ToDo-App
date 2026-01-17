import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client lazily to avoid build-time errors
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables not configured');
  }

  return createClient(url, key);
}

interface TelegramUpdate {
  message?: {
    chat: {
      id: number;
    };
    from?: {
      id: number;
      first_name?: string;
      username?: string;
    };
    text?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    if (!update.message?.text) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();
    const chatId = update.message.chat.id.toString();
    const text = update.message.text;
    const username = update.message.from?.username || update.message.from?.first_name || 'User';

    // Handle /start command with connect code
    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const connectCode = parts[1];

      if (connectCode) {
        // The connect code is the user_id from our app
        const userId = connectCode;

        // Upsert user settings with telegram chat ID
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            telegram_chat_id: chatId,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error linking Telegram:', error);
          await sendMessage(chatId, '❌ Failed to connect. Please try again from the app.');
        } else {
          await sendMessage(
            chatId,
            `✅ <b>Connected successfully!</b>\n\nHey ${username}! Your Telegram is now linked to Accountability.\n\nYou'll receive:\n• Task reminders\n• Daily summaries\n• Overdue alerts\n\nStay productive! 💪`
          );
        }
      } else {
        await sendMessage(
          chatId,
          `👋 <b>Welcome to Accountability Bot!</b>\n\nTo connect your account, please use the "Connect Telegram" button in the app.\n\nThis will link your Telegram to receive task reminders.`
        );
      }
    }

    // Handle /status command
    if (text === '/status') {
      // Check if this chat is connected
      const { data } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('telegram_chat_id', chatId)
        .single();

      if (data) {
        await sendMessage(chatId, '✅ Your Telegram is connected and active!');
      } else {
        await sendMessage(chatId, '❌ Your Telegram is not connected. Use the app to connect.');
      }
    }

    // Handle /disconnect command
    if (text === '/disconnect') {
      const { error } = await supabase
        .from('user_settings')
        .update({ telegram_chat_id: null })
        .eq('telegram_chat_id', chatId);

      if (!error) {
        await sendMessage(chatId, '👋 Disconnected! You will no longer receive reminders.');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}

async function sendMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
}

// Verify webhook is working
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook active' });
}
