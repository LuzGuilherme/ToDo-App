'use client';

import { useEffect, useState } from 'react';

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
}

const CONFETTI_COLORS = ['#6366F1', '#22C55E', '#F97316', '#EF4444', '#A855F7', '#EC4899'];
const MESSAGES = [
  'Amazing work!',
  'You crushed it!',
  'Keep it up!',
  'Fantastic!',
  'One down, more to go!',
  'You\'re on fire!',
  'Productivity unlocked!',
];

export function Celebration({ show, onComplete }: CelebrationProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
  }>>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.3,
        size: Math.random() * 8 + 4,
      }));
      setParticles(newParticles);
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

      // Play celebration sound (optional)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRADj9LteEMNC4HL2'
          + 'niVOQkEZrLW3J5pNC4nYJK/uJ11UkVCaZypmn9UTkVrn6mWfU5GRW6fpZR7TkdIcaCkknlOR0p1oaOQdk1ISXiipJB0TUlLe6Skj3JLSUx+pqSNcEpJTICmpIxuSUlOg6ekimtISE+GqKSIaEdHUImopoZlRUZRjaqnhGJDRFKQrKiCX0JCU5OtqYBdQEFVlq+pgFo+QFeZsa1+VjxAWpyzsHxTO');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}

      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Confetti */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-celebration-message text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899]">
          {message}
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes celebration-message {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
        .animate-celebration-message {
          animation: celebration-message 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
