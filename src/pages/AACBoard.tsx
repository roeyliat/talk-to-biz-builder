import { useState, useEffect } from 'react';
import { AACDashboard } from '@/components/aac/AACDashboard';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { AACBoard as AACBoardType } from '@/types/aac';
import { getSavedBoardById, updateSavedBoardBoards } from '@/lib/savedBoards';
import { useAuth } from '@/hooks/useAuth';

const shouldUseLatestBusinessTemplate = (businessType: BusinessType) => businessType === 'iceCream';

const shouldRefreshSavedTemplateBoards = (
  savedBoards: Record<string, AACBoardType>,
  latestBoards: Record<string, AACBoardType>
) => {
  const savedBoardIds = Object.keys(savedBoards);
  const latestBoardIds = new Set(Object.keys(latestBoards));

  if (savedBoardIds.length === 0) {
    return false;
  }

  return savedBoardIds.every((boardId) => latestBoardIds.has(boardId));
};

const AACBoard = () => {
  const { boardId } = useParams();
  const [searchParams] = useSearchParams();
  const businessType = searchParams.get('type') as BusinessType || 'cafe';
  const editMode = searchParams.get('edit') === 'true';
  const { user, isGuest, loading: authLoading } = useAuth();
  
  const [boards, setBoards] = useState<Record<string, AACBoardType>>(() => getBoardsForBusinessType(businessType));

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

      const savedBoard = await getSavedBoardById(boardId, user && !isGuest ? user.id : undefined);
      if (savedBoard) {
        if (shouldUseLatestBusinessTemplate(businessType)) {
          const latestBoards = getBoardsForBusinessType(businessType);
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
  }, [authLoading, boardId, businessType, user, isGuest]);
  
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
    <div className="min-h-screen w-screen overflow-x-hidden">
      <AACDashboard 
        boards={boards}
        rootBoardId="main"
        businessType={businessType}
        showAIUpload={false}
        allowEdit={editMode}
        onBoardsChange={handleBoardsChange}
      />
    </div>
  );
};

export default AACBoard;
