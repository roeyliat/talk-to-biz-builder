import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Eye, EyeOff, KeyRound, Loader2, XCircle } from 'lucide-react';

export default function ResetPassword() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const texts = {
    he: {
      title: 'איפוס סיסמה',
      description: 'הגדירו סיסמה חדשה לחשבון שלכם',
      invalidTitle: 'לינק לא תקין או פג תוקף',
      invalidDescription: 'בקשו מייל איפוס חדש מדף ההתחברות ונסו שוב.',
      password: 'סיסמה חדשה',
      confirmPassword: 'אימות סיסמה חדשה',
      save: 'שמור סיסמה חדשה',
      saving: 'שומר...',
      successTitle: 'הסיסמה עודכנה',
      successDescription: 'אפשר עכשיו להתחבר עם הסיסמה החדשה.',
      backToSignIn: 'חזרה להתחברות',
      mismatch: 'הסיסמאות אינן תואמות.',
      shortPassword: 'הסיסמה חייבת להכיל לפחות 6 תווים.',
      updateError: 'לא הצלחנו לעדכן את הסיסמה. נסו שוב.',
      loading: 'בודק את הקישור...',
    },
    en: {
      title: 'Reset Password',
      description: 'Set a new password for your account',
      invalidTitle: 'Invalid or expired link',
      invalidDescription: 'Request a new reset email from the sign-in page and try again.',
      password: 'New password',
      confirmPassword: 'Confirm new password',
      save: 'Save new password',
      saving: 'Saving...',
      successTitle: 'Password updated',
      successDescription: 'You can now sign in with your new password.',
      backToSignIn: 'Back to sign in',
      mismatch: 'Passwords do not match.',
      shortPassword: 'Password must be at least 6 characters.',
      updateError: 'Failed to update password. Please try again.',
      loading: 'Checking reset link...',
    },
  };

  const t = texts[language === 'he' ? 'he' : 'en'];

  useEffect(() => {
    let mounted = true;

    const checkRecoveryState = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setRecoveryReady(Boolean(data.session));
      setCheckingLink(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        return;
      }

      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setRecoveryReady(Boolean(session));
        setCheckingLink(false);
      }
    });

    void checkRecoveryState();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: t.mismatch,
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: t.shortPassword,
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      await supabase.auth.signOut();
      setCompleted(true);
      toast({
        title: t.successTitle,
        description: t.successDescription,
      });
    } catch (error: any) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: error?.message || t.updateError,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {completed ? <CheckCircle className="h-8 w-8 text-primary" /> : <KeyRound className="h-8 w-8 text-primary" />}
            </div>
            <CardTitle className="text-2xl">
              {checkingLink ? t.loading : completed ? t.successTitle : recoveryReady ? t.title : t.invalidTitle}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {checkingLink ? t.loading : completed ? t.successDescription : recoveryReady ? t.description : t.invalidDescription}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {checkingLink ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : completed ? (
              <Button className="w-full" onClick={() => navigate('/signin')}>
                {t.backToSignIn}
              </Button>
            ) : recoveryReady ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={saving}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      disabled={saving}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.saving}
                    </>
                  ) : (
                    t.save
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center text-destructive">
                  <XCircle className="h-6 w-6" />
                </div>
                <Button className="w-full" onClick={() => navigate('/signin')}>
                  {t.backToSignIn}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}