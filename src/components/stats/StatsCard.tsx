'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'red' | 'blue' | 'purple' | 'default';
}

export function StatsCard({ title, value, subtitle, icon, color = 'default' }: StatsCardProps) {
  const colorStyles = {
    green: 'text-[#22C55E]',
    red: 'text-[#EF4444]',
    blue: 'text-[#6366F1]',
    purple: 'text-[#A855F7]',
    default: 'text-[#F5F5F5]',
  };

  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#71717A] uppercase tracking-wide">
          {title}
        </span>
        {icon && (
          <span className="text-[#52525B]">
            {icon}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${colorStyles[color]}`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-[#52525B] mt-1">{subtitle}</p>
      )}
    </div>
  );
}
