import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isGuest, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: language === 'he' ? 'להתראות!' : 'Goodbye!',
        description: language === 'he' ? 'התנתקת בהצלחה' : 'You have been signed out',
      });
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary overflow-hidden">
    <img
      src="/favicon.png"
      alt="TalktobiZ Logo"
      className="h-full w-full object-cover"
    />
  </div>

  <span className="font-bold text-xl text-foreground">
    TalktobiZ
  </span>
</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('nav.dashboard')}
          </Link>
          <Link 
            to="/create" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('nav.create')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hidden md:flex"
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          {!loading && (
            <>
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{isGuest ? (language === 'he' ? 'אורח' : 'Guest') : user.email}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    {language === 'he' ? 'התנתק' : 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="hidden md:inline-flex"
                  onClick={() => navigate('/auth')}
                >
                  {language === 'he' ? 'התחברות' : 'Login'}
                </Button>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-3">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.dashboard')}
            </Link>
            <Link 
              to="/create" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.create')}
            </Link>
            <div className="flex items-center gap-3 pt-3 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'he' ? 'English' : 'עברית'}
              </Button>
              
              {!loading && (
                <>
                  {user ? (
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      {language === 'he' ? 'התנתק' : 'Sign Out'}
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/auth');
                      }}
                    >
                      {language === 'he' ? 'התחברות' : 'Login'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
