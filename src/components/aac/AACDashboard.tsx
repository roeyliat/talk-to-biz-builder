import { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACBoard, AACCell, BoardNavigationState } from '@/types/aac';
import { AACCard } from './AACCard';
import { CoreVocabularySidebar } from './CoreVocabularySidebar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AIUploadPlaceholder } from './AIUploadPlaceholder';
import { BoardEditModal } from './BoardEditModal';
import { CustomerModeOverlay } from './CustomerModeOverlay';
import { VoiceSettingsModal } from '@/components/settings/VoiceSettingsModal';
import { GuestWatermark } from './GuestWatermark';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronRight, Volume2, Trash2, Pencil, Plus, Check, MessageCircle, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const [navState, setNavState] = useState<BoardNavigationState>({
    currentBoardId: rootBoardId,
    breadcrumbs: [],
  });
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

  const handleCellClick = useCallback((cell: AACCell) => {
    if (isEditMode) return;
    
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

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Top Bar */}
      <header className="flex items-center justify-between gap-4 p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          {navState.breadcrumbs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateBack}
              className="gap-2 shrink-0"
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

        <div className="flex items-center gap-2">
          {/* Customer Mode Toggle */}
          <Button
            variant={isCustomerMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setIsCustomerMode(!isCustomerMode);
              if (isEditMode) setIsEditMode(false);
            }}
            className={cn(
              "gap-2",
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
              className="gap-2"
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

      {/* Customer Mode Indicator Bar */}
      {isCustomerMode && !isEditMode && (
        <div className="flex items-center justify-center gap-3 p-3 bg-green-600/20 border-b border-green-600/30">
          <MessageCircle className="h-5 w-5 text-green-700" />
          <p className="text-sm text-green-800 dark:text-green-300 font-medium">
            {language === 'he' 
              ? '🎯 מצב לקוח: לחץ על פריט כדי להציג ולהקריא אותו' 
              : '🎯 Customer Mode: Tap an item to display and speak it'}
          </p>
        </div>
      )}

      {/* Edit Mode Bar */}
      {isEditMode && (
        <div className="flex items-center justify-between gap-3 p-3 bg-primary/10 border-b border-primary/20">
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

      {/* Selected Words Bar */}
      {selectedWords.length > 0 && !isEditMode && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 border-b border-border">
          <div className="flex-1 flex flex-wrap gap-2">
            {selectedWords.map((word, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {isSupported && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={speakAllWords}
                disabled={isSpeaking}
                className="gap-2"
              >
                <Volume2 className={cn("h-4 w-4", isSpeaking && "animate-pulse")} />
                {language === 'he' ? 'השמע הכל' : 'Speak All'}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={clearSelectedWords}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Core Vocabulary Sidebar - hidden in customer mode for cleaner UI */}
        {!isEditMode && !isCustomerMode && <CoreVocabularySidebar onWordClick={handleCoreWordClick} />}

        {/* Main Grid Area */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Board Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'he' || language === 'ar' ? currentBoard.name : currentBoard.nameEn}
            </h1>
          </div>

          {/* AAC Grid */}
          <div 
            className={cn(
              'grid gap-4 max-w-4xl mx-auto transition-all duration-150',
              isTransitioning && 'opacity-0 scale-95',
              !isTransitioning && 'opacity-100 scale-100'
            )}
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {currentBoard.cells.map((cell) => (
              <AACCard
                key={cell.id}
                text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                category={cell.category}
                icon={cell.icon}
                imageUrl={cell.imageUrl}
                isFolder={!!cell.linkToBoardId}
                onClick={() => handleCellClick(cell)}
                size="lg"
                isEditMode={isEditMode}
                isSpeaking={speakingCellId === cell.id}
                onDelete={() => handleDeleteCell(cell.id)}
                onEdit={() => handleEditCell(cell)}
              />
            ))}
          </div>

          {/* AI Upload Placeholder */}
          {showAIUpload && navState.currentBoardId === rootBoardId && !isEditMode && (
            <AIUploadPlaceholder 
              className="mt-8 max-w-2xl mx-auto"
              onUpload={(file) => {
                console.log('File uploaded for AI processing:', file.name);
                // TODO: Integrate with AI service
              }}
            />
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
