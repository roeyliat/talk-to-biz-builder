import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'he' | 'en' | 'ar' | 'ru';
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
    'nav.aacBoard': 'לוח תקשורת',
    
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
    'business.pizza': 'פיצריה',
    'business.cafe': 'בית קפה',
    'business.restaurant': 'מסעדה',
    'business.pharmacy': 'בית מרקחת',
    'business.bakery': 'מאפייה',
    'business.supermarket': 'סופרמרקט',
    'business.laundromat': 'מכבסה',
    'business.partySupplies': 'חנות מסיבות',
    'business.toyStore': 'חנות צעצועים',
    'business.hairSalon': 'מספרה',
    'business.shoeStore': 'חנות נעליים',
    'business.clothingStore': 'חנות בגדים',
    'business.other': 'אחר',
    
    // Fitzgerald Categories
    'fitzgerald.people': 'אנשים / שמות עצם',
    'fitzgerald.verbs': 'פעולות',
    'fitzgerald.descriptors': 'תיאורים',
    'fitzgerald.social': 'מילים חברתיות',
    
    // Common AAC Words - Core Vocabulary
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
    'aac.toilet': 'שירותים',
    'aac.back': 'חזרה',
    
    // AAC Board UI
    'aac.coreVocabulary': 'מילים בסיסיות',
    'aac.mainBoard': 'לוח ראשי',
    'aac.uploadMenu': 'העלו תמונת תפריט',
    'aac.aiProcessing': 'ה-AI יעבד את התמונה ויצור כרטיסים',
    
    // Menu Items
    'menu.drinks': 'משקאות',
    'menu.food': 'אוכל',
    'menu.desserts': 'קינוחים',
    'menu.coffee': 'קפה',
    'menu.tea': 'תה',
    'menu.juice': 'מיץ',
    'menu.water': 'מים',
    'menu.hotDrinks': 'משקאות חמים',
    'menu.coldDrinks': 'משקאות קרים',
    
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
    'nav.aacBoard': 'AAC Board',
    
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
    'business.pizza': 'Pizzeria',
    'business.cafe': 'Cafe',
    'business.restaurant': 'Restaurant',
    'business.pharmacy': 'Pharmacy',
    'business.bakery': 'Bakery',
    'business.supermarket': 'Supermarket',
    'business.laundromat': 'Laundromat',
    'business.partySupplies': 'Party Supplies',
    'business.toyStore': 'Toy Store',
    'business.hairSalon': 'Hair Salon',
    'business.shoeStore': 'Shoe Store',
    'business.clothingStore': 'Clothing Store',
    'business.other': 'Other',
    
    // Fitzgerald Categories
    'fitzgerald.people': 'People / Nouns',
    'fitzgerald.verbs': 'Actions',
    'fitzgerald.descriptors': 'Descriptors',
    'fitzgerald.social': 'Social Words',
    
    // Common AAC Words - Core Vocabulary
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
    'aac.toilet': 'Toilet',
    'aac.back': 'Back',
    
    // AAC Board UI
    'aac.coreVocabulary': 'Core Words',
    'aac.mainBoard': 'Main Board',
    'aac.uploadMenu': 'Upload Menu Photo',
    'aac.aiProcessing': 'AI will process the image and create cards',
    
    // Menu Items
    'menu.drinks': 'Drinks',
    'menu.food': 'Food',
    'menu.desserts': 'Desserts',
    'menu.coffee': 'Coffee',
    'menu.tea': 'Tea',
    'menu.juice': 'Juice',
    'menu.water': 'Water',
    'menu.hotDrinks': 'Hot Drinks',
    'menu.coldDrinks': 'Cold Drinks',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.create': 'إنشاء لوحة',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.aacBoard': 'لوحة التواصل',
    
    // Hero
    'hero.title': 'TalkBiz',
    'hero.subtitle': 'اجعل عملك متاحاً للجميع',
    'hero.description': 'أنشئ لوحات تواصل بصرية مخصصة لعملك، لكي يتمكن كل عميل من التواصل بسهولة',
    'hero.cta': 'ابدأ الآن',
    'hero.demo': 'شاهد العرض',
    
    // Features
    'features.title': 'لماذا TalkBiz؟',
    'features.ai.title': 'مدعوم بالذكاء الاصطناعي',
    'features.ai.description': 'ذكاء اصطناعي يفهم عملك وينشئ لوحات مخصصة',
    'features.accessible.title': 'متاح للجميع',
    'features.accessible.description': 'مصمم باستخدام طريقة Fitzgerald Key السريرية المثبتة',
    'features.easy.title': 'سهل الاستخدام',
    'features.easy.description': 'واجهة سحب وإفلات بسيطة للتحرير السريع',
    'features.print.title': 'طباعة ورقمي',
    'features.print.description': 'تصدير إلى PDF للطباعة أو الاستخدام التفاعلي',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً',
    'dashboard.boards': 'لوحاتي',
    'dashboard.createNew': 'إنشاء لوحة جديدة',
    'dashboard.noBoards': 'لا توجد لوحات بعد. أنشئ أول واحدة!',
    
    // Board Creator
    'creator.title': 'إنشاء لوحة جديدة',
    'creator.step1': 'نوع العمل',
    'creator.step2': 'مستوى التعقيد',
    'creator.step3': 'تفاصيل القائمة',
    'creator.step4': 'مراجعة وإنشاء',
    'creator.businessType': 'اختر نوع العمل',
    'creator.complexity': 'اختر مستوى التعقيد',
    'creator.level1': 'أساسي (4-6 خلايا)',
    'creator.level2': 'متوسط (12-16 خلية)',
    'creator.level3': 'متقدم (24-32 خلية)',
    'creator.menuItems': 'أدخل عناصر القائمة',
    'creator.generate': 'إنشاء اللوحة',
    'creator.generating': 'جاري إنشاء اللوحة...',
    
    // Business Types
    'business.iceCream': 'محل آيس كريم',
    'business.pizza': 'بيتزا',
    'business.cafe': 'مقهى',
    'business.restaurant': 'مطعم',
    'business.pharmacy': 'صيدلية',
    'business.bakery': 'مخبز',
    'business.supermarket': 'سوبرماركت',
    'business.laundromat': 'مغسلة',
    'business.partySupplies': 'مستلزمات الحفلات',
    'business.toyStore': 'متجر ألعاب',
    'business.hairSalon': 'صالون تجميل',
    'business.shoeStore': 'متجر أحذية',
    'business.clothingStore': 'متجر ملابس',
    'business.other': 'أخرى',
    
    // Fitzgerald Categories
    'fitzgerald.people': 'أشخاص / أسماء',
    'fitzgerald.verbs': 'أفعال',
    'fitzgerald.descriptors': 'صفات',
    'fitzgerald.social': 'كلمات اجتماعية',
    
    // Common AAC Words - Core Vocabulary
    'aac.hello': 'مرحباً',
    'aac.thanks': 'شكراً',
    'aac.please': 'من فضلك',
    'aac.yes': 'نعم',
    'aac.no': 'لا',
    'aac.want': 'أريد',
    'aac.help': 'مساعدة',
    'aac.more': 'المزيد',
    'aac.done': 'انتهيت',
    'aac.i': 'أنا',
    'aac.toilet': 'حمام',
    'aac.back': 'رجوع',
    
    // AAC Board UI
    'aac.coreVocabulary': 'كلمات أساسية',
    'aac.mainBoard': 'اللوحة الرئيسية',
    'aac.uploadMenu': 'تحميل صورة القائمة',
    'aac.aiProcessing': 'سيقوم الذكاء الاصطناعي بمعالجة الصورة',
    
    // Menu Items
    'menu.drinks': 'مشروبات',
    'menu.food': 'طعام',
    'menu.desserts': 'حلويات',
    'menu.coffee': 'قهوة',
    'menu.tea': 'شاي',
    'menu.juice': 'عصير',
    'menu.water': 'ماء',
    'menu.hotDrinks': 'مشروبات ساخنة',
    'menu.coldDrinks': 'مشروبات باردة',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.dashboard': 'Панель управления',
    'nav.create': 'Создать доску',
    'nav.login': 'Войти',
    'nav.signup': 'Регистрация',
    'nav.aacBoard': 'Коммуникационная доска',
    
    // Hero
    'hero.title': 'TalkBiz',
    'hero.subtitle': 'Сделайте свой бизнес доступным для всех',
    'hero.description': 'Создавайте персонализированные коммуникационные доски для вашего бизнеса, чтобы каждый клиент мог легко общаться',
    'hero.cta': 'Начать',
    'hero.demo': 'Смотреть демо',
    
    // Features
    'features.title': 'Почему TalkBiz?',
    'features.ai.title': 'На основе ИИ',
    'features.ai.description': 'Умный ИИ, который понимает ваш бизнес и создает персонализированные доски',
    'features.accessible.title': 'Доступно для всех',
    'features.accessible.description': 'Разработано с использованием проверенного клинического метода Fitzgerald Key',
    'features.easy.title': 'Простота использования',
    'features.easy.description': 'Простой интерфейс перетаскивания для быстрого редактирования',
    'features.print.title': 'Печать и цифра',
    'features.print.description': 'Экспорт в PDF для печати или интерактивного использования',
    
    // Dashboard
    'dashboard.title': 'Мои доски',
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.boards': 'Мои доски',
    'dashboard.createNew': 'Создать новую доску',
    'dashboard.noBoards': 'Пока нет досок. Создайте первую!',
    
    // Board Creator
    'creator.title': 'Создать новую доску',
    'creator.step1': 'Тип бизнеса',
    'creator.step2': 'Уровень сложности',
    'creator.step3': 'Детали меню',
    'creator.step4': 'Обзор и создание',
    'creator.businessType': 'Выберите тип бизнеса',
    'creator.complexity': 'Выберите уровень сложности',
    'creator.level1': 'Базовый (4-6 ячеек)',
    'creator.level2': 'Средний (12-16 ячеек)',
    'creator.level3': 'Продвинутый (24-32 ячейки)',
    'creator.menuItems': 'Введите пункты меню',
    'creator.generate': 'Создать доску',
    'creator.generating': 'Создание доски...',
    
    // Business Types
    'business.iceCream': 'Мороженое',
    'business.pizza': 'Пиццерия',
    'business.cafe': 'Кафе',
    'business.restaurant': 'Ресторан',
    'business.pharmacy': 'Аптека',
    'business.bakery': 'Пекарня',
    'business.supermarket': 'Супермаркет',
    'business.laundromat': 'Прачечная',
    'business.partySupplies': 'Товары для праздников',
    'business.toyStore': 'Магазин игрушек',
    'business.hairSalon': 'Парикмахерская',
    'business.shoeStore': 'Обувной магазин',
    'business.clothingStore': 'Магазин одежды',
    'business.other': 'Другое',
    
    // Fitzgerald Categories
    'fitzgerald.people': 'Люди / Существительные',
    'fitzgerald.verbs': 'Действия',
    'fitzgerald.descriptors': 'Описания',
    'fitzgerald.social': 'Социальные слова',
    
    // Common AAC Words - Core Vocabulary
    'aac.hello': 'Привет',
    'aac.thanks': 'Спасибо',
    'aac.please': 'Пожалуйста',
    'aac.yes': 'Да',
    'aac.no': 'Нет',
    'aac.want': 'Хочу',
    'aac.help': 'Помощь',
    'aac.more': 'Ещё',
    'aac.done': 'Готово',
    'aac.i': 'Я',
    'aac.toilet': 'Туалет',
    'aac.back': 'Назад',
    
    // AAC Board UI
    'aac.coreVocabulary': 'Основные слова',
    'aac.mainBoard': 'Главная доска',
    'aac.uploadMenu': 'Загрузить фото меню',
    'aac.aiProcessing': 'ИИ обработает изображение и создаст карточки',
    
    // Menu Items
    'menu.drinks': 'Напитки',
    'menu.food': 'Еда',
    'menu.desserts': 'Десерты',
    'menu.coffee': 'Кофе',
    'menu.tea': 'Чай',
    'menu.juice': 'Сок',
    'menu.water': 'Вода',
    'menu.hotDrinks': 'Горячие напитки',
    'menu.coldDrinks': 'Холодные напитки',
    
    // Footer
    'footer.rights': 'Все права защищены',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');

  const direction: Direction = (language === 'he' || language === 'ar') ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
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
