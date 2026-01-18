import { useState } from 'react';
import { AACDashboard } from '@/components/aac/AACDashboard';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { AACBoard as AACBoardType } from '@/types/aac';

const AACBoard = () => {
  const { boardId } = useParams();
  const [searchParams] = useSearchParams();
  const businessType = searchParams.get('type') as BusinessType || 'cafe';
  const editMode = searchParams.get('edit') === 'true';
  
  // Get initial boards for the business type
  const [boards, setBoards] = useState<Record<string, AACBoardType>>(() => 
    getBoardsForBusinessType(businessType)
  );
  
  const handleBoardsChange = (newBoards: Record<string, AACBoardType>) => {
    setBoards(newBoards);
    // In a full implementation, this would save to database
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
