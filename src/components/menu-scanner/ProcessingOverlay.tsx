import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, ScanSearch, Sparkles, Palette, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProcessingOverlayProps {
  isProcessing: boolean;
  onCancel: () => void;
}

const steps = [
  { key: 'analyzing', icon: ScanSearch, delay: 0 },
  { key: 'identifying', icon: Sparkles, delay: 2000 },
  { key: 'generating', icon: Palette, delay: 4000 },
  { key: 'applying', icon: CheckCircle, delay: 6000 },
];

export function ProcessingOverlay({ isProcessing, onCancel }: ProcessingOverlayProps) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const isRtl = language === 'he' || language === 'ar';

  const texts: Record<string, Record<string, string>> = {
    he: {
      analyzing: 'מנתח את התפריט...',
      identifying: 'מזהה פריטים...',
      generating: 'יוצר סמלים...',
      applying: 'מחיל סטנדרטים של AAC...',
      cancel: 'ביטול',
    },
    en: {
      analyzing: 'Analyzing menu...',
      identifying: 'Identifying items...',
      generating: 'Generating symbols...',
      applying: 'Applying AAC standards...',
      cancel: 'Cancel',
    },
    ar: {
      analyzing: 'تحليل القائمة...',
      identifying: 'تحديد العناصر...',
      generating: 'إنشاء الرموز...',
      applying: 'تطبيق معايير AAC...',
      cancel: 'إلغاء',
    },
    ru: {
      analyzing: 'Анализ меню...',
      identifying: 'Определение элементов...',
      generating: 'Генерация символов...',
      applying: 'Применение стандартов AAC...',
      cancel: 'Отмена',
    },
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="text-center space-y-8 p-8 max-w-md">
        {/* Main spinner */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep >= index;
            const isCurrent = currentStep === index;

            return (
              <div
                key={step.key}
                className={cn(
                  "flex items-center gap-3 justify-center transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-30"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                  isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <StepIcon className={cn("h-4 w-4", isCurrent && "animate-pulse")} />
                </div>
                <span className={cn(
                  "text-lg font-medium transition-colors",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {t[step.key]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cancel button */}
        <Button variant="outline" onClick={onCancel} className="mt-4">
          {t.cancel}
        </Button>
      </div>
    </div>
  );
}
