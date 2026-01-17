'use client';

interface OnTimeChartProps {
  onTimeRate: number;
  totalCompleted: number;
}

export function OnTimeChart({ onTimeRate, totalCompleted }: OnTimeChartProps) {
  const overdueRate = 100 - onTimeRate;

  if (totalCompleted === 0) {
    return (
      <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
        <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">On-Time Completion</h3>
        <div className="h-16 flex items-center justify-center text-[#52525B] text-sm">
          Complete tasks to see your on-time rate
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
      <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">On-Time Completion</h3>

      {/* Stacked bar */}
      <div className="relative h-8 bg-[#252525] rounded-full overflow-hidden">
        {/* On-time segment */}
        <div
          className="absolute left-0 top-0 h-full bg-[#22C55E] transition-all duration-500"
          style={{ width: `${onTimeRate}%` }}
        />
        {/* Overdue segment */}
        <div
          className="absolute right-0 top-0 h-full bg-[#EF4444] transition-all duration-500"
          style={{ width: `${overdueRate}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#22C55E]" />
          <span className="text-xs text-[#A1A1AA]">On-time</span>
          <span className="text-xs font-medium text-[#22C55E]">{onTimeRate}%</span>
        </div>
        {overdueRate > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#EF4444]" />
            <span className="text-xs text-[#A1A1AA]">Overdue</span>
            <span className="text-xs font-medium text-[#EF4444]">{overdueRate}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
