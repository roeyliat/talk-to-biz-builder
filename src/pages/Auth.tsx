import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { language } = useLanguage();
  const { signInWithPassword, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isHe = language === 'he';
  const initialTab = location.pathname === '/signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithPassword(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: isHe ? 'שגיאה בהתחברות' : 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: isHe ? 'ברוך הבא!' : 'Welcome!',
      description: isHe ? 'התחברת בהצלחה' : 'You are now signed in',
    });
    navigate('/dashboard');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: isHe ? 'שגיאה בהרשמה' : 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    if (data.session) {
      toast({
        title: isHe ? 'נרשמת בהצלחה!' : 'Account created!',
        description: isHe ? 'התחברת בהצלחה' : 'You are now signed in',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: isHe ? 'בדוק את הדוא"ל שלך' : 'Check your email',
        description: isHe
          ? 'שלחנו לך קישור לאישור החשבון'
          : 'We sent you a confirmation link to activate your account',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isHe ? 'התחברות' : 'Sign in'}</CardTitle>
            <CardDescription>
              {isHe
                ? 'התחבר עם דוא"ל וסיסמה'
                : 'Sign in with your email and password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{isHe ? 'התחברות' : 'Login'}</TabsTrigger>
                <TabsTrigger value="signup">{isHe ? 'הרשמה' : 'Sign Up'}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{isHe ? 'דוא"ל' : 'Email'}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{isHe ? 'סיסמה' : 'Password'}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isHe ? 'התחבר' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{isHe ? 'דוא"ל' : 'Email'}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{isHe ? 'סיסמה' : 'Password'}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isHe ? 'הרשמה' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
