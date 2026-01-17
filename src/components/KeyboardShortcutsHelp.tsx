'use client';

import { useState, useEffect } from 'react';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{ keys: string[]; description: string }>;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['↑', '↓'], description: 'Move between tasks' },
      { keys: ['←', '→'], description: 'Move between columns' },
      { keys: ['1', '2', '3', '4'], description: 'Jump to column' },
    ],
  },
  {
    title: 'Task Actions',
    shortcuts: [
      { keys: ['n'], description: 'New task' },
      { keys: ['Enter'], description: 'Edit focused task' },
      { keys: ['Space'], description: 'Mark as done' },
      { keys: ['Delete'], description: 'Delete task' },
    ],
  },
  {
    title: 'Modal',
    shortcuts: [
      { keys: ['Esc'], description: 'Close modal' },
      { keys: ['Ctrl', 'Enter'], description: 'Save and close' },
    ],
  },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return;
      }

      if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-[#1A1A1A] rounded-2xl border border-[#252525] p-6 max-w-md w-full mx-4 shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#F5F5F5]">Keyboard Shortcuts</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[#71717A] hover:text-[#F5F5F5] hover:bg-[#252525] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider mb-2.5">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <span className="text-sm text-[#A1A1AA]">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j}>
                          <kbd className="px-2 py-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-xs text-[#F5F5F5] font-mono min-w-[28px] text-center inline-block">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && shortcut.keys.length > 1 && shortcut.keys[0] !== 'Ctrl' && (
                            <span className="text-[#52525B] text-xs mx-0.5">/</span>
                          )}
                          {j < shortcut.keys.length - 1 && shortcut.keys[0] === 'Ctrl' && (
                            <span className="text-[#52525B] text-xs mx-0.5">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#52525B] mt-5 pt-4 border-t border-[#252525]">
          Press <kbd className="px-1.5 py-0.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded text-[#F5F5F5] font-mono">?</kbd> to toggle this help
        </p>
      </div>
    </div>
  );
}
