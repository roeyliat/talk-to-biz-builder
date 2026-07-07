import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminUsers = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-10">
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>{isHe ? 'ניהול משתמשים' : 'Manage Users'}</CardTitle>
            <CardDescription>
              {isHe
                ? 'מסך ניהול המשתמשים נמצא בתהליך חיבור מחדש.'
                : 'The user management screen is being reconnected.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              {isHe
                ? 'הנתיב נשמר פעיל כדי שמנהלים יוכלו להמשיך לנווט במערכת בזמן שאנחנו משלימים את הממשק.'
                : 'This route stays available so admins can keep navigating while the full interface is restored.'}
            </p>
            <p>
              {isHe
                ? 'אם תרצה, אפשר להמשיך מכאן ולבנות את טבלת המשתמשים והפעולות מול Supabase.'
                : 'If you want, I can build out the Supabase-backed user table and admin actions next.'}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUsers;