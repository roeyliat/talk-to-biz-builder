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
    <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <div className="absolute inset-6 rounded-[34px] bg-black/15 blur-2xl" />

      <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between border-b border-slate-200 px-7 py-5">
          <div className="flex gap-2 pt-1">
            <div className="h-3.5 w-3.5 rounded-full bg-[#8cd29d]" />
            <div className="h-3.5 w-3.5 rounded-full bg-[#f2d46a]" />
            <div className="h-3.5 w-3.5 rounded-full bg-[#e48abc]" />
          </div>

          <div className="flex items-start gap-4 text-right">
            <div>
              <h3 className="text-[1.9rem] font-extrabold leading-none text-slate-900">
                {language === 'he' ? 'גלידריה מתוקה' : 'Sweet Ice Cream'}
              </h3>
              <p className="mt-2 text-lg text-slate-500">
                {language === 'he' ? 'לוח תקשורת' : 'Communication Board'}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f7b03d_0%,#ef5ca7_100%)] text-2xl shadow-md">
              🍦
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 px-7 py-6">
          {previewCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-scale-in rounded-3xl border-[4px] px-4 py-5 text-center shadow-sm"
              style={{
                animationDelay: `${0.1 * index}s`,
                borderColor: card.color,
                backgroundColor: card.surface,
              }}
            >
              <div className="flex min-h-[76px] items-center justify-center text-4xl">{card.icon}</div>
              <div className="mt-3 text-[1.6rem] font-bold text-slate-800">
                {language === 'he' ? card.text : card.textEn}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-200 px-7 py-4 text-sm">
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
