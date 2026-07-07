import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function CTASection() {
  const { t, language, direction } = useLanguage();
  const { user, isGuest, loading } = useAuth();
  const createTarget = !loading && user && !isGuest ? '/create' : '/auth';

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            {language === 'he' 
              ? 'מוכנים להפוך את העסק שלכם לנגיש יותר?'
              : 'Ready to make your business more accessible?'
            }
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            {language === 'he'
              ? 'התחילו ליצור לוחות תקשורת מותאמים אישית תוך דקות'
              : 'Start creating custom communication boards in minutes'
            }
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to={createTarget} className="gap-2">
              {t('hero.cta')}
              <ArrowRight className={`h-5 w-5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
