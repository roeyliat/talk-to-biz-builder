import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeechOutputBarProps {
  selectionSummary: string;
  language: string;
  selectedWordsCount: number;
  hidden?: boolean;
  onClearSelection?: () => void;
  onSpeakSelection: () => void;
  onRunSpokenAction: (label: string, action: () => void) => void;
}

export function SpeechOutputBar({
  selectionSummary,
  language,
  selectedWordsCount,
  hidden = false,
  onClearSelection,
  onSpeakSelection,
  onRunSpokenAction,
}: SpeechOutputBarProps) {
  if (hidden) {
    return null;
  }

  return (
    <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_220px]">
      <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-[16px] border-[3px] border-[#c9b4e8] bg-[linear-gradient(180deg,#f3ebff_0%,#e9ddff_100%)] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]">
        <span className="text-base font-bold text-slate-700 md:text-lg">
          {selectionSummary}
        </span>
        <span className="text-2xl" aria-hidden="true">{selectedWordsCount > 0 ? '💬' : '❔'}</span>
      </div>
      <button
        type="button"
        onClick={selectedWordsCount > 0
          ? () => onRunSpokenAction(
            language === 'he' ? 'סיימתי לבחור' : 'Done choosing',
            onSpeakSelection,
          )
          : undefined}
        className="flex min-h-[72px] items-center justify-center gap-2 rounded-[16px] border-[3px] border-[#c9b4e8] bg-[linear-gradient(180deg,#f3ebff_0%,#e9ddff_100%)] px-4 text-base font-extrabold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
      >
        <Check className="h-6 w-6 text-emerald-600" />
        {language === 'he' ? 'סיימתי לבחור' : 'Done choosing'}
      </button>
    </div>
  );
}

interface IceCreamSpeechOutputBarProps {
  language: string;
  selectedWordsCount: number;
  variant?: 'standard' | 'ice-cream-panel';
  onClearSelection: () => void;
  onSpeakSelection: () => void;
  onRunSpokenAction: (label: string, action: () => void) => void;
}

export function IceCreamSpeechOutputBar({
  language,
  selectedWordsCount,
  variant = 'standard',
  onClearSelection,
  onSpeakSelection,
  onRunSpokenAction,
}: IceCreamSpeechOutputBarProps) {
  const isPanelVariant = variant === 'ice-cream-panel';

  return (
    <div className={cn(
      'grid gap-2.5',
      isPanelVariant ? 'md:grid-cols-[1fr_1.45fr]' : 'mt-3 md:grid-cols-[1fr_1.45fr]',
    )}>
      <button
        type="button"
        onClick={() => onRunSpokenAction(
          language === 'he' ? 'טעם אחר' : 'Another flavor',
          onClearSelection,
        )}
        className={cn(
          'flex items-center justify-center gap-3 rounded-[12px] border-[2.5px] px-4 font-bold text-slate-800',
          isPanelVariant
            ? 'min-h-[62px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] text-xl'
            : 'min-h-[60px] border-[#bba6de] bg-[linear-gradient(180deg,#efe4ff_0%,#dccbf7_100%)] text-lg',
        )}
      >
        <span>{language === 'he' ? 'טעם אחר' : 'Another flavor'}</span>
        <span className={cn('aria-hidden', isPanelVariant ? 'text-3xl' : 'text-2xl')} aria-hidden="true">❔</span>
      </button>
      <button
        type="button"
        onClick={selectedWordsCount > 0
          ? () => onRunSpokenAction(
            language === 'he' ? 'סיימתי לבחור' : 'Done choosing',
            onSpeakSelection,
          )
          : undefined}
        className={cn(
          'flex items-center justify-center gap-3 rounded-[12px] border-[2.5px] px-4 font-extrabold text-slate-800',
          isPanelVariant
            ? 'min-h-[62px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] text-xl'
            : 'min-h-[60px] border-[#bba6de] bg-[linear-gradient(180deg,#efe4ff_0%,#dccbf7_100%)] text-lg',
        )}
      >
        <span>{language === 'he' ? 'סיימתי לבחור' : 'Done choosing'}</span>
        <Check className={cn(isPanelVariant ? 'h-8 w-8' : 'h-8 w-8', 'text-emerald-600')} />
      </button>
    </div>
  );
}
