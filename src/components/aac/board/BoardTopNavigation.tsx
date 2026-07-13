import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/aac/LanguageSwitcher';
import { BoardNavigationState, AACBoard } from '@/types/aac';
import {
  ChevronRight,
  Check,
  MessageCircle,
  Pencil,
  Settings,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface BoardTopNavigationProps {
  hidden?: boolean;
  navState: BoardNavigationState;
  currentBoard: AACBoard;
  language: string;
  direction: 'ltr' | 'rtl';
  t: (key: string) => string;
  BackIcon: LucideIcon;
  isCustomerMode: boolean;
  isEditMode: boolean;
  allowEdit: boolean;
  authLoading: boolean;
  user: { email?: string } | null;
  isGuest: boolean;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onNavigateBack: () => void;
  onNavigateToBreadcrumb: (index: number) => void;
  onToggleCustomerMode: () => void;
  onToggleEditMode: () => void;
  onOpenVoiceSettings: () => void;
  onSignOut: () => void;
}

export function BoardTopNavigation({
  hidden,
  navState,
  currentBoard,
  language,
  direction,
  t,
  BackIcon,
  isCustomerMode,
  isEditMode,
  allowEdit,
  authLoading,
  user,
  isGuest,
  onRunSpokenAction,
  onNavigateBack,
  onNavigateToBreadcrumb,
  onToggleCustomerMode,
  onToggleEditMode,
  onOpenVoiceSettings,
  onSignOut,
}: BoardTopNavigationProps) {
  if (hidden) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary">
            <img
              src="/favicon.png"
              alt="TalkBiz Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="hidden text-base font-bold text-foreground lg:inline">TalkBiz</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.home')}
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.dashboard')}
          </Link>
          <Link to="/create" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.create')}
          </Link>
        </nav>

        {navState.breadcrumbs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRunSpokenAction(t('aac.back'), onNavigateBack)}
            className="shrink-0 gap-2 border-slate-300 bg-white"
          >
            <BackIcon className="h-4 w-4" />
            {t('aac.back')}
          </Button>
        )}

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          {navState.breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
              <button
                type="button"
                onClick={() => onRunSpokenAction(
                  language === 'he' || language === 'ar' ? crumb.name : crumb.nameEn,
                  () => onNavigateToBreadcrumb(index),
                )}
                className="max-w-[100px] truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {language === 'he' || language === 'ar' ? crumb.name : crumb.nameEn}
              </button>
            </div>
          ))}

          {navState.breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className="max-w-[100px] truncate font-medium text-foreground">
                {language === 'he' || language === 'ar' ? currentBoard.name : currentBoard.nameEn}
              </span>
            </div>
          )}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant={isCustomerMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => onRunSpokenAction(
            isCustomerMode
              ? (language === 'he' ? 'צא ממצב לקוח' : 'Exit Customer Mode')
              : (language === 'he' ? 'אני רוצה לדבר' : 'I Want To Talk'),
            onToggleCustomerMode,
          )}
          className={cn(
            'gap-2 border-slate-300 bg-white',
            isCustomerMode && 'bg-green-600 text-white hover:bg-green-700',
          )}
        >
          {isCustomerMode ? (
            <>
              <X className="h-4 w-4" />
              {language === 'he' ? 'צא ממצב לקוח' : 'Exit Customer Mode'}
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              {language === 'he' ? 'אני רוצה לדבר' : 'I Want To Talk'}
            </>
          )}
        </Button>

        {allowEdit && !isCustomerMode && (
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRunSpokenAction(
              isEditMode
                ? (language === 'he' ? 'סיום עריכה' : 'Done')
                : (language === 'he' ? 'עריכה' : 'Edit'),
              onToggleEditMode,
            )}
            className="gap-2 border-slate-300 bg-white"
          >
            {isEditMode ? (
              <>
                <Check className="h-4 w-4" />
                {language === 'he' ? 'סיום עריכה' : 'Done'}
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                {language === 'he' ? 'עריכה' : 'Edit'}
              </>
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRunSpokenAction(
            language === 'he' ? 'הגדרות קול' : 'Voice Settings',
            onOpenVoiceSettings,
          )}
          className="shrink-0"
          aria-label={language === 'he' ? 'הגדרות קול' : 'Voice Settings'}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <LanguageSwitcher variant="compact" />

        {!authLoading && user && (
          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="max-w-[180px] truncate">
                {isGuest ? (language === 'he' ? 'אורח' : 'Guest') : user.email}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRunSpokenAction(
                language === 'he' ? 'התנתק' : 'Sign Out',
                onSignOut,
              )}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              {language === 'he' ? 'התנתק' : 'Sign Out'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
