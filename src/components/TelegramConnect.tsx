'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';

interface TelegramConnectProps {
  onClose?: () => void;
}

export function TelegramConnect({ onClose }: TelegramConnectProps) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testSending, setTestSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'AccountabilityBot';

  useEffect(() => {
    checkConnection();
  }, [user]);

  async function checkConnection() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('user_settings')
        .select('telegram_chat_id')
        .eq('user_id', user.id)
        .single();

      setIsConnected(!!data?.telegram_chat_id);
    } catch (error) {
      console.error('Error checking Telegram connection:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateConnectLink() {
    if (!user) return '';
    // The connect code is simply the user ID - the webhook will use this to link accounts
    return `https://t.me/${botUsername}?start=${user.id}`;
  }

  async function handleDisconnect() {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_settings')
        .update({ telegram_chat_id: null })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsConnected(false);
      setMessage({ type: 'success', text: 'Telegram disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting:', error);
      setMessage({ type: 'error', text: 'Failed to disconnect. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSendTest() {
    if (!user) return;

    try {
      setTestSending(true);
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: '🎉 <b>Test Message</b>\n\nYour Telegram notifications are working! You\'ll receive task reminders here.',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Test message sent! Check your Telegram.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test message.' });
      }
    } catch (error) {
      console.error('Error sending test:', error);
      setMessage({ type: 'error', text: 'Failed to send test message.' });
    } finally {
      setTestSending(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <div className="animate-pulse flex items-center justify-center py-8">
          <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.43 3.8-1.57 4.59-1.85 5.1-1.85.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
          </svg>
          Telegram Notifications
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {message.text}
        </div>
      )}

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Telegram is connected</span>
          </div>

          <p className="text-gray-400 text-sm">
            You&apos;ll receive task reminders, daily summaries, and overdue alerts via Telegram.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleSendTest}
              disabled={testSending}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {testSending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Test
                </>
              )}
            </button>

            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Connect your Telegram account to receive task reminders, daily summaries, and overdue alerts.
          </p>

          <div className="bg-gray-900 rounded-lg p-4 space-y-3">
            <p className="text-sm text-gray-300 font-medium">How to connect:</p>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Click the button below to open Telegram</li>
              <li>Press &quot;Start&quot; in the bot chat</li>
              <li>You&apos;ll receive a confirmation message</li>
            </ol>
          </div>

          <a
            href={generateConnectLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center font-medium"
          >
            Connect Telegram
          </a>

          <button
            onClick={checkConnection}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
          >
            I&apos;ve connected - refresh status
          </button>
        </div>
      )}
    </div>
  );
}
