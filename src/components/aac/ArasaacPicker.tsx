import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchArasaac, ArasaacPictogram } from '@/lib/arasaac';
import { cn } from '@/lib/utils';
import { ImageIcon, Loader2, X } from 'lucide-react';

interface ArasaacPickerProps {
  // Current image, if any (shown on the trigger button).
  imageUrl?: string;
  // Emoji fallback shown on the trigger when no image is selected.
  icon?: string;
  // Text used to seed the initial search (e.g. the item name).
  seedQuery?: string;
  onSelect: (imageUrl: string) => void;
  onClear?: () => void;
  className?: string;
}

export function ArasaacPicker({
  imageUrl,
  icon,
  seedQuery = '',
  onSelect,
  onClear,
  className,
}: ArasaacPickerProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(seedQuery);
  const [results, setResults] = useState<ArasaacPictogram[]>([]);
  const [loading, setLoading] = useState(false);

  const texts = {
    he: { placeholder: 'חיפוש סמלים…', empty: 'אין תוצאות', hint: 'חפש סמל ARASAAC', useEmoji: 'השתמש באימוג׳י' },
    en: { placeholder: 'Search pictograms…', empty: 'No results', hint: 'Search ARASAAC pictograms', useEmoji: 'Use emoji' },
  };
  const t = texts[language === 'he' ? 'he' : 'en'];
  const apiLang = language === 'he' ? 'he' : 'en';

  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const r = await searchArasaac(term, apiLang, controller.signal);
        setResults(r.slice(0, 24));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [query, open, apiLang]);

  // Seed/refresh the query when opening.
  const seededRef = useRef(false);
  useEffect(() => {
    if (open && !seededRef.current) {
      setQuery(seedQuery);
      seededRef.current = true;
    }
    if (!open) seededRef.current = false;
  }, [open, seedQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('h-10 w-10 p-1 shrink-0 bg-white/80', className)}
          aria-label={t.hint}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-contain" />
          ) : icon ? (
            <span className="text-xl">{icon}</span>
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="mb-2"
        />
        <div className="h-48 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {query.trim() ? t.empty : t.hint}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1">
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelect(p.imageUrl);
                    setOpen(false);
                  }}
                  className="aspect-square rounded-md border border-border p-1 hover:border-primary hover:bg-primary/5"
                  title={p.keyword}
                >
                  <img src={p.imageUrl} alt={p.keyword} className="h-full w-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        {imageUrl && onClear && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 w-full gap-2 text-muted-foreground"
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            <X className="h-4 w-4" />
            {t.useEmoji}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
