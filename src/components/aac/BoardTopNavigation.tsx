import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CircleHelp,
  Check,
  ChevronRight,
  Grid2X2,
  Home,
  LogOut,
  MessageCircle,
  Pencil,
  Settings,
  User,
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
  onToggleCustomerMode: () => void;
  onToggleEditMode: () => void;
  onVoiceSettings: () => void;
  onSignOut: () => void;
  isRootView?: boolean;
}

export function BoardTopNavigation({
  backLabel,
  backIcon: BackIcon,
  homeLabel,
  dashboardLabel,
  createLabel,
  breadcrumbs,
  currentBoardName,
  language,
  isCustomerMode,
  isEditMode,
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
  onBack,
  onBreadcrumb,
  onToggleCustomerMode,
  onToggleEditMode,
  onVoiceSettings,
  onSignOut,
  isRootView = false,
}: BoardTopNavigationProps) {
  const isRtl = language === 'he' || language === 'ar';
  const getCrumbLabel = (crumb: Breadcrumb) => (isRtl ? crumb.name : crumb.nameEn);

  if (isRootView) {
    const rootNavItemClass =
      'flex min-w-[48px] flex-col items-center justify-center gap-1 bg-transparent px-1 py-0.5 text-[11px] font-semibold leading-none text-[#a09cab] transition-colors hover:text-[#1c1b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

    return (
      <header className="z-40 shrink-0 border-b border-black/5 bg-white px-4 pb-2 pt-3">
        <nav
          className="mx-auto flex w-full max-w-[375px] items-start justify-between gap-1"
          aria-label={isRtl ? 'ניווט ראשי' : 'Primary navigation'}
        >
          <Link to="/" className={cn(rootNavItemClass, 'text-[#1c1b1f]')}>
            <Home className="h-6 w-6" aria-hidden="true" />
            <span>{homeLabel}</span>
          </Link>

          {allowEdit ? (
            <button
              type="button"
              onClick={onToggleEditMode}
              className={cn(rootNavItemClass, isEditMode && 'text-[#1c1b1f]')}
              aria-pressed={isEditMode}
            >
              {isEditMode ? <Check className="h-6 w-6" /> : <Grid2X2 className="h-6 w-6" />}
              <span>{isEditMode ? editOnLabel : editOffLabel}</span>
            </button>
          ) : (
            <Link to="/dashboard" className={rootNavItemClass}>
              <Grid2X2 className="h-6 w-6" aria-hidden="true" />
              <span>{dashboardLabel}</span>
            </Link>
          )}

          <button type="button" onClick={onVoiceSettings} className={rootNavItemClass}>
            <Settings className="h-6 w-6" aria-hidden="true" />
            <span>{voiceSettingsLabel}</span>
          </button>

          <button
            type="button"
            onClick={onToggleCustomerMode}
            className={cn(rootNavItemClass, isCustomerMode && 'text-[#1c1b1f]')}
            aria-pressed={isCustomerMode}
          >
            {isCustomerMode ? <X className="h-6 w-6" /> : <CircleHelp className="h-6 w-6" />}
            <span>{isCustomerMode ? customerModeOnLabel : customerModeOffLabel}</span>
          </button>

          <div className="flex min-w-[53px] flex-col items-center gap-1">
            <div className="flex h-7 items-center justify-center gap-0.5">
              <LanguageSwitcher variant="compact" />
              {!authLoading && userEmail && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded p-1 text-[#a09cab] hover:text-[#1c1b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={signOutLabel}
                  title={isGuest ? guestLabel : userEmail}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
            <Link to="/" className="text-[11px] font-semibold leading-none text-[#a09cab]">
              TalkBiz
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary">
            <img src="/favicon.png" alt="TalkBiz Logo" className="h-full w-full object-cover" />
          </div>
          <span className="hidden text-base font-bold text-foreground lg:inline">TalkBiz</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {homeLabel}
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {dashboardLabel}
          </Link>
          <Link to="/create" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {createLabel}
          </Link>
        </nav>

        {breadcrumbs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="shrink-0 gap-2 border-slate-300 bg-white"
          >
            <BackIcon className="h-4 w-4" />
            {backLabel}
          </Button>
        )}

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
              <button
                type="button"
                onClick={() => onBreadcrumb(index)}
                className="max-w-[100px] truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {getCrumbLabel(crumb)}
              </button>
            </div>
          ))}

          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className="max-w-[100px] truncate font-medium text-foreground">{currentBoardName}</span>
            </div>
          )}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant={isCustomerMode ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleCustomerMode}
          className={cn(
            'gap-2 border-slate-300 bg-white',
            isCustomerMode && 'bg-green-600 text-white hover:bg-green-700',
          )}
        >
          {isCustomerMode ? (
            <>
              <X className="h-4 w-4" />
              {customerModeOnLabel}
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              {customerModeOffLabel}
            </>
          )}
        </Button>

        {allowEdit && !isCustomerMode && (
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleEditMode}
            className="gap-2 border-slate-300 bg-white"
          >
            {isEditMode ? (
              <>
                <Check className="h-4 w-4" />
                {editOnLabel}
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                {editOffLabel}
              </>
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onVoiceSettings}
          className="shrink-0"
          aria-label={voiceSettingsLabel}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <LanguageSwitcher variant="compact" />

        {!authLoading && userEmail && (
          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="max-w-[180px] truncate">{isGuest ? guestLabel : userEmail}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              {signOutLabel}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
