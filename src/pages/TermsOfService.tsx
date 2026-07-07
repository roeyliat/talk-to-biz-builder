import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsOfService = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-10">
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>{isHe ? 'תנאי שימוש' : 'Terms of Service'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              {isHe
                ? 'TalkToBiz מספקת כלים ליצירת לוחות תקשורת לעסקים במטרה לשפר נגישות ותקשורת עם לקוחות.'
                : 'TalkToBiz provides tools for creating communication boards for businesses to improve accessibility and customer communication.'}
            </p>
            <p>
              {isHe
                ? 'בשימוש בשירות אתם מסכימים להשתמש בו באופן חוקי, לשמור על פרטי ההתחברות שלכם, ולא להעלות תוכן שאינכם מורשים להשתמש בו.'
                : 'By using the service, you agree to use it lawfully, protect your account credentials, and avoid uploading content you are not authorized to use.'}
            </p>
            <p>
              {isHe
                ? 'אם אתם זקוקים לנוסח משפטי מלא, מומלץ להחליף דף זה בנוסח מאושר על ידי ייעוץ משפטי.'
                : 'If you need production-ready legal language, replace this page with a version reviewed by legal counsel.'}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;