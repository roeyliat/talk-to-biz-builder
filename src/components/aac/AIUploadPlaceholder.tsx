import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIUploadPlaceholderProps {
  onUpload?: (file: File) => void;
  className?: string;
}

export function AIUploadPlaceholder({ onUpload, className }: AIUploadPlaceholderProps) {
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-6 w-6" />
        <span className="font-semibold text-lg">AI Menu Scanner</span>
      </div>
      
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {t('aac.aiProcessing')}
      </p>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" asChild>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4" />
            {t('aac.uploadMenu')}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
        </Button>
        
        <Button variant="outline" className="gap-2" asChild>
          <label className="cursor-pointer">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Camera</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Coming soon: AI-powered menu recognition
      </p>
    </div>
  );
}
