import { useLanguage } from '@/contexts/LanguageContext';

const previewCards = [
  { id: '1', text: 'רוצה', textEn: 'Want', category: 'verbs' as const, icon: '👉', color: '#32b25e', surface: '#d4ebdd' },
  { id: '2', text: 'אני', textEn: 'I', category: 'people' as const, icon: '🙋', color: '#f6c233', surface: '#fbeec6' },
  { id: '3', text: 'שלום', textEn: 'Hello', category: 'social' as const, icon: '👋', color: '#3d88e8', surface: '#d7e6f7' },
  { id: '4', text: 'תודה', textEn: 'Thank you', category: 'social' as const, icon: '🙏', color: '#3d88e8', surface: '#d7e6f7' },
  { id: '5', text: 'קר', textEn: 'Cold', category: 'descriptors' as const, icon: '❄️', color: '#dd5ca4', surface: '#efd9e8' },
  { id: '6', text: 'גלידה', textEn: 'Ice Cream', category: 'people' as const, icon: '🍦', color: '#f6c233', surface: '#fbeec6' },
];

export function AACBoardPreview() {
  const { language } = useLanguage();

  return (
    <div className="relative mx-auto w-full max-w-[21rem] animate-scale-in sm:max-w-[31rem] lg:max-w-none" style={{ animationDelay: '0.2s' }}>
      <div className="absolute inset-4 rounded-[28px] bg-black/15 blur-2xl sm:inset-6 sm:rounded-[34px]" />

      <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-7 sm:py-5">
          <div className="flex gap-2 pt-1">
            <div className="h-3 w-3 rounded-full bg-[#8cd29d] sm:h-3.5 sm:w-3.5" />
            <div className="h-3 w-3 rounded-full bg-[#f2d46a] sm:h-3.5 sm:w-3.5" />
            <div className="h-3 w-3 rounded-full bg-[#e48abc] sm:h-3.5 sm:w-3.5" />
          </div>

          <div className="flex items-start gap-3 text-right sm:gap-4">
            <div>
              <h3 className="text-[1.4rem] font-extrabold leading-none text-slate-900 sm:text-[1.9rem]">
                {language === 'he' ? 'גלידריה מתוקה' : 'Sweet Ice Cream'}
              </h3>
              <p className="mt-2 text-sm text-slate-500 sm:text-lg">
                {language === 'he' ? 'לוח תקשורת' : 'Communication Board'}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f7b03d_0%,#ef5ca7_100%)] text-xl shadow-md sm:h-14 sm:w-14 sm:text-2xl">
              🍦
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 py-4 sm:gap-4 sm:px-7 sm:py-6">
          {previewCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-scale-in rounded-[1.4rem] border-[4px] px-2 py-3 text-center shadow-sm sm:rounded-3xl sm:px-4 sm:py-5"
              style={{
                animationDelay: `${0.1 * index}s`,
                borderColor: card.color,
                backgroundColor: card.surface,
              }}
            >
              <div className="flex min-h-[56px] items-center justify-center text-3xl sm:min-h-[76px] sm:text-4xl">{card.icon}</div>
              <div className="mt-2 text-[1.05rem] font-bold text-slate-800 sm:mt-3 sm:text-[1.6rem]">
                {language === 'he' ? card.text : card.textEn}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-4 py-4 text-xs sm:gap-4 sm:px-7 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{language === 'he' ? 'חברתי' : 'Social'}</span>
            <div className="h-4 w-4 rounded-md border-[3px] border-[#3d88e8] bg-[#d7e6f7]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{language === 'he' ? 'תיאורים' : 'Descriptors'}</span>
            <div className="h-4 w-4 rounded-md border-[3px] border-[#dd5ca4] bg-[#efd9e8]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{language === 'he' ? 'פעולות' : 'Actions'}</span>
            <div className="h-4 w-4 rounded-md border-[3px] border-[#32b25e] bg-[#d4ebdd]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{language === 'he' ? 'שמות' : 'Nouns'}</span>
            <div className="h-4 w-4 rounded-md border-[3px] border-[#f6c233] bg-[#fbeec6]" />
          </div>
        </div>
      </div>
    </div>
  );
}
