import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FitzgeraldCategory } from '@/types/aac';
import { selectAacCategory } from '@/lib/aacColorSelection';
import { cn } from '@/lib/utils';
import { Plus, Trash2, FolderOpen, ChevronDown, ChevronUp, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ArasaacPicker } from '@/components/aac/ArasaacPicker';

export interface MenuItem {
  id: string;
  text: string;
  textEn: string;
  icon: string;
  imageUrl?: string;
  category: FitzgeraldCategory;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  items: MenuItem[];
  isOpen?: boolean;
}

interface CategoryItemsEditorProps {
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  standaloneItems: MenuItem[];
  setStandaloneItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const fitzgeraldColors: Record<FitzgeraldCategory, { bg: string; border: string }> = {
  people: { bg: 'bg-yellow-100', border: 'border-yellow-400' },
  verbs: { bg: 'bg-green-100', border: 'border-green-400' },
  descriptors: { bg: 'bg-pink-100', border: 'border-pink-400' },
  questions: { bg: 'bg-blue-100', border: 'border-blue-400' },
  social: { bg: 'bg-white', border: 'border-slate-300' },
};

const commonEmojis = ['☕', '🍕', '🍔', '🥗', '🍦', '🧁', '🥐', '🍝', '🍜', '🥩', '🍰', '🍪', '💊', '🩹', '📦', '🛒'];

const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

export function CategoryItemsEditor({
  categories,
  setCategories,
  standaloneItems,
  setStandaloneItems,
}: CategoryItemsEditorProps) {
  const { language } = useLanguage();
  const isRtl = language === 'he' || language === 'ar';
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');

  const texts = {
    he: {
      addCategory: 'הוסף קטגוריה',
      addItem: 'הוסף פריט',
      categoryName: 'שם הקטגוריה (עברית)',
      categoryNameEn: 'שם הקטגוריה (אנגלית)',
      itemName: 'שם הפריט (עברית)',
      itemNameEn: 'שם הפריט (אנגלית)',
      icon: 'אייקון',
      delete: 'מחק',
      categoriesTitle: 'קטגוריות (לוחות משנה)',
      categoriesDesc: 'צור קטגוריות שיפתחו לוחות משנה עם פריטים',
      standaloneTitle: 'פריטים ראשיים',
      standaloneDesc: 'פריטים שיופיעו בלוח הראשי',
      emptyCategories: 'לחץ "הוסף קטגוריה" כדי ליצור לוח משנה',
      emptyItems: 'לחץ "הוסף פריט" כדי להוסיף פריט לקטגוריה',
      people: 'עצמים',
      verbs: 'פעולות',
      descriptors: 'תיאורים',
      questions: 'שאלות',
      social: 'תקשורת',
    },
    en: {
      addCategory: 'Add Category',
      addItem: 'Add Item',
      categoryName: 'Category Name (Hebrew)',
      categoryNameEn: 'Category Name (English)',
      itemName: 'Item Name (Hebrew)',
      itemNameEn: 'Item Name (English)',
      icon: 'Icon',
      delete: 'Delete',
      categoriesTitle: 'Categories (Sub-boards)',
      categoriesDesc: 'Create categories that open sub-boards with items',
      standaloneTitle: 'Main Items',
      standaloneDesc: 'Items that appear on the main board',
      emptyCategories: 'Click "Add Category" to create a sub-board',
      emptyItems: 'Click "Add Item" to add an item to this category',
      people: 'Nouns',
      verbs: 'Actions',
      descriptors: 'Descriptors',
      questions: 'Questions',
      social: 'Communication',
    },
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  // Add new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: MenuCategory = {
      id: generateId(),
      name: newCategoryName.trim(),
      nameEn: newCategoryNameEn.trim() || newCategoryName.trim(),
      icon: newCategoryIcon,
      items: [],
      isOpen: true,
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryNameEn('');
    setNewCategoryIcon('📁');
  };

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  // Toggle category open/closed
  const handleToggleCategory = (categoryId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, isOpen: !c.isOpen } : c
    ));
  };

  // Add item to category
  const handleAddItemToCategory = (categoryId: string) => {
    const defaultText = language === 'he' ? 'פריט חדש' : 'New Item';
    const newItem: MenuItem = {
      id: generateId(),
      text: defaultText,
      textEn: 'New Item',
      icon: '📦',
      category: selectAacCategory(defaultText),
    };
    
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, items: [...c.items, newItem] } : c
    ));
  };

  // Update item in category
  const handleUpdateCategoryItem = (categoryId: string, itemId: string, updates: Partial<MenuItem>) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? {
            ...c,
            items: c.items.map((item) => {
              if (item.id !== itemId) return item;
              const next = { ...item, ...updates };
              if (updates.text !== undefined) {
                next.category = selectAacCategory(updates.text);
              }
              return next;
            }),
          }
        : c
    ));
  };

  // Delete item from category
  const handleDeleteCategoryItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, items: c.items.filter(item => item.id !== itemId) } : c
    ));
  };

  // Add standalone item
  const handleAddStandaloneItem = () => {
    const defaultText = language === 'he' ? 'פריט חדש' : 'New Item';
    const newItem: MenuItem = {
      id: generateId(),
      text: defaultText,
      textEn: 'New Item',
      icon: '📦',
      category: selectAacCategory(defaultText),
    };
    setStandaloneItems([...standaloneItems, newItem]);
  };

  // Update standalone item
  const handleUpdateStandaloneItem = (itemId: string, updates: Partial<MenuItem>) => {
    setStandaloneItems(standaloneItems.map((item) => {
      if (item.id !== itemId) return item;
      const next = { ...item, ...updates };
      if (updates.text !== undefined) {
        next.category = selectAacCategory(updates.text);
      }
      return next;
    }));
  };

  // Delete standalone item
  const handleDeleteStandaloneItem = (itemId: string) => {
    setStandaloneItems(standaloneItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              {t.categoriesTitle}
            </h3>
            <p className="text-sm text-muted-foreground">{t.categoriesDesc}</p>
          </div>
        </div>

        {/* Add Category Form */}
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-xl border border-dashed border-border">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={t.categoryName}
            className="flex-1 min-w-[150px]"
          />
          <Input
            value={newCategoryNameEn}
            onChange={(e) => setNewCategoryNameEn(e.target.value)}
            placeholder={t.categoryNameEn}
            className="flex-1 min-w-[150px]"
          />
          <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
            <SelectTrigger className="w-20">
              <SelectValue>{newCategoryIcon}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="grid grid-cols-4 gap-1 p-1">
                {['📁', '🗂️', ...commonEmojis].map(emoji => (
                  <SelectItem key={emoji} value={emoji} className="flex items-center justify-center cursor-pointer">
                    <span className="text-xl">{emoji}</span>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.addCategory}
          </Button>
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
            <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>{t.emptyCategories}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <Collapsible
                key={category.id}
                open={category.isOpen}
                onOpenChange={() => handleToggleCategory(category.id)}
              >
                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 p-4 bg-primary/5">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        {category.isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <span className="text-2xl">{category.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-card-foreground truncate">
                        {isRtl ? category.name : category.nameEn}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.items.length} {language === 'he' ? 'פריטים' : 'items'}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Category Items */}
                  <CollapsibleContent>
                    <div className="p-4 border-t border-border/50 space-y-2">
                      {category.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">{t.emptyItems}</p>
                      ) : (
                        <div className="space-y-2">
                          {category.items.map((item) => (
                            <ItemRow
                              key={item.id}
                              item={item}
                              onUpdate={(updates) => handleUpdateCategoryItem(category.id, item.id, updates)}
                              onDelete={() => handleDeleteCategoryItem(category.id, item.id)}
                              t={t}
                            />
                          ))}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 mt-2"
                        onClick={() => handleAddItemToCategory(category.id)}
                      >
                        <Plus className="h-4 w-4" />
                        {t.addItem}
                      </Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </div>

      {/* Standalone Items Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {t.standaloneTitle}
            </h3>
            <p className="text-sm text-muted-foreground">{t.standaloneDesc}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddStandaloneItem} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.addItem}
          </Button>
        </div>

        {standaloneItems.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {language === 'he' ? 'אין פריטים ראשיים. הוסף פריטים או קטגוריות למעלה.' : 'No main items. Add items or categories above.'}
          </div>
        ) : (
          <div className="space-y-2">
            {standaloneItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={(updates) => handleUpdateStandaloneItem(item.id, updates)}
                onDelete={() => handleDeleteStandaloneItem(item.id)}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Item Row Component
interface ItemRowProps {
  item: MenuItem;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onDelete: () => void;
  t: Record<string, string>;
}

function ItemRow({ item, onUpdate, onDelete, t }: ItemRowProps) {
  return (
    <div className={cn(
      "flex flex-wrap items-center gap-2 p-2 rounded-lg border-2 transition-all",
      fitzgeraldColors[item.category].bg,
      fitzgeraldColors[item.category].border
    )}>
      <ArasaacPicker
        imageUrl={item.imageUrl}
        icon={item.icon}
        seedQuery={item.textEn || item.text}
        onSelect={(imageUrl) => onUpdate({ imageUrl })}
        onClear={() => onUpdate({ imageUrl: undefined })}
      />
      <Select value={item.icon} onValueChange={(icon) => onUpdate({ icon })}>
        <SelectTrigger className="w-14 h-10 bg-white/80">
          <SelectValue>{item.icon}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="grid grid-cols-4 gap-1 p-1">
            {commonEmojis.map(emoji => (
              <SelectItem key={emoji} value={emoji} className="flex items-center justify-center cursor-pointer">
                <span className="text-xl">{emoji}</span>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      <Input
        value={item.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder={t.itemName}
        className="flex-1 min-w-[100px] bg-white/80"
      />
      <Input
        value={item.textEn}
        onChange={(e) => onUpdate({ textEn: e.target.value })}
        placeholder={t.itemNameEn}
        className="flex-1 min-w-[100px] bg-white/80"
      />
      <Select value={item.category} onValueChange={(category) => onUpdate({ category: category as FitzgeraldCategory })}>
        <SelectTrigger className="w-28 bg-white/80">
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
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-destructive hover:text-destructive shrink-0"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
