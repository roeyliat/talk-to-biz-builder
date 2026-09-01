import { Link } from 'react-router-dom';
import {
  CircleHelp,
  Check,
  Grid2X2,
  LogOut,
  Settings,
  X,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AacTopBar } from './AacTopBar';
import { cn } from '@/lib/utils';

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

/**
 * AAC chrome navigation: global AacTopBar on every board, plus optional owner edit tools.
 */
export function BoardTopNavigation({
  homeLabel,
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
      isActive ? 'text-[#1c1b1f]' : 'text-[#8e8e93]',
    );

  const iconClassName = (isActive: boolean) =>
    cn('h-6 w-6 shrink-0', isActive ? 'text-[#1c1b1f]' : 'text-[#8e8e93]');

  return (
    <div className="z-40 mx-auto w-full max-w-[375px] shrink-0 bg-white pt-[env(safe-area-inset-top,0px)]">
      {isRootView && allowEdit && (
        <div
          className={cn(
            'flex w-full shrink-0 items-center gap-1 px-9 pt-2',
            isRtl ? 'justify-start' : 'justify-end',
          )}
        >
          <LanguageSwitcher variant="compact" />
          {!authLoading && userEmail && (
            <button
              type="button"
              onClick={onSignOut}
              className="shrink-0 rounded p-0.5 text-[#8e8e93] transition-colors hover:text-[#1c1b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            <span className="text-[11px] font-semibold leading-none tracking-[0.2px] text-[#8e8e93]">
              TalkBiz
            </span>
          </Link>
        </div>
      )}

      {/* Global AAC TopBar — same on every board / business */}
      <AacTopBar
        language={language}
        homeLabel={homeLabel}
        listeningModeOnLabel={listeningModeOnLabel}
        listeningModeOffLabel={listeningModeOffLabel}
        keyboardLabel={keyboardLabel}
        helpLabel={helpLabel}
        isRootView={isRootView}
        isListeningMode={isListeningMode}
        onHome={onHome}
        onToggleListeningMode={onToggleListeningMode}
        onKeyboard={onKeyboard}
        onHelp={onHelp}
        className="!max-w-none !pt-0"
      />

      {/* Owner-only tools — does not replace the global TopBar */}
      {allowEdit && (
        <nav
          className="flex w-full items-start justify-between border-t border-[#e8e8ed] px-9 py-2"
          dir={isRtl ? 'rtl' : 'ltr'}
          aria-label={isRtl ? 'כלי עריכה' : 'Edit tools'}
        >
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
        </nav>
      )}
    </div>
  );
}
