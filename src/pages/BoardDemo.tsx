import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AACBoardDemo } from '@/components/aac/AACBoardDemo';
import { useLanguage } from '@/contexts/LanguageContext';

const BoardDemo = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'he' ? 'הדגמת לוח היררכי' : 'Hierarchical Board Demo'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'he'
                ? 'לוח AAC עם ניווט תת-לוחות וניווט פירורי לחם'
                : 'AAC board with sub-board navigation and breadcrumbs'}
            </p>
          </div>

          <AACBoardDemo />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BoardDemo;
