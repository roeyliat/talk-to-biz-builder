import { AACBoard } from '@/types/aac';
import { AACBoardView } from './AACBoardView';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

// Demo hierarchical board structure for a Pharmacy
const demoBoards: Record<string, AACBoard> = {
  'pharmacy-main': {
    id: 'pharmacy-main',
    name: 'בית מרקחת',
    nameEn: 'Pharmacy',
    cells: [
      { id: '1', text: 'שלום', textEn: 'Hello', category: 'social', icon: '👋' },
      { id: '2', text: 'אני', textEn: 'I', category: 'people', icon: '🙋' },
      { id: '3', text: 'רוצה', textEn: 'Want', category: 'verbs', icon: '👉' },
      { id: '4', text: 'עזרה ראשונה', textEn: 'First Aid', category: 'people', icon: '🩹', linkToBoardId: 'first-aid' },
      { id: '5', text: 'תרופות ללא מרשם', textEn: 'OTC Meds', category: 'people', icon: '💊', linkToBoardId: 'otc-meds' },
      { id: '6', text: 'מרשם', textEn: 'Prescription', category: 'people', icon: '📋', linkToBoardId: 'prescription' },
      { id: '7', text: 'איפה', textEn: 'Where', category: 'verbs', icon: '🔍' },
      { id: '8', text: 'יקר', textEn: 'Expensive', category: 'descriptors', icon: '💰' },
      { id: '9', text: 'תודה', textEn: 'Thank you', category: 'social', icon: '🙏' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'first-aid': {
    id: 'first-aid',
    name: 'עזרה ראשונה',
    nameEn: 'First Aid',
    parentBoardId: 'pharmacy-main',
    cells: [
      { id: 'fa1', text: 'תחבושות', textEn: 'Bandages', category: 'people', icon: '🩹' },
      { id: 'fa2', text: 'אלכוהול', textEn: 'Alcohol', category: 'people', icon: '🧴' },
      { id: 'fa3', text: 'פלסטרים', textEn: 'Band-aids', category: 'people', icon: '🩹' },
      { id: 'fa4', text: 'גזה', textEn: 'Gauze', category: 'people', icon: '🏥' },
      { id: 'fa5', text: 'משחה', textEn: 'Ointment', category: 'people', icon: '💊' },
      { id: 'fa6', text: 'חיטוי', textEn: 'Disinfectant', category: 'people', icon: '🧼' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'otc-meds': {
    id: 'otc-meds',
    name: 'תרופות ללא מרשם',
    nameEn: 'OTC Meds',
    parentBoardId: 'pharmacy-main',
    cells: [
      { id: 'otc1', text: 'כדורי כאב', textEn: 'Painkillers', category: 'people', icon: '💊' },
      { id: 'otc2', text: 'נגד חום', textEn: 'Fever', category: 'people', icon: '🌡️' },
      { id: 'otc3', text: 'נגד שיעול', textEn: 'Cough', category: 'people', icon: '😷' },
      { id: 'otc4', text: 'אלרגיה', textEn: 'Allergy', category: 'people', icon: '🤧' },
      { id: 'otc5', text: 'בטן', textEn: 'Stomach', category: 'people', icon: '🤢' },
      { id: 'otc6', text: 'ויטמינים', textEn: 'Vitamins', category: 'people', icon: '💪' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'prescription': {
    id: 'prescription',
    name: 'מרשם',
    nameEn: 'Prescription',
    parentBoardId: 'pharmacy-main',
    cells: [
      { id: 'rx1', text: 'יש לי מרשם', textEn: 'I have a prescription', category: 'social', icon: '📋' },
      { id: 'rx2', text: 'לאסוף', textEn: 'Pick up', category: 'verbs', icon: '📦' },
      { id: 'rx3', text: 'חידוש', textEn: 'Refill', category: 'verbs', icon: '🔄' },
      { id: 'rx4', text: 'לשאול רוקח', textEn: 'Ask pharmacist', category: 'verbs', icon: '👨‍⚕️' },
      { id: 'rx5', text: 'דחוף', textEn: 'Urgent', category: 'descriptors', icon: '⚡' },
      { id: 'rx6', text: 'לחכות', textEn: 'Wait', category: 'verbs', icon: '⏰' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

export function AACBoardDemo() {
  const { language } = useLanguage();

  const handleCellClick = (cell: { text: string; textEn: string }) => {
    const text = language === 'he' ? cell.text : cell.textEn;
    toast.success(text, {
      description: language === 'he' ? 'נלחץ' : 'Clicked',
      duration: 1500,
    });
    
    // TTS placeholder - would trigger speech here
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'he' ? 'he-IL' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg">
      <div className="text-center mb-4 pb-4 border-b border-border">
        <p className="text-sm text-muted-foreground">
          {language === 'he' 
            ? 'לחצו על תיקיות (כרטיסים עם אייקון תיקייה) כדי לנווט' 
            : 'Click on folders (cards with folder icon) to navigate'}
        </p>
      </div>
      <AACBoardView
        boards={demoBoards}
        rootBoardId="pharmacy-main"
        onCellClick={handleCellClick}
      />
    </div>
  );
}
