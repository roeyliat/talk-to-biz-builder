import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockBoards = [
  {
    id: '1',
    name: 'גלידריה מתוקה',
    nameEn: 'Sweet Ice Cream',
    businessType: 'iceCream',
    complexity: 2,
    createdAt: '2024-01-15',
    icon: '🍦',
  },
  {
    id: '2',
    name: 'בית קפה הפינה',
    nameEn: 'Corner Cafe',
    businessType: 'cafe',
    complexity: 2,
    createdAt: '2024-01-10',
    icon: '☕',
  },
];

const Dashboard = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('dashboard.title')}
              </h1>
              <p className="text-muted-foreground">
                {language === 'he' 
                  ? 'נהלו ועירכו את לוחות התקשורת שלכם'
                  : 'Manage and edit your communication boards'
                }
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/create" className="gap-2">
                <Plus className="h-5 w-5" />
                {t('dashboard.createNew')}
              </Link>
            </Button>
          </div>

          {/* Boards Grid */}
          {mockBoards.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBoards.map((board) => (
                <div
                  key={board.id}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {board.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {language === 'he' ? board.name : board.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`business.${board.businessType}`)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <LayoutGrid className="h-4 w-4" />
                      <span>{t(`creator.level${board.complexity}`)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{new Date(board.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {language === 'he' ? 'עריכה' : 'Edit'}
                    </Button>
                    <Button size="sm" className="flex-1">
                      {language === 'he' ? 'תצוגה' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Create New Card */}
              <Link
                to="/create"
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 p-8 transition-all duration-300 min-h-[200px]"
              >
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-7 w-7 text-muted-foreground" />
                </div>
                <span className="font-medium text-muted-foreground">
                  {t('dashboard.createNew')}
                </span>
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                <LayoutGrid className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('dashboard.noBoards')}
              </h2>
              <Button size="lg" asChild className="mt-4">
                <Link to="/create" className="gap-2">
                  <Plus className="h-5 w-5" />
                  {t('dashboard.createNew')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
