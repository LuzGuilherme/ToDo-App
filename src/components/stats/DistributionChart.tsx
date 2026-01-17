'use client';

import { ColumnType, COLUMN_CONFIG } from '@/types';

interface DistributionChartProps {
  data: Record<ColumnType, number>;
}

export function DistributionChart({ data }: DistributionChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return (
      <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
        <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">Task Distribution</h3>
        <div className="h-32 flex items-center justify-center text-[#52525B] text-sm">
          No tasks yet
        </div>
      </div>
    );
  }

  const columns: ColumnType[] = ['today', 'this_week', 'later', 'done'];
  const size = 100;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  const segments = columns.map(column => {
    const count = data[column];
    const percentage = total > 0 ? (count / total) * 100 : 0;
    const dashLength = (percentage / 100) * circumference;
    const dashOffset = circumference - currentOffset;

    const segment = {
      column,
      count,
      percentage,
      dashArray: `${dashLength} ${circumference}`,
      dashOffset,
      color: COLUMN_CONFIG[column].accentColor,
    };

    currentOffset += dashLength;
    return segment;
  });

  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
      <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">Task Distribution</h3>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#252525"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {segments.map((segment, index) => (
              segment.count > 0 && (
                <circle
                  key={segment.column}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                  style={{ zIndex: segments.length - index }}
                />
              )
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#F5F5F5]">{total}</span>
            <span className="text-[10px] text-[#52525B]">tasks</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {segments.filter(s => s.count > 0).map(segment => (
            <div key={segment.column} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-xs text-[#A1A1AA]">
                {COLUMN_CONFIG[segment.column].title}
              </span>
              <span className="text-xs text-[#52525B]">
                ({segment.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
