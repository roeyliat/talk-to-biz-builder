import { createContext, useContext } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CoreCommunicationAction = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export const CoreCommunicationBarContext = createContext<CoreCommunicationAction[] | null>(null);

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
  isSpeaking,
}: CoreActionsBarProps) {
  const communicationActions = useContext(CoreCommunicationBarContext);

  const actionButtonClassName =
    'flex h-10 min-w-12 shrink-0 flex-col items-center justify-center gap-1 px-[13px] bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-45 active:scale-95';

  const labelClassName = (isActive: boolean) =>
    cn(
      'text-[13px] font-semibold leading-none tracking-[0.2px]',
      isActive ? 'text-[#1c1b1f]' : 'text-[#a09cab]',
    );

  const actions = communicationActions ?? [];

  return (
    <div className="flex w-full flex-col bg-white py-2" role="toolbar" dir="rtl">
      <div className="flex w-full items-start justify-between px-9">
        {actions.map((action) => {
          const disabled = Boolean(action.disabled || isSpeaking);
          return (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              disabled={disabled}
              aria-label={action.label}
              className={actionButtonClassName}
            >
              <span className={labelClassName(!disabled)}>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
