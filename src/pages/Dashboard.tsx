import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Settings, FileText, ScanLine, QrCode, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuScannerModal } from '@/components/menu-scanner/MenuScannerModal';
import { ProcessingOverlay } from '@/components/menu-scanner/ProcessingOverlay';
import { BoardReviewEditor } from '@/components/menu-scanner/BoardReviewEditor';
import { useMenuScanner } from '@/hooks/useMenuScanner';
import { AACDashboard } from '@/components/aac/AACDashboard';
import { AACBoard } from '@/types/aac';
import { useToast } from '@/hooks/use-toast';
import { BoardExportModal } from '@/components/board-export/BoardExportModal';
import { getSavedBoards, saveBoardRecord, SavedBoardRecord, syncLocalBoardsToCloud } from '@/lib/savedBoards';
import { useAuth } from '@/hooks/useAuth';

type ViewState = 'dashboard' | 'review' | 'preview';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isGuest, loading: authLoading } = useAuth();
  
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [previewBoards, setPreviewBoards] = useState<Record<string, AACBoard> | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [savedBoards, setSavedBoards] = useState<SavedBoardRecord[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<SavedBoardRecord | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBoards = async () => {
      if (authLoading) {
        return;
      }

      if (user && !isGuest) {
        await syncLocalBoardsToCloud(user.id);
      }

      const records = await getSavedBoards(user && !isGuest ? user.id : undefined);
      if (isMounted) {
        setSavedBoards(records);
      }
    };

    void loadBoards();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user, isGuest]);
  
  const handleOpenExport = (board: SavedBoardRecord) => {
    setSelectedBoard(board);
    setExportModalOpen(true);
  };
  
  const { 
    isProcessing, 
    generatedBoards, 
    processMenuImage, 
    reset 
  } = useMenuScanner();

  const handleImageSelected = async (imageBase64: string) => {
    setShowScannerModal(false);
    const success = await processMenuImage(imageBase64);
    if (success) {
      setViewState('review');
    }
  };

  const handleCancelProcessing = () => {
    reset();
  };

  const handleSaveBoard = async (boards: Record<string, AACBoard>) => {
    const savedBoard = await saveBoardRecord({
      boards,
      businessType: 'other',
      businessName: boards.main?.name || 'Custom Board',
      userId: user && !isGuest ? user.id : undefined,
    });

    setSavedBoards(await getSavedBoards(user && !isGuest ? user.id : undefined));
    toast({
      title: language === 'he' ? 'הלוח נשמר בהצלחה!' : 'Board saved successfully!',
      description: language === 'he' 
        ? 'הלוח החדש נוסף ללוח הבקרה שלך' 
        : 'The new board has been added to your dashboard',
    });
    setSelectedBoard(savedBoard);
    reset();
    setViewState('dashboard');
  };

  const handlePreviewBoard = (boards: Record<string, AACBoard>) => {
    setPreviewBoards(boards);
    setViewState('preview');
  };

  const handleBackFromReview = () => {
    reset();
    setViewState('dashboard');
  };

  const handleBackFromPreview = () => {
    setViewState('review');
  };

  const texts = {
    he: {
      scanMenu: 'סרוק תפריט חדש',
      scanDescription: 'העלו תמונת תפריט והבינה המלאכותית תיצור לוח תקשורת',
    },
    en: {
      scanMenu: 'Scan New Menu',
      scanDescription: 'Upload a menu photo and AI will create a communication board',
    },
    ar: {
      scanMenu: 'مسح قائمة جديدة',
      scanDescription: 'قم بتحميل صورة القائمة وسيقوم الذكاء الاصطناعي بإنشاء لوحة اتصال',
    },
    ru: {
      scanMenu: 'Сканировать новое меню',
      scanDescription: 'Загрузите фото меню, и ИИ создаст коммуникационную доску',
    },
  };

  const localT = texts[language as keyof typeof texts] || texts.en;

  // Show review editor
  if (viewState === 'review' && generatedBoards) {
    return (
      <BoardReviewEditor
        boards={generatedBoards}
        onSave={handleSaveBoard}
        onPreview={handlePreviewBoard}
        onBack={handleBackFromReview}
      />
    );
  }

  // Show preview
  if (viewState === 'preview' && previewBoards) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <div className="p-4 bg-card border-b border-border flex items-center justify-between">
          <Button variant="outline" onClick={handleBackFromPreview}>
            {language === 'he' ? 'חזרה לעריכה' : 'Back to Edit'}
          </Button>
          <span className="font-medium text-muted-foreground">
            {language === 'he' ? 'תצוגה מקדימה' : 'Preview Mode'}
          </span>
          <Button onClick={() => void handleSaveBoard(previewBoards)}>
            {language === 'he' ? 'שמור לוח' : 'Save Board'}
          </Button>
        </div>
        <div className="flex-1">
          <AACDashboard boards={previewBoards} rootBoardId="main" showAIUpload={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <ProcessingOverlay isProcessing={isProcessing} onCancel={handleCancelProcessing} />
      
      {selectedBoard && (
        <BoardExportModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          boardId={selectedBoard.id}
          boardName={selectedBoard.business_name}
          businessType={selectedBoard.business_type}
          boards={selectedBoard.boards_data}
        />
      )}
      
      <MenuScannerModal
        open={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onImageSelected={handleImageSelected}
      />
      
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
            <div className="flex gap-3">
              <Button size="lg" variant="default" onClick={() => setShowScannerModal(true)} className="gap-2">
                <ScanLine className="h-5 w-5" />
                {localT.scanMenu}
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/create" className="gap-2">
                  <Plus className="h-5 w-5" />
                  {t('dashboard.createNew')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Scan Menu CTA Card */}
          <div className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <ScanLine className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {localT.scanMenu}
                </h2>
                <p className="text-muted-foreground">
                  {localT.scanDescription}
                </p>
              </div>
              <Button size="lg" onClick={() => setShowScannerModal(true)} className="shrink-0">
                {language === 'he' ? 'התחל סריקה' : 'Start Scan'}
              </Button>
            </div>
          </div>

          {/* Boards Grid */}
          {savedBoards.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBoards.map((board) => (
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
                          {board.business_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`business.${board.business_type}`)}
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
                      <span>{Object.keys(board.boards_data).length} {language === 'he' ? 'לוחות' : 'boards'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{new Date(board.created_at).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenExport(board)}
                      className="gap-1"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      {language === 'he' ? 'ייצוא' : 'Export'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/board/${board.id}?type=${board.business_type}&edit=true`} className="gap-1">
                        <Settings className="h-3.5 w-3.5" />
                        {language === 'he' ? 'עריכה' : 'Edit'}
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link to={`/board/${board.id}?type=${board.business_type}`}>
                        {language === 'he' ? 'תצוגה' : 'View'}
                      </Link>
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
