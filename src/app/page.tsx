'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/AuthForm';
import { SupabaseKanbanBoard } from '@/components/SupabaseKanbanBoard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#A1A1AA]">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <SupabaseKanbanBoard />;
}
