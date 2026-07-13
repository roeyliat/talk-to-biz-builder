import { AACCell } from '@/types/aac';
import { BoardCard } from '@/components/aac/board/BoardCard';
import { cn } from '@/lib/utils';

interface BoardGridProps {
  cells: AACCell[];
  gridCols: number;
  language: string;
  isTransitioning?: boolean;
  isEditMode?: boolean;
  speakingCellId?: string | null;
  useIceCreamLayout?: boolean;
  hideFolderIndicator?: boolean;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell?: (cellId: string, boardId?: string) => void;
  onEditCell?: (cell: AACCell, boardId?: string) => void;
  targetBoardId?: string;
  cardClassName?: string;
  labelClassName?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  gridClassName?: string;
}

export function BoardGrid({
  cells,
  gridCols,
  language,
  isTransitioning = false,
  isEditMode = false,
  speakingCellId = null,
  useIceCreamLayout = false,
  hideFolderIndicator = false,
  onCellClick,
  onDeleteCell,
  onEditCell,
  targetBoardId,
  cardClassName,
  labelClassName,
  imageContainerClassName,
  imageClassName,
  gridClassName,
}: BoardGridProps) {
  return (
    <div
      className={cn(
        'grid gap-2.5 transition-all duration-150 md:gap-3',
        isTransitioning && 'scale-95 opacity-0',
        !isTransitioning && 'scale-100 opacity-100',
        gridClassName,
      )}
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell) => (
        <BoardCard
          key={cell.id}
          text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
          imageSearchTerms={[cell.text, cell.textEn]}
          category={cell.category}
          icon={cell.icon}
          imageUrl={cell.imageUrl}
          isFolder={hideFolderIndicator ? false : !!cell.linkToBoardId}
          onClick={() => onCellClick(cell)}
          size="lg"
          variant="mockup"
          labelPosition="top"
          isEditMode={isEditMode}
          isSpeaking={speakingCellId === cell.id}
          onDelete={onDeleteCell ? () => onDeleteCell(cell.id, targetBoardId) : undefined}
          onEdit={onEditCell ? () => onEditCell(cell, targetBoardId) : undefined}
          className={cn(
            useIceCreamLayout
              ? 'min-h-[102px] rounded-[12px] px-2 py-2 md:min-h-[114px]'
              : 'min-h-[106px] rounded-[16px] px-2 py-2 md:min-h-[118px]',
            cardClassName,
          )}
          labelClassName={labelClassName}
          imageContainerClassName={imageContainerClassName}
          imageClassName={imageClassName}
        />
      ))}
    </div>
  );
}

interface BoardInfoStripProps {
  cells: AACCell[];
  language: string;
  isEditMode?: boolean;
  speakingCellId?: string | null;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell?: (cellId: string) => void;
  onEditCell?: (cell: AACCell) => void;
}

export function BoardInfoStrip({
  cells,
  language,
  isEditMode = false,
  speakingCellId = null,
  onCellClick,
  onDeleteCell,
  onEditCell,
}: BoardInfoStripProps) {
  if (cells.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 grid gap-2.5 md:grid-cols-3">
      {cells.map((cell) => (
        <BoardCard
          key={cell.id}
          text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
          imageSearchTerms={[cell.text, cell.textEn]}
          category={cell.category}
          icon={cell.icon}
          imageUrl={cell.imageUrl}
          isFolder={!!cell.linkToBoardId}
          onClick={() => onCellClick(cell)}
          size="md"
          variant="rail"
          labelPosition="top"
          isEditMode={isEditMode}
          isSpeaking={speakingCellId === cell.id}
          onDelete={onDeleteCell ? () => onDeleteCell(cell.id) : undefined}
          onEdit={onEditCell ? () => onEditCell(cell) : undefined}
          className="min-h-[82px] rounded-[16px] px-3"
        />
      ))}
    </div>
  );
}
