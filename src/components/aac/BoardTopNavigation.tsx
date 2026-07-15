import { Link } from 'react-router-dom';
import {
  CircleHelp,
  Check,
  Grid2X2,
  Home,
  LogOut,
  Settings,
  X,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
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
  onBack: () => void;
  onBreadcrumb: (index: number) => void;
  onHome: () => void;
  onToggleCustomerMode: () => void;
  onToggleEditMode: () => void;
  onVoiceSettings: () => void;
  onSignOut: () => void;
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
  language,
  isCustomerMode,
  isEditMode,
  onHome,
  onToggleCustomerMode,
  onToggleEditMode,
  onVoiceSettings,
  onSignOut,
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
        {isRootView && (
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
              className="shrink-0 text-[11px] font-semibold leading-none tracking-[0.2px] text-[#a09cab] transition-colors hover:text-[#1c1b1f]"
            >
              TalkBiz
            </Link>
          </div>
        )}

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

          {allowEdit ? (
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
          ) : (
            <Link to="/dashboard" className={navItemClassName}>
              <Grid2X2 className={iconClassName(false)} aria-hidden="true" />
              <span className={labelClassName(false)}>{dashboardLabel}</span>
            </Link>
          )}

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
        </div>
      </nav>
    </header>
  );
}
