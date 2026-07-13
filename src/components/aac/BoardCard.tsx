import { AACCard } from './AACCard';
import { AACCell } from '@/types/aac';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  cell: AACCell;
  label: string;
  isFolder?: boolean;
  isEditMode?: boolean;
  isSpeaking?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

const isFlavorCard = (cell: AACCell) => cell.linkToBoardId === 'toppings';

const isLongFlavorLabel = (label: string) => {
  const trimmed = label.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  return trimmed.length > 12 || wordCount > 2;
};

export function BoardCard({
  cell,
  label,
  isFolder,
  isEditMode,
  isSpeaking,
  onClick,
  onDelete,
  onEdit,
  className,
}: BoardCardProps) {
  const categoryClassName = {
    people: 'border-transparent bg-[#ccedcc]',
    verbs: 'border-transparent bg-[#ccedcc]',
    descriptors: 'border-transparent bg-[#e8f2ff]',
    social: 'border-black bg-white',
  }[cell.category];

  const flavorCard = isFlavorCard(cell);
  const longLabel = flavorCard && isLongFlavorLabel(label);

  return (
    <AACCard
      text={label}
      imageSearchTerms={[cell.text, cell.textEn]}
      category={cell.category}
      icon={cell.icon}
      imageUrl={cell.imageUrl}
      isFolder={isFolder}
      onClick={onClick}
      size="lg"
      variant="mockup"
      labelPosition="bottom"
      isEditMode={isEditMode}
      isSpeaking={isSpeaking}
      onDelete={onDelete}
      onEdit={onEdit}
      className={cn(
        'relative mx-auto flex !h-[153px] !min-h-[153px] !max-h-[153px] w-full max-w-[153px] flex-col !gap-0 !rounded-[24px] border !px-2 !py-0 shadow-[0_2px_4px_rgba(0,0,0,0.06)]',
        '[&>div.rounded-md]:top-3 [&>div.rounded-md]:end-3',
        // Fixed title band (~30% of 153px) — AACCard bottom label is a direct span child
        '[&>span]:flex [&>span]:h-[46px] [&>span]:min-h-[46px] [&>span]:max-h-[46px] [&>span]:shrink-0 [&>span]:grow-0',
        '[&>span]:items-center [&>span]:justify-center [&>span]:overflow-hidden [&>span]:px-1',
        '[&>span]:text-center [&>span]:font-semibold [&>span]:tracking-[0.2px] [&>span]:text-[#1c1b1f]',
        // Short labels keep 21px; long flavor names wrap to 2 lines without ellipsis
        longLabel
          ? '[&>span]:!line-clamp-none [&>span]:whitespace-normal [&>span]:break-words [&>span]:text-[14px] [&>span]:leading-[1.05]'
          : '[&>span]:text-[21px] [&>span]:leading-[22px]',
        categoryClassName,
        className,
      )}
      imageContainerClassName="!flex !h-[107px] !min-h-[107px] !max-h-[107px] !w-full !flex-none !grow-0 !shrink-0 !items-center !justify-center !overflow-hidden !p-0"
      imageClassName={cn(
        'object-contain object-center',
        flavorCard
          // Cap at ~90% of image region; neutralize AACCard flavor scale-* boosts
          ? '!h-[90%] !w-[90%] !max-h-[90%] !max-w-[90%] !scale-100 !transform-none'
          : '!h-full !w-full !max-h-full !max-w-full',
      )}
    />
  );
}
