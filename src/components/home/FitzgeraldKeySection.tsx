import { useLanguage } from '@/contexts/LanguageContext';
import { AACCard } from '@/components/aac/AACCard';
import { FitzgeraldCategory } from '@/types/aac';

const categories = [
  {
    key: 'people',
    color: 'fitzgerald-yellow',
    examples: [
      { text: 'אני', textEn: 'I', icon: '🙋' },
      { text: 'מלצר', textEn: 'Server', icon: '👨‍🍳' },
      { text: 'גלידה', textEn: 'Ice Cream', icon: '🍦' },
    ],
  },
  {
    key: 'verbs',
    color: 'fitzgerald-green',
    examples: [
      { text: 'רוצה', textEn: 'Want', icon: '👉' },
      { text: 'לקנות', textEn: 'Buy', icon: '💳' },
      { text: 'לשלם', textEn: 'Pay', icon: '💰' },
    ],
  },
  {
    key: 'descriptors',
    color: 'fitzgerald-pink',
    examples: [
      { text: 'קר', textEn: 'Cold', icon: '❄️' },
      { text: 'גדול', textEn: 'Large', icon: '📏' },
      { text: 'טעים', textEn: 'Delicious', icon: '😋' },
    ],
  },
  {
    key: 'social',
    color: 'fitzgerald-blue',
    examples: [
      { text: 'שלום', textEn: 'Hello', icon: '👋' },
      { text: 'תודה', textEn: 'Thank you', icon: '🙏' },
      { text: 'בבקשה', textEn: 'Please', icon: '🤲' },
    ],
  },
];

export function FitzgeraldKeySection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'he' ? 'שיטת Fitzgerald Key' : 'Fitzgerald Key Method'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'he' 
              ? 'שיטה קלינית מוכחת לארגון לוחות תקשורת חזותית בעזרת קידוד צבעים'
              : 'A proven clinical method for organizing visual communication boards using color coding'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, catIndex) => (
            <div 
              key={category.key}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 animate-slide-up"
              style={{ animationDelay: `${0.1 * catIndex}s` }}
            >
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <div className={`h-4 w-4 rounded border-2 border-${category.color} bg-${category.color}-light`} />
                {t(`fitzgerald.${category.key}`)}
              </h3>
              <div className="space-y-3">
                {category.examples.map((example, index) => (
                  <AACCard
                    key={index}
                    text={language === 'he' ? example.text : example.textEn}
                    imageSearchTerms={[example.text, example.textEn]}
                    category={category.key as FitzgeraldCategory}
                    icon={example.icon}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
