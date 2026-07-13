import {
  Check,
  Home,
  MessageCircle,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoreActionsBarProps {
  language: string;
  BackIcon: LucideIcon;
  useIceCreamLayout?: boolean;
  iceCreamVariant?: 'standard' | 'dedicated';
  canNavigateBack: boolean;
  selectedWordsCount: number;
  isSpeaking?: boolean;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onClearSelection: () => void;
  onSpeakSelection: () => void;
  onToggleCustomerMode: () => void;
  onNavigateBack: () => void;
  onNavigateHome: () => void;
}

export function CoreActionsBar({
  language,
  BackIcon,
  useIceCreamLayout = false,
  iceCreamVariant = 'standard',
  canNavigateBack,
  selectedWordsCount,
  isSpeaking = false,
  onRunSpokenAction,
  onClearSelection,
  onSpeakSelection,
  onToggleCustomerMode,
  onNavigateBack,
  onNavigateHome,
}: CoreActionsBarProps) {
  const isDedicatedIceCream = useIceCreamLayout && iceCreamVariant === 'dedicated';

  if (isDedicatedIceCream) {
    return (
      <div className="grid gap-2.5 md:grid-cols-5">
        <button
          type="button"
          onClick={() => onRunSpokenAction(language === 'he' ? 'מחק' : 'Delete', onClearSelection)}
          className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
        >
          <Trash2 className="h-8 w-8" />
          <span>{language === 'he' ? 'מחק' : 'Delete'}</span>
        </button>
        <button
          type="button"
          onClick={selectedWordsCount > 0
            ? () => onRunSpokenAction(language === 'he' ? 'כן' : 'Yes', onSpeakSelection)
            : undefined}
          className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
        >
          <Check className="h-9 w-9 text-emerald-600" />
          <span>{language === 'he' ? 'כן' : 'Yes'}</span>
        </button>
        <button
          type="button"
          onClick={() => onRunSpokenAction(language === 'he' ? 'לא' : 'No', onClearSelection)}
          className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
        >
          <X className="h-9 w-9 text-rose-500" />
          <span>{language === 'he' ? 'לא' : 'No'}</span>
        </button>
        <button
          type="button"
          onClick={() => onRunSpokenAction(language === 'he' ? 'חזור' : 'Back', onNavigateBack)}
          disabled={!canNavigateBack}
          className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] disabled:opacity-50"
        >
          <BackIcon className="h-9 w-9" />
          <span>{language === 'he' ? 'חזור' : 'Back'}</span>
        </button>
        <button
          type="button"
          onClick={() => onRunSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', onNavigateHome)}
          className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
        >
          <Home className="h-9 w-9" />
          <span>{language === 'he' ? 'דף ראשי' : 'Home'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-2.5', useIceCreamLayout ? 'md:grid-cols-5' : 'md:grid-cols-5')}>
      <button
        type="button"
        onClick={() => onRunSpokenAction(language === 'he' ? 'מחק' : 'Delete', onClearSelection)}
        className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
      >
        <Trash2 className="h-5 w-5" />
        {language === 'he' ? 'מחק' : 'Delete'}
      </button>
      <button
        type="button"
        onClick={selectedWordsCount > 0
          ? () => onRunSpokenAction(
            useIceCreamLayout ? (language === 'he' ? 'כן' : 'Yes') : language === 'he' ? 'השמע' : 'Speak',
            onSpeakSelection,
          )
          : undefined}
        disabled={!useIceCreamLayout && (selectedWordsCount === 0 || isSpeaking)}
        className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] disabled:opacity-50"
      >
        {useIceCreamLayout
          ? <Check className="h-6 w-6 text-emerald-600" />
          : <Volume2 className={cn('h-5 w-5', isSpeaking && 'animate-pulse')} />}
        {useIceCreamLayout ? (language === 'he' ? 'כן' : 'Yes') : language === 'he' ? 'השמע' : 'Speak'}
      </button>
      <button
        type="button"
        onClick={useIceCreamLayout
          ? () => onRunSpokenAction(language === 'he' ? 'לא' : 'No', onClearSelection)
          : () => onRunSpokenAction(language === 'he' ? 'דבר' : 'Talk', onToggleCustomerMode)}
        className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
      >
        {useIceCreamLayout ? <X className="h-6 w-6 text-rose-500" /> : <MessageCircle className="h-5 w-5" />}
        {useIceCreamLayout ? (language === 'he' ? 'לא' : 'No') : language === 'he' ? 'דבר' : 'Talk'}
      </button>
      <button
        type="button"
        onClick={() => onRunSpokenAction(language === 'he' ? 'חזור' : 'Back', onNavigateBack)}
        disabled={!canNavigateBack}
        className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)] disabled:opacity-50"
      >
        <BackIcon className="h-5 w-5" />
        {language === 'he' ? 'חזור' : 'Back'}
      </button>
      <button
        type="button"
        onClick={() => onRunSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', onNavigateHome)}
        className="flex min-h-[60px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#c8d1e0] bg-white px-3 text-base font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(15,23,42,0.08)]"
      >
        <Home className="h-5 w-5" />
        {language === 'he' ? 'דף ראשי' : 'Home'}
      </button>
    </div>
  );
}

interface IceCreamCategoryNavProps {
  language: string;
  buttons: Array<{
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
  }>;
}

export function IceCreamCategoryNav({ language, buttons }: IceCreamCategoryNavProps) {
  return (
    <div className="grid gap-2.5 md:grid-cols-3">
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          onClick={button.onClick}
          className="flex min-h-[74px] flex-col items-center justify-center rounded-[16px] border-[2.5px] border-[#c6cfdd] bg-white px-4 py-2 text-lg font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
        >
          <span className="mb-1">{button.label}</span>
          <span className="text-[2rem] leading-none" aria-hidden="true">{button.icon}</span>
        </button>
      ))}
    </div>
  );
}

interface IceCreamReferenceNavProps {
  language: string;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onNavigateToToppings: () => void;
  onNavigateToQuantity: () => void;
  onNavigateToFlavors: () => void;
}

export function IceCreamReferenceNav({
  language,
  onRunSpokenAction,
  onNavigateToToppings,
  onNavigateToQuantity,
  onNavigateToFlavors,
}: IceCreamReferenceNavProps) {
  return (
    <div className="grid gap-2.5 md:grid-cols-3">
      <button
        type="button"
        onClick={() => onRunSpokenAction(language === 'he' ? 'תוספות' : 'Toppings', onNavigateToToppings)}
        className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800"
      >
        <span>{language === 'he' ? 'תוספות' : 'Toppings'}</span>
        <span className="text-2xl" aria-hidden="true">🌈</span>
      </button>
      <button
        type="button"
        onClick={() => onRunSpokenAction(language === 'he' ? 'כמות' : 'Quantity', onNavigateToQuantity)}
        className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800"
      >
        <span>{language === 'he' ? 'כמות' : 'Quantity'}</span>
        <span className="text-2xl" aria-hidden="true">🍦🍦🍦</span>
      </button>
      <button
        type="button"
        onClick={() => onRunSpokenAction(language === 'he' ? 'טעמים' : 'Flavors', onNavigateToFlavors)}
        className="flex min-h-[56px] items-center justify-center gap-3 rounded-[14px] border-[2.5px] border-[#bcc7de] bg-white px-4 text-lg font-bold text-slate-800"
      >
        <span>{language === 'he' ? 'טעמים' : 'Flavors'}</span>
        <span className="text-2xl" aria-hidden="true">🍨</span>
      </button>
    </div>
  );
}
