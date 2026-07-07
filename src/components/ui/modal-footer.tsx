import { forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ModalFooter = forwardRef<HTMLDivElement>((_, ref) => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const texts: Record<string, string> = {
    he: 'כל הזכויות שמורות',
    en: 'All rights reserved',
    ar: 'جميع الحقوق محفوظة',
    ru: 'Все права защищены',
  };

  return (
    <div ref={ref} className="pt-4 mt-4 border-t border-border/50">
      <p className="text-xs text-center text-muted-foreground">
        © {currentYear} TalktobiZ. {texts[language] || texts.en}
      </p>
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';
