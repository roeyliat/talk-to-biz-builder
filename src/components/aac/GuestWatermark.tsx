import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuestWatermarkProps {
  className?: string;
}

export function GuestWatermark({ className }: GuestWatermarkProps) {
  const { language } = useLanguage();
  
  return (
    <div 
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none',
        className
      )}
    >
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg">
        <p className="text-sm text-muted-foreground font-medium">
          {language === 'he' ? 'נוצר עם' : 'Created with'}{' '}
          <span className="text-primary font-bold">TalkToBiz</span>
          {' '}
          <span className="text-xs opacity-70">
            {language === 'he' ? '(גרסת התנסות - אימוג׳ים בלבד)' : '(Trial - Emojis Only)'}
          </span>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1 text-center">
          {language === 'he' 
            ? 'הירשם לקבלת תמונות ARASAAC מקצועיות' 
            : 'Sign up for professional ARASAAC images'}
        </p>
      </div>
    </div>
  );
}