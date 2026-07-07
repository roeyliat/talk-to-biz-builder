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
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2f9b93_0%,#3f97c8_100%)] py-14 sm:py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-white/8 blur-3xl sm:-top-36 sm:-left-24 sm:h-72 sm:w-72" />
        <div className="absolute -bottom-10 -right-16 h-64 w-64 rounded-full bg-white/6 blur-3xl sm:bottom-0 sm:right-0 sm:h-96 sm:w-96" />
      </div>

      <div className="container relative px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <AACBoardPreview />
          </div>

          <div className="order-1 space-y-5 text-center lg:order-2 lg:space-y-7 lg:text-right">
            <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm animate-fade-in lg:justify-start">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered AAC Boards</span>
            </div>
            
            <h1 className="text-3xl font-bold leading-[1.05] text-white animate-slide-up sm:text-4xl md:text-6xl lg:text-[5.25rem]">
              {t('hero.subtitle')}
            </h1>
            
            <p className="mx-auto max-w-xl text-base text-white/85 animate-slide-up sm:text-lg md:text-[1.65rem] lg:mx-0 lg:max-w-xl" style={{ animationDelay: '0.1s' }}>
              {t('hero.description')}
            </p>

            <div className="flex flex-col justify-center gap-4 animate-slide-up sm:flex-row lg:justify-end" style={{ animationDelay: '0.2s' }}>
              <Button
                size="xl"
                asChild
                className="h-14 w-full rounded-2xl bg-[#2f8a7d] px-6 text-lg font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] hover:bg-[#2a7c71] sm:h-16 sm:w-auto sm:px-10 sm:text-xl"
              >
                <Link to={createTarget} className="gap-2">
                  {t('hero.cta')}
                  <ArrowRight className={`h-5 w-5 ${direction === 'rtl' ? '' : 'rotate-180'}`} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="h-14 w-full rounded-2xl border-2 border-white/35 bg-transparent px-6 text-lg font-bold text-white hover:bg-white/10 sm:h-16 sm:w-auto sm:px-10 sm:text-xl"
              >
                <Play className="h-5 w-5" />
                {t('hero.demo')}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-6 text-white animate-fade-in sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8 lg:justify-end" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold sm:text-5xl">WCAG</div>
                <div className="text-sm text-white/70 md:text-xl">AA Compliant</div>
              </div>
              <div className="hidden h-14 w-px bg-white/20 sm:block" />
              <div className="text-center">
                <div className="text-4xl font-bold sm:text-5xl">+10K</div>
                <div className="text-sm text-white/70 md:text-xl">Boards Created</div>
              </div>
              <div className="hidden h-14 w-px bg-white/20 sm:block" />
              <div className="col-span-2 text-center sm:col-span-1">
                <div className="text-4xl font-bold sm:text-5xl">+500</div>
                <div className="text-sm text-white/70 md:text-xl">Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
