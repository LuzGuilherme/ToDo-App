'use client';

import { useState } from 'react';

interface CompletionChartProps {
  data: Array<{ date: string; count: number }>;
}

export function CompletionChart({ data }: CompletionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
        <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">Tasks Completed</h3>
        <div className="h-32 flex items-center justify-center text-[#52525B] text-sm">
          No data available
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 120;
  const barWidth = Math.max(4, Math.min(12, (280 / data.length) - 2));
  const gap = 2;

  // Limit to last 14 days for readability
  const displayData = data.slice(-14);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
      <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">Tasks Completed</h3>

      <div className="relative">
        <svg
          width="100%"
          height={chartHeight + 24}
          viewBox={`0 0 ${displayData.length * (barWidth + gap) + 20} ${chartHeight + 24}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight - ratio * chartHeight}
              x2={displayData.length * (barWidth + gap)}
              y2={chartHeight - ratio * chartHeight}
              stroke="#252525"
              strokeDasharray="2,2"
            />
          ))}

          {/* Bars */}
          {displayData.map((item, index) => {
            const barHeight = maxCount > 0 ? (item.count / maxCount) * chartHeight : 0;
            const isToday = item.date === today;
            const isHovered = hoveredIndex === index;

            return (
              <g key={item.date}>
                <rect
                  x={index * (barWidth + gap)}
                  y={chartHeight - barHeight}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx={2}
                  fill={isToday ? '#818CF8' : '#6366F1'}
                  opacity={isHovered ? 1 : 0.8}
                  className="transition-opacity cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}

          {/* Hover tooltip */}
          {hoveredIndex !== null && displayData[hoveredIndex] && (
            <g>
              <rect
                x={hoveredIndex * (barWidth + gap) - 20}
                y={-30}
                width={60}
                height={24}
                rx={4}
                fill="#1A1A1A"
                stroke="#333333"
              />
              <text
                x={hoveredIndex * (barWidth + gap) + barWidth / 2}
                y={-14}
                textAnchor="middle"
                fill="#F5F5F5"
                fontSize="10"
                fontWeight="500"
              >
                {displayData[hoveredIndex].count} task{displayData[hoveredIndex].count !== 1 ? 's' : ''}
              </text>
            </g>
          )}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-[10px] text-[#52525B]">
          <span>{formatDate(displayData[0]?.date || '')}</span>
          <span>{formatDate(displayData[displayData.length - 1]?.date || '')}</span>
        </div>
      </div>
    </div>
  );
}
