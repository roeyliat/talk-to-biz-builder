import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Figma outline icons (BoardTopNavigation / node 4156:1584). Neutral chrome only. */
function KeyboardOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 12C0 13.1 0.9 14 2 14H18C19.1 14 20 13.1 20 12V2C20 0.9 19.1 0 18 0ZM9 3H11V5H9V3ZM9 6H11V8H9V6ZM6 3H8V5H6V3ZM6 6H8V8H6V6ZM5 8H3V6H5V8ZM5 5H3V3H5V5ZM14 12H6V10H14V12ZM14 8H12V6H14V8ZM14 5H12V3H14V5ZM17 8H15V6H17V8ZM17 5H15V3H17V5Z"
      />
    </svg>
  );
}

function HelpOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 16H11V14H9V16ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 4C7.79 4 6 5.79 6 8H8C8 6.9 8.9 6 10 6C11.1 6 12 6.9 12 8C12 10 9 9.75 9 13H11C11 10.75 14 10.5 14 8C14 5.79 12.21 4 10 4Z"
      />
    </svg>
  );
}

const LISTENING_MODE_ICON_SRC = '/aac-local/nav/מצב השמעה.png';
const TALKTOBIZ_LOGO_ICON_SRC = '/aac-local/nav/talktobiZ-icon.png';

export interface AacTopBarProps {
  language: string;
  homeLabel: string;
  listeningModeOnLabel: string;
  listeningModeOffLabel: string;
  keyboardLabel: string;
  helpLabel: string;
  isRootView?: boolean;
  isListeningMode: boolean;
  onHome: () => void;
  onToggleListeningMode: () => void;
  onKeyboard: () => void;
  onHelp: () => void;
  className?: string;
}

/**
 * Global AAC top bar — same controls on every board/business.
 * Neutral chrome only (no Fitzgerald / POS category colors).
 * Handlers are supplied by the parent (AACDashboard); no duplicated navigation logic.
 */
export function AacTopBar({
  language,
  homeLabel,
  listeningModeOnLabel,
  listeningModeOffLabel,
  keyboardLabel,
  helpLabel,
  isRootView = false,
  isListeningMode,
  onHome,
  onToggleListeningMode,
  onKeyboard,
  onHelp,
  className,
}: AacTopBarProps) {
  const isRtl = language === 'he' || language === 'ar';

  const navItemClassName =
    'flex h-10 w-12 shrink-0 flex-col items-center justify-between bg-transparent px-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  const mutedIcon = 'h-6 w-6 shrink-0 text-[#8e8e93]';
  const mutedLabel = 'text-[11px] font-semibold leading-none tracking-[0.2px] text-[#8e8e93]';
  const listeningLabel = cn(
    'text-[11px] font-semibold leading-none tracking-[0.2px]',
    isListeningMode ? 'text-[#1c1b1f]' : 'text-[#8e8e93]',
  );

  return (
    <header
      className={cn(
        'z-40 mx-auto w-full max-w-[375px] shrink-0 bg-white pt-[env(safe-area-inset-top,0px)]',
        className,
      )}
    >
      <nav
        className="flex w-full items-start justify-between px-9 py-2"
        dir={isRtl ? 'rtl' : 'ltr'}
        aria-label={isRtl ? 'ניווט ראשי' : 'Primary navigation'}
      >
        <button
          type="button"
          onClick={onHome}
          className={navItemClassName}
          aria-current={isRootView ? 'page' : undefined}
          aria-label={homeLabel}
        >
          <Home className={mutedIcon} aria-hidden="true" />
          <span className={mutedLabel}>{homeLabel}</span>
        </button>

        <button
          type="button"
          onClick={onToggleListeningMode}
          className={navItemClassName}
          aria-pressed={isListeningMode}
          aria-label={isListeningMode ? listeningModeOnLabel : listeningModeOffLabel}
        >
          <img
            src={LISTENING_MODE_ICON_SRC}
            alt=""
            aria-hidden="true"
            className={cn(
              'h-6 w-6 shrink-0 object-contain',
              isListeningMode ? 'opacity-100' : 'opacity-70',
            )}
          />
          <span className={listeningLabel}>
            {isListeningMode ? listeningModeOnLabel : listeningModeOffLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={onKeyboard}
          className={navItemClassName}
          aria-label={keyboardLabel}
        >
          <KeyboardOutlineIcon className={mutedIcon} />
          <span className={mutedLabel}>{keyboardLabel}</span>
        </button>

        <button
          type="button"
          onClick={onHelp}
          className={navItemClassName}
          aria-label={helpLabel}
        >
          <HelpOutlineIcon className={mutedIcon} />
          <span className={mutedLabel}>{helpLabel}</span>
        </button>

        {/* Branding only — not interactive */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
          <img src={TALKTOBIZ_LOGO_ICON_SRC} alt="" className="h-10 w-10 object-contain" />
        </span>
      </nav>
    </header>
  );
}
