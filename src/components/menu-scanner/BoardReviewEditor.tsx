import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';
import { selectAacCategory } from '@/lib/aacColorSelection';
import { cn } from '@/lib/utils';
import { Trash2, Plus, Edit2, Check, X, Save, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArasaacPicker } from '@/components/aac/ArasaacPicker';
import { useResolvedAacImage } from '@/hooks/useResolvedAacImage';

interface BoardReviewEditorProps {
  boards: Record<string, AACBoard>;
  onSave: (boards: Record<string, AACBoard>) => void;
  onPreview: (boards: Record<string, AACBoard>) => void;
  onBack: () => void;
}

const fitzgeraldColors: Record<FitzgeraldCategory, string> = {
  people: 'bg-yellow-100 border-yellow-400 text-yellow-900',
  verbs: 'bg-green-100 border-green-400 text-green-900',
  descriptors: 'bg-pink-100 border-pink-400 text-pink-900',
  questions: 'bg-blue-100 border-blue-400 text-blue-900',
  social: 'bg-white border-slate-300 text-slate-900',
};

export function BoardReviewEditor({ boards, onSave, onPreview, onBack }: BoardReviewEditorProps) {
  const { language } = useLanguage();
  const [editableBoards, setEditableBoards] = useState<Record<string, AACBoard>>({ ...boards });
  const [editingCell, setEditingCell] = useState<{ boardId: string; cellId: string } | null>(null);
  const [editForm, setEditForm] = useState<{ text: string; textEn: string; icon: string; imageUrl?: string; category: FitzgeraldCategory }>({
    text: '',
    textEn: '',
    icon: '',
    imageUrl: undefined,
    category: 'people',
  });

  const isRtl = language === 'he' || language === 'ar';

  const texts: Record<string, Record<string, string>> = {
    he: {
      title: 'סקירה ועריכה',
      subtitle: 'עיברו על הלוח שנוצר ובצעו שינויים לפי הצורך',
      save: 'שמור לוח',
      preview: 'תצוגה מקדימה',
      back: 'חזרה',
      addTile: 'הוסף כרטיסיה',
      mainBoard: 'לוח ראשי',
      people: 'אנשים/עצמים',
      verbs: 'פעולות',
      descriptors: 'תיאורים',
      questions: 'שאלות',
      social: 'תקשורת',
    },
    en: {
      title: 'Review & Edit',
      subtitle: 'Review the generated board and make changes as needed',
      save: 'Save Board',
      preview: 'Preview',
      back: 'Back',
      addTile: 'Add Tile',
      mainBoard: 'Main Board',
      people: 'People/Nouns',
      verbs: 'Actions',
      descriptors: 'Descriptors',
      questions: 'Questions',
      social: 'Communication',
    },
    ar: {
      title: 'مراجعة وتحرير',
      subtitle: 'راجع اللوحة المنشأة وأجر التغييرات حسب الحاجة',
      save: 'حفظ اللوحة',
      preview: 'معاينة',
      back: 'رجوع',
      addTile: 'إضافة بطاقة',
      mainBoard: 'اللوحة الرئيسية',
      people: 'أشخاص/أسماء',
      verbs: 'أفعال',
      descriptors: 'صفات',
      questions: 'أسئلة',
      social: 'تواصل',
    },
    ru: {
      title: 'Обзор и редактирование',
      subtitle: 'Просмотрите созданную доску и внесите изменения при необходимости',
      save: 'Сохранить доску',
      preview: 'Предпросмотр',
      back: 'Назад',
      addTile: 'Добавить плитку',
      mainBoard: 'Главная доска',
      people: 'Люди/Существительные',
      verbs: 'Действия',
      descriptors: 'Описания',
      questions: 'Вопросы',
      social: 'Коммуникация',
    },
  };

  const t = texts[language] || texts.en;

  const handleDeleteCell = (boardId: string, cellId: string) => {
    setEditableBoards(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        cells: prev[boardId].cells.filter(c => c.id !== cellId),
      },
    }));
  };

  const handleStartEdit = (boardId: string, cell: AACCell) => {
    setEditingCell({ boardId, cellId: cell.id });
    setEditForm({
      text: cell.text,
      textEn: cell.textEn,
      icon: cell.icon || '',
      imageUrl: cell.imageUrl,
      category: cell.category,
    });
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    const category = selectAacCategory(editForm.text);

    setEditableBoards(prev => ({
      ...prev,
      [editingCell.boardId]: {
        ...prev[editingCell.boardId],
        cells: prev[editingCell.boardId].cells.map(c =>
          c.id === editingCell.cellId
            ? { ...c, text: editForm.text, textEn: editForm.textEn, icon: editForm.icon, imageUrl: editForm.imageUrl, category }
            : c
        ),
      },
    }));
    setEditingCell(null);
  };

  const handleAddCell = (boardId: string) => {
    const text = language === 'he' ? 'פריט חדש' : 'New Item';
    const newCell: AACCell = {
      id: `new-${Date.now()}`,
      text,
      textEn: 'New Item',
      category: selectAacCategory(text),
      icon: '➕',
    };

    setEditableBoards(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        cells: [...prev[boardId].cells, newCell],
      },
    }));
  };

  const boardEntries = Object.entries(editableBoards);
  const mainBoard = boardEntries.find(([id]) => id === 'main') || boardEntries[0];
  const subBoards = boardEntries.filter(([id]) => id !== 'main' && id !== mainBoard?.[0]);

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              {t.back}
            </Button>
            <Button variant="outline" onClick={() => onPreview(editableBoards)} className="gap-2">
              <Eye className="h-4 w-4" />
              {t.preview}
            </Button>
            <Button onClick={() => onSave(editableBoards)} className="gap-2">
              <Save className="h-4 w-4" />
              {t.save}
            </Button>
          </div>
        </div>

        {/* Main Board */}
        {mainBoard && (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {language === 'he' ? mainBoard[1].name : mainBoard[1].nameEn}
              </h2>
              <Button variant="outline" size="sm" onClick={() => handleAddCell(mainBoard[0])} className="gap-2">
                <Plus className="h-4 w-4" />
                {t.addTile}
              </Button>
            </div>
            
            <div className={cn(
              "grid gap-3",
              `grid-cols-${Math.min(mainBoard[1].gridSize.cols, 4)} md:grid-cols-${mainBoard[1].gridSize.cols}`
            )} style={{ gridTemplateColumns: `repeat(${Math.min(mainBoard[1].gridSize.cols, 6)}, minmax(0, 1fr))` }}>
              {mainBoard[1].cells.map(cell => (
                <CellCard
                  key={cell.id}
                  cell={cell}
                  isEditing={editingCell?.cellId === cell.id}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onEdit={() => handleStartEdit(mainBoard[0], cell)}
                  onDelete={() => handleDeleteCell(mainBoard[0], cell.id)}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingCell(null)}
                  language={language}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sub Boards */}
        {subBoards.map(([boardId, board]) => (
          <div key={boardId} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {language === 'he' ? board.name : board.nameEn}
              </h2>
              <Button variant="outline" size="sm" onClick={() => handleAddCell(boardId)} className="gap-2">
                <Plus className="h-4 w-4" />
                {t.addTile}
              </Button>
            </div>
            
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(board.gridSize.cols, 6)}, minmax(0, 1fr))` }}>
              {board.cells.map(cell => (
                <CellCard
                  key={cell.id}
                  cell={cell}
                  isEditing={editingCell?.cellId === cell.id}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onEdit={() => handleStartEdit(boardId, cell)}
                  onDelete={() => handleDeleteCell(boardId, cell.id)}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingCell(null)}
                  language={language}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CellCardProps {
  cell: AACCell;
  isEditing: boolean;
  editForm: { text: string; textEn: string; icon: string; imageUrl?: string; category: FitzgeraldCategory };
  setEditForm: React.Dispatch<React.SetStateAction<{ text: string; textEn: string; icon: string; imageUrl?: string; category: FitzgeraldCategory }>>;
  onEdit: () => void;
  onDelete: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  language: string;
  t: Record<string, string>;
}

function CellCard({
  cell,
  isEditing,
  editForm,
  setEditForm,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  language,
  t,
}: CellCardProps) {
  const resolvedImageUrl = useResolvedAacImage({
    text: cell.text,
    imageUrl: cell.imageUrl,
    fallbackTerms: [cell.textEn],
  });

  if (isEditing) {
    return (
      <div className="p-3 rounded-xl border-2 border-primary bg-card space-y-2">
        <Input
          value={editForm.text}
          onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
          placeholder="עברית"
          className="text-sm"
        />
        <Input
          value={editForm.textEn}
          onChange={(e) => setEditForm(prev => ({ ...prev, textEn: e.target.value }))}
          placeholder="English"
          className="text-sm"
        />
        <Input
          value={editForm.icon}
          onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
          placeholder="🍕"
          className="text-sm text-center"
        />
        <div className="flex justify-center">
          <ArasaacPicker
            imageUrl={editForm.imageUrl}
            icon={editForm.icon}
            seedQuery={editForm.textEn || editForm.text}
            onSelect={(url) => setEditForm(prev => ({ ...prev, imageUrl: url }))}
            onClear={() => setEditForm(prev => ({ ...prev, imageUrl: undefined }))}
          />
        </div>
        <Select
          value={editForm.category}
          onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value as FitzgeraldCategory }))}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="people">{t.people}</SelectItem>
            <SelectItem value="verbs">{t.verbs}</SelectItem>
            <SelectItem value="descriptors">{t.descriptors}</SelectItem>
            <SelectItem value="questions">{t.questions}</SelectItem>
            <SelectItem value="social">{t.social}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={onSaveEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={onCancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative group p-3 rounded-xl border-2 transition-all hover:shadow-md",
      fitzgeraldColors[cell.category]
    )}>
      <div className="text-center">
        {resolvedImageUrl ? (
          <img src={resolvedImageUrl} alt="" className="h-10 w-10 mx-auto mb-1 object-contain" />
        ) : (
          <div className="text-2xl mb-1">{cell.icon}</div>
        )}
        <div className="text-sm font-medium truncate">
          {language === 'he' || language === 'ar' ? cell.text : cell.textEn}
        </div>
      </div>
      
      {/* Edit/Delete buttons */}
      <div className="absolute -top-2 -end-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6"
          onClick={onEdit}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
