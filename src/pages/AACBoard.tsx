import { useState, useEffect } from 'react';
import { AACDashboard } from '@/components/aac/AACDashboard';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { AACBoard as AACBoardType } from '@/types/aac';

const AACBoard = () => {
  const { boardId } = useParams();
  const [searchParams] = useSearchParams();
  const businessType = searchParams.get('type') as BusinessType || 'cafe';
  const editMode = searchParams.get('edit') === 'true';
  
  // Get initial boards - check sessionStorage for custom boards first
  const [boards, setBoards] = useState<Record<string, AACBoardType>>(() => {
    // Check if this is a custom generated board
    if (boardId === 'custom') {
      const storedBoards = sessionStorage.getItem('generatedBoards');
      if (storedBoards) {
        try {
          return JSON.parse(storedBoards);
        } catch {
          console.error('Failed to parse stored boards');
        }
      }
    }
    return getBoardsForBusinessType(businessType);
  });
  
  const handleBoardsChange = (newBoards: Record<string, AACBoardType>) => {
    setBoards(newBoards);
    
    // Save to sessionStorage for custom boards
    if (boardId === 'custom') {
      sessionStorage.setItem('generatedBoards', JSON.stringify(newBoards));
    }
    
    console.log('Boards updated:', newBoards);
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden">
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
