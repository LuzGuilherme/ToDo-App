'use client';

import { useState } from 'react';

interface FocusModeToggleProps {
  isActive: boolean;
  focusUntil: string | null;
  vacationUntil: string | null;
  onEnterFocus: (minutes: number) => void;
  onExitFocus: () => void;
  onEnterVacation: (days: number) => void;
  onExitVacation: () => void;
}

export function FocusModeToggle({
  isActive,
  focusUntil,
  vacationUntil,
  onEnterFocus,
  onExitFocus,
  onEnterVacation,
  onExitVacation,
}: FocusModeToggleProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatTimeRemaining = (until: string) => {
    const remaining = new Date(until).getTime() - Date.now();
    if (remaining <= 0) return 'Ending...';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} left`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const isInFocusMode = focusUntil && new Date(focusUntil) > new Date();
  const isInVacationMode = vacationUntil && new Date(vacationUntil) > new Date();

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium
          ${isInFocusMode
            ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30'
            : isInVacationMode
              ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
              : 'border border-[#2A2A2A] text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]'
          }
        `}
      >
        {isInFocusMode ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Focus Mode
            <span className="text-xs opacity-75">
              {formatTimeRemaining(focusUntil)}
            </span>
          </>
        ) : isInVacationMode ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M9 8h6m-6 4h6m-6 4h6M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
            </svg>
            Vacation Mode
            <span className="text-xs opacity-75">
              {formatTimeRemaining(vacationUntil)}
            </span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Modes
          </>
        )}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#252525] rounded-xl shadow-xl z-20 overflow-hidden">
            {/* Focus Mode Section */}
            <div className="p-3 border-b border-[#252525]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium text-[#F5F5F5]">Focus Mode</span>
              </div>
              <p className="text-xs text-[#71717A] mb-3">
                Pause reminders while working
              </p>

              {isInFocusMode ? (
                <button
                  onClick={() => {
                    onExitFocus();
                    setShowMenu(false);
                  }}
                  className="w-full py-2 text-sm bg-[#F97316]/20 text-[#F97316] rounded-lg hover:bg-[#F97316]/30 transition-colors"
                >
                  Exit Focus Mode
                </button>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        onEnterFocus(mins);
                        setShowMenu(false);
                      }}
                      className="py-2 text-xs bg-[#141414] border border-[#252525] rounded-lg text-[#A1A1AA] hover:bg-[#252525] hover:text-[#F5F5F5] transition-colors"
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vacation Mode Section */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M9 8h6m-6 4h6m-6 4h6M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
                </svg>
                <span className="text-sm font-medium text-[#F5F5F5]">Vacation Mode</span>
              </div>
              <p className="text-xs text-[#71717A] mb-3">
                Pause all accountability features
              </p>

              {isInVacationMode ? (
                <button
                  onClick={() => {
                    onExitVacation();
                    setShowMenu(false);
                  }}
                  className="w-full py-2 text-sm bg-[#22C55E]/20 text-[#22C55E] rounded-lg hover:bg-[#22C55E]/30 transition-colors"
                >
                  Exit Vacation Mode
                </button>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 7].map((days) => (
                    <button
                      key={days}
                      onClick={() => {
                        onEnterVacation(days);
                        setShowMenu(false);
                      }}
                      className="py-2 text-xs bg-[#141414] border border-[#252525] rounded-lg text-[#A1A1AA] hover:bg-[#252525] hover:text-[#F5F5F5] transition-colors"
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
