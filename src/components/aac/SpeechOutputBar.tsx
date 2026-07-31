import { useContext } from 'react';
import { Trash2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SentenceSpeechContext } from './CoreActionsBar';

interface SpeechOutputBarProps {
  summary: string;
  doneLabel: string;
  hasSelection: boolean;
  onDone: () => void;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

export function SpeechOutputBar({
  summary,
  doneLabel,
  hasSelection,
  onDone,
  onClear,
  clearLabel,
  className,
}: SpeechOutputBarProps) {
  const sentenceSpeech = useContext(SentenceSpeechContext);
  const canSpeak = sentenceSpeech?.canSpeak ?? hasSelection;
  const isSpeaking = Boolean(sentenceSpeech?.isSpeaking);
  const isListeningMode = Boolean(sentenceSpeech?.isListeningMode);
  const speakFullSentence = () => {
    if (sentenceSpeech?.speakSentence) {
      sentenceSpeech.speakSentence();
      return;
    }
    onDone();
  };

  return (
    <div
      className={cn(
        'relative mx-auto flex min-h-[68px] w-full max-w-[375px] flex-col rounded-[18px] bg-[#f2f2f7] px-4 py-3',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-h-0 w-full flex-1 items-center rounded-[12px] bg-white py-[10px] ps-[60px] text-start text-sm font-medium leading-snug text-[#1c1b1f]',
          onClear ? 'pe-[52px]' : 'pe-4',
          isListeningMode && 'opacity-60',
        )}
        aria-live="polite"
        aria-disabled={isListeningMode}
      >
        <span className="min-w-0 flex-1 whitespace-normal break-words">
          {canSpeak || hasSelection ? summary : ''}
        </span>
      </div>

      <button
        type="button"
        onClick={canSpeak ? speakFullSentence : undefined}
        disabled={!canSpeak || isSpeaking}
        className={cn(
          'absolute top-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isListeningMode ? 'bg-[#22c55e] ring-2 ring-[#22c55e]/40 ring-offset-2' : 'bg-[#294f83]',
          'start-4 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
        )}
        aria-label={doneLabel}
        aria-disabled={!canSpeak || isSpeaking}
        aria-pressed={isListeningMode}
      >
        {isListeningMode ? (
          <VolumeX className="h-6 w-6 animate-pulse" aria-hidden="true" />
        ) : canSpeak ? (
          <Volume2 className={cn('h-6 w-6', isSpeaking && 'animate-pulse')} aria-hidden="true" />
        ) : (
          <VolumeX className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {onClear && hasSelection && (
        <button
          type="button"
          onClick={onClear}
          className={cn(
            'absolute top-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#8e8e93] shadow-sm ring-1 ring-inset ring-[#d9d9e0] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'end-4 hover:scale-105',
          )}
          aria-label={clearLabel}
        >
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
