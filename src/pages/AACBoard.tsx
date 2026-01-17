import { AACDashboard } from '@/components/aac/AACDashboard';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';

const AACBoard = () => {
  const { boardId } = useParams();
  const [searchParams] = useSearchParams();
  const businessType = searchParams.get('type') as BusinessType || 'cafe';
  
  // Get boards for the business type
  const boards = getBoardsForBusinessType(businessType);
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <AACDashboard 
        boards={boards}
        rootBoardId="main"
        businessType={businessType}
        showAIUpload={false}
      />
    </div>
  );
};

export default AACBoard;
