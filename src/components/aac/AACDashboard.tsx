import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACBoard, AACCell } from '@/types/aac';
import { BoardEditModal } from './BoardEditModal';
import { CustomerModeOverlay } from './CustomerModeOverlay';
import { VoiceSettingsModal } from '@/components/settings/VoiceSettingsModal';
import { GuestWatermark } from './GuestWatermark';
import { BoardTopNavigation } from './board/BoardTopNavigation';
import { PublicBoardPage } from './board/PublicBoardPage';
import { utilityRailCells } from './board/constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useBoardNavigation } from '@/hooks/useBoardNavigation';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { deriveBoardLayout, getSelectionSummary } from '@/lib/boardLayoutUtils';
import {
  deriveManualIceCreamSections,
  isBuiltInIceCreamBoardSet,
} from '@/lib/boardIceCreamUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClickSound } from '@/hooks/useClickSound';

interface AACDashboardProps {
  boards?: Record<string, AACBoard>;
  rootBoardId?: string;
  showAIUpload?: boolean;
  className?: string;
  businessType?: BusinessType;
  allowEdit?: boolean;
  onBoardsChange?: (boards: Record<string, AACBoard>) => void;
}

export function AACDashboard({
  boards,
  rootBoardId = 'main',
  showAIUpload = true,
  className,
  businessType = 'cafe',
  allowEdit = false,
  onBoardsChange,
}: AACDashboardProps) {
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
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCell, setEditingCell] = useState<AACCell | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<AACCell | null>(null);

  const {
    navState,
    currentBoard,
    isTransitioning,
    navigateToBoard,
    navigateBack,
    navigateToBreadcrumb,
  } = useBoardNavigation({
    boards: activeBoards,
    rootBoardId,
    businessType,
  });

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
  }, [boards, businessType]);

  const updateBoards = useCallback((newBoards: Record<string, AACBoard>) => {
    setLocalBoards(newBoards);
    onBoardsChange?.(newBoards);
  }, [onBoardsChange]);

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
      setSelectedWords((prev) => [...prev, text]);
    }
  }, [activeBoards, getSpokenCellText, navigateToBoard, speakButtonLabel, isEditMode, isCustomerMode]);

  const clearSelectedWords = useCallback(() => {
    setSelectedWords([]);
  }, []);

  const speakAllWords = useCallback(() => {
    if (selectedWords.length > 0) {
      speak(selectedWords.join(' '));
    }
  }, [selectedWords, speak]);

  const handleDeleteCell = useCallback((cellId: string, targetBoardId?: string) => {
    const newBoards = { ...activeBoards };
    const boardId = targetBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    newBoards[boardId] = {
      ...board,
      cells: board.cells.filter((c) => c.id !== cellId),
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
      cells: board.cells.map((c) => (c.id === updatedCell.id ? updatedCell : c)),
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

  const {
    socialCells,
    infoStripCells,
    displayGridCells,
    effectiveGridCols,
  } = deriveBoardLayout(currentBoard);

  const extraSocialCells = socialCells.filter(
    (cell) => !utilityRailCells.some(
      (utilityCell) => utilityCell.text === cell.text || utilityCell.textEn === cell.textEn,
    ),
  ).slice(0, 4);

  const boardTitle = language === 'he' || language === 'ar' ? currentBoard.name : currentBoard.nameEn;
  const selectionSummary = getSelectionSummary(selectedWords, infoStripCells, language);

  const useIceCreamReferenceLayout =
    businessType === 'iceCream'
    && isBuiltInIceCreamBoardSet(activeBoards)
    && ['flavors-cup', 'flavors-cone'].includes(navState.currentBoardId);

  const manualIceCreamSections = useMemo(
    () => deriveManualIceCreamSections(
      activeBoards,
      businessType,
      currentBoard,
      navState.currentBoardId,
      rootBoardId,
      language,
    ),
    [activeBoards, businessType, currentBoard, language, navState.currentBoardId, rootBoardId],
  );

  const useManualIceCreamLayout = businessType === 'iceCream' && Boolean(manualIceCreamSections);
  const useIceCreamLayout = useIceCreamReferenceLayout || useManualIceCreamLayout;
  const iceCreamPrompt = language === 'he' ? 'בחר טעם גלידה' : 'Choose Ice Cream Flavor';
  const iceCreamTitle = boardTitle || (language === 'he' ? 'גלידריה' : 'Ice Cream Shop');
  const iceCreamFlavorCards = displayGridCells.slice(0, 15);

  const iceCreamCategoryButtons = [
    {
      id: 'toppings',
      label: language === 'he' ? 'תוספות' : 'Toppings',
      icon: '🌈',
      onClick: () => runSpokenAction(
        language === 'he' ? 'תוספות' : 'Toppings',
        () => navigateToBoard('toppings'),
      ),
    },
    {
      id: 'quantity',
      label: language === 'he' ? 'כמות' : 'Quantity',
      icon: '🍦🍦🍦',
      onClick: () => runSpokenAction(
        language === 'he' ? 'כמות' : 'Quantity',
        () => navigateToBreadcrumb(0),
      ),
    },
    {
      id: 'flavors',
      label: language === 'he' ? 'טעמים' : 'Flavors',
      icon: '🍨',
      onClick: () => runSpokenAction(
        language === 'he' ? 'טעמים' : 'Flavors',
        () => navigateToBoard(
          navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup',
        ),
      ),
    },
  ];

  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-hidden bg-[#eef2f8] text-base', className)}>
      <BoardTopNavigation
        hidden={useIceCreamLayout}
        navState={navState}
        currentBoard={currentBoard}
        language={language}
        direction={direction}
        t={t}
        BackIcon={BackIcon}
        isCustomerMode={isCustomerMode}
        isEditMode={isEditMode}
        allowEdit={allowEdit}
        authLoading={authLoading}
        user={user}
        isGuest={isGuest}
        onRunSpokenAction={runSpokenAction}
        onNavigateBack={navigateBack}
        onNavigateToBreadcrumb={navigateToBreadcrumb}
        onToggleCustomerMode={() => {
          setIsCustomerMode(!isCustomerMode);
          if (isEditMode) setIsEditMode(false);
        }}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onOpenVoiceSettings={() => setShowVoiceSettings(true)}
        onSignOut={() => { void handleSignOut(); }}
      />

      <PublicBoardPage
        language={language}
        contentDir={contentDir}
        BackIcon={BackIcon}
        useIceCreamLayout={useIceCreamLayout}
        useManualIceCreamLayout={useManualIceCreamLayout}
        useIceCreamReferenceLayout={useIceCreamReferenceLayout}
        manualIceCreamSections={manualIceCreamSections}
        isCustomerMode={isCustomerMode}
        isEditMode={isEditMode}
        allowEdit={allowEdit}
        showMockupSideRail={utilityRailCells.length > 0}
        showAIUpload={showAIUpload}
        isAtRoot={navState.breadcrumbs.length === 0}
        boardTitle={boardTitle}
        iceCreamTitle={iceCreamTitle}
        iceCreamPrompt={iceCreamPrompt}
        selectionSummary={selectionSummary}
        selectedWordsCount={selectedWords.length}
        displayGridCells={displayGridCells}
        iceCreamFlavorCards={iceCreamFlavorCards}
        infoStripCells={infoStripCells}
        extraSocialCells={extraSocialCells}
        effectiveGridCols={effectiveGridCols}
        isTransitioning={isTransitioning}
        speakingCellId={speakingCellId}
        isSpeaking={isSpeaking}
        canNavigateBack={navState.breadcrumbs.length > 0}
        iceCreamCategoryButtons={iceCreamCategoryButtons}
        onRunSpokenAction={runSpokenAction}
        onCellClick={handleCellClick}
        onDeleteCell={handleDeleteCell}
        onEditCell={handleEditCell}
        onOpenAddItemModal={openAddItemModal}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onClearSelection={clearSelectedWords}
        onSpeakSelection={speakAllWords}
        onToggleCustomerMode={() => setIsCustomerMode((prev) => !prev)}
        onNavigateBack={navigateBack}
        onNavigateHome={() => navigateToBreadcrumb(-1)}
        onNavigateToToppings={() => navigateToBoard('toppings')}
        onNavigateToQuantity={() => navigateToBreadcrumb(0)}
        onNavigateToFlavors={() => navigateToBoard(
          navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup',
        )}
      />

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

      {isCustomerMode && (
        <CustomerModeOverlay
          cell={selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}

      <VoiceSettingsModal
        open={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />

      {isGuest && <GuestWatermark />}
    </div>
  );
}
