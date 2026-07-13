import { cn } from '@/lib/utils';

interface BoardPageTitleProps {
  title: string;
  emoji: string;
  className?: string;
}

export function BoardPageTitle({ title, emoji, className }: BoardPageTitleProps) {
  return (
    <div
      className={cn(
        'px-4 pb-1 pt-2 text-center',
        className,
      )}
    >
      <h1 className="text-[20px] font-semibold leading-8 tracking-normal text-[#1c1b1f]">
        {title}
      </h1>
      <span className="sr-only">{emoji}</span>
    </div>
  );
}
