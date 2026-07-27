import { AACCell } from '@/types/aac';
import { BoardCard } from './BoardCard';
import { cn } from '@/lib/utils';

interface BoardGridProps {
  cells: AACCell[];
  gridCols: number;
  getLabel: (cell: AACCell) => string;
  isTransitioning?: boolean;
  isEditMode?: boolean;
  speakingCellId?: string | null;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell?: (cellId: string) => void;
  onEditCell?: (cell: AACCell) => void;
  onPreviewCell?: (cell: AACCell) => void;
  previewAriaLabelPrefix?: string;
  prompt: string;
}

export function BoardGrid({
  cells,
  gridCols,
  getLabel,
  isTransitioning,
  isEditMode,
  speakingCellId,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onPreviewCell,
  previewAriaLabelPrefix,
  prompt,
}: BoardGridProps) {
  const visibleColumns = Math.min(2, Math.max(1, gridCols));

  return (
    <div className="mt-1 mb-[29px] flex min-h-0 flex-1 flex-col bg-white">
      <h2 className="sr-only">{prompt}</h2>

      <div
        className={cn(
          'mx-auto grid w-full max-w-[327px] justify-items-center gap-x-[21px] gap-y-[24px] transition-all duration-150',
          isTransitioning && 'scale-95 opacity-0',
          !isTransitioning && 'scale-100 opacity-100',
        )}
        style={{ gridTemplateColumns: `repeat(${visibleColumns}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => (
          <BoardCard
            key={cell.id}
            cell={cell}
            label={getLabel(cell)}
            isFolder={!!cell.linkToBoardId}
            isEditMode={isEditMode}
            isSpeaking={speakingCellId === cell.id}
            onClick={() => onCellClick(cell)}
            onDelete={onDeleteCell ? () => onDeleteCell(cell.id) : undefined}
            onEdit={onEditCell ? () => onEditCell(cell) : undefined}
            onPreview={onPreviewCell ? () => onPreviewCell(cell) : undefined}
            previewAriaLabel={previewAriaLabelPrefix ? `${previewAriaLabelPrefix} ${getLabel(cell)}` : undefined}
          />
        ))}
      </div>
    </div>
  );
}
