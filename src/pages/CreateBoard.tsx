import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AACCard } from '@/components/aac/AACCard';
import { businessPreviewCards, BusinessType, getBoardsForBusinessType } from '@/data/businessBoards';
import { useToast } from '@/hooks/use-toast';
import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';

const businessTypes = [
  { key: 'iceCream', icon: '🍦' },
  { key: 'cafe', icon: '☕' },
  { key: 'restaurant', icon: '🍽️' },
  { key: 'pharmacy', icon: '💊' },
  { key: 'bakery', icon: '🥐' },
  { key: 'supermarket', icon: '🛒' },
  { key: 'other', icon: '🏪' },
];

const complexityLevels = [
  { level: 1, cells: '4-6', grid: '2x2 / 2x3' },
  { level: 2, cells: '12-16', grid: '3x4 / 4x4' },
  { level: 3, cells: '24-32', grid: '4x6 / 4x8' },
];

// Helper to generate a unique ID
const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to get an appropriate emoji for a menu item
const getItemEmoji = (item: string, businessType: string): string => {
  const lowerItem = item.toLowerCase();
  
  // Common food/drink items
  if (lowerItem.includes('קפה') || lowerItem.includes('coffee')) return '☕';
  if (lowerItem.includes('תה') || lowerItem.includes('tea')) return '🍵';
  if (lowerItem.includes('מים') || lowerItem.includes('water')) return '💧';
  if (lowerItem.includes('מיץ') || lowerItem.includes('juice')) return '🧃';
  if (lowerItem.includes('שוקולד') || lowerItem.includes('chocolate')) return '🍫';
  if (lowerItem.includes('וניל') || lowerItem.includes('vanilla')) return '🍨';
  if (lowerItem.includes('תות') || lowerItem.includes('strawberry')) return '🍓';
  if (lowerItem.includes('לימון') || lowerItem.includes('lemon')) return '🍋';
  if (lowerItem.includes('פיצה') || lowerItem.includes('pizza')) return '🍕';
  if (lowerItem.includes('המבורגר') || lowerItem.includes('burger')) return '🍔';
  if (lowerItem.includes('סלט') || lowerItem.includes('salad')) return '🥗';
  if (lowerItem.includes('מרק') || lowerItem.includes('soup')) return '🍜';
  if (lowerItem.includes('לחם') || lowerItem.includes('bread')) return '🍞';
  if (lowerItem.includes('עוגה') || lowerItem.includes('cake')) return '🍰';
  if (lowerItem.includes('גלידה') || lowerItem.includes('ice cream')) return '🍦';
  if (lowerItem.includes('פסטה') || lowerItem.includes('pasta')) return '🍝';
  if (lowerItem.includes('בשר') || lowerItem.includes('meat') || lowerItem.includes('סטייק') || lowerItem.includes('steak')) return '🥩';
  if (lowerItem.includes('עוף') || lowerItem.includes('chicken')) return '🍗';
  if (lowerItem.includes('דג') || lowerItem.includes('fish')) return '🐟';
  if (lowerItem.includes('ביצ') || lowerItem.includes('egg')) return '🥚';
  if (lowerItem.includes('גבינ') || lowerItem.includes('cheese')) return '🧀';
  if (lowerItem.includes('חלב') || lowerItem.includes('milk')) return '🥛';
  if (lowerItem.includes('בירה') || lowerItem.includes('beer')) return '🍺';
  if (lowerItem.includes('יין') || lowerItem.includes('wine')) return '🍷';
  if (lowerItem.includes('קרואסון') || lowerItem.includes('croissant')) return '🥐';
  if (lowerItem.includes('בורקס') || lowerItem.includes('burekas')) return '🥧';
  if (lowerItem.includes('תרופ') || lowerItem.includes('medicine') || lowerItem.includes('pill')) return '💊';
  if (lowerItem.includes('פלסטר') || lowerItem.includes('bandage')) return '🩹';
  
  // Default by business type
  const defaults: Record<string, string> = {
    iceCream: '🍦',
    cafe: '☕',
    restaurant: '🍽️',
    pharmacy: '💊',
    bakery: '🥐',
    supermarket: '🛒',
    other: '📦',
  };
  
  return defaults[businessType] || '🍽️';
};

const CreateBoard = () => {
  const { t, language, direction } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    complexity: 2,
    businessName: '',
    menuItems: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { num: 1, key: 'step1' },
    { num: 2, key: 'step2' },
    { num: 3, key: 'step3' },
    { num: 4, key: 'step4' },
  ];

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.businessType;
      case 2: return !!formData.complexity;
      case 3: return !!formData.businessName;
      case 4: return true;
      default: return false;
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    try {
      // Get base boards for the business type
      const businessType = formData.businessType;
      const validBusinessTypes: BusinessType[] = ['pharmacy', 'supermarket', 'iceCream', 'cafe', 'restaurant', 'bakery'];
      const actualType: BusinessType = validBusinessTypes.includes(businessType as BusinessType) 
        ? (businessType as BusinessType) 
        : 'cafe';
      const baseBoards = getBoardsForBusinessType(actualType);
      
      // Create a deep copy of the boards
      const customBoards: Record<string, AACBoard> = JSON.parse(JSON.stringify(baseBoards));
      
      // Update the main board name
      if (customBoards.main) {
        customBoards.main.name = formData.businessName;
        customBoards.main.nameEn = formData.businessName;
      }
      
      // If user provided custom menu items, add them to the board
      if (formData.menuItems.trim()) {
        const items = formData.menuItems
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
        
        if (items.length > 0) {
          // Create custom items as AACCells
          const customCells: AACCell[] = items.map(item => ({
            id: generateId(),
            text: item,
            textEn: item, // User can edit later
            category: 'people' as FitzgeraldCategory,
            icon: getItemEmoji(item, formData.businessType),
          }));
          
          // Add custom items board
          const customBoardId = 'custom-items';
          customBoards[customBoardId] = {
            id: customBoardId,
            name: language === 'he' ? 'פריטים מותאמים' : 'Custom Items',
            nameEn: 'Custom Items',
            parentBoardId: 'main',
            cells: customCells,
            gridSize: {
              cols: Math.min(Math.ceil(Math.sqrt(customCells.length)), 4),
              rows: Math.ceil(customCells.length / 4),
            },
          };
          
          // Add link to custom items in main board
          if (customBoards.main) {
            customBoards.main.cells.push({
              id: 'custom-items-link',
              text: language === 'he' ? 'פריטים מותאמים' : 'Custom Items',
              textEn: 'Custom Items',
              category: 'people' as FitzgeraldCategory,
              icon: '⭐',
              linkToBoardId: customBoardId,
            });
          }
        }
      }
      
      // Adjust grid size based on complexity
      if (customBoards.main) {
        const cellCount = customBoards.main.cells.length;
        switch (formData.complexity) {
          case 1:
            customBoards.main.gridSize = { cols: 2, rows: 3 };
            customBoards.main.cells = customBoards.main.cells.slice(0, 6);
            break;
          case 2:
            customBoards.main.gridSize = { cols: 3, rows: Math.ceil(cellCount / 3) };
            break;
          case 3:
            customBoards.main.gridSize = { cols: 4, rows: Math.ceil(cellCount / 4) };
            break;
        }
      }
      
      // Store the generated boards in sessionStorage for now
      // In a full implementation, this would be saved to the database
      sessionStorage.setItem('generatedBoards', JSON.stringify(customBoards));
      sessionStorage.setItem('generatedBoardsType', formData.businessType);
      sessionStorage.setItem('generatedBoardsName', formData.businessName);
      
      // Small delay to show the loading state
      setTimeout(() => {
        setIsGenerating(false);
        toast({
          title: language === 'he' ? 'הלוח נוצר בהצלחה!' : 'Board created successfully!',
          description: language === 'he' 
            ? 'מועברים לתצוגת הלוח שלך'
            : 'Redirecting to your board',
        });
        
        // Navigate to the board with edit mode enabled
        navigate(`/board/custom?type=${formData.businessType}&edit=true`);
      }, 1000);
      
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating board:', error);
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: language === 'he' 
          ? 'אירעה שגיאה ביצירת הלוח. נסו שוב.'
          : 'Failed to create board. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;
  const BackArrowIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

  // Get preview items - mix of base items and user's custom items
  const getPreviewItems = () => {
    const baseItems = (businessPreviewCards[formData.businessType as BusinessType] || businessPreviewCards.cafe)
      .slice(0, formData.complexity === 1 ? 4 : 6);
    
    // Add some user items to preview if they exist
    if (formData.menuItems.trim()) {
      const userItems = formData.menuItems
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, 3)
        .map(item => ({
          text: item,
          textEn: item,
          category: 'people' as FitzgeraldCategory,
          icon: getItemEmoji(item, formData.businessType),
        }));
      
      // Replace some base items with user items
      return [...baseItems.slice(0, Math.max(3, baseItems.length - userItems.length)), ...userItems];
    }
    
    return baseItems;
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('creator.title')}
            </h1>
            <p className="text-muted-foreground">
              {language === 'he' 
                ? 'מלאו את הפרטים ותנו ל-AI ליצור עבורכם לוח תקשורת מושלם'
                : 'Fill in the details and let AI create a perfect communication board for you'
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full font-semibold transition-all',
                    step === s.num
                      ? 'bg-primary text-primary-foreground'
                      : step > s.num
                      ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30'
                      : 'bg-muted text-muted-foreground'
                  )}
                  disabled={s.num > step}
                >
                  {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                </button>
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      'h-1 w-12 mx-2 rounded-full',
                      step > s.num ? 'bg-primary' : 'bg-muted'
                    )} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
            {/* Step 1: Business Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {t('creator.businessType')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {businessTypes.map((type) => (
                    <button
                      key={type.key}
                      onClick={() => setFormData({ ...formData, businessType: type.key })}
                      className={cn(
                        'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                        formData.businessType === type.key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <span className="text-4xl">{type.icon}</span>
                      <span className="font-medium text-card-foreground">
                        {t(`business.${type.key}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Complexity Level */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {t('creator.complexity')}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {complexityLevels.map((level) => (
                    <button
                      key={level.level}
                      onClick={() => setFormData({ ...formData, complexity: level.level })}
                      className={cn(
                        'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                        formData.complexity === level.level
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                        {level.level}
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-card-foreground block">
                          {t(`creator.level${level.level}`)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {level.grid}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Menu Details */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {t('creator.menuItems')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      {language === 'he' ? 'שם העסק' : 'Business Name'}
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder={language === 'he' ? 'לדוגמה: גלידריה מתוקה' : 'e.g., Sweet Ice Cream'}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      {language === 'he' 
                        ? 'פריטי תפריט מותאמים (אחד בכל שורה) - אופציונלי' 
                        : 'Custom Menu Items (one per line) - optional'}
                    </label>
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'he'
                        ? 'הוסיפו פריטים ספציפיים לעסק שלכם. הם יתווספו ללוח הבסיסי.'
                        : 'Add items specific to your business. They will be added to the base board.'}
                    </p>
                    <Textarea
                      value={formData.menuItems}
                      onChange={(e) => setFormData({ ...formData, menuItems: e.target.value })}
                      placeholder={language === 'he' 
                        ? 'שוקולד בלגי\nוניל מדגסקר\nסורבה מנגו\nפיסטוק איטלקי'
                        : 'Belgian Chocolate\nMadagascar Vanilla\nMango Sorbet\nItalian Pistachio'
                      }
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Generate */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {language === 'he' ? 'סקירה ויצירה' : 'Review & Create'}
                </h2>
                
                {/* Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {language === 'he' ? 'סוג העסק' : 'Business Type'}
                      </div>
                      <div className="font-semibold text-card-foreground flex items-center gap-2">
                        <span className="text-2xl">
                          {businessTypes.find(b => b.key === formData.businessType)?.icon}
                        </span>
                        {t(`business.${formData.businessType}`)}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {language === 'he' ? 'רמת מורכבות' : 'Complexity'}
                      </div>
                      <div className="font-semibold text-card-foreground">
                        {t(`creator.level${formData.complexity}`)}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {language === 'he' ? 'שם העסק' : 'Business Name'}
                      </div>
                      <div className="font-semibold text-card-foreground">
                        {formData.businessName || '-'}
                      </div>
                    </div>
                    {formData.menuItems.trim() && (
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          {language === 'he' ? 'פריטים מותאמים' : 'Custom Items'}
                        </div>
                        <div className="text-sm text-card-foreground">
                          {formData.menuItems.split('\n').filter(i => i.trim()).length} {language === 'he' ? 'פריטים' : 'items'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-3">
                      {language === 'he' ? 'תצוגה מקדימה' : 'Preview'}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {getPreviewItems().map((card, index) => (
                        <AACCard
                          key={index}
                          text={language === 'he' ? card.text : card.textEn}
                          category={card.category}
                          icon={card.icon}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    size="lg" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="gap-2 min-w-[200px]"
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t('creator.generating')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        {t('creator.generate')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <BackArrowIcon className="h-4 w-4" />
                {language === 'he' ? 'הקודם' : 'Previous'}
              </Button>
              {step < 4 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  {language === 'he' ? 'הבא' : 'Next'}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateBoard;
