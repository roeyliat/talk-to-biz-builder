import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyboardTextEntryProps {
  open: boolean;
  language: string;
  onClose: () => void;
  /** Called with trimmed non-empty text only. Must not speak. */
  onSubmit: (text: string) => void;
}

/**
 * Focused native text field so the device keyboard opens.
 * Done / Enter appends via onSubmit; empty submit is a no-op.
 */
export function KeyboardTextEntry({
  open,
  language,
  onClose,
  onSubmit,
}: KeyboardTextEntryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const isRtl = language === 'he' || language === 'ar';
  const doneLabel = language === 'he' ? 'סיום' : language === 'ar' ? 'تم' : 'Done';
  const placeholder =
    language === 'he' ? 'הקלידו כאן…' : language === 'ar' ? 'اكتب هنا…' : 'Type here…';

  useEffect(() => {
    if (!open) return;

    setValue('');

    // Autofocus so the OS keyboard appears (mobile browsers need a short delay).
    const focusInput = () => {
      inputRef.current?.focus({ preventScroll: false });
    };
    const rafId = window.requestAnimationFrame(focusInput);
    const timeoutId = window.setTimeout(focusInput, 50);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/35 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'he' ? 'מקלדת' : 'Keyboard'}
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full max-w-[375px] rounded-t-[18px] bg-white p-4 shadow-lg sm:rounded-[18px]',
          'pb-[max(1rem,env(safe-area-inset-bottom))]',
        )}
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={language === 'he' ? 'he' : language}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-[#1c1b1f]">
            {language === 'he' ? 'מקלדת' : 'Keyboard'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#8e8e93] ring-1 ring-inset ring-[#d9d9e0] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={language === 'he' ? 'סגור' : 'Close'}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSubmit();
            }
          }}
          enterKeyHint="done"
          inputMode="text"
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck
          dir={isRtl ? 'rtl' : 'ltr'}
          lang={language === 'he' ? 'he' : language}
          placeholder={placeholder}
          className="mb-3 w-full rounded-[12px] border border-[#d9d9e0] bg-[#f2f2f7] px-4 py-3 text-base font-medium text-[#1c1b1f] outline-none focus:border-[#294f83] focus:ring-2 focus:ring-[#294f83]/25"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="flex h-11 w-full items-center justify-center rounded-full bg-[#294f83] text-base font-semibold text-white shadow-sm transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.99]"
        >
          {doneLabel}
        </button>
      </div>
    </div>
  );
}
