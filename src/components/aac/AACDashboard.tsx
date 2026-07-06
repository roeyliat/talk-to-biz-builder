import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ArrowLeft, ArrowRight, Home, ChevronRight, Volume2, Trash2, Pencil, Plus, Check, MessageCircle, X, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClickSound } from '@/hooks/useClickSound';
import wantImage from '@/assets/aac-local/אני רוצה.png';
import moreImage from '@/assets/aac-local/עוד.png';
import howMuchImage from '@/assets/aac-local/כמה עולה.png';

const utilityRailCells: AACCell[] = [
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
    id: 'utility-thanks',
    text: 'תודה',
    textEn: 'Thank you',
    category: 'social',
    icon: '🙏',
  },
  {
    id: 'utility-price',
    text: 'כמה עולה',
    textEn: 'How much',
    category: 'social',
    icon: '💰',
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

type ManualIceCreamCellEntry = {
  boardId: string;
  cell: AACCell;
};

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
  const { user, isGuest, signOut, loading: authLoading } = useAuth();
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
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  
  // Customer Communication Mode
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<AACCell | null>(null);

  const currentBoard = activeBoards[navState.currentBoardId];
  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const contentDir = direction === 'rtl' ? 'rtl' : 'ltr';

  const handleSignOut = useCallback(async () => {
    const { error } = await signOut();

    if (error) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: language === 'he' ? 'להתראות!' : 'Goodbye!',
      description: language === 'he' ? 'התנתקת בהצלחה' : 'You have been signed out',
    });
    navigate('/');
  }, [language, navigate, signOut, toast]);

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

  const getSpokenCellText = useCallback((cell: AACCell) => {
    return language === 'he' || language === 'ar' ? cell.text : cell.textEn;
  }, [language]);

  const speakButtonLabel = useCallback((label: string, cellId?: string) => {
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      return;
    }

    if (!isSupported) {
      playClickSound();
    }
    speak(normalizedLabel, undefined, cellId);
  }, [isSupported, playClickSound, speak]);

  const runSpokenAction = useCallback((label: string, action: () => void, cellId?: string) => {
    speakButtonLabel(label, cellId);
    action();
  }, [speakButtonLabel]);

  const handleCellClick = useCallback((cell: AACCell) => {
    if (isEditMode) return;
    const text = getSpokenCellText(cell);
    speakButtonLabel(text, cell.id);
    
    // Customer Mode: Show enlarged cell with TTS
    if (isCustomerMode) {
      if (!cell.linkToBoardId) {
        setSelectedCell(cell);
      } else if (activeBoards[cell.linkToBoardId]) {
        navigateToBoard(cell.linkToBoardId);
      }
      return;
    }
    
    if (cell.linkToBoardId && activeBoards[cell.linkToBoardId]) {
      navigateToBoard(cell.linkToBoardId);
    } else {
      setSelectedWords(prev => [...prev, text]);
    }
  }, [activeBoards, getSpokenCellText, navigateToBoard, speakButtonLabel, isEditMode, isCustomerMode]);

  const handleCoreWordClick = useCallback((word: { textKey: string }) => {
    const text = t(word.textKey);
    speakButtonLabel(text);
    setSelectedWords(prev => [...prev, text]);
  }, [t, speakButtonLabel]);

  const clearSelectedWords = useCallback(() => {
    setSelectedWords([]);
  }, []);

  const speakAllWords = useCallback(() => {
    if (selectedWords.length > 0) {
      speak(selectedWords.join(' '));
    }
  }, [selectedWords, speak]);

  // Edit mode handlers
  const handleDeleteCell = useCallback((cellId: string, targetBoardId?: string) => {
    const newBoards = { ...activeBoards };
    const boardId = targetBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    newBoards[boardId] = {
      ...board,
      cells: board.cells.filter(c => c.id !== cellId),
    };
    
    updateBoards(newBoards);
    toast({
      title: language === 'he' ? 'הפריט הוסר' : 'Item removed',
    });
  }, [activeBoards, navState.currentBoardId, updateBoards, toast, language]);

  const handleEditCell = useCallback((cell: AACCell, targetBoardId?: string) => {
    setEditingCell(cell);
    setEditingBoardId(targetBoardId ?? navState.currentBoardId);
    setShowAddModal(true);
  }, [navState.currentBoardId]);

  const openAddItemModal = useCallback((targetBoardId?: string) => {
    setEditingCell(null);
    setEditingBoardId(targetBoardId ?? navState.currentBoardId);
    setShowAddModal(true);
  }, [navState.currentBoardId]);

  const handleAddCell = useCallback((cellData: Omit<AACCell, 'id'>) => {
    const newBoards = { ...activeBoards };
    const boardId = editingBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    const newCell: AACCell = {
      ...cellData,
      id: `custom-${Date.now()}`,
    };

    newBoards[boardId] = {
      ...board,
      cells: [...board.cells, newCell],
    };
    
    updateBoards(newBoards);
    setEditingBoardId(null);
    toast({
      title: language === 'he' ? 'הפריט נוסף' : 'Item added',
    });
  }, [activeBoards, editingBoardId, navState.currentBoardId, updateBoards, toast, language]);

  const handleUpdateCell = useCallback((updatedCell: AACCell) => {
    const newBoards = { ...activeBoards };
    const boardId = editingBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    newBoards[boardId] = {
      ...board,
      cells: board.cells.map(c => c.id === updatedCell.id ? updatedCell : c),
    };
    
    updateBoards(newBoards);
    setEditingCell(null);
    setEditingBoardId(null);
    toast({
      title: language === 'he' ? 'הפריט עודכן' : 'Item updated',
    });
  }, [activeBoards, editingBoardId, navState.currentBoardId, updateBoards, toast, language]);

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
      serving: servingSection ? servingSection.board.cells.map((cell) => ({ boardId: servingSection.board.id, cell })) : [],
      flavors: flavorsSection ? flavorsSection.board.cells.map((cell) => ({ boardId: flavorsSection.board.id, cell })) : [],
      toppings: toppingsSection ? toppingsSection.board.cells.map((cell) => ({ boardId: toppingsSection.board.id, cell })) : [],
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
  const iceCreamRailVisuals: Record<string, { center?: string }> = {
    'utility-yes': { center: '✅' },
    'utility-no': { center: '❌' },
  };
  const utilityRailImageVisuals: Record<string, { src: string; className?: string }> = {
    'utility-want': { src: wantImage, className: 'scale-[1.18]' },
    'utility-more': { src: moreImage, className: 'scale-[1.18]' },
    'utility-thanks': { src: '/aac-local/תודה.png', className: 'scale-[1.15]' },
    'utility-price': { src: howMuchImage, className: 'scale-[1.2]' },
  };
  const getUtilityRailImageSrc = (cell: AACCell) => utilityRailImageVisuals[cell.id]?.src ?? cell.imageUrl;
  const iceCreamCategoryButtons = [
    {
      id: 'toppings',
      label: language === 'he' ? 'תוספות' : 'Toppings',
      icon: '🌈',
      onClick: () => runSpokenAction(language === 'he' ? 'תוספות' : 'Toppings', () => navigateToBoard('toppings')),
    },
    {
      id: 'quantity',
      label: language === 'he' ? 'כמות' : 'Quantity',
      icon: '🍦🍦🍦',
      onClick: () => runSpokenAction(language === 'he' ? 'כמות' : 'Quantity', () => navigateToBreadcrumb(0)),
    },
    {
      id: 'flavors',
      label: language === 'he' ? 'טעמים' : 'Flavors',
      icon: '🍨',
      onClick: () => runSpokenAction(
        language === 'he' ? 'טעמים' : 'Flavors',
        () => navigateToBoard(navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup'),
      ),
    },
  ];

  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-hidden bg-[#eef2f8] text-base', className)}>
      {/* Top Bar */}
      {!useIceCreamLayout && (
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary">
              <img
                src="/favicon.png"
                alt="TalkBiz Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden text-base font-bold text-foreground lg:inline">TalkBiz</span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.home')}
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.dashboard')}
            </Link>
            <Link to="/create" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.create')}
            </Link>
          </nav>

          {navState.breadcrumbs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => runSpokenAction(t('aac.back'), navigateBack)}
              className="shrink-0 gap-2 border-slate-300 bg-white"
            >
              <BackIcon className="h-4 w-4" />
              {t('aac.back')}
            </Button>
          )}
          
          {/* Breadcrumbs */}
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
            {navState.breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
                <button
                  onClick={() => runSpokenAction(language === 'he' || language === 'ar' ? crumb.name : crumb.nameEn, () => navigateToBreadcrumb(index))}
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

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Customer Mode Toggle */}
          <Button
            variant={isCustomerMode ? "default" : "outline"}
            size="sm"
            onClick={() => runSpokenAction(
              isCustomerMode
                ? (language === 'he' ? 'צא ממצב לקוח' : 'Exit Customer Mode')
                : (language === 'he' ? 'אני רוצה לדבר' : 'I Want To Talk'),
              () => {
                setIsCustomerMode(!isCustomerMode);
                if (isEditMode) setIsEditMode(false);
              },
            )}
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
              onClick={() => runSpokenAction(
                isEditMode
                  ? (language === 'he' ? 'סיום עריכה' : 'Done')
                  : (language === 'he' ? 'עריכה' : 'Edit'),
                () => setIsEditMode(!isEditMode),
              )}
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
            onClick={() => runSpokenAction(language === 'he' ? 'הגדרות קול' : 'Voice Settings', () => setShowVoiceSettings(true))}
            className="shrink-0"
            aria-label={language === 'he' ? 'הגדרות קול' : 'Voice Settings'}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <LanguageSwitcher variant="compact" />

          {!authLoading && user && (
            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[180px] truncate">{isGuest ? (language === 'he' ? 'אורח' : 'Guest') : user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => runSpokenAction(language === 'he' ? 'התנתק' : 'Sign Out', () => { void handleSignOut(); })} className="gap-2">
                <LogOut className="h-4 w-4" />
                {language === 'he' ? 'התנתק' : 'Sign Out'}
              </Button>
            </div>
          )}
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
            onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal())}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'he' ? 'הוסף פריט' : 'Add Item'}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-2 pb-4 md:p-3 md:pb-6">
          {showMockupSideRail && !useIceCreamLayout && (
            <div className="sticky top-0 z-20 -mx-2 mb-3 border-b border-slate-200 bg-[#eef2f8]/95 px-2 py-2 backdrop-blur lg:hidden md:-mx-3 md:px-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sideRailCells.map((cell) => (
                  <button
                    key={`mobile-${cell.id}`}
                    type="button"
                    onClick={() => handleCellClick(cell)}
                    className={cn(
                      'flex h-[86px] min-w-[76px] shrink-0 flex-col items-center justify-start gap-1 rounded-[16px] border-[2px] border-[#cad3e4] bg-white px-1.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_2px_6px_rgba(15,23,42,0.06)]',
                      speakingCellId === cell.id && 'ring-2 ring-primary shadow-lg shadow-primary/20'
                    )}
                    aria-label={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                  >
                    <span className="line-clamp-2 min-h-[1.6rem] text-[0.78rem] font-extrabold leading-tight text-slate-800">
                      {language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                    </span>
                    <div className="mt-0 flex h-[2.2rem] w-full items-center justify-center overflow-hidden">
                      {utilityRailImageVisuals[cell.id] ? (
                        <img
                          src={getUtilityRailImageSrc(cell)}
                          alt=""
                          aria-hidden="true"
                          className="max-h-full w-auto object-contain"
                        />
                      ) : (
                        <span
                          className={cn(
                            'leading-none',
                            cell.id === 'utility-question' ? 'text-[1.5rem]' : 'text-[1.3rem]'
                          )}
                          aria-hidden="true"
                        >
                          {cell.icon}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {useIceCreamLayout ? (
            <div className="mx-auto max-w-[1020px] rounded-[30px] border-[3px] border-[#30497a] bg-[#f7f7f2] p-3 shadow-[0_18px_45px_rgba(48,73,122,0.14)]">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_112px]" style={{ direction: 'ltr' }}>
                <section className="space-y-3" dir={contentDir}>
                  {allowEdit && (
                    <div className="flex items-center justify-end gap-2 rounded-[16px] border-[2px] border-[#c8d1e0] bg-white/95 px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
                      <Button
                        variant={isEditMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => runSpokenAction(
                          isEditMode
                            ? (language === 'he' ? 'סיום עריכה' : 'Done')
                            : (language === 'he' ? 'עריכה' : 'Edit'),
                          () => setIsEditMode(!isEditMode),
                        )}
                        className="gap-2"
                      >
                        {isEditMode ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                        {isEditMode ? (language === 'he' ? 'סיום עריכה' : 'Done') : (language === 'he' ? 'עריכה' : 'Edit')}
                      </Button>
                      {isEditMode && !useManualIceCreamLayout && (
                        <Button
                          size="sm"
                          onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal())}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                        </Button>
                      )}
                    </div>
                  )}

                  {isEditMode && (
                    <div className="rounded-[16px] border-[2px] border-primary/20 bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
                      {language === 'he'
                        ? '🛠️ מצב עריכה: לחץ על פריט כדי לערוך או למחוק אותו'
                        : '🛠️ Edit mode: tap an item to edit or delete it'}
                    </div>
                  )}

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
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.serving}
                          </h2>
                          {isEditMode && manualIceCreamSections.serving[0] && (
                            <Button
                              size="sm"
                              onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal(manualIceCreamSections.serving[0].boardId))}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                            </Button>
                          )}
                        </div>

                        <div className={cn('grid gap-3', manualIceCreamSections.serving.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                          {manualIceCreamSections.serving.map(({ boardId, cell }: ManualIceCreamCellEntry) => (
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
                              onDelete={() => handleDeleteCell(cell.id, boardId)}
                              onEdit={() => handleEditCell(cell, boardId)}
                              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.flavors}
                          </h2>
                          {isEditMode && manualIceCreamSections.flavors[0] && (
                            <Button
                              size="sm"
                              onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal(manualIceCreamSections.flavors[0].boardId))}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                            </Button>
                          )}
                        </div>

                        <div className="max-h-[min(56vh,34rem)] overflow-y-auto pe-1">
                          <div className="grid grid-cols-3 gap-4 md:gap-5">
                          {manualIceCreamSections.flavors.map(({ boardId, cell }: ManualIceCreamCellEntry) => {
                            const normalizedFlavorText = `${cell.text ?? ''} ${cell.textEn ?? ''}`.toLowerCase();
                            const shouldEmphasizeFlavorImage = normalizedFlavorText.includes('תות')
                              || normalizedFlavorText.includes('strawberry')
                              || normalizedFlavorText.includes('גלידת וניל')
                              || normalizedFlavorText.includes('vanilla');

                            return (
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
                              onDelete={() => handleDeleteCell(cell.id, boardId)}
                              onEdit={() => handleEditCell(cell, boardId)}
                              className="h-[112px] min-h-[112px] gap-1.5 rounded-[14px] border-[2px] border-[#efcf63] px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:h-[118px] md:min-h-[118px]"
                              labelClassName="min-h-[1.45rem] text-[0.8rem] md:min-h-[1.55rem] md:text-[0.88rem]"
                              imageContainerClassName="min-h-0 px-0 py-0"
                              imageClassName={cn(
                                'h-[84%] w-[84%] max-h-none max-w-none !scale-[2.36] -translate-y-[18%]',
                                shouldEmphasizeFlavorImage && '!scale-[2.76] -translate-y-[20%]'
                              )}
                            />
                            );
                          })}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.toppings}
                          </h2>
                          {isEditMode && manualIceCreamSections.toppings[0] && (
                            <Button
                              size="sm"
                              onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal(manualIceCreamSections.toppings[0].boardId))}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                            </Button>
                          )}
                        </div>

                        <div className={cn('grid gap-3', manualIceCreamSections.toppings.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                          {manualIceCreamSections.toppings.map(({ boardId, cell }: ManualIceCreamCellEntry) => (
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
                              onDelete={() => handleDeleteCell(cell.id, boardId)}
                              onEdit={() => handleEditCell(cell, boardId)}
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
                        onClick={() => runSpokenAction(language === 'he' ? 'טעם אחר' : 'Another flavor', clearSelectedWords)}
                        className="flex min-h-[62px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] px-4 text-xl font-bold text-slate-800"
                      >
                        <span>{language === 'he' ? 'טעם אחר' : 'Another flavor'}</span>
                        <span className="text-3xl" aria-hidden="true">❔</span>
                      </button>
                      <button
                        type="button"
                        onClick={selectedWords.length > 0 ? () => runSpokenAction(language === 'he' ? 'סיימתי לבחור' : 'Done choosing', speakAllWords) : undefined}
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
                      onClick={() => runSpokenAction(language === 'he' ? 'מחק' : 'Delete', clearSelectedWords)}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Trash2 className="h-8 w-8" />
                      <span>{language === 'he' ? 'מחק' : 'Delete'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={selectedWords.length > 0 ? () => runSpokenAction(language === 'he' ? 'כן' : 'Yes', speakAllWords) : undefined}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Check className="h-9 w-9 text-emerald-600" />
                      <span>{language === 'he' ? 'כן' : 'Yes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'לא' : 'No', clearSelectedWords)}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <X className="h-9 w-9 text-rose-500" />
                      <span>{language === 'he' ? 'לא' : 'No'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'חזור' : 'Back', navigateBack)}
                      disabled={navState.breadcrumbs.length === 0}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] disabled:opacity-50"
                    >
                      <BackIcon className="h-9 w-9" />
                      <span>{language === 'he' ? 'חזור' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', () => navigateToBreadcrumb(-1))}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Home className="h-9 w-9" />
                      <span>{language === 'he' ? 'דף ראשי' : 'Home'}</span>
                    </button>
                  </div>
                </section>

                <aside className="grid h-[min(56vh,34rem)] grid-rows-4 gap-4 self-start pe-1" dir={contentDir}>
                  {sideRailCells.map((cell) => {
                    const visual = iceCreamRailVisuals[cell.id] ?? { center: cell.icon };

                    return (
                      <button
                        key={cell.id}
                        type="button"
                        onClick={() => handleCellClick(cell)}
                        className={cn(
                          'flex h-full min-h-0 flex-col items-center justify-start gap-1 rounded-[14px] border-[2px] border-[#c6cfdd] bg-white px-1.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]',
                          speakingCellId === cell.id && 'ring-4 ring-primary shadow-lg shadow-primary/20'
                        )}
                      >
                        <span className="text-[0.78rem] font-extrabold leading-tight text-slate-900">
                          {language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                        </span>

                        <div className="mt-0 flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden">
                          {utilityRailImageVisuals[cell.id] ? (
                            <img
                              src={utilityRailImageVisuals[cell.id].src}
                              alt=""
                              aria-hidden="true"
                              className={cn('h-full w-full max-h-none max-w-none object-contain', utilityRailImageVisuals[cell.id].className)}
                            />
                          ) : (
                            <span className={cn(
                              'leading-none',
                              cell.id === 'utility-question' ? 'text-[1.5rem]' : 'text-[1.35rem]'
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
            <div className={cn('grid min-h-0 gap-3', showMockupSideRail ? 'lg:grid-cols-[minmax(0,1fr)_172px]' : 'grid-cols-1')} style={{ direction: 'ltr' }}>
              <section className="flex min-h-0 flex-col space-y-3" dir={contentDir}>
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
                        onClick={() => runSpokenAction(language === 'he' ? 'טעם אחר' : 'Another flavor', clearSelectedWords)}
                        className="flex min-h-[60px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#bba6de] bg-[linear-gradient(180deg,#efe4ff_0%,#dccbf7_100%)] px-4 text-lg font-bold text-slate-800"
                      >
                        <span>{language === 'he' ? 'טעם אחר' : 'Another flavor'}</span>
                        <span className="text-2xl" aria-hidden="true">❔</span>
                      </button>
                      <button
                        type="button"
                        onClick={selectedWords.length > 0 ? () => runSpokenAction(language === 'he' ? 'סיימתי לבחור' : 'Done choosing', speakAllWords) : undefined}
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
                    <button type="button" onClick={() => runSpokenAction(language === 'he' ? 'תוספות' : 'Toppings', () => navigateToBoard('toppings'))} className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800">
                      <span>{language === 'he' ? 'תוספות' : 'Toppings'}</span>
                      <span className="text-2xl" aria-hidden="true">🌈</span>
                    </button>
                    <button type="button" onClick={() => runSpokenAction(language === 'he' ? 'כמות' : 'Quantity', () => navigateToBreadcrumb(0))} className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800">
                      <span>{language === 'he' ? 'כמות' : 'Quantity'}</span>
                      <span className="text-2xl" aria-hidden="true">🍦🍦🍦</span>
                    </button>
                    <button type="button" onClick={() => runSpokenAction(language === 'he' ? 'טעמים' : 'Flavors', () => navigateToBoard(navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup'))} className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800">
                      <span>{language === 'he' ? 'טעמים' : 'Flavors'}</span>
                      <span className="text-2xl" aria-hidden="true">🍨</span>
                    </button>
                  </div>
                )}

                <div className={cn('grid gap-2.5', useIceCreamLayout ? 'md:grid-cols-5' : 'md:grid-cols-5')}>
                  <button
                    type="button"
                    onClick={() => runSpokenAction(language === 'he' ? 'מחק' : 'Delete', clearSelectedWords)}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
                  >
                    <Trash2 className="h-5 w-5" />
                    {language === 'he' ? 'מחק' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={selectedWords.length > 0 ? () => runSpokenAction(useIceCreamLayout ? (language === 'he' ? 'כן' : 'Yes') : language === 'he' ? 'השמע' : 'Speak', speakAllWords) : undefined}
                    disabled={!useIceCreamLayout && (selectedWords.length === 0 || isSpeaking)}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] disabled:opacity-50"
                  >
                    {useIceCreamLayout ? <Check className="h-6 w-6 text-emerald-600" /> : <Volume2 className={cn('h-5 w-5', isSpeaking && 'animate-pulse')} />}
                    {useIceCreamLayout ? (language === 'he' ? 'כן' : 'Yes') : language === 'he' ? 'השמע' : 'Speak'}
                  </button>
                  <button
                    type="button"
                    onClick={useIceCreamLayout
                      ? () => runSpokenAction(language === 'he' ? 'לא' : 'No', clearSelectedWords)
                      : () => runSpokenAction(language === 'he' ? 'דבר' : 'Talk', () => setIsCustomerMode((prev) => !prev))}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
                  >
                    {useIceCreamLayout ? <X className="h-6 w-6 text-rose-500" /> : <MessageCircle className="h-5 w-5" />}
                    {useIceCreamLayout ? (language === 'he' ? 'לא' : 'No') : language === 'he' ? 'דבר' : 'Talk'}
                  </button>
                  <button
                    type="button"
                    onClick={() => runSpokenAction(language === 'he' ? 'חזור' : 'Back', navigateBack)}
                    disabled={navState.breadcrumbs.length === 0}
                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] disabled:opacity-50"
                  >
                    <BackIcon className="h-5 w-5" />
                    {language === 'he' ? 'חזור' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => runSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', () => navigateToBreadcrumb(-1))}
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
                    onClick={selectedWords.length > 0 ? () => runSpokenAction(language === 'he' ? 'סיימתי לבחור' : 'Done choosing', speakAllWords) : undefined}
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
                <aside className={cn('hidden space-y-2.5 ps-1 lg:block', useIceCreamLayout && 'ps-0')} dir={contentDir}>
                  <div className="grid auto-rows-fr gap-2.5">
                  {sideRailCells.map((cell) => (
                    <AACCard
                      key={cell.id}
                      text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                      imageSearchTerms={[cell.text, cell.textEn]}
                      category={cell.category}
                      icon={cell.icon}
                      imageUrl={getUtilityRailImageSrc(cell)}
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
          setEditingBoardId(null);
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
