import { useState, useCallback, useEffect } from 'react';
import { AACBoard, BoardNavigationState } from '@/types/aac';
import { BusinessType } from '@/data/businessBoards';
import { buildInitialNavState } from '@/lib/boardIceCreamUtils';

interface UseBoardNavigationOptions {
  boards: Record<string, AACBoard>;
  rootBoardId: string;
  businessType: BusinessType;
}

export function useBoardNavigation({
  boards,
  rootBoardId,
  businessType,
}: UseBoardNavigationOptions) {
  const [navState, setNavState] = useState<BoardNavigationState>(() =>
    buildInitialNavState(boards, businessType, rootBoardId),
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setNavState((prev) => {
      if (boards[prev.currentBoardId]) {
        return prev;
      }

      return buildInitialNavState(boards, businessType, rootBoardId);
    });
  }, [boards, businessType, rootBoardId]);

  const currentBoard = boards[navState.currentBoardId];

  const navigateToBoard = useCallback((boardId: string) => {
    if (!boards[boardId]) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setNavState((prev) => ({
        currentBoardId: boardId,
        breadcrumbs: [
          ...prev.breadcrumbs,
          {
            id: prev.currentBoardId,
            name: boards[prev.currentBoardId].name,
            nameEn: boards[prev.currentBoardId].nameEn,
          },
        ],
      }));
      setIsTransitioning(false);
    }, 150);
  }, [boards]);

  const navigateBack = useCallback(() => {
    if (navState.breadcrumbs.length === 0) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setNavState((prev) => {
        const newBreadcrumbs = [...prev.breadcrumbs];
        const parentBoard = newBreadcrumbs.pop();
        return {
          currentBoardId: parentBoard?.id || rootBoardId,
          breadcrumbs: newBreadcrumbs,
        };
      });
      setIsTransitioning(false);
    }, 150);
  }, [navState.breadcrumbs.length, rootBoardId]);

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
      setNavState((prev) => ({
        currentBoardId: prev.breadcrumbs[targetIndex].id,
        breadcrumbs: prev.breadcrumbs.slice(0, targetIndex),
      }));
      setIsTransitioning(false);
    }, 150);
  }, [rootBoardId]);

  return {
    navState,
    setNavState,
    currentBoard,
    isTransitioning,
    navigateToBoard,
    navigateBack,
    navigateToBreadcrumb,
  };
}
