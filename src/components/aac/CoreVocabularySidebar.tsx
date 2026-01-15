import { useLanguage } from '@/contexts/LanguageContext';
import { AACCard, FitzgeraldCategory } from './AACCard';
import { cn } from '@/lib/utils';

interface CoreWord {
  id: string;
  textKey: string;
  icon: string;
  category: FitzgeraldCategory;
}

const coreWords: CoreWord[] = [
  { id: 'toilet', textKey: 'aac.toilet', icon: '🚻', category: 'people' },
  { id: 'help', textKey: 'aac.help', icon: '🆘', category: 'verbs' },
  { id: 'yes', textKey: 'aac.yes', icon: '✅', category: 'social' },
  { id: 'no', textKey: 'aac.no', icon: '❌', category: 'social' },
  { id: 'thanks', textKey: 'aac.thanks', icon: '🙏', category: 'social' },
];

interface CoreVocabularySidebarProps {
  onWordClick?: (word: CoreWord) => void;
  className?: string;
}

export function CoreVocabularySidebar({ onWordClick, className }: CoreVocabularySidebarProps) {
  const { t } = useLanguage();

  return (
    <aside 
      className={cn(
        'flex flex-col gap-3 p-4 bg-card border-e border-border min-w-[140px] max-w-[160px]',
        className
      )}
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {t('aac.coreVocabulary')}
      </h2>
      <div className="flex flex-col gap-2">
        {coreWords.map((word) => (
          <AACCard
            key={word.id}
            text={t(word.textKey)}
            category={word.category}
            icon={word.icon}
            size="sm"
            onClick={() => onWordClick?.(word)}
            className="w-full"
          />
        ))}
      </div>
    </aside>
  );
}
