import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACBoard, AACCell, BoardNavigationState } from '@/types/aac';
import { AACCard } from './AACCard';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AIUploadPlaceholder } from './AIUploadPlaceholder';
import { BoardEditModal } from './BoardEditModal';
import { CustomerModeOverlay } from './CustomerModeOverlay';
import { VoiceSettingsModal } from '@/components/settings/VoiceSettingsModal';
import { GuestWatermark } from './GuestWatermark';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronRight, Volume2, Trash2, Pencil, Plus, Check, MessageCircle, X, Settings, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClickSound } from '@/hooks/useClickSound';
import { useNavigate } from 'react-router-dom';

const utilityRailCells: AACCell[] = [
  {
    id: 'utility-need',
    text: 'אני צריך',
    textEn: 'I need',
    category: 'verbs',
    icon: '✋',
  },
  {
    id: 'utility-want',
    text: 'אני רוצה',
    textEn: 'I want',
    category: 'verbs',
    icon: '👉',
  },
  {
    id: 'utility-more',
    text: 'עוד',
    textEn: 'More',
    category: 'descriptors',
    icon: '🟥',
  },
  {
    id: 'utility-dont-know',
    text: 'לא יודע',
    textEn: "I don't know",
    category: 'social',
    icon: '🤷',
  },
  {
    id: 'utility-help',
    text: 'עזרה',
    textEn: 'Help',
    category: 'social',
    icon: '🆘',
  },
  {
    id: 'utility-done',
    text: 'סיימתי',
    textEn: 'Finished',
    category: 'social',
    icon: '👏',
  },
  {
    id: 'utility-question',
    text: 'שאלה',
    textEn: 'Question',
    category: 'social',
    icon: '❓',
  },
  {
    id: 'utility-special-requests',
    text: 'בקשות מיוחדות',
    textEn: 'Special requests',
    category: 'social',
    icon: '💬',
  },
];

interface AACDashboardProps {
  boards?: Record<string, AACBoard>;
  rootBoardId?: string;
  showAIUpload?: boolean;
  className?: string;
  businessType?: BusinessType;
  allowEdit?: boolean;
  onBoardsChange?: (boards: Record<string, AACBoard>) => void;
}

const buildInitialNavState = (
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
  rootBoardId: string,
): BoardNavigationState => {
  if (businessType !== 'iceCream' || !activeBoards['flavors-cup'] || !activeBoards['ice-cream-type']) {
    return {
      currentBoardId: rootBoardId,
      breadcrumbs: [],
    };
  }

  const rootBoard = activeBoards[rootBoardId];
  const iceCreamTypeBoard = activeBoards['ice-cream-type'];

  return {
    currentBoardId: 'flavors-cup',
    breadcrumbs: [
      ...(rootBoard
        ? [{ id: rootBoard.id, name: rootBoard.name, nameEn: rootBoard.nameEn }]
        : []),
      {
        id: iceCreamTypeBoard.id,
        name: iceCreamTypeBoard.name,
        nameEn: iceCreamTypeBoard.nameEn,
      },
    ],
  };
};

const isBuiltInIceCreamBoardSet = (activeBoards: Record<string, AACBoard>) =>
  ['ice-cream-type', 'flavors-cup', 'flavors-cone'].every((boardId) => Boolean(activeBoards[boardId]));

const normalizeCategoryLabel = (value: string) => value.trim().replace(/[:：]/g, '').toLowerCase();

const matchesAnyLabel = (value: string, labels: string[]) => {
  const normalizedValue = normalizeCategoryLabel(value);
  return labels.some((label) => normalizedValue.includes(normalizeCategoryLabel(label)));
};

export function AACDashboard({ 
  boards,
  rootBoardId = 'main',
  showAIUpload = true,
  className,
  businessType = 'cafe',
  allowEdit = false,
  onBoardsChange,
}: AACDashboardProps) {
  // Use provided boards or get boards based on business type
  const [localBoards, setLocalBoards] = useState<Record<string, AACBoard>>(() => {
    if (boards) return { ...boards };
    return { ...getBoardsForBusinessType(businessType) };
  });
  
  const activeBoards = localBoards;
  const { language, direction, t } = useLanguage();
  const { speak, isSpeaking, speakingCellId, isSupported } = useTextToSpeech();
  const { toast } = useToast();
  const { isGuest } = useAuth();
  const { playClickSound } = useClickSound();
  const navigate = useNavigate();
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const [navState, setNavState] = useState<BoardNavigationState>(() =>
    buildInitialNavState(localBoards, businessType, rootBoardId)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCell, setEditingCell] = useState<AACCell | null>(null);
  
  // Customer Communication Mode
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<AACCell | null>(null);

  const currentBoard = activeBoards[navState.currentBoardId];
  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const nextBoards = boards ? { ...boards } : { ...getBoardsForBusinessType(businessType) };
    setLocalBoards(nextBoards);

    setNavState((prev) => {
      if (nextBoards[prev.currentBoardId]) {
        return prev;
      }

      return buildInitialNavState(nextBoards, businessType, rootBoardId);
    });
  }, [boards, businessType, rootBoardId]);

  const updateBoards = useCallback((newBoards: Record<string, AACBoard>) => {
    setLocalBoards(newBoards);
    onBoardsChange?.(newBoards);
  }, [onBoardsChange]);

  const navigateToBoard = useCallback((boardId: string) => {
    if (!activeBoards[boardId]) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setNavState(prev => ({
        currentBoardId: boardId,
        breadcrumbs: [
          ...prev.breadcrumbs,
          { 
            id: prev.currentBoardId, 
            name: activeBoards[prev.currentBoardId].name,
            nameEn: activeBoards[prev.currentBoardId].nameEn 
          }
        ],
      }));
      setIsTransitioning(false);
    }, 150);
  }, [activeBoards]);

  const navigateBack = useCallback(() => {
    if (navState.breadcrumbs.length === 0) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setNavState(prev => {
        const newBreadcrumbs = [...prev.breadcrumbs];
        const parentBoard = newBreadcrumbs.pop();
        return {
          currentBoardId: parentBoard?.id || rootBoardId,
          breadcrumbs: newBreadcrumbs,
        };
      });
      setIsTransitioning(false);
    }, 150);
  }, [navState.breadcrumbs, rootBoardId]);

  const navigateToBreadcrumb = useCallback((targetIndex: number) => {
    if (targetIndex === -1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setNavState({
          currentBoardId: rootBoardId,
          breadcrumbs: [],
        });
        setIsTransitioning(false);
      }, 150);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setNavState(prev => ({
        currentBoardId: prev.breadcrumbs[targetIndex].id,
        breadcrumbs: prev.breadcrumbs.slice(0, targetIndex),
      }));
      setIsTransitioning(false);
    }, 150);
  }, [rootBoardId]);

  const handleReturnToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleCellClick = useCallback((cell: AACCell) => {
    if (isEditMode) return;
    playClickSound();
    
    // Customer Mode: Show enlarged cell with TTS
    if (isCustomerMode) {
      if (!cell.linkToBoardId) {
        // Speak immediately during user gesture (must be synchronous)
        const text = language === 'he' || language === 'ar' ? cell.text : cell.textEn;
        speak(text, undefined, cell.id);
        setSelectedCell(cell);
      } else if (activeBoards[cell.linkToBoardId]) {
        navigateToBoard(cell.linkToBoardId);
      }
      return;
    }
    
    if (cell.linkToBoardId && activeBoards[cell.linkToBoardId]) {
      navigateToBoard(cell.linkToBoardId);
    } else {
      // Speak the word with cell ID for visual feedback
      const text = language === 'he' || language === 'ar' ? cell.text : cell.textEn;
      speak(text, undefined, cell.id);
      setSelectedWords(prev => [...prev, text]);
    }
  }, [activeBoards, navigateToBoard, language, speak, isEditMode, isCustomerMode]);

  const handleCoreWordClick = useCallback((word: { textKey: string }) => {
    playClickSound();
    const text = t(word.textKey);
    speak(text);
    setSelectedWords(prev => [...prev, text]);
  }, [t, speak]);

  const clearSelectedWords = useCallback(() => {
    setSelectedWords([]);
  }, []);

  const speakAllWords = useCallback(() => {
    if (selectedWords.length > 0) {
      speak(selectedWords.join(' '));
    }
  }, [selectedWords, speak]);

  // Edit mode handlers
  const handleDeleteCell = useCallback((cellId: string) => {
    const newBoards = { ...activeBoards };
    const board = newBoards[navState.currentBoardId];
    if (!board) return;

    newBoards[navState.currentBoardId] = {
      ...board,
      cells: board.cells.filter(c => c.id !== cellId),
    };
    
    updateBoards(newBoards);
    toast({
      title: language === 'he' ? 'הפריט הוסר' : 'Item removed',
    });
  }, [activeBoards, navState.currentBoardId, updateBoards, toast, language]);

  const handleEditCell = useCallback((cell: AACCell) => {
    setEditingCell(cell);
    setShowAddModal(true);
  }, []);

  const handleAddCell = useCallback((cellData: Omit<AACCell, 'id'>) => {
    const newBoards = { ...activeBoards };
    const board = newBoards[navState.currentBoardId];
    if (!board) return;

    const newCell: AACCell = {
      ...cellData,
      id: `custom-${Date.now()}`,
    };

    newBoards[navState.currentBoardId] = {
      ...board,
      cells: [...board.cells, newCell],
    };
    
    updateBoards(newBoards);
    toast({
      title: language === 'he' ? 'הפריט נוסף' : 'Item added',
    });
  }, [activeBoards, navState.currentBoardId, updateBoards, toast, language]);

  const handleUpdateCell = useCallback((updatedCell: AACCell) => {
    const newBoards = { ...activeBoards };
    const board = newBoards[navState.currentBoardId];
    if (!board) return;

    newBoards[navState.currentBoardId] = {
      ...board,
      cells: board.cells.map(c => c.id === updatedCell.id ? updatedCell : c),
    };
    
    updateBoards(newBoards);
    setEditingCell(null);
    toast({
      title: language === 'he' ? 'הפריט עודכן' : 'Item updated',
    });
  }, [activeBoards, navState.currentBoardId, updateBoards, toast, language]);

  if (!currentBoard) {
    return <div className="text-center text-muted-foreground">Board not found</div>;
  }

  const gridCols = currentBoard.gridSize.cols;
  const boardTypeIcon: Record<BusinessType, string> = {
    cafe: '☕',
    restaurant: '🍽️',
    bakery: '🥐',
    pizza: '🍕',
    supermarket: '🛒',
    pharmacy: '💊',
    iceCream: '🍦',
    laundromat: '🧺',
    partySupplies: '🎉',
    toyStore: '🧸',
    hairSalon: '💇',
    shoeStore: '👟',
    clothingStore: '👕',
  };

  const sortedCells = useMemo(() => {
    const categoryOrder: Record<AACCell['category'], number> = {
      people: 0,
      verbs: 1,
      descriptors: 2,
      social: 3,
    };

    return [...currentBoard.cells].sort((first, second) => categoryOrder[first.category] - categoryOrder[second.category]);
  }, [currentBoard.cells]);

  const peopleCells = sortedCells.filter((cell) => cell.category === 'people');
  const verbCells = sortedCells.filter((cell) => cell.category === 'verbs');
  const descriptorCells = sortedCells.filter((cell) => cell.category === 'descriptors');
  const socialCells = sortedCells.filter((cell) => cell.category === 'social');

  const sideRailCells = utilityRailCells;
  const extraSocialCells = socialCells.filter(
    (cell) => !utilityRailCells.some((utilityCell) => utilityCell.text === cell.text || utilityCell.textEn === cell.textEn)
  ).slice(0, 4);
  const infoStripCells = [...descriptorCells, ...verbCells].slice(0, 3);
  const featuredCellIds = new Set([...socialCells, ...infoStripCells].map((cell) => cell.id));
  const mainGridCells = peopleCells.length > 0 ? peopleCells : sortedCells.filter((cell) => !featuredCellIds.has(cell.id));
  const displayGridCells = mainGridCells.length > 0 ? mainGridCells : sortedCells;
  const effectiveGridCols = Math.min(5, Math.max(2, displayGridCells.length >= 10 ? 5 : displayGridCells.length >= 8 ? 4 : displayGridCells.length || 2));
  const boardTitle = language === 'he' || language === 'ar' ? currentBoard.name : currentBoard.nameEn;
  const showMockupSideRail = sideRailCells.length > 0;
  const boardEmoji = boardTypeIcon[businessType] || '🗂️';
  const selectionSummary = selectedWords.length > 0
    ? selectedWords.join(' • ')
    : infoStripCells[0]
      ? (language === 'he' || language === 'ar' ? infoStripCells[0].text : infoStripCells[0].textEn)
      : language === 'he'
        ? 'בחירה נוספת'
        : 'Another choice';
  const useIceCreamReferenceLayout =
    businessType === 'iceCream' &&
    isBuiltInIceCreamBoardSet(activeBoards) &&
    ['flavors-cup', 'flavors-cone'].includes(navState.currentBoardId);
  const manualIceCreamSections = useMemo(() => {
    if (businessType !== 'iceCream' || navState.currentBoardId !== rootBoardId) {
      return null;
    }

    const linkedBoards = currentBoard.cells
      .filter((cell) => cell.linkToBoardId && activeBoards[cell.linkToBoardId])
      .map((cell) => {
        const linkedBoard = activeBoards[cell.linkToBoardId!];
        return {
          cell,
          board: linkedBoard,
          label: linkedBoard ? linkedBoard.name : cell.text,
        };
      });

    const servingSection = linkedBoards.find(({ label, cell }) =>
      matchesAnyLabel(label, ['איך תרצה', 'איך אתה רוצה', 'סוג הגשה', 'כמות', 'גביע', 'כוס']) ||
      matchesAnyLabel(cell.text, ['איך תרצה', 'איך אתה רוצה', 'סוג הגשה', 'כמות', 'גביע', 'כוס'])
    );
    const flavorsSection = linkedBoards.find(({ label, cell }) =>
      matchesAnyLabel(label, ['טעמים', 'טעם', 'בחר טעם']) ||
      matchesAnyLabel(cell.text, ['טעמים', 'טעם', 'בחר טעם'])
    );
    const toppingsSection = linkedBoards.find(({ label, cell }) =>
      matchesAnyLabel(label, ['תוספות', 'תוספת']) ||
      matchesAnyLabel(cell.text, ['תוספות', 'תוספת'])
    );

    if (!servingSection && !flavorsSection && !toppingsSection) {
      return null;
    }

    return {
      serving: servingSection?.board.cells ?? [],
      flavors: flavorsSection?.board.cells ?? [],
      toppings: toppingsSection?.board.cells ?? [],
      labels: {
        serving: servingSection?.label ?? (language === 'he' ? 'איך תרצה?' : 'How would you like it?'),
        flavors: flavorsSection?.label ?? (language === 'he' ? 'בחר טעם גלידה' : 'Choose a flavor'),
        toppings: toppingsSection?.label ?? (language === 'he' ? 'תוספות' : 'Toppings'),
      },
    };
  }, [activeBoards, businessType, currentBoard.cells, language, navState.currentBoardId, rootBoardId]);
  const useManualIceCreamLayout = businessType === 'iceCream' && Boolean(manualIceCreamSections);
  const useIceCreamLayout = useIceCreamReferenceLayout || useManualIceCreamLayout;
  const iceCreamPrompt = language === 'he' ? 'בחר טעם גלידה' : 'Choose Ice Cream Flavor';
  const iceCreamTitle = boardTitle || (language === 'he' ? 'גלידריה' : 'Ice Cream Shop');
  const iceCreamFlavorCards = displayGridCells.slice(0, 15);
  const iceCreamRailVisuals: Record<string, { top?: string; center?: string; bottom?: string; accent?: string }> = {
    'utility-need': { center: '🙂☝️' },
    'utility-want': { center: '🙂👉' },
    'utility-more': { center: '🙌', bottom: '🟥', accent: '🙌' },
    'utility-dont-know': { center: '🤷' },
    'utility-help': { center: '🧑‍🤝‍🧑' },
    'utility-done': { center: '👏' },
    'utility-question': { center: '❓' },
    'utility-special-requests': { center: '💬' },
  };
  const iceCreamCategoryButtons = [
    {
      id: 'toppings',
      label: language === 'he' ? 'תוספות' : 'Toppings',
      icon: '🌈',
      onClick: () => navigateToBoard('toppings'),
    },
    {
      id: 'quantity',
      label: language === 'he' ? 'כמות' : 'Quantity',
      icon: '🍦🍦🍦',
      onClick: () => navigateToBreadcrumb(0),
    },
    {
      id: 'flavors',
      label: language === 'he' ? 'טעמים' : 'Flavors',
      icon: '🍨',
      onClick: () => navigateToBoard(navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup'),
    },
  ];

  return (
    <div className={cn('flex min-h-screen flex-col overflow-x-hidden bg-[#eef2f8] text-base', className)}>
      {/* Top Bar */}
      {!useIceCreamLayout && (
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnToDashboard}
            className="shrink-0 gap-2 border-slate-300 bg-white"
          >
            <LayoutGrid className="h-4 w-4" />
            {language === 'he' ? 'לוח בקרה' : 'Dashboard'}
          </Button>

          {navState.breadcrumbs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateBack}
              className="shrink-0 gap-2 border-slate-300 bg-white"
            >
              <BackIcon className="h-4 w-4" />
              {t('aac.back')}
            </Button>
          )}
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            <button
              onClick={() => navigateToBreadcrumb(-1)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{t('aac.mainBoard')}</span>
            </button>
            
            {navState.breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[100px]"
                >
                  {language === 'he' || language === 'ar' ? crumb.name : crumb.nameEn}
                </button>
              </div>
            ))}
            
            {navState.breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <span className="font-medium text-foreground truncate max-w-[100px]">
                  {language === 'he' || language === 'ar' ? currentBoard.name : currentBoard.nameEn}
                </span>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Customer Mode Toggle */}
          <Button
            variant={isCustomerMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setIsCustomerMode(!isCustomerMode);
              if (isEditMode) setIsEditMode(false);
            }}
            className={cn(
              'gap-2 border-slate-300 bg-white',
              isCustomerMode && "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            {isCustomerMode ? (
              <>
                <X className="h-4 w-4" />
                {language === 'he' ? 'צא ממצב לקוח' : 'Exit Customer Mode'}
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4" />
                {language === 'he' ? 'אני רוצה לדבר' : 'I Want To Talk'}
              </>
            )}
          </Button>

          {/* Edit Mode Toggle */}
          {allowEdit && !isCustomerMode && (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className="gap-2 border-slate-300 bg-white"
            >
              {isEditMode ? (
                <>
                  <Check className="h-4 w-4" />
                  {language === 'he' ? 'סיום עריכה' : 'Done'}
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  {language === 'he' ? 'עריכה' : 'Edit'}
                </>
              )}
            </Button>
          )}

          {/* Voice Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVoiceSettings(true)}
            className="shrink-0"
            aria-label={language === 'he' ? 'הגדרות קול' : 'Voice Settings'}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <LanguageSwitcher variant="compact" />
        </div>
      </header>
      )}

      {/* Customer Mode Indicator Bar */}
      {isCustomerMode && !isEditMode && !useIceCreamLayout && (
        <div className="flex items-center justify-center gap-2 border-b border-green-600/30 bg-green-600/20 px-3 py-2">
          <MessageCircle className="h-5 w-5 text-green-700" />
          <p className="text-sm text-green-800 dark:text-green-300 font-medium">
            {language === 'he' 
              ? '🎯 מצב לקוח: לחץ על פריט כדי להציג ולהקריא אותו' 
              : '🎯 Customer Mode: Tap an item to display and speak it'}
          </p>
        </div>
      )}

      {/* Edit Mode Bar */}
      {isEditMode && !useIceCreamLayout && (
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary/10 px-3 py-2">
          <p className="text-sm text-primary font-medium">
            {language === 'he' 
              ? '🛠️ מצב עריכה: לחץ על פריט לעריכה, או על ה-X למחיקה' 
              : '🛠️ Edit mode: Click item to edit, or X to delete'}
          </p>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'he' ? 'הוסף פריט' : 'Add Item'}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-2 md:p-3">
          {useIceCreamLayout && (
            <div className="mx-auto mb-3 flex max-w-[1020px] justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReturnToDashboard}
                className="gap-2 border-slate-300 bg-white"
              >
                <LayoutGrid className="h-4 w-4" />
                {language === 'he' ? 'חזרה ללוח בקרה' : 'Back to Dashboard'}
              </Button>
            </div>
          )}
          {useIceCreamLayout ? (
            <div className="mx-auto max-w-[1020px] rounded-[30px] border-[3px] border-[#30497a] bg-[#f7f7f2] p-3 shadow-[0_18px_45px_rgba(48,73,122,0.14)]">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_158px]">
                <section className="space-y-3">
                  <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src="/aac-local/ice-cream.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-16 w-16 object-contain"
                      />
                      <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-[3.35rem]">
                        {iceCreamTitle}
                      </h1>
                    </div>
                  </div>

                  {useManualIceCreamLayout && manualIceCreamSections ? (
                    <>
                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 text-center">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.serving}
                          </h2>
                        </div>

                        <div className={cn('grid gap-3', manualIceCreamSections.serving.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                          {manualIceCreamSections.serving.map((cell) => (
                            <AACCard
                              key={cell.id}
                              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                              imageSearchTerms={[cell.text, cell.textEn]}
                              category={cell.category}
                              icon={cell.icon}
                              imageUrl={cell.imageUrl}
                              isFolder={false}
                              onClick={() => handleCellClick(cell)}
                              size="lg"
                              variant="mockup"
                              labelPosition="top"
                              isEditMode={isEditMode}
                              isSpeaking={speakingCellId === cell.id}
                              onDelete={() => handleDeleteCell(cell.id)}
                              onEdit={() => handleEditCell(cell)}
                              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 text-center">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.flavors}
                          </h2>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                          {manualIceCreamSections.flavors.map((cell) => (
                            <AACCard
                              key={cell.id}
                              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                              imageSearchTerms={[cell.text, cell.textEn]}
                              category={cell.category}
                              icon={cell.icon}
                              imageUrl={cell.imageUrl}
                              isFolder={false}
                              onClick={() => handleCellClick(cell)}
                              size="lg"
                              variant="mockup"
                              labelPosition="top"
                              isEditMode={isEditMode}
                              isSpeaking={speakingCellId === cell.id}
                              onDelete={() => handleDeleteCell(cell.id)}
                              onEdit={() => handleEditCell(cell)}
                              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 text-center">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.toppings}
                          </h2>
                        </div>

                        <div className={cn('grid gap-3', manualIceCreamSections.toppings.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                          {manualIceCreamSections.toppings.map((cell) => (
                            <AACCard
                              key={cell.id}
                              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                              imageSearchTerms={[cell.text, cell.textEn]}
                              category={cell.category}
                              icon={cell.icon}
                              imageUrl={cell.imageUrl}
                              isFolder={false}
                              onClick={() => handleCellClick(cell)}
                              size="lg"
                              variant="mockup"
                              labelPosition="top"
                              isEditMode={isEditMode}
                              isSpeaking={speakingCellId === cell.id}
                              onDelete={() => handleDeleteCell(cell.id)}
                              onEdit={() => handleEditCell(cell)}
                              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                      <div className="mb-3 text-center">
                        <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                          {iceCreamPrompt}
                        </h2>
                      </div>

                      <div className="grid grid-cols-5 gap-2.5 md:gap-3">
                        {iceCreamFlavorCards.map((cell) => (
                          <AACCard
                            key={cell.id}
                            text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                            imageSearchTerms={[cell.text, cell.textEn]}
                            category={cell.category}
                            icon={cell.icon}
                            imageUrl={cell.imageUrl}
                            isFolder={false}
                            onClick={() => handleCellClick(cell)}
                            size="lg"
                            variant="mockup"
                            labelPosition="top"
                            isEditMode={isEditMode}
                            isSpeaking={speakingCellId === cell.id}
                            onDelete={() => handleDeleteCell(cell.id)}
                            onEdit={() => handleEditCell(cell)}
                            className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                    <div className="mt-3 grid gap-2.5 md:grid-cols-[1fr_1.45fr]">
                      <button
                        type="button"
                        onClick={clearSelectedWords}
                        className="flex min-h-[62px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] px-4 text-xl font-bold text-slate-800"
                      >
                        <span>{language === 'he' ? 'טעם אחר' : 'Another flavor'}</span>
                        <span className="text-3xl" aria-hidden="true">❔</span>
                      </button>
                      <button
                        type="button"
                        onClick={selectedWords.length > 0 ? speakAllWords : undefined}
                        className="flex min-h-[62px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] px-4 text-xl font-extrabold text-slate-800"
                      >
                        <span>{language === 'he' ? 'סיימתי לבחור' : 'Done choosing'}</span>
                        <Check className="h-8 w-8 text-emerald-600" />
                      </button>
                    </div>
                  

                  {!useManualIceCreamLayout && (
                    <div className="grid gap-2.5 md:grid-cols-3">
                      {iceCreamCategoryButtons.map((button) => (
                        <button
                          key={button.id}
                          type="button"
                          onClick={button.onClick}
                          className="flex min-h-[74px] flex-col items-center justify-center rounded-[16px] border-[2.5px] border-[#c6cfdd] bg-white px-4 py-2 text-lg font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                        >
                          <span className="mb-1">{button.label}</span>
                          <span className="text-[2rem] leading-none" aria-hidden="true">{button.icon}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-2.5 md:grid-cols-5">
                    <button
                      type="button"
                      onClick={clearSelectedWords}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Trash2 className="h-8 w-8" />
                      <span>{language === 'he' ? 'מחק' : 'Delete'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={selectedWords.length > 0 ? speakAllWords : undefined}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Check className="h-9 w-9 text-emerald-600" />
                      <span>{language === 'he' ? 'כן' : 'Yes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearSelectedWords}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <X className="h-9 w-9 text-rose-500" />
                      <span>{language === 'he' ? 'לא' : 'No'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={navigateBack}
                      disabled={navState.breadcrumbs.length === 0}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] disabled:opacity-50"
                    >
                      <BackIcon className="h-9 w-9" />
                      <span>{language === 'he' ? 'חזור' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToBreadcrumb(-1)}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Home className="h-9 w-9" />
                      <span>{language === 'he' ? 'דף ראשי' : 'Home'}</span>
                    </button>
                  </div>
                </section>

                <aside className="grid auto-rows-fr gap-2.5">
                  {sideRailCells.map((cell) => {
                    const visual = iceCreamRailVisuals[cell.id] ?? { center: cell.icon };

                    return (
                      <button
                        key={cell.id}
                        type="button"
                        onClick={() => handleCellClick(cell)}
                        className={cn(
                          'flex min-h-[88px] flex-col items-center justify-between rounded-[16px] border-[2.5px] border-[#c6cfdd] bg-white px-2 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]',
                          speakingCellId === cell.id && 'ring-4 ring-primary shadow-lg shadow-primary/20'
                        )}
                      >
                        <span className="text-[0.98rem] font-extrabold leading-tight text-slate-900">
                          {language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                        </span>

                        <div className="flex flex-1 w-full items-center justify-center gap-2 py-1">
                          {visual.center === '🙌' ? (
                            <>
                              <span className="text-[1.55rem] leading-none" aria-hidden="true">🙌</span>
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#c33] bg-[#dd3b3b] text-[0]" aria-hidden="true">■</span>
                              <span className="text-[1.55rem] leading-none" aria-hidden="true">🙌</span>
                            </>
                          ) : (
                            <span className={cn(
                              'leading-none',
                              cell.id === 'utility-question' ? 'text-[3rem]' : 'text-[2.5rem]'
                            )} aria-hidden="true">
                              {visual.center}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </aside>
              </div>
            </div>
          ) : (
          <div className={cn(
            'mx-auto flex min-h-full flex-col border-[3px] bg-[#fbfcff] shadow-[0_20px_60px_rgba(48,73,122,0.15)]',
            'max-w-[1380px] rounded-[26px] border-[#30497a] p-3 md:p-4'
          )}>
            <div className={cn('grid min-h-full gap-3', showMockupSideRail ? 'lg:grid-cols-[minmax(0,1fr)_172px]' : 'grid-cols-1')}>
              <section className="flex min-h-0 flex-col space-y-3">
                <div className={cn(
                  'border-[3px] border-[#30497a] bg-white text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
                  useIceCreamLayout ? 'rounded-[18px] px-4 py-3 md:px-6 md:py-4' : 'rounded-[22px] px-4 py-3 md:px-5'
                )}>
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src="/aac-local/ice-cream.svg"
                      alt=""
                      aria-hidden="true"
                      className={cn('h-10 w-10 object-contain', useIceCreamLayout && 'h-14 w-14')}
                    />
                    <h1 className={cn(
                      'font-extrabold tracking-tight text-slate-900',
                      useIceCreamLayout ? 'text-3xl md:text-[3.1rem]' : 'text-xl md:text-[2rem]'
                    )}>
                      {useIceCreamLayout ? iceCreamTitle : boardTitle}
                    </h1>
                  </div>
                </div>

                <div className={cn(
                  'flex min-h-0 flex-1 flex-col border-[3px] border-[#30497a] bg-white',
                  useIceCreamLayout ? 'rounded-[18px] p-3' : 'rounded-[22px] p-3 md:p-3.5'
                )}>
                  <div className="mb-3 text-center">
                    <h2 className={cn(
                      'font-extrabold text-slate-800',
                      useIceCreamLayout ? 'text-lg md:text-[1.95rem]' : 'text-base md:text-xl'
                    )}>
                      {useIceCreamLayout ? iceCreamPrompt : language === 'he' ? 'בחר אפשרות' : 'Choose an option'}
                    </h2>
                  </div>

                  <div 
                    className={cn(
                      'grid gap-2.5 transition-all duration-150 md:gap-3',
                      isTransitioning && 'scale-95 opacity-0',
                      !isTransitioning && 'scale-100 opacity-100'
                    )}
                    style={{
                      gridTemplateColumns: `repeat(${useIceCreamLayout ? 5 : effectiveGridCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {(useIceCreamLayout ? iceCreamFlavorCards : displayGridCells).map((cell) => (
                      <AACCard
                        key={cell.id}
                        text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                        imageSearchTerms={[cell.text, cell.textEn]}
                        category={cell.category}
                        icon={cell.icon}
                        imageUrl={cell.imageUrl}
                        isFolder={useIceCreamLayout ? false : !!cell.linkToBoardId}
                        onClick={() => handleCellClick(cell)}
                        size="lg"
                        variant="mockup"
                        labelPosition="top"
                        isEditMode={isEditMode}
                        isSpeaking={speakingCellId === cell.id}
                        onDelete={() => handleDeleteCell(cell.id)}
                        onEdit={() => handleEditCell(cell)}
                        className={cn(
                          useIceCreamLayout
                            ? 'min-h-[102px] rounded-[12px] px-2 py-2 md:min-h-[114px]'
                            : 'min-h-[106px] rounded-[16px] px-2 py-2 md:min-h-[118px]'
                        )}
                      />
                    ))}
                  </div>

                  {useIceCreamLayout ? (
                    <div className="mt-3 grid gap-2.5 md:grid-cols-[1fr_1.45fr]">
                      <button
                        type="button"
                        onClick={clearSelectedWords}
                        className="flex min-h-[60px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#bba6de] bg-[linear-gradient(180deg,#efe4ff_0%,#dccbf7_100%)] px-4 text-lg font-bold text-slate-800"
                      >
                        <span>{language === 'he' ? 'טעם אחר' : 'Another flavor'}</span>
                        <span className="text-2xl" aria-hidden="true">❔</span>
                      </button>
                      <button
                        type="button"
                        onClick={selectedWords.length > 0 ? speakAllWords : undefined}
                        className="flex min-h-[60px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#bba6de] bg-[linear-gradient(180deg,#efe4ff_0%,#dccbf7_100%)] px-4 text-lg font-extrabold text-slate-800"
                      >
                        <span>{language === 'he' ? 'סיימתי לבחור' : 'Done choosing'}</span>
                        <Check className="h-8 w-8 text-emerald-600" />
                      </button>
                    </div>
                  ) : infoStripCells.length > 0 && (
                    <div className="mt-3 grid gap-2.5 md:grid-cols-3">
                      {infoStripCells.map((cell) => (
                        <AACCard
                          key={cell.id}
                          text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                          imageSearchTerms={[cell.text, cell.textEn]}
                          category={cell.category}
                          icon={cell.icon}
                          imageUrl={cell.imageUrl}
                          isFolder={!!cell.linkToBoardId}
                          onClick={() => handleCellClick(cell)}
                          size="md"
                          variant="rail"
                          labelPosition="top"
                          isEditMode={isEditMode}
                          isSpeaking={speakingCellId === cell.id}
                          onDelete={() => handleDeleteCell(cell.id)}
                          onEdit={() => handleEditCell(cell)}
                          className="min-h-[82px] rounded-[16px] px-3"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {useIceCreamReferenceLayout && (
                  <div className="grid gap-2.5 md:grid-cols-3">
                    <button type="button" onClick={() => navigateToBoard('toppings')} className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800">
                      <span>{language === 'he' ? 'תוספות' : 'Toppings'}</span>
                      <span className="text-2xl" aria-hidden="true">🌈</span>
                    </button>
                    <button type="button" onClick={() => navigateToBreadcrumb(0)} className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800">
                      <span>{language === 'he' ? 'כמות' : 'Quantity'}</span>
                      <span className="text-2xl" aria-hidden="true">🍦🍦🍦</span>
                    </button>
                    <button type="button" onClick={() => navigateToBoard(navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup')} className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800">
                      <span>{language === 'he' ? 'טעמים' : 'Flavors'}</span>
                      <span className="text-2xl" aria-hidden="true">🍨</span>
                    </button>
                  </div>
                )}

                <div className={cn('grid gap-2.5', useIceCreamLayout ? 'md:grid-cols-5' : 'md:grid-cols-5')}>
                  <button
                    type="button"
                    onClick={clearSelectedWords}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
                  >
                    <Trash2 className="h-5 w-5" />
                    {language === 'he' ? 'מחק' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={selectedWords.length > 0 ? speakAllWords : undefined}
                    disabled={!useIceCreamLayout && (selectedWords.length === 0 || isSpeaking)}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] disabled:opacity-50"
                  >
                    {useIceCreamLayout ? <Check className="h-6 w-6 text-emerald-600" /> : <Volume2 className={cn('h-5 w-5', isSpeaking && 'animate-pulse')} />}
                    {useIceCreamLayout ? (language === 'he' ? 'כן' : 'Yes') : language === 'he' ? 'השמע' : 'Speak'}
                  </button>
                  <button
                    type="button"
                    onClick={useIceCreamLayout ? clearSelectedWords : () => setIsCustomerMode((prev) => !prev)}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
                  >
                    {useIceCreamLayout ? <X className="h-6 w-6 text-rose-500" /> : <MessageCircle className="h-5 w-5" />}
                    {useIceCreamLayout ? (language === 'he' ? 'לא' : 'No') : language === 'he' ? 'דבר' : 'Talk'}
                  </button>
                  <button
                    type="button"
                    onClick={navigateBack}
                    disabled={navState.breadcrumbs.length === 0}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] disabled:opacity-50"
                  >
                    <BackIcon className="h-5 w-5" />
                    {language === 'he' ? 'חזור' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToBreadcrumb(-1)}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
                  >
                    <Home className="h-5 w-5" />
                    {language === 'he' ? 'דף ראשי' : 'Home'}
                  </button>
                </div>

                {!useIceCreamLayout && (
                <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-[16px] border-[3px] border-[#c9b4e8] bg-[linear-gradient(180deg,#f3ebff_0%,#e9ddff_100%)] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]">
                    <span className="text-base font-bold text-slate-700 md:text-lg">
                      {selectionSummary}
                    </span>
                    <span className="text-2xl" aria-hidden="true">{selectedWords.length > 0 ? '💬' : '❔'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={selectedWords.length > 0 ? speakAllWords : undefined}
                    className="flex min-h-[72px] items-center justify-center gap-2 rounded-[16px] border-[3px] border-[#c9b4e8] bg-[linear-gradient(180deg,#f3ebff_0%,#e9ddff_100%)] px-4 text-base font-extrabold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
                  >
                    <Check className="h-6 w-6 text-emerald-600" />
                    {language === 'he' ? 'סיימתי לבחור' : 'Done choosing'}
                  </button>
                </div>
                )}

                {showAIUpload && navState.currentBoardId === rootBoardId && !isEditMode && (
                  <AIUploadPlaceholder 
                    className="mx-auto mt-2 max-w-2xl"
                    onUpload={(file) => {
                      console.log('File uploaded for AI processing:', file.name);
                    }}
                  />
                )}
              </section>

              {showMockupSideRail && (
                <aside className={cn('space-y-2.5 ps-1', useIceCreamLayout && 'ps-0')}>
                  <div className="grid auto-rows-fr gap-2.5">
                  {sideRailCells.map((cell) => (
                    <AACCard
                      key={cell.id}
                      text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                      imageSearchTerms={[cell.text, cell.textEn]}
                      category={cell.category}
                      icon={cell.icon}
                      imageUrl={cell.imageUrl}
                      isFolder={!!cell.linkToBoardId}
                      onClick={() => handleCellClick(cell)}
                      size="md"
                      variant="utility"
                      labelPosition="top"
                      isEditMode={isEditMode}
                      isSpeaking={speakingCellId === cell.id}
                      className={cn(
                        useIceCreamLayout
                          ? 'min-h-[76px] rounded-[14px] px-2 py-2 text-[0.9rem]'
                          : 'min-h-[116px] rounded-[20px] px-2.5 py-3 text-base'
                      )}
                    />
                  ))}
                  </div>

                  {extraSocialCells.length > 0 && !useIceCreamLayout && (
                    <div className="rounded-[20px] border-[3px] border-[#d7dfec] bg-white/90 p-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                      <div className="mb-2 px-2 text-center text-sm font-extrabold text-slate-500">
                        {language === 'he' ? 'עוד מסרים' : 'More messages'}
                      </div>
                      <div className="grid gap-2">
                        {extraSocialCells.map((cell) => (
                          <AACCard
                            key={cell.id}
                            text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                            imageSearchTerms={[cell.text, cell.textEn]}
                            category={cell.category}
                            icon={cell.icon}
                            imageUrl={cell.imageUrl}
                            isFolder={!!cell.linkToBoardId}
                            onClick={() => handleCellClick(cell)}
                            size="sm"
                            variant="utility"
                            labelPosition="top"
                            isEditMode={isEditMode}
                            isSpeaking={speakingCellId === cell.id}
                            onDelete={() => handleDeleteCell(cell.id)}
                            onEdit={() => handleEditCell(cell)}
                            className="min-h-[86px] rounded-[16px] px-2 py-2"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              )}
            </div>
          </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      <BoardEditModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCell(null);
        }}
        onAddCell={handleAddCell}
        editingCell={editingCell}
        onUpdateCell={handleUpdateCell}
      />

      {/* Customer Mode Overlay */}
      {isCustomerMode && (
        <CustomerModeOverlay 
          cell={selectedCell} 
          onClose={() => setSelectedCell(null)} 
        />
      )}

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        open={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />

      {/* Guest Watermark */}
      {isGuest && <GuestWatermark />}
    </div>
  );
}
