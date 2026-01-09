import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AACBoardPreview } from './AACBoardPreview';

export function HeroSection() {
  const { t, direction } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-start space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered AAC Boards</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-slide-up">
              {t('hero.subtitle')}
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/create" className="gap-2">
                  {t('hero.cta')}
                  <ArrowRight className={`h-5 w-5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Play className="h-5 w-5" />
                {t('hero.demo')}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">500+</div>
                <div className="text-sm text-primary-foreground/70">Businesses</div>
              </div>
              <div className="h-10 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">10K+</div>
                <div className="text-sm text-primary-foreground/70">Boards Created</div>
              </div>
              <div className="h-10 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">WCAG</div>
                <div className="text-sm text-primary-foreground/70">AA Compliant</div>
              </div>
            </div>
          </div>

          {/* Board Preview */}
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <AACBoardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
