import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check, Sparkles, Link, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AACCard } from '@/components/aac/AACCard';
import { businessPreviewCards, BusinessType, getBoardsForBusinessType, getSupermarketBaseCategories } from '@/data/businessBoards';
import { useToast } from '@/hooks/use-toast';
import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';
import { UrlImportModal } from '@/components/menu-scanner/UrlImportModal';
import { MenuScannerModal } from '@/components/menu-scanner/MenuScannerModal';
import { ProcessingOverlay } from '@/components/menu-scanner/ProcessingOverlay';
import { BoardReviewEditor } from '@/components/menu-scanner/BoardReviewEditor';
import { useAuth } from '@/hooks/useAuth';
import { useMenuScanner } from '@/hooks/useMenuScanner';
import { CategoryItemsEditor, MenuCategory, MenuItem } from '@/components/create-board/CategoryItemsEditor';
import { saveBoardRecord } from '@/lib/savedBoards';

const businessTypes = [
  { key: 'iceCream', icon: '🍦' },
  { key: 'pizza', icon: '🍕' },
  { key: 'cafe', icon: '☕' },
  { key: 'restaurant', icon: '🍽️' },
  { key: 'bakery', icon: '🥐' },
  { key: 'pharmacy', icon: '💊' },
  { key: 'supermarket', icon: '🛒' },
  { key: 'laundromat', icon: '🧺' },
  { key: 'partySupplies', icon: '🎈' },
  { key: 'toyStore', icon: '🧸' },
  { key: 'hairSalon', icon: '✂️' },
  { key: 'shoeStore', icon: '👟' },
  { key: 'clothingStore', icon: '👕' },
  { key: 'other', icon: '🏪' },
];

const complexityLevels = [
  { level: 1, cells: '4-6', grid: '2x2 / 2x3' },
  { level: 2, cells: '12-16', grid: '3x4 / 4x4' },
  { level: 3, cells: '24-32', grid: '4x6 / 4x8' },
];


const CreateBoard = () => {
  const { t, language, direction } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isGuest } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    complexity: 2,
    businessName: '',
  });
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [standaloneItems, setStandaloneItems] = useState<MenuItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBoardReview, setShowBoardReview] = useState(false);
  
  const { isProcessing, generatedBoards, processMenuUrl, processMenuImage, setGeneratedBoards, reset: resetScanner } = useMenuScanner();

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
      const validBusinessTypes: BusinessType[] = [
        'pharmacy', 'supermarket', 'iceCream', 'cafe', 'restaurant', 'bakery',
        'pizza', 'laundromat', 'partySupplies', 'toyStore', 'hairSalon', 'shoeStore', 'clothingStore'
      ];
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
      
      // Build hierarchical boards from categories and standalone items
      if (categories.length > 0 || standaloneItems.length > 0) {
        // Add standalone items to main board
        standaloneItems.forEach(item => {
          if (customBoards.main) {
            customBoards.main.cells.push({
              id: item.id,
              text: item.text,
              textEn: item.textEn,
              category: item.category,
              icon: item.icon,
              imageUrl: item.imageUrl,
            });
          }
        });
        
        // Create sub-boards for each category
        categories.forEach(category => {
          const subBoardId = `category-${category.id}`;
          
          // Add folder link to main board
          if (customBoards.main) {
            customBoards.main.cells.push({
              id: `link-${category.id}`,
              text: category.name,
              textEn: category.nameEn,
              category: 'people' as FitzgeraldCategory,
              icon: category.icon,
              linkToBoardId: subBoardId,
            });
          }
          
          // Create the sub-board
          const categoryCells: AACCell[] = category.items.map(item => ({
            id: item.id,
            text: item.text,
            textEn: item.textEn,
            category: item.category,
            icon: item.icon,
            imageUrl: item.imageUrl,
          }));
          
          customBoards[subBoardId] = {
            id: subBoardId,
            name: category.name,
            nameEn: category.nameEn,
            parentBoardId: 'main',
            cells: categoryCells,
            gridSize: {
              cols: Math.min(Math.ceil(Math.sqrt(categoryCells.length + 1)), 4),
              rows: Math.ceil((categoryCells.length + 1) / 4),
            },
          };
        });
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
    
    // Add some user items to preview if they exist (categories and standalone items)
    const userItems: Array<{ text: string; textEn: string; category: FitzgeraldCategory; icon: string }> = [];
    
    // Add some standalone items
    standaloneItems.slice(0, 2).forEach(item => {
      userItems.push({
        text: item.text,
        textEn: item.textEn,
        category: item.category,
        icon: item.icon,
      });
    });
    
    // Add category folder items
    categories.slice(0, 2).forEach(cat => {
      userItems.push({
        text: cat.name,
        textEn: cat.nameEn,
        category: 'people' as FitzgeraldCategory,
        icon: cat.icon,
      });
    });
    
    if (userItems.length > 0) {
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

                  {/* Import Options */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <label className="block text-sm font-medium text-card-foreground mb-3">
                      {language === 'he' ? 'ייבוא אוטומטי (אופציונלי)' : 'Auto Import (optional)'}
                    </label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => setShowUrlModal(true)}
                      >
                        <Link className="h-4 w-4" />
                        {language === 'he' ? 'ייבוא מקישור' : 'Import from URL'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => setShowImageModal(true)}
                      >
                        <Camera className="h-4 w-4" />
                        {language === 'he' ? 'סריקת תמונה' : 'Scan Image'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === 'he'
                        ? 'סרקו תפריט מאתר אינטרנט או תמונה - הבינה המלאכותית תחלץ את הפריטים'
                        : 'Scan a menu from a website or image - AI will extract the items'}
                    </p>
                  </div>

                  {/* Category Items Editor */}
                  <CategoryItemsEditor
                    categories={categories}
                    setCategories={setCategories}
                    standaloneItems={standaloneItems}
                    setStandaloneItems={setStandaloneItems}
                  />
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
                    {(categories.length > 0 || standaloneItems.length > 0) && (
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          {language === 'he' ? 'פריטים מותאמים' : 'Custom Items'}
                        </div>
                        <div className="text-sm text-card-foreground">
                          {categories.length} {language === 'he' ? 'קטגוריות' : 'categories'}, {standaloneItems.length} {language === 'he' ? 'פריטים' : 'items'}
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
                  onClick={() => {
                    const nextStep = step + 1;
                    // Pre-populate categories for supermarket when entering step 3
                    if (nextStep === 3 && formData.businessType === 'supermarket' && categories.length === 0 && standaloneItems.length === 0) {
                      setCategories(getSupermarketBaseCategories());
                    }
                    setStep(nextStep);
                  }}
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

      {/* URL Import Modal */}
      <UrlImportModal
        open={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onUrlSubmit={async (url) => {
          const success = await processMenuUrl(url);
          if (success) {
            setShowUrlModal(false);
            setShowBoardReview(true);
          }
        }}
        isProcessing={isProcessing}
      />

      {/* Image Scanner Modal */}
      <MenuScannerModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        onImageSelected={async (imageBase64) => {
          setShowImageModal(false);
          const success = await processMenuImage(imageBase64);
          if (success) {
            setShowBoardReview(true);
          }
        }}
      />

      {/* Processing Overlay */}
      <ProcessingOverlay 
        isProcessing={isProcessing} 
        onCancel={() => resetScanner()}
      />

      {/* Board Review Editor - Full page overlay */}
      {generatedBoards && showBoardReview && (
        <div className="fixed inset-0 z-50 bg-background overflow-auto">
          <BoardReviewEditor
            boards={generatedBoards}
            onBack={() => {
              setShowBoardReview(false);
              resetScanner();
            }}
            onPreview={(boards) => {
              // Store temporarily and navigate to preview
              sessionStorage.setItem('generatedBoards', JSON.stringify(boards));
              sessionStorage.setItem('generatedBoardsType', formData.businessType || 'other');
              sessionStorage.setItem('generatedBoardsName', boards.main?.name || 'Custom Board');
              navigate(`/board/custom?type=${formData.businessType || 'other'}&preview=true`);
            }}
            onSave={async (boards) => {
              const savedBoard = await saveBoardRecord({
                boards,
                businessType: formData.businessType || 'other',
                businessName: boards.main?.name || formData.businessName || 'Custom Board',
                userId: user && !isGuest ? user.id : undefined,
              });
              
              setShowBoardReview(false);
              resetScanner();
              
              toast({
                title: language === 'he' ? 'הלוח נוצר בהצלחה!' : 'Board created successfully!',
                description: language === 'he' 
                  ? 'מועברים לתצוגת הלוח שלך'
                  : 'Redirecting to your board',
              });
              
              navigate(`/board/${savedBoard.id}?type=${savedBoard.business_type}&edit=true`);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CreateBoard;
