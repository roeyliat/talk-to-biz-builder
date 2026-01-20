import { useCallback, useEffect } from 'react';
import { AACCell } from '@/types/aac';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Button } from '@/components/ui/button';
import { X, Volume2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerModeOverlayProps {
  cell: AACCell | null;
  onClose: () => void;
}

export function CustomerModeOverlay({ cell, onClose }: CustomerModeOverlayProps) {
  const { language } = useLanguage();
  const { speak, isSpeaking, isSupported } = useTextToSpeech();

  const displayText = cell 
    ? (language === 'he' || language === 'ar' ? cell.text : cell.textEn)
    : '';

  // Auto-speak when cell is selected
  useEffect(() => {
    if (cell && isSupported) {
      speak(displayText);
    }
  }, [cell, displayText, speak, isSupported]);

  const handleRepeat = useCallback(() => {
    if (displayText) {
      speak(displayText);
    }
  }, [displayText, speak]);

  if (!cell) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col items-center justify-center gap-6 p-8 md:p-12 max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="secondary"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 h-12 w-12 rounded-full shadow-lg z-10"
          aria-label={language === 'he' ? 'סגור' : 'Close'}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Main Card - Enlarged Display */}
        <div 
          className={cn(
            'flex flex-col items-center justify-center gap-6 p-8 md:p-12 rounded-3xl shadow-2xl w-full',
            'bg-gradient-to-br from-card via-card to-card/95 border-4',
            'transition-all duration-300',
            cell.category === 'people' && 'border-[hsl(var(--fitzgerald-yellow))]',
            cell.category === 'verbs' && 'border-[hsl(var(--fitzgerald-green))]',
            cell.category === 'descriptors' && 'border-[hsl(var(--fitzgerald-blue))]',
            cell.category === 'social' && 'border-[hsl(var(--fitzgerald-pink))]',
            // Speaking animation
            isSpeaking && 'ring-4 ring-primary/50 animate-pulse shadow-primary/20 shadow-xl',
          )}
        >
          {/* Dual Visual Representation */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
            {/* Primary Visual: Icon/Symbol */}
            <div className="flex items-center justify-center h-40 w-40 md:h-56 md:w-56 rounded-2xl bg-muted/30">
              {cell.icon ? (
                <span className="text-8xl md:text-9xl">{cell.icon}</span>
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted" />
              )}
            </div>

            {/* Secondary Visual: Custom Image (if exists) */}
            {cell.imageUrl && (
              <div className="flex items-center justify-center h-40 w-40 md:h-56 md:w-56 rounded-2xl bg-muted/30 overflow-hidden">
                <img 
                  src={cell.imageUrl} 
                  alt={displayText}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Text Label - Large and Clear */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-center leading-tight">
            {displayText}
          </h1>
        </div>

        {/* Repeat Button */}
        {isSupported && (
          <Button
            size="lg"
            onClick={handleRepeat}
            disabled={isSpeaking}
            className="gap-3 h-16 px-8 text-xl rounded-full shadow-lg"
          >
            {isSpeaking ? (
              <>
                <Volume2 className="h-6 w-6 animate-pulse" />
                {language === 'he' ? 'מדבר...' : 'Speaking...'}
              </>
            ) : (
              <>
                <RefreshCw className="h-6 w-6" />
                {language === 'he' ? 'חזור שוב' : 'Repeat'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
