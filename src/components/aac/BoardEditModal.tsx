import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACCell, FitzgeraldCategory } from '@/types/aac';
import { cn } from '@/lib/utils';
import { ArasaacPicker } from '@/components/aac/ArasaacPicker';

interface BoardEditModalProps {
  open: boolean;
  onClose: () => void;
  onAddCell: (cell: Omit<AACCell, 'id'>) => void;
  editingCell?: AACCell | null;
  onUpdateCell?: (cell: AACCell) => void;
}

const categoryColors: Record<FitzgeraldCategory, { bg: string; label: string; labelEn: string }> = {
  people: { bg: 'bg-amber-400', label: 'שמות עצם / אנשים', labelEn: 'Nouns / People' },
  verbs: { bg: 'bg-emerald-500', label: 'פעלים', labelEn: 'Verbs' },
  descriptors: { bg: 'bg-sky-400', label: 'תארים', labelEn: 'Descriptors' },
  social: { bg: 'bg-pink-400', label: 'ביטויים חברתיים', labelEn: 'Social Phrases' },
};

const commonEmojis = ['😊', '👍', '❤️', '🙏', '👆', '🔍', '✨', '🔥', '❄️', '💧', '🍽️', '☕', '🥤', '🍦', '🍞', '🥐', '🍰', '💊', '🩹', '🧴'];

export function BoardEditModal({
  open,
  onClose,
  onAddCell,
  editingCell,
  onUpdateCell,
}: BoardEditModalProps) {
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';
  
  const [text, setText] = useState(editingCell?.text || '');
  const [textEn, setTextEn] = useState(editingCell?.textEn || '');
  const [icon, setIcon] = useState(editingCell?.icon || '😊');
  const [imageUrl, setImageUrl] = useState<string | undefined>(editingCell?.imageUrl);
  const [category, setCategory] = useState<FitzgeraldCategory>(editingCell?.category || 'people');

  const isEditing = !!editingCell;

  const texts = {
    he: {
      addTitle: 'הוספת פריט חדש',
      editTitle: 'עריכת פריט',
      textHe: 'טקסט בעברית',
      textEn: 'טקסט באנגלית',
      icon: 'אייקון',
      picto: 'סמל ARASAAC',
      category: 'קטגוריה (צבע)',
      add: 'הוסף',
      save: 'שמור',
      cancel: 'ביטול',
    },
    en: {
      addTitle: 'Add New Item',
      editTitle: 'Edit Item',
      textHe: 'Hebrew Text',
      textEn: 'English Text',
      icon: 'Icon',
      picto: 'ARASAAC pictogram',
      category: 'Category (Color)',
      add: 'Add',
      save: 'Save',
      cancel: 'Cancel',
    },
  };

  const t = texts[language === 'he' ? 'he' : 'en'];

  const handleSubmit = () => {
    if (!text.trim() || !textEn.trim()) return;

    if (isEditing && onUpdateCell && editingCell) {
      onUpdateCell({
        ...editingCell,
        text: text.trim(),
        textEn: textEn.trim(),
        icon,
        imageUrl,
        category,
      });
    } else {
      onAddCell({
        text: text.trim(),
        textEn: textEn.trim(),
        icon,
        imageUrl,
        category,
      });
    }

    // Reset and close
    setText('');
    setTextEn('');
    setIcon('😊');
    setImageUrl(undefined);
    setCategory('people');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{isEditing ? t.editTitle : t.addTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Hebrew Text */}
          <div className="space-y-2">
            <Label htmlFor="text-he">{t.textHe}</Label>
            <Input
              id="text-he"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="לדוגמה: קפה"
              dir="rtl"
            />
          </div>

          {/* English Text */}
          <div className="space-y-2">
            <Label htmlFor="text-en">{t.textEn}</Label>
            <Input
              id="text-en"
              value={textEn}
              onChange={(e) => setTextEn(e.target.value)}
              placeholder="e.g., Coffee"
              dir="ltr"
            />
          </div>

          {/* ARASAAC Pictogram */}
          <div className="space-y-2">
            <Label>{t.picto}</Label>
            <div className="flex items-center gap-2">
              <ArasaacPicker
                imageUrl={imageUrl}
                icon={icon}
                seedQuery={textEn || text}
                onSelect={(url) => setImageUrl(url)}
                onClear={() => setImageUrl(undefined)}
              />
              <span className="text-sm text-muted-foreground">
                {isRTL ? 'בחר סמל מ-ARASAAC (גובר על האימוג׳י)' : 'Pick a pictogram (overrides emoji)'}
              </span>
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>{t.icon}</Label>
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    'w-10 h-10 text-xl rounded-lg border-2 transition-all',
                    icon === emoji
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="או הקלד אימוג'י אחר"
              className="mt-2"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>{t.category}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(categoryColors) as [FitzgeraldCategory, typeof categoryColors.people][]).map(
                ([cat, { bg, label, labelEn }]) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-start',
                      category === cat
                        ? 'border-foreground ring-2 ring-foreground/20'
                        : 'border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn('w-4 h-4 rounded', bg)} />
                      <span className="text-sm font-medium">
                        {isRTL ? label : labelEn}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              {isRTL ? 'תצוגה מקדימה:' : 'Preview:'}
            </p>
            <div
              className={cn(
                'inline-flex flex-col items-center gap-2 p-3 rounded-xl text-white',
                categoryColors[category].bg
              )}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="" className="h-10 w-10 object-contain" />
              ) : (
                <span className="text-2xl">{icon}</span>
              )}
              <span className="font-medium">{isRTL ? text || '---' : textEn || '---'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button onClick={handleSubmit} disabled={!text.trim() || !textEn.trim()}>
              {isEditing ? t.save : t.add}
            </Button>
          </div>

          <ModalFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
}
