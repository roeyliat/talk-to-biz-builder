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
        'relative mx-auto flex !h-[153px] !min-h-[153px] !max-h-[153px] w-full max-w-[153px] flex-col !gap-1 !rounded-[24px] border !px-6 !py-4 shadow-[0_2px_4px_rgba(0,0,0,0.06)]',
        '[&>div.rounded-md]:top-3 [&>div.rounded-md]:end-3',
        categoryClassName,
        className,
      )}
      labelClassName="mt-auto pb-1.5 text-center text-[21px] font-semibold leading-[34px] tracking-[0.2px] text-[#1c1b1f] line-clamp-2"
      imageContainerClassName="!min-h-0 flex-1 px-0 py-0"
      imageClassName="!h-[130px] !w-[130px] !max-h-[130px] !max-w-[130px] object-contain object-center -translate-y-1.5"
    />
  );
}
