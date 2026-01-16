'use client';

import { TagType, TAG_PRESETS } from '@/types';

interface TagBadgeProps {
  label: string;
  type: TagType;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export function TagBadge({ label, type, onRemove, size = 'sm' }: TagBadgeProps) {
  const preset = TAG_PRESETS[type];

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded font-semibold uppercase tracking-wide
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
      `}
      style={{
        backgroundColor: preset.bgColor,
        color: preset.color,
      }}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

interface TagSelectorProps {
  selectedTags: TagType[];
  onToggleTag: (type: TagType) => void;
}

export function TagSelector({ selectedTags, onToggleTag }: TagSelectorProps) {
  const tagTypes = Object.keys(TAG_PRESETS) as TagType[];

  return (
    <div className="flex flex-wrap gap-2">
      {tagTypes.map((type) => {
        const preset = TAG_PRESETS[type];
        const isSelected = selectedTags.includes(type);

        return (
          <button
            key={type}
            type="button"
            onClick={() => onToggleTag(type)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide
              transition-all duration-150
              ${isSelected
                ? 'ring-2 ring-offset-1 ring-offset-[#1A1A1A]'
                : 'opacity-60 hover:opacity-100'
              }
            `}
            style={{
              backgroundColor: preset.bgColor,
              color: preset.color,
              // @ts-expect-error - ringColor is a valid CSS custom property for ring utilities
              '--tw-ring-color': isSelected ? preset.color : undefined,
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
