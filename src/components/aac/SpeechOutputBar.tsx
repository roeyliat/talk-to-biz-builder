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
        'relative mx-auto flex h-[68px] w-full max-w-[375px] flex-col rounded-[18px] bg-[#f2f2f7] px-4 py-3',
        className,
      )}
    >
      <div
        className="flex min-h-0 w-full flex-1 items-center rounded-[12px] bg-white py-[10px] pe-4 ps-[60px] text-start text-sm font-medium leading-snug text-[#1c1b1f]"
        aria-live="polite"
      >
        <span className="min-w-0 flex-1 truncate">
          {hasSelection ? summary : ''}
        </span>
      </div>

      <button
        type="button"
        onClick={hasSelection ? onDone : undefined}
        disabled={!hasSelection}
        className={cn(
          'absolute top-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#294f83] text-white shadow-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'start-4 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
        )}
        aria-label={doneLabel}
        aria-disabled={!hasSelection}
      >
        <Volume2 className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
