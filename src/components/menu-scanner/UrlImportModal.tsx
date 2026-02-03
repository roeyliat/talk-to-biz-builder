import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UrlImportModalProps {
  open: boolean;
  onClose: () => void;
  onUrlSubmit: (url: string) => void;
  isProcessing?: boolean;
}

export function UrlImportModal({ open, onClose, onUrlSubmit, isProcessing }: UrlImportModalProps) {
  const { language } = useLanguage();
  const [url, setUrl] = useState('');

  const isRtl = language === 'he' || language === 'ar';

  const texts = {
    he: {
      title: 'ייבוא תפריט מכתובת אינטרנט',
      instruction: 'הזינו את כתובת האתר של התפריט. הבינה המלאכותית תסרוק את הדף ותחלץ את הפריטים.',
      placeholder: 'https://example.com/menu',
      import: 'ייבא תפריט',
      cancel: 'ביטול',
      processing: 'מעבד...',
      examples: 'דוגמאות: דף תפריט של מסעדה, אתר בית קפה, דף מוצרים',
    },
    en: {
      title: 'Import Menu from URL',
      instruction: 'Enter the website URL of the menu. Our AI will scan the page and extract items.',
      placeholder: 'https://example.com/menu',
      import: 'Import Menu',
      cancel: 'Cancel',
      processing: 'Processing...',
      examples: 'Examples: Restaurant menu page, cafe website, product page',
    },
    ar: {
      title: 'استيراد قائمة من رابط',
      instruction: 'أدخل رابط الموقع للقائمة. سيقوم الذكاء الاصطناعي بمسح الصفحة واستخراج العناصر.',
      placeholder: 'https://example.com/menu',
      import: 'استيراد القائمة',
      cancel: 'إلغاء',
      processing: 'جاري المعالجة...',
      examples: 'أمثلة: صفحة قائمة مطعم، موقع مقهى، صفحة منتجات',
    },
    ru: {
      title: 'Импорт меню по ссылке',
      instruction: 'Введите URL страницы с меню. ИИ просканирует страницу и извлечет элементы.',
      placeholder: 'https://example.com/menu',
      import: 'Импортировать меню',
      cancel: 'Отмена',
      processing: 'Обработка...',
      examples: 'Примеры: страница меню ресторана, сайт кафе, страница продуктов',
    },
  };

  const t = texts[language] || texts.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isProcessing) {
      onUrlSubmit(url.trim());
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setUrl('');
      onClose();
    }
  };

  const isValidUrl = (str: string) => {
    if (!str.trim()) return false;
    try {
      new URL(str.startsWith('http') ? str : `https://${str}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Link className="h-5 w-5" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-muted-foreground text-sm">{t.instruction}</p>

          <div className="space-y-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.placeholder}
              disabled={isProcessing}
              className={cn("text-base", isRtl && "text-right")}
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">{t.examples}</p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isProcessing}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={!isValidUrl(url) || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.processing}
                </>
              ) : (
                t.import
              )}
            </Button>
          </div>

          <ModalFooter />
        </form>
      </DialogContent>
    </Dialog>
  );
}
