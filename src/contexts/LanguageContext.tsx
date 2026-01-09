import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'he' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.dashboard': 'לוח בקרה',
    'nav.create': 'יצירת לוח',
    'nav.login': 'התחברות',
    'nav.signup': 'הרשמה',
    
    // Hero
    'hero.title': 'קול לעסק',
    'hero.subtitle': 'הפכו את העסק שלכם לנגיש לכולם',
    'hero.description': 'צרו לוחות תקשורת חזותית מותאמים אישית לעסק שלכם, כדי שכל לקוח יוכל לתקשר בקלות',
    'hero.cta': 'התחילו עכשיו',
    'hero.demo': 'צפו בדוגמה',
    
    // Features
    'features.title': 'למה TalkBiz?',
    'features.ai.title': 'מונע בינה מלאכותית',
    'features.ai.description': 'AI חכם שמבין את העסק שלכם ויוצר לוחות מותאמים אישית',
    'features.accessible.title': 'נגיש לכולם',
    'features.accessible.description': 'עיצוב לפי שיטת Fitzgerald Key הקלינית המוכחת',
    'features.easy.title': 'קל לשימוש',
    'features.easy.description': 'ממשק גרור ושחרר פשוט לעריכה מהירה',
    'features.print.title': 'הדפסה ודיגיטל',
    'features.print.description': 'ייצוא ל-PDF להדפסה או שימוש אינטראקטיבי בטאבלט',
    
    // Dashboard
    'dashboard.title': 'לוח הבקרה שלי',
    'dashboard.welcome': 'ברוכים הבאים',
    'dashboard.boards': 'הלוחות שלי',
    'dashboard.createNew': 'צור לוח חדש',
    'dashboard.noBoards': 'עדיין אין לוחות. צרו את הראשון!',
    
    // Board Creator
    'creator.title': 'יצירת לוח חדש',
    'creator.step1': 'סוג העסק',
    'creator.step2': 'רמת מורכבות',
    'creator.step3': 'פרטי תפריט',
    'creator.step4': 'סקירה ויצירה',
    'creator.businessType': 'בחרו סוג עסק',
    'creator.complexity': 'בחרו רמת מורכבות',
    'creator.level1': 'בסיסי (4-6 תאים)',
    'creator.level2': 'בינוני (12-16 תאים)',
    'creator.level3': 'מתקדם (24-32 תאים)',
    'creator.menuItems': 'הזינו פריטי תפריט',
    'creator.generate': 'צור לוח',
    'creator.generating': 'יוצר את הלוח...',
    
    // Business Types
    'business.iceCream': 'גלידריה',
    'business.cafe': 'בית קפה',
    'business.restaurant': 'מסעדה',
    'business.pharmacy': 'בית מרקחת',
    'business.bakery': 'מאפייה',
    'business.supermarket': 'סופרמרקט',
    'business.other': 'אחר',
    
    // Fitzgerald Categories
    'fitzgerald.people': 'אנשים / שמות עצם',
    'fitzgerald.verbs': 'פעולות',
    'fitzgerald.descriptors': 'תיאורים',
    'fitzgerald.social': 'מילים חברתיות',
    
    // Common AAC Words
    'aac.hello': 'שלום',
    'aac.thanks': 'תודה',
    'aac.please': 'בבקשה',
    'aac.yes': 'כן',
    'aac.no': 'לא',
    'aac.want': 'רוצה',
    'aac.help': 'עזרה',
    'aac.more': 'עוד',
    'aac.done': 'סיימתי',
    'aac.i': 'אני',
    
    // Footer
    'footer.rights': 'כל הזכויות שמורות',
    'footer.privacy': 'מדיניות פרטיות',
    'footer.terms': 'תנאי שימוש',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.create': 'Create Board',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Hero
    'hero.title': 'TalkBiz',
    'hero.subtitle': 'Make Your Business Accessible to Everyone',
    'hero.description': 'Create custom visual communication boards for your business, so every customer can communicate with ease',
    'hero.cta': 'Get Started',
    'hero.demo': 'Watch Demo',
    
    // Features
    'features.title': 'Why TalkBiz?',
    'features.ai.title': 'AI-Powered',
    'features.ai.description': 'Smart AI that understands your business and creates personalized boards',
    'features.accessible.title': 'Accessible to All',
    'features.accessible.description': 'Designed using the proven clinical Fitzgerald Key method',
    'features.easy.title': 'Easy to Use',
    'features.easy.description': 'Simple drag-and-drop interface for quick editing',
    'features.print.title': 'Print & Digital',
    'features.print.description': 'Export to PDF for printing or use interactively on tablet',
    
    // Dashboard
    'dashboard.title': 'My Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.boards': 'My Boards',
    'dashboard.createNew': 'Create New Board',
    'dashboard.noBoards': 'No boards yet. Create your first one!',
    
    // Board Creator
    'creator.title': 'Create New Board',
    'creator.step1': 'Business Type',
    'creator.step2': 'Complexity Level',
    'creator.step3': 'Menu Details',
    'creator.step4': 'Review & Create',
    'creator.businessType': 'Select Business Type',
    'creator.complexity': 'Select Complexity Level',
    'creator.level1': 'Basic (4-6 cells)',
    'creator.level2': 'Medium (12-16 cells)',
    'creator.level3': 'Advanced (24-32 cells)',
    'creator.menuItems': 'Enter Menu Items',
    'creator.generate': 'Generate Board',
    'creator.generating': 'Generating board...',
    
    // Business Types
    'business.iceCream': 'Ice Cream Shop',
    'business.cafe': 'Cafe',
    'business.restaurant': 'Restaurant',
    'business.pharmacy': 'Pharmacy',
    'business.bakery': 'Bakery',
    'business.supermarket': 'Supermarket',
    'business.other': 'Other',
    
    // Fitzgerald Categories
    'fitzgerald.people': 'People / Nouns',
    'fitzgerald.verbs': 'Actions',
    'fitzgerald.descriptors': 'Descriptors',
    'fitzgerald.social': 'Social Words',
    
    // Common AAC Words
    'aac.hello': 'Hello',
    'aac.thanks': 'Thank you',
    'aac.please': 'Please',
    'aac.yes': 'Yes',
    'aac.no': 'No',
    'aac.want': 'Want',
    'aac.help': 'Help',
    'aac.more': 'More',
    'aac.done': 'Done',
    'aac.i': 'I',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');

  const direction: Direction = language === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
