'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email to confirm your account!');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#F5F5F5]">Accountability</h1>
          <p className="text-[#A1A1AA] mt-2">Stay focused and get things done</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#252525] p-8">
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-6">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
                disabled={loading}
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30 transition-all"
                  disabled={loading}
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30">
                <p className="text-sm text-[#22C55E]">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-[#6366F1]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#52525B] text-sm mt-6">
          Your personal accountability partner
        </p>
      </div>
    </div>
  );
}
