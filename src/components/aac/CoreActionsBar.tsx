import { Home, MessageCircle, Trash2, Volume2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoreActionsBarProps {
  labels: {
    delete: string;
    speak: string;
    talk: string;
    back: string;
    home: string;
  };
  backIcon: LucideIcon;
  canGoBack: boolean;
  canSpeak: boolean;
  isSpeaking?: boolean;
  isCustomerMode?: boolean;
  onDelete: () => void;
  onSpeak: () => void;
  onTalk: () => void;
  onBack: () => void;
  onHome: () => void;
}

export function CoreActionsBar({
  labels,
  backIcon: BackIcon,
  canGoBack,
  canSpeak,
  isSpeaking,
  isCustomerMode,
  onDelete,
  onSpeak,
  onTalk,
  onBack,
  onHome,
}: CoreActionsBarProps) {
  const actionClassName =
    'flex h-12 min-w-0 flex-col items-center justify-between gap-0.5 bg-white px-1 py-1 text-[11px] font-semibold leading-none text-[#a09cab] transition-colors hover:text-[#1c1b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-45';

  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[375px] border-t border-black/5 bg-white px-6 py-1.5',
        canGoBack ? 'grid-cols-5' : 'grid-cols-4',
      )}
      role="toolbar"
    >
      <button
        type="button"
        onClick={onDelete}
        className={actionClassName}
      >
        <Trash2 className="h-6 w-6 text-[#1c1b1f]" />
        <span>{labels.delete}</span>
      </button>
      <button
        type="button"
        onClick={canSpeak ? onSpeak : undefined}
        disabled={!canSpeak || isSpeaking}
        className={actionClassName}
      >
        <Volume2 className={cn('h-6 w-6 text-[#1c1b1f]', isSpeaking && 'animate-pulse')} />
        <span>{labels.speak}</span>
      </button>
      <button
        type="button"
        onClick={onTalk}
        className={cn(
          actionClassName,
          isCustomerMode && 'text-[#1c1b1f]',
        )}
      >
        <MessageCircle className="h-6 w-6 text-[#1c1b1f]" />
        <span>{labels.talk}</span>
      </button>
      {canGoBack && (
        <button type="button" onClick={onBack} className={actionClassName}>
          <BackIcon className="h-6 w-6 text-[#1c1b1f]" />
          <span>{labels.back}</span>
        </button>
      )}
      <button
        type="button"
        onClick={onHome}
        className={actionClassName}
      >
        <Home className="h-6 w-6 text-[#1c1b1f]" />
        <span>{labels.home}</span>
      </button>
    </div>
  );
}
