import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, Accessibility, MousePointerClick, FileText } from 'lucide-react';

const features = [
  {
    key: 'ai',
    icon: Sparkles,
    color: 'bg-fitzgerald-yellow text-foreground',
  },
  {
    key: 'accessible',
    icon: Accessibility,
    color: 'bg-fitzgerald-green text-foreground',
  },
  {
    key: 'easy',
    icon: MousePointerClick,
    color: 'bg-fitzgerald-blue text-foreground',
  },
  {
    key: 'print',
    icon: FileText,
    color: 'bg-fitzgerald-pink text-foreground',
  },
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group relative bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
