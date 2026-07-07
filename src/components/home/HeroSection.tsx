import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AACBoardPreview } from './AACBoardPreview';
import { useAuth } from '@/hooks/useAuth';

export function HeroSection() {
  const { t, direction } = useLanguage();
  const { user, isGuest, loading } = useAuth();
  const createTarget = !loading && user && !isGuest ? '/create' : '/auth';

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2f9b93_0%,#3f97c8_100%)] py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-36 -left-24 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/6 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 lg:order-1">
            <AACBoardPreview />
          </div>

          <div className="order-1 space-y-7 text-center lg:order-2 lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered AAC Boards</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-[1.05] text-white animate-slide-up md:text-6xl lg:text-[5.25rem]">
              {t('hero.subtitle')}
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-white/85 animate-slide-up md:text-[1.65rem] lg:mx-0 lg:max-w-xl" style={{ animationDelay: '0.1s' }}>
              {t('hero.description')}
            </p>

            <div className="flex flex-col gap-4 justify-center animate-slide-up sm:flex-row lg:justify-end" style={{ animationDelay: '0.2s' }}>
              <Button
                size="xl"
                asChild
                className="h-16 rounded-2xl bg-[#2f8a7d] px-10 text-xl font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] hover:bg-[#2a7c71]"
              >
                <Link to={createTarget} className="gap-2">
                  {t('hero.cta')}
                  <ArrowRight className={`h-5 w-5 ${direction === 'rtl' ? '' : 'rotate-180'}`} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="h-16 rounded-2xl border-2 border-white/35 bg-transparent px-10 text-xl font-bold text-white hover:bg-white/10"
              >
                <Play className="h-5 w-5" />
                {t('hero.demo')}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-white animate-fade-in lg:justify-end" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-5xl font-bold">WCAG</div>
                <div className="text-sm text-white/70 md:text-xl">AA Compliant</div>
              </div>
              <div className="h-14 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-5xl font-bold">+10K</div>
                <div className="text-sm text-white/70 md:text-xl">Boards Created</div>
              </div>
              <div className="h-14 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-5xl font-bold">+500</div>
                <div className="text-sm text-white/70 md:text-xl">Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
