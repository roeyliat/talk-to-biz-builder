import { Link } from 'react-router-dom';
import {
  CircleHelp,
  Check,
  Grid2X2,
  Headphones,
  Home,
  LogOut,
  Settings,
  X,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

// Exact vector paths exported from Figma (node I4156:1584;4161:1133;2010:66 and
// I4156:1584;4161:1137;2011:66) — fill uses currentColor so the existing
// active/inactive tinting pattern used by the other tabs still applies.
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

// Raster assets downloaded verbatim from Figma (nodes I4156:1584;4161:1130
// "השמע כבוי 1" and I4156:1584;4161:1403 "talktobiZLogonotext 1").
const LISTENING_MODE_ICON_SRC = '/aac-local/nav/מצב השמעה.png';
const TALKTOBIZ_LOGO_ICON_SRC = '/aac-local/nav/talktobiZ-icon.png';

interface Breadcrumb {
  id: string;
  name: string;
  nameEn: string;
}

interface BoardTopNavigationProps {
  backLabel: string;
  backIcon: LucideIcon;
  homeLabel: string;
  dashboardLabel: string;
  createLabel: string;
  breadcrumbs: Breadcrumb[];
  currentBoardName: string;
  language: string;
  isCustomerMode: boolean;
  isEditMode: boolean;
  isListeningMode: boolean;
  allowEdit: boolean;
  authLoading: boolean;
  userEmail?: string | null;
  isGuest?: boolean;
  guestLabel: string;
  signOutLabel: string;
  voiceSettingsLabel: string;
  customerModeOnLabel: string;
  customerModeOffLabel: string;
  editOnLabel: string;
  editOffLabel: string;
  listeningModeOnLabel: string;
  listeningModeOffLabel: string;
  keyboardLabel: string;
  helpLabel: string;
  onBack: () => void;
  onBreadcrumb: (index: number) => void;
  onHome: () => void;
  onToggleCustomerMode: () => void;
  onToggleEditMode: () => void;
  onToggleListeningMode: () => void;
  onVoiceSettings: () => void;
  onSignOut: () => void;
  onKeyboard: () => void;
  onHelp: () => void;
  isRootView?: boolean;
}

export function BoardTopNavigation({
  homeLabel,
  dashboardLabel,
  allowEdit,
  authLoading,
  userEmail,
  isGuest,
  guestLabel,
  signOutLabel,
  voiceSettingsLabel,
  customerModeOnLabel,
  customerModeOffLabel,
  editOnLabel,
  editOffLabel,
  listeningModeOnLabel,
  listeningModeOffLabel,
  keyboardLabel,
  helpLabel,
  language,
  isCustomerMode,
  isEditMode,
  isListeningMode,
  onHome,
  onToggleCustomerMode,
  onToggleEditMode,
  onToggleListeningMode,
  onVoiceSettings,
  onSignOut,
  onKeyboard,
  onHelp,
  isRootView = false,
}: BoardTopNavigationProps) {
  const isRtl = language === 'he' || language === 'ar';

  const navItemClassName =
    'flex h-10 w-12 shrink-0 flex-col items-center justify-between bg-transparent px-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  const labelClassName = (isActive: boolean) =>
    cn(
      'text-[11px] font-semibold leading-none tracking-[0.2px]',
      isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]',
    );

  const iconClassName = (isActive: boolean) =>
    cn('h-6 w-6 shrink-0', isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]');

  return (
    <header className="z-40 mx-auto w-full max-w-[375px] shrink-0 bg-white pt-[env(safe-area-inset-top,0px)]">
      <nav
        className="flex w-full flex-col py-2"
        dir={isRtl ? 'rtl' : 'ltr'}
        aria-label={isRtl ? 'ניווט ראשי' : 'Primary navigation'}
      >
        {isRootView && allowEdit && (
          <div
            className={cn(
              'mb-1 flex w-full shrink-0 items-center gap-1 px-9',
              isRtl ? 'justify-start' : 'justify-end',
            )}
          >
            <LanguageSwitcher variant="compact" />
            {!authLoading && userEmail && (
              <button
                type="button"
                onClick={onSignOut}
                className="shrink-0 rounded p-0.5 text-[#a09cab] transition-colors hover:text-[#1c1b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={signOutLabel}
                title={isGuest ? guestLabel : userEmail}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-1 opacity-80 transition-opacity hover:opacity-100"
              aria-label="TalkToBiz"
            >
              <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-md bg-primary">
                <img src="/favicon.png" alt="" aria-hidden="true" className="h-full w-full object-cover" />
              </span>
              <span className="text-[11px] font-semibold leading-none tracking-[0.2px] text-[#a09cab]">
                TalkBiz
              </span>
            </Link>
          </div>
        )}

        {allowEdit ? (
          <div className="flex w-full items-start justify-between px-9">
            <button
              type="button"
              onClick={onHome}
              className={navItemClassName}
              aria-current={isRootView ? 'page' : undefined}
              aria-label={homeLabel}
            >
              <Home className={iconClassName(isRootView)} aria-hidden="true" />
              <span className={labelClassName(isRootView)}>{homeLabel}</span>
            </button>

            <button
              type="button"
              onClick={onToggleEditMode}
              className={navItemClassName}
              aria-pressed={isEditMode}
              aria-label={isEditMode ? editOnLabel : editOffLabel}
            >
              {isEditMode ? (
                <Check className={iconClassName(true)} aria-hidden="true" />
              ) : (
                <Grid2X2 className={iconClassName(isEditMode)} aria-hidden="true" />
              )}
              <span className={labelClassName(isEditMode)}>
                {isEditMode ? editOnLabel : editOffLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={onVoiceSettings}
              className={navItemClassName}
              aria-label={voiceSettingsLabel}
            >
              <Settings className={iconClassName(false)} aria-hidden="true" />
              <span className={labelClassName(false)}>{voiceSettingsLabel}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCustomerMode}
              className={navItemClassName}
              aria-pressed={isCustomerMode}
              aria-label={isCustomerMode ? customerModeOnLabel : customerModeOffLabel}
            >
              {isCustomerMode ? (
                <X className={iconClassName(true)} aria-hidden="true" />
              ) : (
                <CircleHelp className={iconClassName(false)} aria-hidden="true" />
              )}
              <span className={labelClassName(isCustomerMode)}>
                {isCustomerMode ? customerModeOnLabel : customerModeOffLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleListeningMode}
              className={navItemClassName}
              aria-pressed={isListeningMode}
              aria-label={isListeningMode ? listeningModeOnLabel : listeningModeOffLabel}
            >
              <Headphones
                className={cn('h-6 w-6 shrink-0', isListeningMode ? 'text-[#22c55e]' : 'text-[#a09cab]')}
                aria-hidden="true"
              />
              <span className={cn('text-[11px] font-semibold leading-none tracking-[0.2px]', isListeningMode ? 'text-[#22c55e]' : 'text-[#a09cab]')}>
                {isListeningMode ? listeningModeOnLabel : listeningModeOffLabel}
              </span>
            </button>
          </div>
        ) : (
          // Figma "עמוד ראשי" top tab bar (node 4156:1584): ראשי, מצב השמעה, מקלדת,
          // עזרה, then the static TalkToBiz logo. Edit/voice-settings/customer-mode
          // are intentionally not exposed here — they remain fully available in the
          // owner's edit-mode nav above.
          <div className="flex w-full items-start justify-between px-9">
            <button
              type="button"
              onClick={onHome}
              className={navItemClassName}
              aria-current={isRootView ? 'page' : undefined}
              aria-label={homeLabel}
            >
              {/* Figma's "ראשי" tab uses its own neutral gray (#8e8e93) rather
                  than the dark active/inactive tinting the other tabs use. */}
              <Home className="h-6 w-6 shrink-0 text-[#8e8e93]" aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-none tracking-[0.2px] text-[#8e8e93]">
                {homeLabel}
              </span>
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
                className="h-6 w-6 shrink-0 object-contain"
              />
              <span className={cn('text-[11px] font-semibold leading-none tracking-[0.2px]', isListeningMode ? 'text-[#22c55e]' : 'text-[#a09cab]')}>
                {isListeningMode ? listeningModeOnLabel : listeningModeOffLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={onKeyboard}
              className={navItemClassName}
              aria-label={keyboardLabel}
            >
              <KeyboardOutlineIcon className={iconClassName(false)} />
              <span className={labelClassName(false)}>{keyboardLabel}</span>
            </button>

            <button
              type="button"
              onClick={onHelp}
              className={navItemClassName}
              aria-label={helpLabel}
            >
              <HelpOutlineIcon className={iconClassName(false)} />
              <span className={labelClassName(false)}>{helpLabel}</span>
            </button>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
              <img src={TALKTOBIZ_LOGO_ICON_SRC} alt="" className="h-10 w-10 object-contain" />
            </span>
          </div>
        )}
      </nav>
    </header>
  );
}
