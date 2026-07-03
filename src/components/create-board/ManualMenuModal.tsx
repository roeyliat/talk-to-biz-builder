import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Keyboard, Loader2, WandSparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ManualMenuModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (menuText: string) => void;
  businessName?: string;
  openPdfPickerOnOpen?: boolean;
}

export function ManualMenuModal({ open, onClose, onSubmit, businessName, openPdfPickerOnOpen = false }: ManualMenuModalProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [menuText, setMenuText] = useState('');
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const hasAutoOpenedPdfRef = useRef(false);

  const isRtl = language === 'he' || language === 'ar';

  const texts = {
    he: {
      title: 'הקלדת תפריט ידנית',
      instruction: 'הזינו את התפריט בשורות. אפשר להוסיף כותרת קטגוריה ואז פריטים מתחתיה.',
      placeholder: 'קטגוריה: שתייה\nקפה\nתה\nשוקו\n\nקטגוריה: קינוחים\nגלידה\nעוגת שוקולד\nוופל בלגי',
      helper: 'אפשר גם לכתוב שורה בצורה: פריט | English name | ☕',
      pdf: 'העלו PDF',
      pdfLoading: 'קורא PDF...',
      pdfHelper: 'אפשר להעלות PDF של תפריט, והטקסט יתווסף לאזור העריכה לבדיקה ותיקון.',
      pdfEmpty: 'לא נמצא טקסט קריא ב-PDF',
      pdfError: 'לא הצלחתי לקרוא את קובץ ה-PDF',
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
      pdf: 'Upload PDF',
      pdfLoading: 'Reading PDF...',
      pdfHelper: 'You can upload a menu PDF and its text will be added to the editor for review and cleanup.',
      pdfEmpty: 'No readable text was found in the PDF',
      pdfError: 'Failed to read the PDF file',
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
      pdf: 'تحميل PDF',
      pdfLoading: 'جارٍ قراءة PDF...',
      pdfHelper: 'يمكنك تحميل ملف PDF للقائمة وسيتم إضافة النص إلى منطقة التحرير للمراجعة والتعديل.',
      pdfEmpty: 'لم يتم العثور على نص قابل للقراءة داخل PDF',
      pdfError: 'تعذر قراءة ملف PDF',
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
      pdf: 'Загрузить PDF',
      pdfLoading: 'Чтение PDF...',
      pdfHelper: 'Можно загрузить PDF меню, и его текст будет добавлен в редактор для проверки и правки.',
      pdfEmpty: 'В PDF не найден читаемый текст',
      pdfError: 'Не удалось прочитать PDF-файл',
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
      setIsExtractingPdf(false);
      hasAutoOpenedPdfRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open || !openPdfPickerOnOpen || hasAutoOpenedPdfRef.current) {
      return;
    }

    hasAutoOpenedPdfRef.current = true;
    const timeoutId = window.setTimeout(() => {
      pdfInputRef.current?.click();
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [open, openPdfPickerOnOpen]);

  const extractTextFromPdf = async (file: File) => {
    const pdfjs = await import('pdfjs-dist');

    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    }

    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const groupedLines = new Map<number, Array<{ x: number; text: string }>>();

      textContent.items.forEach((item) => {
        if (!('str' in item) || !Array.isArray(item.transform)) {
          return;
        }

        const text = item.str.trim();
        if (!text) {
          return;
        }

        const y = Math.round(item.transform[5]);
        const existingKey = Array.from(groupedLines.keys()).find((key) => Math.abs(key - y) <= 3) ?? y;
        const currentLine = groupedLines.get(existingKey) ?? [];
        currentLine.push({ x: item.transform[4], text });
        groupedLines.set(existingKey, currentLine);
      });

      const lines = Array.from(groupedLines.entries())
        .sort((first, second) => second[0] - first[0])
        .map(([, lineItems]) =>
          lineItems
            .sort((first, second) => first.x - second.x)
            .map((entry) => entry.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()
        )
        .filter(Boolean);

      if (lines.length > 0) {
        pages.push(lines.join('\n'));
      }
    }

    return pages.join('\n\n').trim();
  };

  const handlePdfChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsExtractingPdf(true);

    try {
      const extractedText = await extractTextFromPdf(file);

      if (!extractedText) {
        toast({
          title: t.pdfEmpty,
          description: t.pdfHelper,
          variant: 'destructive',
        });
        return;
      }

      setMenuText((currentText) => currentText.trim() ? `${currentText.trim()}\n\n${extractedText}` : extractedText);
      toast({
        title: t.pdf,
        description: t.pdfHelper,
      });
    } catch (error) {
      console.error('Failed to read PDF', error);
      toast({
        title: t.pdfError,
        description: t.pdfHelper,
        variant: 'destructive',
      });
    } finally {
      setIsExtractingPdf(false);
    }
  };

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
          <DialogDescription>{t.instruction}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">{t.helper}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isExtractingPdf}
              >
                {isExtractingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {isExtractingPdf ? t.pdfLoading : t.pdf}
              </Button>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handlePdfChange}
              />
            </div>
            <Textarea
              value={menuText}
              onChange={(event) => setMenuText(event.target.value)}
              placeholder={t.placeholder}
              className={cn('min-h-[260px] text-sm', isRtl && 'text-right')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <p className="text-xs text-muted-foreground">{t.pdfHelper}</p>
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
