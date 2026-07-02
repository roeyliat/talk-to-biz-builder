import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Keyboard, WandSparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualMenuModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (menuText: string) => void;
  businessName?: string;
}

export function ManualMenuModal({ open, onClose, onSubmit, businessName }: ManualMenuModalProps) {
  const { language } = useLanguage();
  const [menuText, setMenuText] = useState('');

  const isRtl = language === 'he' || language === 'ar';

  const texts = {
    he: {
      title: 'הקלדת תפריט ידנית',
      instruction: 'הזינו את התפריט בשורות. אפשר להוסיף כותרת קטגוריה ואז פריטים מתחתיה.',
      placeholder: 'קטגוריה: שתייה\nקפה\nתה\nשוקו\n\nקטגוריה: קינוחים\nגלידה\nעוגת שוקולד\nוופל בלגי',
      helper: 'אפשר גם לכתוב שורה בצורה: פריט | English name | ☕',
      businessName: 'שם הלוח:',
      create: 'צור לוח מהתפריט',
      cancel: 'ביטול',
      exampleTitle: 'דוגמה מהירה',
    },
    en: {
      title: 'Type Menu Manually',
      instruction: 'Enter the menu line by line. You can add a category heading and then items below it.',
      placeholder: 'Category: Drinks\nCoffee\nTea\nHot Chocolate\n\nCategory: Desserts\nIce Cream\nChocolate Cake\nBelgian Waffle',
      helper: 'You can also write a line as: Item | English name | ☕',
      businessName: 'Board name:',
      create: 'Create Board from Menu',
      cancel: 'Cancel',
      exampleTitle: 'Quick example',
    },
    ar: {
      title: 'إدخال القائمة يدويًا',
      instruction: 'أدخل القائمة سطرًا بسطر. يمكنك إضافة عنوان فئة ثم العناصر تحته.',
      placeholder: 'فئة: مشروبات\nقهوة\nشاي\nشوكولاتة ساخنة\n\nفئة: حلويات\nآيس كريم\nكيكة شوكولاتة\nوافل بلجيكي',
      helper: 'يمكنك أيضًا كتابة السطر هكذا: العنصر | الاسم الإنجليزي | ☕',
      businessName: 'اسم اللوحة:',
      create: 'إنشاء لوحة من القائمة',
      cancel: 'إلغاء',
      exampleTitle: 'مثال سريع',
    },
    ru: {
      title: 'Ввести меню вручную',
      instruction: 'Введите меню построчно. Можно добавить заголовок категории, а затем элементы ниже.',
      placeholder: 'Категория: Напитки\nКофе\nЧай\nГорячий шоколад\n\nКатегория: Десерты\nМороженое\nШоколадный торт\nБельгийская вафля',
      helper: 'Можно также писать строку так: Item | English name | ☕',
      businessName: 'Название доски:',
      create: 'Создать доску из меню',
      cancel: 'Отмена',
      exampleTitle: 'Быстрый пример',
    },
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    if (!open) {
      setMenuText('');
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!menuText.trim()) {
      return;
    }

    onSubmit(menuText.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Keyboard className="h-5 w-5" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">{t.instruction}</p>

          {businessName && (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{t.businessName}</span>{' '}
              <span className="text-muted-foreground">{businessName}</span>
            </div>
          )}

          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <WandSparkles className="h-4 w-4 text-primary" />
              {t.exampleTitle}
            </div>
            <pre className={cn('whitespace-pre-wrap text-xs text-muted-foreground', isRtl && 'text-right')}>
              {t.placeholder}
            </pre>
          </div>

          <div className="space-y-2">
            <Textarea
              value={menuText}
              onChange={(event) => setMenuText(event.target.value)}
              placeholder={t.placeholder}
              className={cn('min-h-[260px] text-sm', isRtl && 'text-right')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <p className="text-xs text-muted-foreground">{t.helper}</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" className="flex-1" disabled={!menuText.trim()}>
              {t.create}
            </Button>
          </div>

          <ModalFooter />
        </form>
      </DialogContent>
    </Dialog>
  );
}
