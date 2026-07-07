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
  const { user, isGuest, isAdmin, isApproved, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const canAccessProtectedRoutes = isAdmin || isApproved;

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
          <svg className="h-9 w-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="12" fill="currentColor" className="text-primary"/>
            <path d="M30 35h40M30 50h40M30 65h30" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="75" cy="65" r="8" fill="white"/>
          </svg>
          <span className="font-bold text-xl text-foreground">
            TalkToBiz
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
            to="/demo" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {language === 'he' ? 'הדגמה' : 'Demo'}
          </Link>
          {canAccessProtectedRoutes && (
            <>
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
            </>
          )}
          {isAdmin && (
            <Link 
              to="/admin/users" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {language === 'he' ? 'ניהול משתמשים' : 'Manage Users'}
            </Link>
          )}
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
                <div className="hidden md:flex items-center gap-3">
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/signin')}
                  >
                    {language === 'he' ? 'התחברות' : 'Sign In'}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/signup')}
                  >
                    {language === 'he' ? 'הרשמה' : 'Sign Up'}
                  </Button>
                </div>
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
              to="/demo" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'he' ? 'הדגמה' : 'Demo'}
            </Link>
            {canAccessProtectedRoutes && (
              <>
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
              </>
            )}
            {isAdmin && (
              <Link 
                to="/admin/users" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'he' ? 'ניהול משתמשים' : 'Manage Users'}
              </Link>
            )}
            <div className="flex items-center gap-3 pt-3 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'he' ? 'אנגלית' : 'עברית'}
              </Button>
              
              {!loading && (
                <>
                  {user ? (
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      {language === 'he' ? 'התנתק' : 'Sign Out'}
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate('/signin');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        {language === 'he' ? 'התחברות' : 'Sign In'}
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate('/signup');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        {language === 'he' ? 'הרשמה' : 'Sign Up'}
                      </Button>
                    </div>
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
