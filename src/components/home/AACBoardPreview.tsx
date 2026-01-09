import { useLanguage } from '@/contexts/LanguageContext';
import { AACCard } from '@/components/aac/AACCard';

const previewCards = [
  { id: '1', text: 'שלום', textEn: 'Hello', category: 'social' as const, icon: '👋' },
  { id: '2', text: 'אני', textEn: 'I', category: 'people' as const, icon: '🙋' },
  { id: '3', text: 'רוצה', textEn: 'Want', category: 'verbs' as const, icon: '👉' },
  { id: '4', text: 'גלידה', textEn: 'Ice Cream', category: 'people' as const, icon: '🍦' },
  { id: '5', text: 'קר', textEn: 'Cold', category: 'descriptors' as const, icon: '❄️' },
  { id: '6', text: 'תודה', textEn: 'Thank you', category: 'social' as const, icon: '🙏' },
];

export function AACBoardPreview() {
  const { language } = useLanguage();

  return (
    <div className="relative">
      {/* Decorative shadow */}
      <div className="absolute inset-4 bg-foreground/10 rounded-2xl blur-xl" />
      
      {/* Board container */}
      <div className="relative bg-card rounded-2xl shadow-2xl p-6 border border-border/50">
        {/* Board header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-fitzgerald-yellow to-fitzgerald-pink flex items-center justify-center text-lg">
              🍦
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                {language === 'he' ? 'גלידריה מתוקה' : 'Sweet Ice Cream'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'he' ? 'לוח תקשורת' : 'Communication Board'}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-fitzgerald-pink/60" />
            <div className="h-3 w-3 rounded-full bg-fitzgerald-yellow/60" />
            <div className="h-3 w-3 rounded-full bg-fitzgerald-green/60" />
          </div>
        </div>

        {/* AAC Grid */}
        <div className="grid grid-cols-3 gap-3">
          {previewCards.map((card, index) => (
            <AACCard
              key={card.id}
              text={language === 'he' ? card.text : card.textEn}
              category={card.category}
              icon={card.icon}
              size="sm"
              className="animate-scale-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            />
          ))}
        </div>

        {/* Fitzgerald Key Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border-2 border-fitzgerald-yellow bg-fitzgerald-yellow-light" />
            <span className="text-muted-foreground">{language === 'he' ? 'שמות' : 'Nouns'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border-2 border-fitzgerald-green bg-fitzgerald-green-light" />
            <span className="text-muted-foreground">{language === 'he' ? 'פעולות' : 'Verbs'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border-2 border-fitzgerald-blue bg-fitzgerald-blue-light" />
            <span className="text-muted-foreground">{language === 'he' ? 'תיאורים' : 'Descriptors'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border-2 border-fitzgerald-pink bg-fitzgerald-pink-light" />
            <span className="text-muted-foreground">{language === 'he' ? 'חברתי' : 'Social'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
