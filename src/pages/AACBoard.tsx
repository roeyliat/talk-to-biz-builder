import { useState, useEffect } from 'react';
import { AACDashboard } from '@/components/aac/AACDashboard';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBoardsForBusinessType, businessBoardsData, BusinessType } from '@/data/businessBoards';
import { AACBoard as AACBoardType } from '@/types/aac';
import { getSavedBoardById, updateSavedBoardBoards } from '@/lib/savedBoards';
import { useAuth } from '@/hooks/useAuth';
import { parseSharedBoardPayload } from '@/lib/sharedBoard';

const shouldUseLatestBusinessTemplate = (businessType: BusinessType) => businessType === 'iceCream';

const isKnownBusinessType = (value: string): value is BusinessType => value in businessBoardsData;

const matchesTemplateCell = (savedCell: AACBoardType['cells'][number], latestCell: AACBoardType['cells'][number]) => (
  savedCell.id === latestCell.id
  && savedCell.text === latestCell.text
  && savedCell.textEn === latestCell.textEn
  && savedCell.category === latestCell.category
  && savedCell.icon === latestCell.icon
  && savedCell.linkToBoardId === latestCell.linkToBoardId
);

const matchesTemplateBoardStructure = (savedBoard: AACBoardType, latestBoard: AACBoardType) => {
  if (
    savedBoard.id !== latestBoard.id
    || savedBoard.name !== latestBoard.name
    || savedBoard.nameEn !== latestBoard.nameEn
    || savedBoard.parentBoardId !== latestBoard.parentBoardId
    || savedBoard.gridSize.cols !== latestBoard.gridSize.cols
    || savedBoard.gridSize.rows !== latestBoard.gridSize.rows
    || savedBoard.cells.length !== latestBoard.cells.length
  ) {
    return false;
  }

  const latestCellsById = new Map(latestBoard.cells.map((cell) => [cell.id, cell]));

  return savedBoard.cells.every((savedCell) => {
    const latestCell = latestCellsById.get(savedCell.id);
    return latestCell ? matchesTemplateCell(savedCell, latestCell) : false;
  });
};

const shouldRefreshSavedTemplateBoards = (
  savedBoards: Record<string, AACBoardType>,
  latestBoards: Record<string, AACBoardType>
) => {
  const savedBoardIds = Object.keys(savedBoards);
  const latestBoardIds = new Set(Object.keys(latestBoards));

  if (savedBoardIds.length === 0) {
    return false;
  }

  return savedBoardIds.every((boardId) => {
    if (!latestBoardIds.has(boardId)) {
      return false;
    }

    const savedBoard = savedBoards[boardId];
    const latestBoard = latestBoards[boardId];

    return savedBoard && latestBoard
      ? matchesTemplateBoardStructure(savedBoard, latestBoard)
      : false;
  });
};

const AACBoard = () => {
  const { boardId } = useParams();
  const [searchParams] = useSearchParams();
  const sharedPayload = parseSharedBoardPayload(searchParams.get('s') ?? searchParams.get('shared'));
  const businessType = (sharedPayload?.businessType ?? searchParams.get('type')) as BusinessType || 'cafe';
  const editMode = searchParams.get('edit') === 'true';
  const { user, isGuest, loading: authLoading } = useAuth();
  
  const [boards, setBoards] = useState<Record<string, AACBoardType>>(() => getBoardsForBusinessType(businessType));
  // The URL's `?type=` param is only a hint for the optimistic first paint. Once a saved
  // board record loads, its persisted business_type is the source of truth - if the URL
  // param is missing/stale/wrong, using it instead would silently skip all iceCream-only
  // runtime repairs (e.g. the allergy flow) for that saved board.
  const [effectiveBusinessType, setEffectiveBusinessType] = useState<BusinessType>(businessType);

  useEffect(() => {
    let isMounted = true;

    const loadBoards = async () => {
      if (authLoading) {
        return;
      }

      if (boardId === 'custom') {
        const storedBoards = sessionStorage.getItem('generatedBoards');
        if (storedBoards) {
          try {
            if (isMounted) {
              setBoards(JSON.parse(storedBoards));
            }
            return;
          } catch {
            console.error('Failed to parse stored boards');
          }
        }
      }

      if (sharedPayload?.boards) {
        if (isMounted) {
          setBoards(sharedPayload.boards);
        }
        return;
      }

      const savedBoard = await getSavedBoardById(boardId, user && !isGuest ? user.id : undefined);
      if (savedBoard) {
        // The saved record's own business_type is authoritative - the URL's `?type=`
        // param may be missing or stale (e.g. older/bookmarked links), which would
        // otherwise silently disable the iceCream-only runtime repairs below.
        const savedBusinessType = isKnownBusinessType(savedBoard.business_type)
          ? savedBoard.business_type
          : businessType;

        if (isMounted && savedBusinessType !== effectiveBusinessType) {
          setEffectiveBusinessType(savedBusinessType);
        }

        if (shouldUseLatestBusinessTemplate(savedBusinessType)) {
          const latestBoards = getBoardsForBusinessType(savedBusinessType);
          const shouldRefreshTemplate = shouldRefreshSavedTemplateBoards(savedBoard.boards_data, latestBoards);

          if (shouldRefreshTemplate) {
            if (isMounted) {
              setBoards(latestBoards);
            }

            await updateSavedBoardBoards(boardId!, latestBoards, user && !isGuest ? user.id : undefined);
            return;
          }
        }

        if (isMounted) {
          setBoards(savedBoard.boards_data);
        }
        return;
      }

      if (isMounted) {
        setBoards(getBoardsForBusinessType(businessType));
      }
    };

    void loadBoards();

    return () => {
      isMounted = false;
    };
  }, [authLoading, boardId, businessType, searchParams, user, isGuest]);
  
  const handleBoardsChange = (newBoards: Record<string, AACBoardType>) => {
    setBoards(newBoards);
    
    // Save to sessionStorage for custom boards
    if (boardId === 'custom') {
      sessionStorage.setItem('generatedBoards', JSON.stringify(newBoards));
    } else if (boardId) {
      void updateSavedBoardBoards(boardId, newBoards, user && !isGuest ? user.id : undefined);
    }
    
    console.log('Boards updated:', newBoards);
  };
  
  return (
    <div className="h-screen overflow-hidden bg-muted/30">
      <AACDashboard 
        boards={boards}
        rootBoardId="main"
        businessType={effectiveBusinessType}
        showAIUpload={false}
        allowEdit={editMode}
        onBoardsChange={handleBoardsChange}
        className="h-full min-h-0"
      />
    </div>
  );
};

export default AACBoard;
