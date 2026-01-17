import { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACBoard, AACCell, BoardNavigationState } from '@/types/aac';
import { AACCard } from './AACCard';
import { CoreVocabularySidebar } from './CoreVocabularySidebar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AIUploadPlaceholder } from './AIUploadPlaceholder';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronRight, Volume2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';

interface AACDashboardProps {
  boards?: Record<string, AACBoard>;
  rootBoardId?: string;
  showAIUpload?: boolean;
  className?: string;
  businessType?: BusinessType;
}

export function AACDashboard({ 
  boards,
  rootBoardId = 'main',
  showAIUpload = true,
  className,
  businessType = 'cafe'
}: AACDashboardProps) {
  // Use provided boards or get boards based on business type
  const activeBoards = useMemo(() => {
    if (boards) return boards;
    return getBoardsForBusinessType(businessType);
  }, [boards, businessType]);
  const { language, direction, t } = useLanguage();
  const { speak, isSpeaking, isSupported } = useTextToSpeech();
  const [navState, setNavState] = useState<BoardNavigationState>({
    currentBoardId: rootBoardId,
    breadcrumbs: [],
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const currentBoard = activeBoards[navState.currentBoardId];
  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

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
    if (cell.linkToBoardId && activeBoards[cell.linkToBoardId]) {
      navigateToBoard(cell.linkToBoardId);
    } else {
      // Speak the word and add to selected words
      const text = language === 'he' || language === 'ar' ? cell.text : cell.textEn;
      speak(text);
      setSelectedWords(prev => [...prev, text]);
    }
  }, [activeBoards, navigateToBoard, language, speak]);

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

        <LanguageSwitcher variant="compact" />
      </header>

      {/* Selected Words Bar */}
      {selectedWords.length > 0 && (
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
        {/* Core Vocabulary Sidebar */}
        <CoreVocabularySidebar onWordClick={handleCoreWordClick} />

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
              />
            ))}
          </div>

          {/* AI Upload Placeholder */}
          {showAIUpload && navState.currentBoardId === rootBoardId && (
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
    </div>
  );
}
