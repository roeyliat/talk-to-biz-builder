import { cn } from '@/lib/utils';
import { CSSProperties, forwardRef } from 'react';
import { FolderOpen } from 'lucide-react';

export type FitzgeraldCategory = 'people' | 'verbs' | 'descriptors' | 'social';

interface AACCardProps {
  text: string;
  category: FitzgeraldCategory;
  icon?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  isFolder?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const categoryStyles: Record<FitzgeraldCategory, string> = {
  people: 'fitzgerald-yellow',
  verbs: 'fitzgerald-green',
  descriptors: 'fitzgerald-blue',
  social: 'fitzgerald-pink',
};

const sizeStyles = {
  sm: 'h-24 text-sm',
  md: 'h-32 text-base',
  lg: 'h-40 text-lg',
};

export const AACCard = forwardRef<HTMLButtonElement, AACCardProps>(
  ({ text, category, icon, imageUrl, size = 'md', isFolder, onClick, className, style, disabled }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        style={style}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 rounded-xl p-3',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-1 hover:shadow-lg',
          'active:translate-y-0 active:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          categoryStyles[category],
          sizeStyles[size],
          // Stacked card appearance for folders
          isFolder && 'before:absolute before:inset-1 before:-z-10 before:rounded-xl before:bg-inherit before:opacity-60 before:translate-x-1 before:translate-y-1',
          className
        )}
        aria-label={isFolder ? `${text} - folder` : text}
      >
        {/* Folder indicator */}
        {isFolder && (
          <div className="absolute top-2 end-2 p-1 rounded-md bg-foreground/10">
            <FolderOpen className="h-3 w-3 text-foreground/70" />
          </div>
        )}

        {/* Icon or Image */}
        <div className="flex-1 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={text} 
              className="max-h-full max-w-full object-contain"
            />
          ) : icon ? (
            <span className="text-3xl md:text-4xl">{icon}</span>
          ) : (
            <div className="h-8 w-8 rounded-full bg-foreground/10" />
          )}
        </div>
        
        {/* Text Label */}
        <span className="font-semibold text-foreground text-center leading-tight line-clamp-2">
          {text}
        </span>
      </button>
    );
  }
);

AACCard.displayName = 'AACCard';
