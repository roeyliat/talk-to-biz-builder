import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, QrCode, FileText, Printer, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AACBoard } from '@/types/aac';
import { AACCard } from '@/components/aac/AACCard';
import { canRenderBoardUrlAsQr, createSharedBoardUrl } from '@/lib/sharedBoard';

const QR_LEVELS = ['H', 'Q', 'M', 'L'] as const;

interface BoardExportModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
  businessType: string;
  boards?: Record<string, AACBoard>;
}

export function BoardExportModal({
  open,
  onClose,
  boardId,
  boardName,
  businessType,
  boards
}: BoardExportModalProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const baseUrl = window.location.origin;
  const boardUrl = createSharedBoardUrl({
    baseUrl,
    boardId,
    businessType,
    boardName,
    boards,
  });
  const qrLevel = QR_LEVELS.find((level) => canRenderBoardUrlAsQr(boardUrl, level)) ?? null;
  const canRenderMainQr = qrLevel !== null;
  const canRenderPrintQr = qrLevel !== null;

  const texts = {
    he: {
      title: 'ייצוא לוח תקשורת',
      qrTab: 'קוד QR',
      pdfTab: 'PDF להדפסה',
      qrTitle: 'קוד QR ללוח התקשורת',
      qrDescription: 'סרקו את הקוד עם הטלפון לפתיחת הלוח',
      downloadQR: 'הורד קוד QR',
      copyLink: 'העתק קישור',
      copied: 'הקישור הועתק',
      copyFailed: 'לא ניתן היה להעתיק את הקישור',
      qrTooLarge: 'הקישור ארוך מדי עבור קוד QR. השתמשו בהעתקת הקישור.',
      printTitle: 'הדפסת לוח תקשורת',
      printDescription: 'הורידו PDF להדפסה ותלייה בעסק',
      downloadPDF: 'הורד PDF',
      generating: 'מייצר PDF...',
      preview: 'תצוגה מקדימה',
    },
    en: {
      title: 'Export Communication Board',
      qrTab: 'QR Code',
      pdfTab: 'Print PDF',
      qrTitle: 'QR Code for Board Access',
      qrDescription: 'Scan the code with your phone to open the board',
      downloadQR: 'Download QR Code',
      copyLink: 'Copy Link',
      copied: 'Link copied',
      copyFailed: 'Could not copy the link',
      qrTooLarge: 'This link is too long for a QR code. Use Copy Link instead.',
      printTitle: 'Print Communication Board',
      printDescription: 'Download a PDF to print and display in your business',
      downloadPDF: 'Download PDF',
      generating: 'Generating PDF...',
      preview: 'Preview',
    },
    ar: {
      title: 'تصدير لوحة التواصل',
      qrTab: 'رمز QR',
      pdfTab: 'PDF للطباعة',
      qrTitle: 'رمز QR للوحة',
      qrDescription: 'امسح الرمز بهاتفك لفتح اللوحة',
      downloadQR: 'تحميل رمز QR',
      copyLink: 'نسخ الرابط',
      copied: 'تم نسخ الرابط',
      copyFailed: 'تعذر نسخ الرابط',
      qrTooLarge: 'هذا الرابط طويل جدًا لرمز QR. استخدم نسخ الرابط بدلاً من ذلك.',
      printTitle: 'طباعة لوحة التواصل',
      printDescription: 'قم بتحميل PDF للطباعة والعرض في عملك',
      downloadPDF: 'تحميل PDF',
      generating: 'جاري إنشاء PDF...',
      preview: 'معاينة',
    },
    ru: {
      title: 'Экспорт доски',
      qrTab: 'QR-код',
      pdfTab: 'PDF для печати',
      qrTitle: 'QR-код для доски',
      qrDescription: 'Отсканируйте код телефоном для открытия доски',
      downloadQR: 'Скачать QR-код',
      copyLink: 'Копировать ссылку',
      copied: 'Ссылка скопирована',
      copyFailed: 'Не удалось скопировать ссылку',
      qrTooLarge: 'Ссылка слишком длинная для QR-кода. Используйте копирование ссылки.',
      printTitle: 'Печать доски',
      printDescription: 'Скачайте PDF для печати и размещения в вашем бизнесе',
      downloadPDF: 'Скачать PDF',
      generating: 'Создание PDF...',
      preview: 'Предпросмотр',
    },
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  const handleDownloadQR = () => {
    const svg = document.getElementById('board-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${boardName}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(boardUrl);
      setCopied(true);
      toast({
        title: t.copied,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: t.copyFailed,
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${boardName}-board.pdf`);
      
      toast({
        title: language === 'he' ? 'ה-PDF הורד בהצלחה!' : 'PDF downloaded successfully!',
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: language === 'he' ? 'שגיאה ביצירת PDF' : 'Error generating PDF',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Get main board cells for preview
  const mainBoard = boards?.['main'];
  const previewCells = mainBoard?.cells.slice(0, 9) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr" className="gap-2">
              <QrCode className="h-4 w-4" />
              {t.qrTab}
            </TabsTrigger>
            <TabsTrigger value="pdf" className="gap-2">
              <FileText className="h-4 w-4" />
              {t.pdfTab}
            </TabsTrigger>
          </TabsList>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-6 pt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t.qrTitle}</h3>
              <p className="text-muted-foreground text-sm">{t.qrDescription}</p>
            </div>

            <div className="flex justify-center">
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                {canRenderMainQr ? (
                  <QRCodeSVG
                    id="board-qr-code"
                    value={boardUrl}
                    size={200}
                    level={qrLevel ?? 'L'}
                    includeMargin
                    imageSettings={{
                      src: '',
                      height: 0,
                      width: 0,
                      excavate: false,
                    }}
                  />
                ) : (
                  <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                    {t.qrTooLarge}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/50 rounded-lg p-3">
              <code className="text-sm text-muted-foreground break-all text-center sm:text-start flex-1" style={{ direction: 'ltr' }}>{boardUrl}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-1.5 shrink-0 bg-background text-foreground border-border hover:bg-muted"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? t.copied : t.copyLink}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleDownloadQR} className="gap-2">
                <Download className="h-4 w-4" />
                {t.downloadQR}
              </Button>
            </div>
          </TabsContent>

          {/* PDF Tab */}
          <TabsContent value="pdf" className="space-y-6 pt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t.printTitle}</h3>
              <p className="text-muted-foreground text-sm">{t.printDescription}</p>
            </div>

            {/* Print Preview */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted/30 px-4 py-2 border-b">
                <span className="text-sm text-muted-foreground">{t.preview}</span>
              </div>
              <div 
                ref={printRef}
                className="p-6 bg-white"
                style={{ direction: language === 'he' || language === 'ar' ? 'rtl' : 'ltr' }}
              >
                {/* Board Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{boardName}</h2>
                  <p className="text-gray-500 text-sm">
                    {language === 'he' ? 'לוח תקשורת נגיש' : 'Accessible Communication Board'}
                  </p>
                </div>

                {/* Board Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {previewCells.map((cell, index) => (
                    <AACCard
                      key={index}
                      text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                      imageSearchTerms={[cell.text, cell.textEn]}
                      category={cell.category}
                      icon={cell.icon}
                      size="md"
                      disabled
                    />
                  ))}
                </div>

                {/* QR Code Footer */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                  {canRenderPrintQr ? (
                    <QRCodeSVG value={boardUrl} size={60} level="M" />
                  ) : (
                    <div className="flex h-[60px] w-[60px] items-center justify-center rounded border border-dashed border-gray-300 text-[10px] text-gray-400">
                      QR
                    </div>
                  )}
                  <div className="text-start">
                    <p className="text-xs text-gray-500">
                      {language === 'he' ? 'סרקו לגרסה דיגיטלית' : 'Scan for digital version'}
                    </p>
                    <p className="text-xs text-gray-400">{canRenderPrintQr ? boardUrl : t.qrTooLarge}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="gap-2">
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? t.generating : t.downloadPDF}
              </Button>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                {language === 'he' ? 'הדפסה ישירה' : 'Print'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <ModalFooter />
      </DialogContent>
    </Dialog>
  );
}
