import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Check, LucideIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const THANKS_ICON_SRC = '/aac-local/flavors/תודה.png';

export type CoreCommunicationAction = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export const CoreCommunicationBarContext = createContext<CoreCommunicationAction[] | null>(null);

export type SentenceSpeechContextValue = {
  speakSentence: () => void;
  canSpeak: boolean;
  isSpeaking?: boolean;
  isListeningMode?: boolean;
};

export const SentenceSpeechContext = createContext<SentenceSpeechContextValue | null>(null);

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
  canGoBack,
  isSpeaking,
  onBack,
  backIcon: BackIcon,
}: CoreActionsBarProps) {
  const communicationActions = useContext(CoreCommunicationBarContext);

  const actionButtonClassName =
    'flex min-h-14 min-w-12 shrink-0 flex-col items-center justify-center gap-1 px-[13px] bg-transparent transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-45 active:scale-95';

  const labelClassName = (isActive: boolean) =>
    cn(
      'text-[13px] font-semibold leading-none tracking-[0.2px]',
      isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]',
    );

  const iconClassName = (isActive: boolean) =>
    cn('h-6 w-6', isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]');

  const actions = useMemo(() => {
    const fromContext = (communicationActions ?? []).filter((action) => action.key !== 'more');
    const communicationOnly = fromContext.slice(0, 3);

    return [
      ...communicationOnly,
      {
        key: 'back',
        label: 'חזרה',
        onClick: onBack,
        disabled: !canGoBack,
      },
    ];
  }, [canGoBack, communicationActions, onBack]);

  const renderActionVisual = (action: { key: string; label: string }, disabled: boolean): ReactNode => {
    if (action.key === 'yes') {
      return (
        <>
          <span
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-sm',
              disabled && 'opacity-60',
            )}
            aria-hidden="true"
          >
            <Check className="h-7 w-7 stroke-[3]" />
          </span>
          <span className={labelClassName(!disabled)}>{action.label}</span>
        </>
      );
    }

    if (action.key === 'no') {
      return (
        <>
          <span
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-sm',
              disabled && 'opacity-60',
            )}
            aria-hidden="true"
          >
            <X className="h-7 w-7 stroke-[3]" />
          </span>
          <span className={labelClassName(!disabled)}>{action.label}</span>
        </>
      );
    }

    if (action.key === 'thanks') {
      return (
        <>
          {/* Source PNG has more built-in transparent padding than the icon
              needs at this size; crop/zoom presentationally (file untouched)
              to match the tighter icon crop used everywhere else in this bar. */}
          <span className="flex h-6 w-6 items-center justify-center overflow-hidden" aria-hidden="true">
            <img
              src={THANKS_ICON_SRC}
              alt=""
              className={cn('h-full w-full scale-125 object-contain', disabled && 'opacity-60')}
            />
          </span>
          <span className={labelClassName(!disabled)}>{action.label}</span>
        </>
      );
    }

    if (action.key === 'back' && BackIcon) {
      return (
        <>
          <BackIcon className={iconClassName(!disabled)} aria-hidden="true" />
          <span className={labelClassName(!disabled)}>{action.label}</span>
        </>
      );
    }

    return <span className={labelClassName(!disabled)}>{action.label}</span>;
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[375px] border-t border-[#e8e8ed] bg-white pb-[env(safe-area-inset-bottom,0px)] pt-2"
      role="toolbar"
      dir="rtl"
    >
      <div className="flex w-full items-center justify-between px-9 pb-2">
        {actions.map((action) => {
          const disabled = Boolean(action.disabled || isSpeaking);
          return (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              disabled={disabled}
              aria-label={action.label}
              className={actionButtonClassName}
            >
              {renderActionVisual(action, disabled)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
