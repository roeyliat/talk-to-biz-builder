import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACCell, AACBoard, BoardNavigationState } from '@/types/aac';
import { AACCard } from './AACCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AACBoardViewProps {
  boards: Record<string, AACBoard>;
  rootBoardId: string;
  onCellClick?: (cell: AACCell) => void;
  className?: string;
}

export function AACBoardView({ boards, rootBoardId, onCellClick, className }: AACBoardViewProps) {
  const { language, direction } = useLanguage();
  const [navState, setNavState] = useState<BoardNavigationState>({
    currentBoardId: rootBoardId,
    breadcrumbs: [],
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentBoard = boards[navState.currentBoardId];
  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

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

  const navigateToBreadcrumb = useCallback((targetIndex: number) => {
    if (targetIndex === -1) {
      // Navigate to root
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

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Navigation Header */}
      {navState.breadcrumbs.length > 0 && (
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
      {navState.breadcrumbs.length === 0 && (
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
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {currentBoard.cells.map((cell) => (
          <AACCard
            key={cell.id}
            text={language === 'he' ? cell.text : cell.textEn}
            category={cell.category}
            icon={cell.icon}
            imageUrl={cell.imageUrl}
            isFolder={!!cell.linkToBoardId}
            onClick={() => handleCellClick(cell)}
          />
        ))}
      </div>
    </div>
  );
}
