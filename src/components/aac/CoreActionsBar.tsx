import { Home, MessageCircle, Trash2, Volume2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoreActionsBarProps {
  labels: {
    delete: string;
    speak: string;
    talk: string;
    back: string;
    home: string;
  };
  backIcon: LucideIcon;
  canGoBack: boolean;
  canSpeak: boolean;
  isSpeaking?: boolean;
  isCustomerMode?: boolean;
  onDelete: () => void;
  onSpeak: () => void;
  onTalk: () => void;
  onBack: () => void;
  onHome: () => void;
}

export function CoreActionsBar({
  labels,
  backIcon: BackIcon,
  canGoBack,
  canSpeak,
  isSpeaking,
  isCustomerMode,
  onDelete,
  onSpeak,
  onTalk,
  onBack,
  onHome,
}: CoreActionsBarProps) {
  const actionButtonClassName =
    'flex h-10 w-12 shrink-0 flex-col items-center justify-between px-[13px] bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-45';

  const labelClassName = (isActive: boolean) =>
    cn(
      'text-[11px] font-semibold leading-none tracking-[0.2px]',
      isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]',
    );

  const iconClassName = (isActive: boolean, pulse = false) =>
    cn(
      'h-6 w-6 shrink-0',
      isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]',
      pulse && 'animate-pulse',
    );

  const actions = [
    {
      key: 'delete',
      label: labels.delete,
      isActive: true,
      disabled: false,
      onClick: onDelete,
      icon: <Trash2 className={iconClassName(true)} aria-hidden="true" />,
    },
    {
      key: 'speak',
      label: labels.speak,
      isActive: canSpeak && !isSpeaking,
      disabled: !canSpeak || isSpeaking,
      onClick: canSpeak ? onSpeak : undefined,
      icon: (
        <Volume2
          className={iconClassName(canSpeak && !isSpeaking, isSpeaking)}
          aria-hidden="true"
        />
      ),
    },
    {
      key: 'talk',
      label: labels.talk,
      isActive: !!isCustomerMode,
      disabled: false,
      onClick: onTalk,
      icon: <MessageCircle className={iconClassName(!!isCustomerMode)} aria-hidden="true" />,
    },
    ...(canGoBack
      ? [
          {
            key: 'back',
            label: labels.back,
            isActive: true,
            disabled: false,
            onClick: onBack,
            icon: <BackIcon className={iconClassName(true)} aria-hidden="true" />,
          },
        ]
      : []),
    {
      key: 'home',
      label: labels.home,
      isActive: true,
      disabled: false,
      onClick: onHome,
      icon: <Home className={iconClassName(true)} aria-hidden="true" />,
    },
  ];

  return (
    <div className="flex w-full flex-col bg-white py-2" role="toolbar">
      <div className="flex w-full items-start justify-between px-9">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            aria-label={action.label}
            className={actionButtonClassName}
          >
            {action.icon}
            <span className={labelClassName(action.isActive)}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
