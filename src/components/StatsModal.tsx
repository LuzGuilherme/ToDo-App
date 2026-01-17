'use client';

import { useState } from 'react';
import { Task, TimeRange } from '@/types';
import { useTaskStats } from '@/hooks/useTaskStats';
import { StatsCard } from './stats/StatsCard';
import { CompletionChart } from './stats/CompletionChart';
import { DistributionChart } from './stats/DistributionChart';
import { OnTimeChart } from './stats/OnTimeChart';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'all', label: 'All time' },
];

export function StatsModal({ isOpen, onClose, tasks }: StatsModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const stats = useTaskStats(tasks, timeRange);

  if (!isOpen) return null;

  const hasData = tasks.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1A1A1A] rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] border border-[#252525] w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252525]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6366F1]/20 rounded-lg">
              <svg className="w-5 h-5 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#F5F5F5]">Productivity Stats</h2>
          </div>

          {/* Time range selector */}
          <div className="flex gap-1 bg-[#0D0D0D] p-1 rounded-lg">
            {TIME_RANGE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === option.value
                    ? 'bg-[#6366F1] text-white'
                    : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!hasData ? (
            <div className="text-center py-16">
              <div className="p-4 bg-[#141414] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#52525B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">No tasks yet</h3>
              <p className="text-sm text-[#52525B]">Add tasks to start tracking your productivity</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats cards grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  title="Completed"
                  value={stats.totalCompleted}
                  subtitle={`in the last ${timeRange === 'all' ? 'period' : timeRange.replace('d', ' days')}`}
                  color="blue"
                />
                <StatsCard
                  title="On-Time Rate"
                  value={`${stats.onTimeRate}%`}
                  subtitle={stats.onTimeRate >= 70 ? 'Great job!' : 'Room to improve'}
                  color={stats.onTimeRate >= 70 ? 'green' : 'red'}
                />
                <StatsCard
                  title="Current Streak"
                  value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
                  subtitle={stats.currentStreak > 0 ? 'Keep it up!' : 'Complete a task today'}
                  color={stats.currentStreak > 0 ? 'purple' : 'default'}
                />
                <StatsCard
                  title="Avg. Time"
                  value={`${stats.averageCompletionDays} day${stats.averageCompletionDays !== 1 ? 's' : ''}`}
                  subtitle="to complete tasks"
                  color="default"
                />
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CompletionChart data={stats.completionsByDay} />
                <DistributionChart data={stats.columnDistribution} />
              </div>

              {/* On-time chart - full width */}
              <OnTimeChart onTimeRate={stats.onTimeRate} totalCompleted={stats.totalCompleted} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#252525]">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#252525] text-[#F5F5F5] rounded-xl hover:bg-[#333333] transition-all font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
