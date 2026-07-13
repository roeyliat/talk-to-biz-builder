import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeechOutputBarProps {
  summary: string;
  doneLabel: string;
  hasSelection: boolean;
  onDone: () => void;
  className?: string;
}

export function SpeechOutputBar({
  summary,
  doneLabel,
  hasSelection,
  onDone,
  className,
}: SpeechOutputBarProps) {
  return (
    <div
      className={cn(
        'relative mx-auto flex h-[68px] w-full max-w-[375px] items-center rounded-[18px] bg-[#f2f2f7] px-4 py-3',
        className,
      )}
    >
      <div
        className="flex h-11 min-w-0 flex-1 items-center rounded-xl bg-white px-4 ps-14 text-sm font-medium text-[#1c1b1f]"
        aria-live="polite"
      >
        <span className="truncate">{hasSelection ? summary : ''}</span>
      </div>
      <button
        type="button"
        onClick={hasSelection ? onDone : undefined}
        disabled={!hasSelection}
        className="absolute start-4 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#294f83] text-white shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-100"
        aria-label={doneLabel}
      >
        <Volume2 className="h-7 w-7" aria-hidden="true" />
      </button>
    </div>
  );
}
