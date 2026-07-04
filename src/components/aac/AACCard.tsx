import { cn } from '@/lib/utils';
import { CSSProperties, forwardRef, useEffect, useState } from 'react';
import { FolderOpen, X, Pencil } from 'lucide-react';
import { useResolvedAacImage } from '@/hooks/useResolvedAacImage';

export type FitzgeraldCategory = 'people' | 'verbs' | 'descriptors' | 'social';

interface AACCardProps {
  text: string;
  imageSearchTerms?: string[];
  category: FitzgeraldCategory;
  icon?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'fitzgerald' | 'mockup' | 'rail' | 'utility';
  labelPosition?: 'top' | 'bottom';
  isFolder?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  isEditMode?: boolean;
  isSpeaking?: boolean; // NEW: Visual feedback during speech
  onDelete?: () => void;
  onEdit?: () => void;
}

const categoryStyles: Record<FitzgeraldCategory, string> = {
  people: 'fitzgerald-yellow',
  verbs: 'fitzgerald-green',
  descriptors: 'fitzgerald-pink',
  social: 'fitzgerald-blue',
};

const sizeStyles = {
  sm: 'h-24 text-sm',
  md: 'h-32 text-base',
  lg: 'h-40 text-lg',
};

const variantStyles = {
  fitzgerald: '',
  mockup: 'border-[2.5px] border-[#efcf63] bg-[linear-gradient(180deg,#fffef6_0%,#fff3c9_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.10)] text-slate-800',
  rail: 'border-[2.5px] border-[#c8d1e0] bg-[linear-gradient(180deg,#ffffff_0%,#f5f7fb_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] text-slate-800',
  utility: 'border-[2.5px] border-[#cad3e4] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_3px_10px_rgba(15,23,42,0.06)] text-slate-800',
};

export const AACCard = forwardRef<HTMLButtonElement, AACCardProps>(
  ({ text, imageSearchTerms = [], category, icon, imageUrl, size = 'md', variant = 'fitzgerald', labelPosition, isFolder, onClick, className, style, disabled, isEditMode, isSpeaking, onDelete, onEdit }, ref) => {
    const usesMockupSurface = variant !== 'fitzgerald';
    const isMockupCard = variant === 'mockup';
    const isRailCard = variant === 'rail';
    const isUtilityCard = variant === 'utility';
    const isBoardStyleCard = usesMockupSurface;
    const resolvedLabelPosition = labelPosition ?? (usesMockupSurface ? 'top' : 'bottom');
    const [primarySearchTerm, ...fallbackSearchTerms] = imageSearchTerms;
    const resolvedImageUrl = useResolvedAacImage({
      text: primarySearchTerm ?? text,
      imageUrl,
      fallbackTerms: fallbackSearchTerms,
      allowCloudFallback: !icon,
    });
    const [hasImageError, setHasImageError] = useState(false);

    useEffect(() => {
      setHasImageError(false);
    }, [resolvedImageUrl]);

    const fallbackIcon = isFolder ? '📁' : icon;
    const shouldShowImage = Boolean(resolvedImageUrl) && !hasImageError;

    return (
      <button
        ref={ref}
        onClick={isEditMode ? onEdit : onClick}
        disabled={disabled}
        style={style}
        className={cn(
          'relative flex flex-col items-center gap-2 overflow-hidden rounded-xl p-3',
          'transition-all duration-200 ease-out',
          !isEditMode && 'hover:-translate-y-1 hover:shadow-lg',
          'active:translate-y-0 active:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variant === 'fitzgerald' ? categoryStyles[category] : variantStyles[variant],
          sizeStyles[size],
          // Stacked card appearance for folders
          isFolder && 'before:absolute before:inset-1 before:-z-10 before:rounded-xl before:bg-inherit before:opacity-60 before:translate-x-1 before:translate-y-1',
          isEditMode && 'ring-2 ring-dashed ring-foreground/30 cursor-pointer',
          // Speaking indicator - pulse animation
          isSpeaking && 'ring-4 ring-primary animate-pulse shadow-lg shadow-primary/30',
          className
        )}
        aria-label={isFolder ? `${text} - folder` : text}
      >
        {/* Edit mode controls */}
        {isEditMode && (
          <>
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="absolute -top-2 -end-2 z-10 p-1.5 rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform cursor-pointer"
            >
              <X className="h-3 w-3" />
            </div>
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="absolute -top-2 start-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform cursor-pointer"
            >
              <Pencil className="h-3 w-3" />
            </div>
          </>
        )}

        {/* Folder indicator */}
        {isFolder && !isEditMode && (
          <div className={cn(
            'absolute top-2 end-2 p-1 rounded-md',
            usesMockupSurface ? 'bg-slate-900/10' : 'bg-foreground/10'
          )}>
            <FolderOpen className={cn('h-3 w-3', usesMockupSurface ? 'text-slate-700' : 'text-foreground/70')} />
          </div>
        )}

        {resolvedLabelPosition === 'top' && (
          <span className={cn(
            'text-center leading-tight line-clamp-2',
            isMockupCard && 'min-h-[2rem] font-bold text-slate-800 text-[0.95rem] md:text-base',
            isRailCard && 'min-h-[1.95rem] font-bold text-slate-800 text-[0.98rem]',
            isUtilityCard && 'min-h-[2.2rem] font-extrabold text-slate-800 text-[1rem] leading-snug',
            !usesMockupSurface && 'font-semibold text-foreground'
          )}>
            {text}
          </span>
        )}

        <div
          className={cn(
            'grid min-h-0 flex-1 self-stretch place-items-center overflow-hidden',
            isMockupCard && 'min-h-[112px] px-1 py-1 md:min-h-[126px]',
            isRailCard && 'min-h-[104px] px-1.5 py-1.5 md:min-h-[114px]',
            isUtilityCard && 'min-h-[106px] px-1.5 py-1.5 md:min-h-[118px]'
          )}
        >
          {shouldShowImage ? (
            <img 
              src={resolvedImageUrl} 
              alt={text} 
              onError={() => setHasImageError(true)}
              className={cn(
                'block h-full max-h-full min-h-0 w-full max-w-full self-center justify-self-center object-contain object-center',
                isRailCard && 'max-h-[88px] md:max-h-[96px]',
                isUtilityCard && 'max-h-[90px] md:max-h-[98px]'
              )}
            />
          ) : fallbackIcon ? (
            <span
              className={cn(
                'self-center justify-self-center',
                isMockupCard && 'text-[2.8rem] md:text-[3.2rem]',
                isRailCard && 'text-[2.5rem] md:text-[2.9rem]',
                isUtilityCard && 'text-[2.65rem] md:text-[3rem]',
                !usesMockupSurface && 'text-3xl md:text-4xl'
              )}
            >
              {fallbackIcon}
            </span>
          ) : (
            <div className="h-8 w-8 rounded-full bg-foreground/10" />
          )}
        </div>
        
        {resolvedLabelPosition === 'bottom' && (
          <span className={cn(
            'text-center leading-tight line-clamp-2',
            usesMockupSurface ? 'font-bold text-slate-800 text-[0.95rem] md:text-base' : 'font-semibold text-foreground'
          )}>
            {text}
          </span>
        )}
      </button>
    );
  }
);

AACCard.displayName = 'AACCard';
