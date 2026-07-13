import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BoardPageTitleProps {
  title: string;
  prompt: string;
  headerIconSrc?: string;
  useIceCreamLayout?: boolean;
  compact?: boolean;
}

export function BoardPageTitle({
  title,
  prompt,
  headerIconSrc = '/aac-local/ice-cream.svg',
  useIceCreamLayout = false,
  compact = false,
}: BoardPageTitleProps) {
  if (compact) {
    return (
      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
        <div className="flex items-center justify-center gap-4">
          <img
            src={headerIconSrc}
            alt=""
            aria-hidden="true"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-[3.35rem]">
            {title}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        'border-[3px] border-[#30497a] bg-white text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
        useIceCreamLayout ? 'rounded-[18px] px-4 py-3 md:px-6 md:py-4' : 'rounded-[22px] px-4 py-3 md:px-5',
      )}>
        <div className="flex items-center justify-center gap-3">
          <img
            src={headerIconSrc}
            alt=""
            aria-hidden="true"
            className={cn('h-10 w-10 object-contain', useIceCreamLayout && 'h-14 w-14')}
          />
          <h1 className={cn(
            'font-extrabold tracking-tight text-slate-900',
            useIceCreamLayout ? 'text-3xl md:text-[3.1rem]' : 'text-xl md:text-[2rem]',
          )}>
            {title}
          </h1>
        </div>
      </div>

      <div className={cn(
        'flex min-h-0 flex-1 flex-col border-[3px] border-[#30497a] bg-white',
        useIceCreamLayout ? 'rounded-[18px] p-3' : 'rounded-[22px] p-3 md:p-3.5',
      )}>
        <div className="mb-3 text-center">
          <h2 className={cn(
            'font-extrabold text-slate-800',
            useIceCreamLayout ? 'text-lg md:text-[1.95rem]' : 'text-base md:text-xl',
          )}>
            {prompt}
          </h2>
        </div>
      </div>
    </>
  );
}

interface BoardPagePromptProps {
  prompt: string;
  useIceCreamLayout?: boolean;
  className?: string;
}

export function BoardPagePrompt({
  prompt,
  useIceCreamLayout = false,
  className,
}: BoardPagePromptProps) {
  return (
    <div className={cn('mb-3 text-center', className)}>
      <h2 className={cn(
        'font-extrabold text-slate-800',
        useIceCreamLayout ? 'text-lg md:text-[1.95rem]' : 'text-base md:text-xl',
      )}>
        {prompt}
      </h2>
    </div>
  );
}

interface BoardPageHeaderProps {
  title: string;
  headerIconSrc?: string;
  useIceCreamLayout?: boolean;
  compact?: boolean;
}

export function BoardPageHeader({
  title,
  headerIconSrc = '/aac-local/ice-cream.svg',
  useIceCreamLayout = false,
  compact = false,
}: BoardPageHeaderProps) {
  if (compact) {
    return (
      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
        <div className="flex items-center justify-center gap-4">
          <img
            src={headerIconSrc}
            alt=""
            aria-hidden="true"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-[3.35rem]">
            {title}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'border-[3px] border-[#30497a] bg-white text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
      useIceCreamLayout ? 'rounded-[18px] px-4 py-3 md:px-6 md:py-4' : 'rounded-[22px] px-4 py-3 md:px-5',
    )}>
      <div className="flex items-center justify-center gap-3">
        <img
          src={headerIconSrc}
          alt=""
          aria-hidden="true"
          className={cn('h-10 w-10 object-contain', useIceCreamLayout && 'h-14 w-14')}
        />
        <h1 className={cn(
          'font-extrabold tracking-tight text-slate-900',
          useIceCreamLayout ? 'text-3xl md:text-[3.1rem]' : 'text-xl md:text-[2rem]',
        )}>
          {title}
        </h1>
      </div>
    </div>
  );
}

interface BoardPagePanelProps {
  children: ReactNode;
  useIceCreamLayout?: boolean;
}

export function BoardPagePanel({ children, useIceCreamLayout = false }: BoardPagePanelProps) {
  return (
    <div className={cn(
      'flex min-h-0 flex-1 flex-col border-[3px] border-[#30497a] bg-white',
      useIceCreamLayout ? 'rounded-[18px] p-3' : 'rounded-[22px] p-3 md:p-3.5',
    )}>
      {children}
    </div>
  );
}
