import { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Camera, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuScannerModalProps {
  open: boolean;
  onClose: () => void;
  onImageSelected: (imageBase64: string) => void;
}

export function MenuScannerModal({ open, onClose, onImageSelected }: MenuScannerModalProps) {
  const { language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isRtl = language === 'he' || language === 'ar';

  const texts = {
    he: {
      title: 'סרוק תפריט ליצירת לוח',
      dropzone: 'גררו תמונה לכאן או לחצו להעלאה',
      uploadBtn: 'העלו תמונה',
      cameraBtn: 'צלמו תמונה',
      instruction: 'העלו תמונה ברורה של התפריט שלכם. הבינה המלאכותית תזהה את הפריטים ותיצור לוח תקשורת.',
      continue: 'המשך',
      cancel: 'ביטול',
    },
    en: {
      title: 'Scan Menu to Create Board',
      dropzone: 'Drag an image here or click to upload',
      uploadBtn: 'Upload Image',
      cameraBtn: 'Take Photo',
      instruction: 'Upload a clear photo of your menu. Our AI will identify items and create a communication board.',
      continue: 'Continue',
      cancel: 'Cancel',
    },
    ar: {
      title: 'امسح القائمة لإنشاء لوحة',
      dropzone: 'اسحب صورة هنا أو انقر للتحميل',
      uploadBtn: 'تحميل صورة',
      cameraBtn: 'التقاط صورة',
      instruction: 'قم بتحميل صورة واضحة للقائمة. سيحدد الذكاء الاصطناعي العناصر وينشئ لوحة اتصال.',
      continue: 'متابعة',
      cancel: 'إلغاء',
    },
    ru: {
      title: 'Сканировать меню для создания доски',
      dropzone: 'Перетащите изображение сюда или нажмите для загрузки',
      uploadBtn: 'Загрузить изображение',
      cameraBtn: 'Сделать фото',
      instruction: 'Загрузите четкое фото вашего меню. ИИ определит элементы и создаст коммуникационную доску.',
      continue: 'Продолжить',
      cancel: 'Отмена',
    },
  };

  const t = texts[language] || texts.en;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleContinue = () => {
    if (preview) {
      onImageSelected(preview);
    }
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">{t.instruction}</p>

          {!preview ? (
            <>
              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{t.dropzone}</p>
                </div>
              </div>

              {/* Upload buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {t.uploadBtn}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  {t.cameraBtn}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={preview}
                  alt="Menu preview"
                  className="w-full max-h-64 object-contain bg-muted"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 end-2"
                  onClick={() => setPreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  {t.cancel}
                </Button>
                <Button className="flex-1" onClick={handleContinue}>
                  {t.continue}
                </Button>
              </div>
            </>
          )}

          <ModalFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
}
