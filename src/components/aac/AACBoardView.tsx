import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACCell, AACBoard, BoardNavigationState } from '@/types/aac';
import { AACCard } from './AACCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AACBoardViewProps {
  boards: Record<string, AACBoard>;
  rootBoardId: string;
  onCellClick?: (cell: AACCell) => void;
  className?: string;
  isCustomerMode?: boolean;
}

export function AACBoardView({ boards, rootBoardId, onCellClick, className, isCustomerMode }: AACBoardViewProps) {
  const { language, direction } = useLanguage();
  const [navState, setNavState] = useState<BoardNavigationState>({
    currentBoardId: rootBoardId,
    breadcrumbs: [],
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset to root when rootBoardId changes
  useEffect(() => {
    setNavState({
      currentBoardId: rootBoardId,
      breadcrumbs: [],
    });
  }, [rootBoardId]);

  const currentBoard = boards[navState.currentBoardId];
  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const isAtRoot = navState.breadcrumbs.length === 0;

  const navigateToBoard = useCallback((boardId: string, boardName: string, boardNameEn: string) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setNavState(prev => ({
        currentBoardId: boardId,
        breadcrumbs: [
          ...prev.breadcrumbs,
          { 
            id: prev.currentBoardId, 
            name: boards[prev.currentBoardId].name,
            nameEn: boards[prev.currentBoardId].nameEn 
          }
        ],
      }));
      setIsTransitioning(false);
    }, 150);
  }, [boards]);

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

  const navigateToRoot = useCallback(() => {
    if (isAtRoot) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setNavState({
        currentBoardId: rootBoardId,
        breadcrumbs: [],
      });
      setIsTransitioning(false);
    }, 150);
  }, [rootBoardId, isAtRoot]);

  const navigateToBreadcrumb = useCallback((targetIndex: number) => {
    if (targetIndex === -1) {
      navigateToRoot();
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
  }, [navigateToRoot]);

  const handleCellClick = useCallback((cell: AACCell) => {
    if (cell.linkToBoardId && boards[cell.linkToBoardId]) {
      navigateToBoard(cell.linkToBoardId, cell.text, cell.textEn);
    } else {
      onCellClick?.(cell);
    }
  }, [boards, navigateToBoard, onCellClick]);

  if (!currentBoard) {
    return <div className="text-center text-muted-foreground">Board not found</div>;
  }

  const gridCols = currentBoard.gridSize.cols;

  // Fitzgerald column order. With RTL + column flow the first group lands on the
  // right, so: intentions/social → verbs → nouns → adjectives (right to left).
  const categoryOrder: Record<AACCell['category'], number> = {
    social: 0,
    verbs: 1,
    people: 2,
    descriptors: 3,
  };
  const orderedCells = [...currentBoard.cells].sort(
    (a, b) => categoryOrder[a.category] - categoryOrder[b.category],
  );
  const gridRows = Math.max(1, Math.ceil(orderedCells.length / gridCols));

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Navigation Header */}
      {!isAtRoot && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={navigateBack}
            className="gap-2 shrink-0"
          >
            <BackIcon className="h-4 w-4" />
            {language === 'he' ? 'חזור' : 'Back'}
          </Button>

          {/* Start Over / Home Button - Only show when nested deep */}
          {navState.breadcrumbs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToRoot}
              className="gap-2 shrink-0 text-primary border-primary hover:bg-primary/10"
            >
              <RotateCcw className="h-4 w-4" />
              {language === 'he' ? 'התחל מחדש' : 'Start Over'}
            </Button>
          )}

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            <button
              onClick={() => navigateToBreadcrumb(-1)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'he' ? 'ראשי' : 'Home'}
              </span>
            </button>
            
            {navState.breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[100px]"
                >
                  {language === 'he' ? crumb.name : crumb.nameEn}
                </button>
              </div>
            ))}
            
            <div className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className="font-medium text-foreground truncate max-w-[100px]">
                {language === 'he' ? currentBoard.name : currentBoard.nameEn}
              </span>
            </div>
          </nav>
        </div>
      )}

      {/* Board Title (when at root) */}
      {isAtRoot && (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            {language === 'he' ? currentBoard.name : currentBoard.nameEn}
          </h2>
        </div>
      )}

      {/* AAC Grid */}
      <div 
        className={cn(
          'grid gap-3 transition-all duration-150',
          isTransitioning && 'opacity-0 scale-95',
          !isTransitioning && 'opacity-100 scale-100'
        )}
        style={{
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(0, 1fr)',
        }}
      >
        {orderedCells.map((cell) => (
          <AACCard
            key={cell.id}
            text={language === 'he' ? cell.text : cell.textEn}
            category={cell.category}
            icon={cell.icon}
            imageUrl={cell.imageUrl}
            isFolder={!!cell.linkToBoardId}
            onClick={() => handleCellClick(cell)}
            size={isCustomerMode ? 'lg' : 'md'}
          />
        ))}
      </div>
    </div>
  );
}
