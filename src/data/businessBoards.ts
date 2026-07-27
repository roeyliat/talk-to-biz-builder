import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';

export type BusinessType = 
  | 'pharmacy' 
  | 'supermarket' 
  | 'iceCream' 
  | 'cafe' 
  | 'restaurant' 
  | 'bakery'
  | 'pizza'
  | 'laundromat'
  | 'partySupplies'
  | 'toyStore'
  | 'hairSalon'
  | 'shoeStore'
  | 'clothingStore';

// Helper to create cells with proper typing
const cell = (
  id: string,
  text: string,
  textEn: string,
  category: FitzgeraldCategory,
  icon: string,
  linkToBoardId?: string
): AACCell => ({
  id,
  text,
  textEn,
  category,
  icon,
  linkToBoardId,
});

const imageCell = (
  id: string,
  text: string,
  textEn: string,
  category: FitzgeraldCategory,
  icon: string,
  imageUrl?: string,
  linkToBoardId?: string,
): AACCell => ({
  id,
  text,
  textEn,
  category,
  icon,
  imageUrl,
  linkToBoardId,
});

// =============================================================================
// PHARMACY BOARDS
// =============================================================================
const pharmacyBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'בית מרקחת',
    nameEn: 'Pharmacy',
    cells: [
      cell('prescription', 'תרופות מרשם', 'Prescription Meds', 'people', '📋', 'prescription'),
      cell('otc', 'תרופות ללא מרשם', 'Over-the-Counter', 'people', '💊', 'otc'),
      cell('first-aid', 'עזרה ראשונה', 'First Aid', 'people', '🩹', 'first-aid'),
      cell('cosmetics', 'קוסמטיקה', 'Cosmetics', 'people', '🧴', 'cosmetics'),
      cell('need', 'צריך', 'Need', 'verbs', '👆'),
      cell('where', 'איפה', 'Where', 'verbs', '🔍'),
      cell('hurts', 'כואב', 'Hurts', 'descriptors', '😣'),
      cell('help', 'עזרה', 'Help', 'social', '🙋'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'prescription': {
    id: 'prescription',
    name: 'תרופות מרשם',
    nameEn: 'Prescription Medications',
    parentBoardId: 'main',
    cells: [
      cell('antibiotics', 'אנטיביוטיקה', 'Antibiotics', 'people', '💊'),
      cell('blood-pressure', 'לחץ דם', 'Blood Pressure', 'people', '❤️'),
      cell('diabetes', 'סוכרת', 'Diabetes', 'people', '🩺'),
      cell('heart', 'לב', 'Heart', 'people', '❤️‍🔥'),
      cell('inhaler', 'משאף', 'Inhaler', 'people', '💨'),
      cell('refill', 'מילוי חוזר', 'Refill', 'verbs', '🔄'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'otc': {
    id: 'otc',
    name: 'תרופות ללא מרשם',
    nameEn: 'Over-the-Counter',
    parentBoardId: 'main',
    cells: [
      cell('headache', 'כאב ראש', 'Headache', 'people', '🤕'),
      cell('cold', 'צינון', 'Cold', 'people', '🤧'),
      cell('allergy', 'אלרגיה', 'Allergy', 'people', '🤢'),
      cell('fever', 'חום', 'Fever', 'people', '🌡️'),
      cell('stomach', 'בטן', 'Stomach', 'people', '🤮'),
      cell('cough', 'שיעול', 'Cough', 'people', '😷'),
      cell('vitamins', 'ויטמינים', 'Vitamins', 'people', '💪'),
      cell('painkillers', 'משככי כאבים', 'Painkillers', 'people', '💊'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'first-aid': {
    id: 'first-aid',
    name: 'עזרה ראשונה',
    nameEn: 'First Aid',
    parentBoardId: 'main',
    cells: [
      cell('bandages', 'פלסטרים', 'Bandages', 'people', '🩹'),
      cell('gauze', 'תחבושות', 'Gauze', 'people', '🩹'),
      cell('disinfectant', 'חיטוי', 'Disinfectant', 'people', '🧴'),
      cell('ointment', 'משחה', 'Ointment', 'people', '🧴'),
      cell('thermometer', 'מדחום', 'Thermometer', 'people', '🌡️'),
      cell('ice-pack', 'קרח', 'Ice Pack', 'people', '🧊'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'cosmetics': {
    id: 'cosmetics',
    name: 'קוסמטיקה',
    nameEn: 'Cosmetics',
    parentBoardId: 'main',
    cells: [
      cell('cream', 'קרם', 'Cream', 'people', '🧴'),
      cell('shampoo', 'שמפו', 'Shampoo', 'people', '🧴'),
      cell('soap', 'סבון', 'Soap', 'people', '🧼'),
      cell('toothpaste', 'משחת שיניים', 'Toothpaste', 'people', '🦷'),
      cell('deodorant', 'דאודורנט', 'Deodorant', 'people', '🧴'),
      cell('sunscreen', 'קרם הגנה', 'Sunscreen', 'people', '☀️'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// SUPERMARKET BOARDS — Comprehensive hierarchical tree
// =============================================================================
const supermarketBoards: Record<string, AACBoard> = {
  // ── Level 0: Home ──
  'main': {
    id: 'main',
    name: 'סופרמרקט',
    nameEn: 'Supermarket',
    cells: [
      cell('staff', 'אני צריך עזרה ממוכר', 'Help / Staff', 'social', '🙋‍♂️', 'staff'),
      cell('checkout', 'קופה ותשלום', 'Checkout', 'social', '💳', 'checkout'),
      cell('navigation', 'איפה נמצא?', 'Where is it?', 'verbs', '🗺️', 'navigation'),
      cell('deli', 'מעדנייה', 'Deli', 'people', '🧀', 'deli'),
      cell('butcher', 'קצבייה ודגים', 'Butcher & Fish', 'people', '🥩', 'butcher'),
      cell('bakery', 'מאפייה', 'Bakery', 'people', '🥖', 'bakery'),
      cell('produce', 'פירות וירקות', 'Produce', 'people', '🍏', 'produce'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },

  // ── Level 1: Staff Interaction ──
  'staff': {
    id: 'staff',
    name: 'אני צריך עזרה ממוכר',
    nameEn: 'Staff Interaction',
    parentBoardId: 'main',
    cells: [
      cell('staff-help', 'סליחה, אתה יכול לעזור לי למצוא מוצר?', 'Excuse me, can you help me find a product?', 'social', '🔍'),
      cell('staff-missing', 'המוצר הזה חסר במדף. האם יש לכם עוד במחסן?', 'This product is missing from the shelf. Do you have more in the back?', 'social', '📦'),
      cell('staff-reach', 'אני לא מגיע לזה, אתה יכול להוריד לי את המוצר מהמדף העליון?', 'I can\'t reach it, can you get it down from the top shelf?', 'social', '📏'),
      cell('staff-price', 'כמה עולה המוצר הזה? אין עליו מדבקת מחיר או ברקוד.', 'How much is this? There\'s no price tag or barcode.', 'social', '💰'),
      cell('staff-cart', 'איפה יש עגלות או סלסלאות פנויות?', 'Where are the shopping carts or baskets?', 'verbs', '🛒'),
      cell('staff-expired', 'פג התוקף של המוצר הזה שעל המדף. תוכל להביא לי אחד בתוקף?', 'This product on the shelf is expired. Can you bring me one that\'s still valid?', 'social', '📅'),
      cell('staff-restroom', 'סליחה, איפה שירותי הלקוחות או שירותי הנכים?', 'Excuse me, where are the customer restrooms or accessible restrooms?', 'social', '🚻'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },

  // ── Level 1: Checkout ──
  'checkout': {
    id: 'checkout',
    name: 'קופה ותשלום',
    nameEn: 'Checkout',
    parentBoardId: 'main',
    cells: [
      cell('ck-intro', 'שלום, אני משתמש בלוח תקשורת. אנא המתן בסבלנות כדי שאוכל לענות לך.', 'Hi, I use a communication board. Please be patient so I can respond.', 'social', '👋'),
      cell('ck-club-yes', 'יש לי כרטיס חבר מועדון, אני מיד מציג לך אותו.', 'I have a club card, I\'ll show it to you right away.', 'social', '💳'),
      cell('ck-club-no', 'אין לי כרטיס מועדון.', 'I don\'t have a club card.', 'social', '🚫'),
      cell('ck-bags-yes', 'אני צריך שקיות ניילון בבקשה.', 'I need plastic bags please.', 'social', '🛍️'),
      cell('ck-bags-no', 'יש לי שקיות משלי, תודה.', 'I have my own bags, thanks.', 'social', '♻️'),
      cell('ck-credit', 'אני משלם באשראי.', 'I\'m paying by credit card.', 'social', '💳'),
      cell('ck-cash', 'אני משלם במזומן.', 'I\'m paying cash.', 'social', '💵'),
      cell('ck-app', 'אני משלם באפליקציה בטלפון (אפל פיי/ביט/גוגל).', 'I\'m paying by phone app (Apple Pay/Bit/Google).', 'social', '📱'),
      cell('ck-coupon', 'יש לי קופון הנחה שאני רוצה לממש.', 'I have a discount coupon I\'d like to use.', 'social', '🏷️'),
      cell('ck-pack-help', 'קשה לי לארוז לבד, אתה יכול בבקשה לעזור לי להכניס את הדברים לשקיות?', 'It\'s hard for me to pack alone, can you help me bag the items?', 'social', '🤝'),
      cell('ck-error', 'יש טעות בחשבון. המוצר הזה היה במבצע שעל המדף וזה לא עבר בקופה.', 'There\'s an error. This item was on sale on the shelf but didn\'t ring up correctly.', 'social', '⚠️'),
      cell('ck-cancel', 'אני רוצה לבטל את המוצר הזה, התחרטתי ואני לא קונה אותו.', 'I want to cancel this item, I changed my mind.', 'social', '❌'),
      cell('ck-receipt', 'אפשר בבקשה את הקבלה? תודה רבה ויום טוב.', 'Can I have the receipt please? Thank you and have a good day.', 'social', '🧾'),
    ],
    gridSize: { cols: 4, rows: 4 },
  },

  // ── Level 1: Navigation ──
  'navigation': {
    id: 'navigation',
    name: 'איפה נמצא?',
    nameEn: 'Where is it?',
    parentBoardId: 'main',
    cells: [
      cell('nav-dairy', 'סליחה, באיזה מעבר נמצאים מוצרי החלב?', 'Excuse me, which aisle has the dairy products?', 'verbs', '🥛'),
      cell('nav-bread', 'איפה נמצא הלחם?', 'Where is the bread?', 'verbs', '🍞'),
      cell('nav-frozen', 'איפה מחלקת הקפואים?', 'Where is the frozen section?', 'verbs', '🧊'),
      cell('nav-cleaning', 'איפה נמצאים חומרי הניקוי?', 'Where are the cleaning supplies?', 'verbs', '🧹'),
      cell('nav-pasta', 'איפה הפסטה והאורז?', 'Where are the pasta and rice?', 'verbs', '🍝'),
      cell('nav-baby', 'איפה מוצרי התינוקות והטיטולים?', 'Where are the baby products and diapers?', 'verbs', '👶'),
      cell('nav-drinks', 'איפה המשקאות הקלים והמים?', 'Where are the soft drinks and water?', 'verbs', '🥤'),
      cell('nav-special', 'איפה מוצרים ללא גלוטן וללא סוכר?', 'Where are the gluten-free and sugar-free products?', 'verbs', '🌾'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },

  // ── Level 1: Deli ──
  'deli': {
    id: 'deli',
    name: 'מעדנייה',
    nameEn: 'Deli',
    parentBoardId: 'main',
    cells: [
      cell('deli-yellow', 'גבינה צהובה', 'Yellow Cheese', 'people', '🧀', 'deli-yellow-cheese'),
      cell('deli-salty', 'גבינה מלוחה', 'Salty Cheese', 'people', '🧀', 'deli-salty-cheese'),
      cell('deli-coldcuts', 'נקניק / פסטרמה', 'Cold Cuts', 'people', '🥓', 'deli-coldcuts'),
      cell('deli-taste', 'אפשר לטעום חתיכה קטנה מזה בבקשה?', 'Can I taste a small piece please?', 'social', '👅'),
      cell('deli-separate', 'בבקשה לארוז כל סוג גבינה בשקית נפרדת.', 'Please pack each cheese type in a separate bag.', 'social', '🛍️'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'deli-yellow-cheese': {
    id: 'deli-yellow-cheese',
    name: 'גבינה צהובה',
    nameEn: 'Yellow Cheese',
    parentBoardId: 'deli',
    cells: [
      cell('yc-200-thin', 'אני רוצה 200 גרם גבינה צהובה, חתוכה לפרוסות דקות.', 'I want 200g yellow cheese, thinly sliced.', 'people', '🧀'),
      cell('yc-300-reg', 'אני רוצה 300 גרם גבינה צהובה, חתוכה לפרוסות רגילות.', 'I want 300g yellow cheese, regular slices.', 'people', '🧀'),
      cell('yc-500-block', 'אני רוצה חצי קילו גבינה צהובה, בחתיכה אחת (גוש), לא פרוס.', 'I want half a kilo of yellow cheese, in one block, not sliced.', 'people', '🧀'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'deli-salty-cheese': {
    id: 'deli-salty-cheese',
    name: 'גבינה מלוחה',
    nameEn: 'Salty Cheese',
    parentBoardId: 'deli',
    cells: [
      cell('sc-bulgarian', 'אני רוצה גבינה בולגרית, קוביה אחת בקופסת פלסטיק עם קצת מים.', 'I want Bulgarian cheese, one cube in a plastic container with some water.', 'people', '🧀'),
    ],
    gridSize: { cols: 1, rows: 1 },
  },
  'deli-coldcuts': {
    id: 'deli-coldcuts',
    name: 'נקניק / פסטרמה',
    nameEn: 'Cold Cuts',
    parentBoardId: 'deli',
    cells: [
      cell('cc-pastrami', 'אני רוצה 200 גרם פסטרמה, חתוכה לפרוסות דקות מאוד.', 'I want 200g pastrami, very thinly sliced.', 'people', '🥓'),
      cell('cc-salami', 'אני רוצה 200 גרם סלמי, חתוך לפרוסות.', 'I want 200g salami, sliced.', 'people', '🥓'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },

  // ── Level 1: Butcher & Fish ──
  'butcher': {
    id: 'butcher',
    name: 'קצבייה ודגים',
    nameEn: 'Butcher & Fish',
    parentBoardId: 'main',
    cells: [
      cell('bt-chicken', 'עוף', 'Chicken', 'people', '🍗', 'butcher-chicken'),
      cell('bt-beef', 'בקר / בשר טחון', 'Beef / Ground Meat', 'people', '🥩', 'butcher-beef'),
      cell('bt-fish', 'דגים', 'Fish', 'people', '🐟', 'butcher-fish'),
      cell('bt-separate', 'בבקשה לארוז כל דבר בשקית נפרדת ואטומה.', 'Please pack each item in a separate sealed bag.', 'social', '🛍️'),
      cell('bt-ice', 'שים לי בבקשה קרח בשקית של הדגים כדי שיישאר קר.', 'Please put ice in the fish bag to keep it cold.', 'social', '🧊'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'butcher-chicken': {
    id: 'butcher-chicken',
    name: 'עוף',
    nameEn: 'Chicken',
    parentBoardId: 'butcher',
    cells: [
      cell('ch-schnitzel', 'אני רוצה קילו חזה עוף, חתוך ודפוק לשניצלים.', 'I want 1kg chicken breast, cut and pounded for schnitzel.', 'people', '🍗'),
      cell('ch-butterfly', 'אני רוצה קילו חזה עוף, שלם כמו שהוא (פרפר).', 'I want 1kg chicken breast, whole butterfly style.', 'people', '🍗'),
      cell('ch-cubes', 'אני רוצה חצי קילו חזה עוף, חתוך לקוביות למוקפץ.', 'I want 500g chicken breast, diced for stir-fry.', 'people', '🍗'),
      cell('ch-thighs', 'אני רוצה קילו פרגיות, מנוקות מבלי עצם.', 'I want 1kg boneless chicken thighs.', 'people', '🍗'),
      cell('ch-drumsticks', 'אני רוצה מגש של כרעיים עוף.', 'I want a tray of chicken drumsticks.', 'people', '🍗'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'butcher-beef': {
    id: 'butcher-beef',
    name: 'בקר / בשר טחון',
    nameEn: 'Beef / Ground Meat',
    parentBoardId: 'butcher',
    cells: [
      cell('bf-ground-half', 'אני רוצה חצי קילו בשר טחון בקר.', 'I want 500g ground beef.', 'people', '🥩'),
      cell('bf-ground-double', 'אני רוצה קילו בשר בקר טחון, לטחון פעמיים בבקשה.', 'I want 1kg ground beef, double-ground please.', 'people', '🥩'),
      cell('bf-ground-mix', 'אני רוצה קילו בשר טחון, חצי בקר וחצי עוף.', 'I want 1kg ground meat, half beef and half chicken.', 'people', '🥩'),
      cell('bf-roast', 'אני רוצה נתח של בקר לצלי קדרה, בערך קילו וחצי.', 'I want a beef roast cut, about 1.5kg.', 'people', '🥩'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'butcher-fish': {
    id: 'butcher-fish',
    name: 'דגים',
    nameEn: 'Fish',
    parentBoardId: 'butcher',
    cells: [
      cell('fi-salmon', 'אני רוצה פילה סלמון, בערך קילו, מחולק לפרוסות.', 'I want salmon fillet, about 1kg, divided into slices.', 'people', '🐟'),
      cell('fi-tilapia', 'אני רוצה דג אמנון/מושט שלם, מנוקה מבפנים ומקשקשים.', 'I want a whole tilapia, cleaned and descaled.', 'people', '🐟'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },

  // ── Level 1: Bakery ──
  'bakery': {
    id: 'bakery',
    name: 'מאפייה',
    nameEn: 'Bakery',
    parentBoardId: 'main',
    cells: [
      cell('bk-slice', 'שלום, אפשר לפרוס לי את הלחם הזה במכונה בבקשה?', 'Hi, can you slice this bread for me in the machine please?', 'social', '🔪'),
      cell('bk-fresh', 'אני רוצה את הלחם הזה, האם הוא נאפה היום?', 'I want this bread, was it baked today?', 'social', '🍞'),
      cell('bk-hot-rolls', 'האם יש לכם לחמניות חמות שעכשיו יצאו מהתנור?', 'Do you have hot rolls that just came out of the oven?', 'social', '🥖'),
      cell('bk-whole-wheat', 'האם הלחם הזה הוא מקמח מלא 100%?', 'Is this bread 100% whole wheat?', 'social', '🌾'),
      cell('bk-box', 'בבקשה לארוז לי את המאפים האלו בקופסת קרטון ולא בשקית נייר כדי שלא ימעכו.', 'Please pack these pastries in a cardboard box, not a paper bag, so they won\'t get crushed.', 'social', '📦'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },

  // ── Level 1: Produce ──
  'produce': {
    id: 'produce',
    name: 'פירות וירקות',
    nameEn: 'Produce',
    parentBoardId: 'main',
    cells: [
      cell('pr-scale', 'איפה המשקל של הפירות והירקות? אני צריך לשקול את זה.', 'Where is the produce scale? I need to weigh this.', 'verbs', '⚖️'),
      cell('pr-bags', 'סליחה, נגמרו שקיות הפלסטיק כאן, תוכל להביא גליל שקיות חדש?', 'Excuse me, the plastic bags here ran out, can you bring a new roll?', 'social', '🛍️'),
      cell('pr-ripe', 'האם הפרי הזה רך ומוכן לאכילה, או קשה?', 'Is this fruit soft and ready to eat, or hard?', 'social', '🍑'),
      cell('pr-reach', 'אני צריך עזרה להגיע לפירות שנמצאים למעלה.', 'I need help reaching the fruit up top.', 'social', '📏'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
};

// =============================================================================
// ICE CREAM SHOP BOARDS - Multi-Level Hierarchical
// =============================================================================
const iceCreamBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'גלידריה',
    nameEn: 'Ice Cream Shop',
    cells: [
      imageCell('root-want-order', 'אני רוצה להזמין', 'I want to order', 'verbs', '📝', '/aac-local/flavors/אני רוצה להזמין.png', 'order-menu'),
      cell('ice-cream', 'גלידה', 'Ice Cream', 'people', '🍦', 'ice-cream-type'),
      cell('sorbet', 'סורבה', 'Sorbet', 'people', '🍧', 'sorbet-type'),
      cell('yogurt', 'יוגורט קפוא', 'Frozen Yogurt', 'people', '🥛', 'yogurt-type'),
      cell('cold-drinks', 'שתייה קרה', 'Cold Drinks', 'people', '🥤', 'cold-drinks'),
      cell('hot-drinks', 'שתייה חמה', 'Hot Drinks', 'people', '☕', 'hot-drinks'),
      cell('desserts', 'קינוחים', 'Desserts', 'people', '🍰', 'desserts'),
      cell('alcoholic-flavors', 'טעמים אלכוהוליים', 'Alcoholic Flavors', 'people', '🍸', 'alcoholic-flavors'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      imageCell('root-want-taste', 'אני רוצה לטעום', 'I want to taste', 'verbs', '👅', '/aac-local/flavors/לטעום.png', 'flavors-cup'),
      cell('taste', 'לטעום', 'Taste', 'verbs', '👅'),
      cell('small', 'קטן', 'Small', 'descriptors', '🔹'),
      cell('medium', 'בינוני', 'Medium', 'descriptors', '🔶'),
      cell('large', 'גדול', 'Large', 'descriptors', '⬛'),
      cell('how-much', 'כמה עולה?', 'How much?', 'social', '💰'),
      cell('please', 'בבקשה', 'Please', 'social', '🙏'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 5 },
  },
  'order-menu': {
    id: 'order-menu',
    name: 'להזמין',
    nameEn: 'Order',
    parentBoardId: 'main',
    cells: [
      imageCell('ice-cream', 'גלידה', 'Ice Cream', 'people', '🍦', '/aac-local/flavors/גלידה.png', 'ice-cream-type'),
      imageCell('desserts', 'קינוחים', 'Desserts', 'people', '🍰', '/aac-local/flavors/פנקייק כדורים.png', 'desserts'),
      imageCell('cold-drinks', 'שתייה קרה', 'Cold Drinks', 'people', '🥤', '/aac-local/flavors/שתיה קרה.png', 'cold-drinks'),
      imageCell('hot-drinks', 'שתייה חמה', 'Hot Drinks', 'people', '☕', '/aac-local/flavors/שתיה חמה.png', 'hot-drinks'),
      imageCell('alcoholic-flavors', 'טעמים אלכוהוליים', 'Alcoholic Flavors', 'people', '🍸', '/aac-local/flavors/טעמים  אלכוהולים.png', 'alcoholic-flavors'),
      imageCell('take-away', 'לקחת הביתה', 'Take Away', 'people', '📦', '/aac-local/flavors/לקחת הביתה.png', 'take-away'),
    ],
    gridSize: { cols: 2, rows: 3 },
  },
  'ice-cream-type': {
    id: 'ice-cream-type',
    name: 'כוס או גביע?',
    nameEn: 'Cup or Cone?',
    parentBoardId: 'main',
    cells: [
      imageCell('cup', 'כוס', 'Cup', 'people', '🥣', '/aac-local/flavors/כוס.png', 'ice-cream-size-cup'),
      imageCell('cone', 'גביע', 'Cone', 'people', '🍦', '/aac-local/flavors/גביע.png', 'ice-cream-size-cone'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
  'ice-cream-size-cup': {
    id: 'ice-cream-size-cup',
    name: 'גודל',
    nameEn: 'Size',
    parentBoardId: 'ice-cream-type',
    cells: [
      imageCell('one-scoop', 'כדור אחד', 'One scoop', 'people', '🍦', '/aac-local/flavors/כדור אחד.png', 'flavors-cup'),
      imageCell('kids-portion', 'מנת ילדים', 'Kids portion', 'people', '🧒', '/aac-local/flavors/מנת ילדים.png', 'flavors-cup'),
      imageCell('two-scoops', 'שני כדורים', 'Two scoops', 'people', '🍨', '/aac-local/flavors/שני כדורים.png', 'flavors-cup'),
      imageCell('half-half', 'חצי חצי', 'Half half', 'people', '☯️', '/aac-local/flavors/חצי חצי.png', 'flavors-cup'),
      imageCell('three-scoops', 'שלושה כדורים', 'Three scoops', 'people', '🍨', '/aac-local/flavors/3 כדורים.png', 'flavors-cup'),
    ],
    gridSize: { cols: 2, rows: 3 },
  },
  'ice-cream-size-cone': {
    id: 'ice-cream-size-cone',
    name: 'גודל',
    nameEn: 'Size',
    parentBoardId: 'ice-cream-type',
    cells: [
      imageCell('one-scoop', 'כדור אחד', 'One scoop', 'people', '🍦', '/aac-local/flavors/כדור אחד.png', 'flavors-cone'),
      imageCell('kids-portion', 'מנת ילדים', 'Kids portion', 'people', '🧒', '/aac-local/flavors/מנת ילדים.png', 'flavors-cone'),
      imageCell('two-scoops', 'שני כדורים', 'Two scoops', 'people', '🍨', '/aac-local/flavors/שני כדורים.png', 'flavors-cone'),
      imageCell('half-half', 'חצי חצי', 'Half half', 'people', '☯️', '/aac-local/flavors/חצי חצי.png', 'flavors-cone'),
      imageCell('three-scoops', 'שלושה כדורים', 'Three scoops', 'people', '🍨', '/aac-local/flavors/3 כדורים.png', 'flavors-cone'),
    ],
    gridSize: { cols: 2, rows: 3 },
  },
  'take-away': {
    id: 'take-away',
    name: 'לקחת הביתה',
    nameEn: 'Take Away',
    parentBoardId: 'order-menu',
    cells: [
      imageCell('box-small', 'קופסא קטנה', 'Small box', 'people', '📦', '/aac-local/flavors/קופסא קטנה.png', 'flavors-cup'),
      imageCell('box-large', 'קופסא גדולה', 'Large box', 'people', '📦', '/aac-local/flavors/קופסא גדולה.png', 'flavors-cup'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
  'sorbet-type': {
    id: 'sorbet-type',
    name: 'כוס או גביע?',
    nameEn: 'Cup or Cone?',
    parentBoardId: 'main',
    cells: [
      imageCell('cup', 'כוס', 'Cup', 'people', '🥣', '/aac-local/כוס.png', 'sorbet-flavors'),
      imageCell('cone', 'גביע', 'Cone', 'people', '🍦', '/aac-local/גביע.png', 'sorbet-flavors'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
  'yogurt-type': {
    id: 'yogurt-type',
    name: 'בחר גודל',
    nameEn: 'Choose Size',
    parentBoardId: 'main',
    cells: [
      cell('small', 'קטן', 'Small', 'descriptors', '🔹', 'yogurt-toppings'),
      cell('medium', 'בינוני', 'Medium', 'descriptors', '🔶', 'yogurt-toppings'),
      cell('large', 'גדול', 'Large', 'descriptors', '⬛', 'yogurt-toppings'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'cold-drinks': {
    id: 'cold-drinks',
    name: 'שתייה קרה',
    nameEn: 'Cold Drinks',
    parentBoardId: 'order-menu',
    cells: [
      imageCell('cola', 'קולה', 'Cola', 'people', '🥤', '/aac-local/flavors/קולה.png'),
      imageCell('soda', 'סודה', 'Soda', 'people', '🥤', '/aac-local/flavors/סודה.png'),
      imageCell('water', 'בקבוק מים', 'Bottle of water', 'people', '💧', '/aac-local/flavors/בקבוק מים.png'),
      imageCell('iced-coffee', 'קפה קר', 'Iced Coffee', 'people', '🧊', '/aac-local/flavors/קפה קר.png'),
      imageCell('milkshake', 'מילקשייק', 'Milkshake', 'people', '🥤', '/aac-local/flavors/מילקשייק.png', 'flavors-cup'),
      imageCell('milkshake-small', 'קטן', 'Small', 'descriptors', '🔹', '/aac-local/flavors/קטן.png'),
      imageCell('milkshake-large', 'גדול', 'Large', 'descriptors', '⬛', '/aac-local/flavors/גדול.png'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'hot-drinks': {
    id: 'hot-drinks',
    name: 'שתייה חמה',
    nameEn: 'Hot Drinks',
    parentBoardId: 'order-menu',
    cells: [
      cell('coffee', 'קפה', 'Coffee', 'people', '☕', 'coffee-size'),
      imageCell('espresso', 'אספרסו', 'Espresso', 'people', '☕', '/aac-local/flavors/אספרסו.png'),
      imageCell('cappuccino', 'קפוצ׳ינו', 'Cappuccino', 'people', '☕', '/aac-local/flavors/קפוצ׳ינו.png'),
      imageCell('tea', 'תה', 'Tea', 'people', '🍵', '/aac-local/flavors/תה.png'),
      imageCell('chocolata', 'שוקולטה', 'Hot Chocolate', 'people', '🍫', '/aac-local/flavors/שוקולטה.png'),
      imageCell('affogato', 'אפוגטו', 'Affogato', 'people', '🍨', '/aac-local/flavors/אפוגטו.png'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'alcoholic-flavors': {
    id: 'alcoholic-flavors',
    name: 'טעמים אלכוהוליים',
    nameEn: 'Alcoholic Flavors',
    parentBoardId: 'order-menu',
    cells: [
      imageCell('coffee-baileys', 'קפה בייליס', 'Coffee Baileys', 'people', '☕', '/aac-local/flavors/קפה בייליס.png'),
      imageCell('aperol-orange', 'אפרול תפוז', 'Aperol Orange', 'people', '🍊', '/aac-local/flavors/אפרול תפוז.png'),
      imageCell('bergamot-ouzo', 'ברגמונט אוזו', 'Bergamot Ouzo', 'people', '🍸', '/aac-local/flavors/ברגמונט אוזו.png'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'flavors-cup': {
    id: 'flavors-cup',
    name: 'בחר טעם',
    nameEn: 'Choose Flavor',
    parentBoardId: 'ice-cream-size-cup',
    cells: [
      imageCell('mango', 'מנגו', 'Mango', 'people', '🥭', '/aac-local/flavors/מנגו.png'),
      imageCell('strawberry', 'תות', 'Strawberry', 'people', '🍓', '/aac-local/flavors/תות.png'),
      imageCell('chocolate', 'שוקולד', 'Chocolate', 'people', '🍫', '/aac-local/flavors/שוקולד.png'),
      imageCell('nutella', 'נוצ׳לה', 'Nutella', 'people', '🍫', '/aac-local/flavors/נוצ׳לה.png'),
      imageCell('halva', 'חלווה', 'Halva', 'people', '🍯', '/aac-local/flavors/חלווה.png'),
      imageCell('pistachio', 'פיסטוק', 'Pistachio', 'people', '🥜', '/aac-local/flavors/פיסטוק.png'),
      imageCell('belgian-chocolate', 'שוקולד בלגי', 'Belgian Chocolate', 'people', '🍫', '/aac-local/flavors/שווקולד בלגי.png'),
      imageCell('black-vanilla', 'וניל שחור', 'Black Vanilla', 'people', '🍨', '/aac-local/flavors/וניל שחור.png'),
      imageCell('pine-nut', 'פינולי צנובר', 'Pine Nut', 'people', '🌰', '/aac-local/flavors/פינולי צנובר.png'),
      imageCell('italian-coffee', 'קפה איטלקי', 'Italian Coffee', 'people', '☕', '/aac-local/flavors/קפה איטלקי.png'),
      imageCell('dark-chocolate', 'שוקולד מריר', 'Dark Chocolate', 'people', '🍫', '/aac-local/flavors/שוקולד מריר.png'),
      imageCell('lime-basil', 'ליים בזיליקום', 'Lime Basil', 'people', '🍋', '/aac-local/flavors/ליים בזיליקום.png'),
      imageCell('amsterdam-cookies', 'אמסטרדם קוקיז', 'Amsterdam Cookies', 'people', '🍪', '/aac-local/flavors/אמסטרדם קוקיז.png'),
      imageCell('peanut-butter-raspberry', 'חמאת בוטנים ופטל', 'Peanut Butter & Raspberry', 'people', '🫐', '/aac-local/flavors/חמאת בוטנים ופטל.png'),
      imageCell('salted-caramel-affogato', 'קרמל מלוח עם שברי אפרופו', 'Salted Caramel with Affogato', 'people', '🍯', '/aac-local/flavors/קרמל מלוח עם שברי אפרופו.png'),
      imageCell('mascarpone-berries-crumble', 'מסקרפונה פירות יער וקרמבל', 'Mascarpone Berry Crumble', 'people', '🍰', '/aac-local/flavors/מסקרפונה פירות יער וקרמבל.png'),
      imageCell('bubblegum', 'מסטיק', 'Bubblegum', 'people', '🍬', '/aac-local/flavors/מסטיק.png'),
      imageCell('hazelnut', 'אגוזי לוז', 'Hazelnut', 'people', '🌰', '/aac-local/flavors/אגוזי לוז.png'),
      imageCell('flavor-special', 'מה הספיישל?', 'What\'s the special?', 'social', '⭐', '/aac-local/flavors/טעמים.png'),
      cell('more-flavor', 'עוד טעם', 'Another flavor', 'verbs', '➕'),
      imageCell('ready-to-order', 'תוספות', 'Toppings', 'social', '🌈', '/aac-local/toppings.svg', 'toppings'),
    ],
    gridSize: { cols: 2, rows: 10 },
  },
  'flavors-cone': {
    id: 'flavors-cone',
    name: 'בחר טעם',
    nameEn: 'Choose Flavor',
    parentBoardId: 'ice-cream-size-cone',
    cells: [
      imageCell('mango', 'מנגו', 'Mango', 'people', '🥭', '/aac-local/flavors/מנגו.png'),
      imageCell('strawberry', 'תות', 'Strawberry', 'people', '🍓', '/aac-local/flavors/תות.png'),
      imageCell('chocolate', 'שוקולד', 'Chocolate', 'people', '🍫', '/aac-local/flavors/שוקולד.png'),
      imageCell('nutella', 'נוצ׳לה', 'Nutella', 'people', '🍫', '/aac-local/flavors/נוצ׳לה.png'),
      imageCell('halva', 'חלווה', 'Halva', 'people', '🍯', '/aac-local/flavors/חלווה.png'),
      imageCell('pistachio', 'פיסטוק', 'Pistachio', 'people', '🥜', '/aac-local/flavors/פיסטוק.png'),
      imageCell('belgian-chocolate', 'שוקולד בלגי', 'Belgian Chocolate', 'people', '🍫', '/aac-local/flavors/שווקולד בלגי.png'),
      imageCell('black-vanilla', 'וניל שחור', 'Black Vanilla', 'people', '🍨', '/aac-local/flavors/וניל שחור.png'),
      imageCell('pine-nut', 'פינולי צנובר', 'Pine Nut', 'people', '🌰', '/aac-local/flavors/פינולי צנובר.png'),
      imageCell('italian-coffee', 'קפה איטלקי', 'Italian Coffee', 'people', '☕', '/aac-local/flavors/קפה איטלקי.png'),
      imageCell('dark-chocolate', 'שוקולד מריר', 'Dark Chocolate', 'people', '🍫', '/aac-local/flavors/שוקולד מריר.png'),
      imageCell('lime-basil', 'ליים בזיליקום', 'Lime Basil', 'people', '🍋', '/aac-local/flavors/ליים בזיליקום.png'),
      imageCell('amsterdam-cookies', 'אמסטרדם קוקיז', 'Amsterdam Cookies', 'people', '🍪', '/aac-local/flavors/אמסטרדם קוקיז.png'),
      imageCell('peanut-butter-raspberry', 'חמאת בוטנים ופטל', 'Peanut Butter & Raspberry', 'people', '🫐', '/aac-local/flavors/חמאת בוטנים ופטל.png'),
      imageCell('salted-caramel-affogato', 'קרמל מלוח עם שברי אפרופו', 'Salted Caramel with Affogato', 'people', '🍯', '/aac-local/flavors/קרמל מלוח עם שברי אפרופו.png'),
      imageCell('mascarpone-berries-crumble', 'מסקרפונה פירות יער וקרמבל', 'Mascarpone Berry Crumble', 'people', '🍰', '/aac-local/flavors/מסקרפונה פירות יער וקרמבל.png'),
      imageCell('bubblegum', 'מסטיק', 'Bubblegum', 'people', '🍬', '/aac-local/flavors/מסטיק.png'),
      imageCell('hazelnut', 'אגוזי לוז', 'Hazelnut', 'people', '🌰', '/aac-local/flavors/אגוזי לוז.png'),
      imageCell('flavor-special', 'מה הספיישל?', 'What\'s the special?', 'social', '⭐', '/aac-local/flavors/טעמים.png'),
      cell('more-flavor', 'עוד טעם', 'Another flavor', 'verbs', '➕'),
      imageCell('ready-to-order', 'תוספות', 'Toppings', 'social', '🌈', '/aac-local/toppings.svg', 'toppings'),
    ],
    gridSize: { cols: 2, rows: 10 },
  },
  'sorbet-flavors': {
    id: 'sorbet-flavors',
    name: 'בחר טעם סורבה',
    nameEn: 'Choose Sorbet Flavor',
    parentBoardId: 'sorbet-type',
    cells: [
      cell('lemon', 'לימון', 'Lemon', 'people', '🍋', 'toppings'),
      cell('mango', 'מנגו', 'Mango', 'people', '🥭', 'toppings'),
      cell('raspberry', 'פטל', 'Raspberry', 'people', '🫐', 'toppings'),
      cell('passion', 'פסיפלורה', 'Passion Fruit', 'people', '🍊', 'toppings'),
      cell('watermelon', 'אבטיח', 'Watermelon', 'people', '🍉', 'toppings'),
      cell('coconut', 'קוקוס', 'Coconut', 'people', '🥥', 'toppings'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'toppings': {
    id: 'toppings',
    name: 'להוסיף תוספות?',
    nameEn: 'Add Toppings?',
    parentBoardId: 'flavors-cup',
    cells: [
      imageCell('sprinkles', 'סוכריות צבעוניות', 'Sprinkles', 'people', '🌈', '/aac-local/סוכריות צבעוניות.png'),
      imageCell('hot-chocolate', 'שוקולד חם', 'Hot Chocolate', 'people', '🍫', '/aac-local/flavors/שוקולד חם.png'),
      imageCell('nuts', 'אגוזים', 'Nuts', 'people', '🥜', '/aac-local/nuts.svg'),
      imageCell('whipped-cream', 'קצפת', 'Whipped Cream', 'people', '🥛', '/aac-local/flavors/קצפת.png'),
      imageCell('caramel', 'קרמל', 'Caramel', 'people', '🍯', '/aac-local/caramel.svg'),
      imageCell('pinoli', 'פינולי', 'Pine nuts', 'people', '🌰', '/aac-local/פינולי (צנובר).PNG'),
      imageCell('roasted-pine-nuts', 'צנובר קלוי', 'Roasted pine nuts', 'people', '🌰', '/aac-local/flavors/צנובר קלוי.png'),
      imageCell('no-toppings', 'בלי תוספות', 'No Toppings', 'descriptors', '✖️', '/aac-local/לא.PNG'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'yogurt-toppings': {
    id: 'yogurt-toppings',
    name: 'בחר תוספות',
    nameEn: 'Choose Toppings',
    parentBoardId: 'yogurt-type',
    cells: [
      cell('granola', 'גרנולה', 'Granola', 'people', '🥣'),
      cell('fresh-fruit', 'פירות טריים', 'Fresh Fruit', 'people', '🍓'),
      cell('honey', 'דבש', 'Honey', 'people', '🍯'),
      cell('chocolate-chips', 'שבבי שוקולד', 'Chocolate Chips', 'people', '🍫'),
      cell('nuts', 'אגוזים', 'Nuts', 'people', '🥜'),
      cell('no-toppings', 'בלי תוספות', 'No Toppings', 'descriptors', '✖️'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'desserts': {
    id: 'desserts',
    name: 'קינוחים',
    nameEn: 'Desserts',
    parentBoardId: 'order-menu',
    cells: [
      imageCell('pancake-balls', 'פנקייק כדורים', 'Pancake Balls', 'people', '🥞', '/aac-local/flavors/פנקייק כדורים.png', 'dessert-spreads'),
      imageCell('crepe', 'קרפ', 'Crepe', 'people', '🥞', '/aac-local/flavors/קרפ.png', 'dessert-spreads'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
  'dessert-spreads': {
    id: 'dessert-spreads',
    name: 'ממרח',
    nameEn: 'Spread',
    parentBoardId: 'desserts',
    cells: [
      imageCell('spread-nutella', 'נוטלה', 'Nutella', 'people', '🍫', '/aac-local/flavors/נוצ׳לה.png'),
      imageCell('spread-kinder', 'שוקולד לבן אגוזי לוז (קינדר)', 'White chocolate hazelnut (Kinder)', 'people', '🍫', '/aac-local/flavors/שוקולד לבן אגוזי לוז קינדר.png'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
  'help': {
    id: 'help',
    name: 'עזרה',
    nameEn: 'Help',
    parentBoardId: 'main',
    cells: [
      cell('help-staff', 'סליחה, אתה יכול לעזור לי?', 'Excuse me, can you help me?', 'social', '🙋'),
      cell('help-menu', 'איפה התפריט?', 'Where is the menu?', 'social', '📋'),
      cell('help-restroom', 'איפה השירותים?', 'Where is the restroom?', 'social', '🚻'),
      cell('help-allergy', 'יש לי אלרגיה', 'I have an allergy', 'social', '⚠️', 'allergy-info'),
      imageCell('napkin', 'מפית', 'Napkin', 'social', '🧻', '/aac-local/מפית.PNG'),
      imageCell('spoon', 'כפית', 'Spoon', 'social', '🥄', '/aac-local/כפית.PNG'),
      imageCell('water-cup', 'כוס מים', 'Cup of water', 'social', '🥤', '/aac-local/flavors/כוס מים.png'),
    ],
    gridSize: { cols: 2, rows: 4 },
  },
  'allergy-info': {
    id: 'allergy-info',
    name: 'יש לי אלרגיה ל...',
    nameEn: 'I have an allergy to...',
    parentBoardId: 'help',
    cells: [
      imageCell('allergy-dairy', 'חלב / לקטוז', 'Dairy / Lactose', 'social', '', '/aac-local/allergies/חלב.png'),
      imageCell('allergy-gluten', 'גלוטן / חיטה', 'Gluten / Wheat', 'social', '', '/aac-local/allergies/גלוטן.png'),
      imageCell('allergy-nuts', 'אגוזים', 'Nuts', 'social', '', '/aac-local/allergies/אגוזים.png'),
      imageCell('allergy-peanuts', 'בוטנים', 'Peanuts', 'social', '', '/aac-local/allergies/בוטנים.png'),
      imageCell('allergy-eggs', 'ביצים', 'Eggs', 'social', '', '/aac-local/allergies/ביצים.png'),
      imageCell('allergy-sesame', 'שומשום', 'Sesame', 'social', '', '/aac-local/allergies/שומשום.png'),
      cell('allergy-more', 'עוד אלרגיות', 'More allergies', 'verbs', '➕', 'allergy-more'),
    ],
    gridSize: { cols: 2, rows: 4 },
  },
  'allergy-more': {
    id: 'allergy-more',
    name: 'יש לי אלרגיה ל...',
    nameEn: 'I have an allergy to...',
    parentBoardId: 'allergy-info',
    cells: [
      cell('allergy-fish', 'דגים', 'Fish', 'social', '🐟'),
      cell('allergy-soy', 'סויה', 'Soy', 'social', '🌱'),
      cell('allergy-shellfish', 'רכיכות / פירות ים', 'Shellfish / Seafood', 'social', '🦐'),
      cell('allergy-other', 'אחר', 'Other', 'social', '❓'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'payment-bill': {
    id: 'payment-bill',
    name: 'תשלום',
    nameEn: 'Payment',
    parentBoardId: 'main',
    cells: [
      cell('payment-ask-bill', 'אפשר חשבון?', 'Can I have the bill?', 'social', '🧾'),
      cell('payment-receipt-please', 'קבלה בבקשה', 'Receipt, please', 'social', '🧾'),
      cell('payment-cash', 'תשלום במזומן', 'Cash payment', 'social', '💵'),
      cell('payment-credit', 'תשלום באשראי', 'Credit card payment', 'social', '💳'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'coffee-size': {
    id: 'coffee-size',
    name: 'גודל',
    nameEn: 'Size',
    parentBoardId: 'hot-drinks',
    cells: [
      cell('coffee-size-small', 'קטן', 'Small', 'descriptors', '🔹', 'coffee-type'),
      cell('coffee-size-medium', 'בינוני', 'Medium', 'descriptors', '🔶', 'coffee-type'),
      cell('coffee-size-large', 'גדול', 'Large', 'descriptors', '⬛', 'coffee-type'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'coffee-type': {
    id: 'coffee-type',
    name: 'סוג קפה',
    nameEn: 'Coffee Type',
    parentBoardId: 'coffee-size',
    cells: [
      cell('coffee-type-regular', 'רגיל', 'Regular', 'people', '☕', 'coffee-milk'),
      cell('coffee-type-americano', 'אמריקנו', 'Americano', 'people', '☕', 'coffee-milk'),
      cell('coffee-type-water-based', 'על בסיס מים', 'Water-based', 'people', '💧', 'coffee-milk'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'coffee-milk': {
    id: 'coffee-milk',
    name: 'סוג חלב',
    nameEn: 'Milk Type',
    parentBoardId: 'coffee-type',
    cells: [
      cell('coffee-milk-regular', 'חלב רגיל', 'Regular milk', 'people', '🥛'),
      cell('coffee-milk-plant', 'חלב צמחי', 'Plant-based milk', 'people', '🌱'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
};

// =============================================================================
// CAFE BOARDS
// =============================================================================
const cafeBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'בית קפה',
    nameEn: 'Cafe',
    cells: [
      cell('root-want-order', 'אני רוצה להזמין', 'I want to order', 'verbs', '📝', 'order-menu'),
      cell('root-help', 'עזרה', 'Help', 'social', '🙋', 'help'),
      cell('root-want-taste', 'אני רוצה לטעום', 'I want to taste', 'verbs', '👅', 'taste-menu'),
      cell('root-want-pay', 'אני רוצה לשלם', 'I want to pay', 'social', '💳', 'pay-menu'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'order-menu': {
    id: 'order-menu',
    name: 'להזמין',
    nameEn: 'Order',
    parentBoardId: 'main',
    cells: [
      cell('hot-drinks', 'משקאות חמים', 'Hot Drinks', 'people', '☕', 'hot-drinks'),
      cell('cold-drinks', 'משקאות קרים', 'Cold Drinks', 'people', '🥤', 'cold-drinks'),
      cell('pastries', 'מאפים', 'Pastries', 'people', '🥐', 'pastries'),
      cell('food', 'אוכל', 'Food', 'people', '🍽️', 'food'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'help': {
    id: 'help',
    name: 'עזרה',
    nameEn: 'Help',
    parentBoardId: 'main',
    cells: [
      cell('help-staff', 'סליחה, אתה יכול לעזור לי?', 'Excuse me, can you help me?', 'social', '🙋'),
      cell('help-menu', 'איפה התפריט?', 'Where is the menu?', 'social', '📋'),
      cell('help-restroom', 'איפה השירותים?', 'Where is the restroom?', 'social', '🚻'),
      cell('help-allergy', 'יש לי אלרגיה', 'I have an allergy', 'social', '⚠️'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'taste-menu': {
    id: 'taste-menu',
    name: 'לטעום',
    nameEn: 'Taste',
    parentBoardId: 'main',
    cells: [
      cell('taste-sample', 'אפשר לטעום?', 'Can I taste?', 'social', '👅'),
      cell('taste-small-piece', 'אפשר חתיכה קטנה?', 'Can I have a small piece?', 'social', '🍽️'),
      cell('taste-before-buy', 'אפשר לטעום לפני שאני קונה?', 'Can I taste before I buy?', 'social', '🤔'),
      cell('taste-which', 'מה אפשר לטעום?', 'What can I taste?', 'social', '❓'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'pay-menu': {
    id: 'pay-menu',
    name: 'לשלם',
    nameEn: 'Pay',
    parentBoardId: 'main',
    cells: [
      cell('pay-card', 'אני משלם באשראי', 'I pay by credit card', 'social', '💳'),
      cell('pay-cash', 'אני משלם במזומן', 'I pay cash', 'social', '💵'),
      cell('pay-app', 'אני משלם באפליקציה', 'I pay by phone app', 'social', '📱'),
      cell('pay-bill', 'אפשר את החשבון?', 'Can I have the bill?', 'social', '🧾'),
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'hot-drinks': {
    id: 'hot-drinks',
    name: 'משקאות חמים',
    nameEn: 'Hot Drinks',
    parentBoardId: 'main',
    cells: [
      cell('coffee', 'קפה', 'Coffee', 'people', '☕'),
      cell('espresso', 'אספרסו', 'Espresso', 'people', '☕'),
      cell('cappuccino', 'קפוצ׳ינו', 'Cappuccino', 'people', '☕'),
      cell('latte', 'לאטה', 'Latte', 'people', '☕'),
      cell('tea', 'תה', 'Tea', 'people', '🍵'),
      cell('hot-chocolate', 'שוקו חם', 'Hot Chocolate', 'people', '🍫'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'cold-drinks': {
    id: 'cold-drinks',
    name: 'משקאות קרים',
    nameEn: 'Cold Drinks',
    parentBoardId: 'main',
    cells: [
      cell('iced-coffee', 'קפה קר', 'Iced Coffee', 'people', '🧊'),
      cell('juice', 'מיץ', 'Juice', 'people', '🧃'),
      cell('lemonade', 'לימונדה', 'Lemonade', 'people', '🍋'),
      cell('smoothie', 'שייק', 'Smoothie', 'people', '🥤'),
      cell('water', 'מים', 'Water', 'people', '💧'),
      cell('soda', 'סודה', 'Soda', 'people', '🥤'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'pastries': {
    id: 'pastries',
    name: 'מאפים',
    nameEn: 'Pastries',
    parentBoardId: 'main',
    cells: [
      cell('croissant', 'קרואסון', 'Croissant', 'people', '🥐'),
      cell('cake', 'עוגה', 'Cake', 'people', '🍰'),
      cell('cookie', 'עוגייה', 'Cookie', 'people', '🍪'),
      cell('muffin', 'מאפין', 'Muffin', 'people', '🧁'),
      cell('danish', 'שמרית', 'Danish', 'people', '🥮'),
      cell('donut', 'סופגנייה', 'Donut', 'people', '🍩'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'food': {
    id: 'food',
    name: 'אוכל',
    nameEn: 'Food',
    parentBoardId: 'main',
    cells: [
      cell('sandwich', 'כריך', 'Sandwich', 'people', '🥪'),
      cell('salad', 'סלט', 'Salad', 'people', '🥗'),
      cell('toast', 'טוסט', 'Toast', 'people', '🍞'),
      cell('eggs', 'ביצים', 'Eggs', 'people', '🍳'),
      cell('soup', 'מרק', 'Soup', 'people', '🍜'),
      cell('quiche', 'קיש', 'Quiche', 'people', '🥧'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// RESTAURANT BOARDS
// =============================================================================
const restaurantBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'מסעדה',
    nameEn: 'Restaurant',
    cells: [
      cell('starters', 'מנות פתיחה', 'Starters', 'people', '🥗', 'starters'),
      cell('mains', 'מנות עיקריות', 'Main Courses', 'people', '🍽️', 'mains'),
      cell('desserts', 'קינוחים', 'Desserts', 'people', '🍰', 'desserts'),
      cell('drinks', 'משקאות', 'Drinks', 'people', '🥤', 'drinks'),
      cell('order', 'להזמין', 'Order', 'verbs', '📝'),
      cell('waiter', 'מלצר', 'Waiter', 'people', '🧑‍🍳'),
      cell('delicious', 'טעים', 'Delicious', 'descriptors', '😋'),
      cell('bill', 'חשבון', 'Bill', 'verbs', '💳'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'starters': {
    id: 'starters',
    name: 'מנות פתיחה',
    nameEn: 'Starters',
    parentBoardId: 'main',
    cells: [
      cell('salad', 'סלט', 'Salad', 'people', '🥗'),
      cell('soup', 'מרק', 'Soup', 'people', '🍜'),
      cell('bread', 'לחם', 'Bread', 'people', '🍞'),
      cell('hummus', 'חומוס', 'Hummus', 'people', '🥙'),
      cell('appetizer', 'מנה ראשונה', 'Appetizer', 'people', '🍴'),
      cell('sharing', 'לשיתוף', 'For Sharing', 'descriptors', '👥'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'mains': {
    id: 'mains',
    name: 'מנות עיקריות',
    nameEn: 'Main Courses',
    parentBoardId: 'main',
    cells: [
      cell('steak', 'סטייק', 'Steak', 'people', '🥩'),
      cell('chicken', 'עוף', 'Chicken', 'people', '🍗'),
      cell('fish', 'דג', 'Fish', 'people', '🐟'),
      cell('pasta', 'פסטה', 'Pasta', 'people', '🍝'),
      cell('burger', 'המבורגר', 'Burger', 'people', '🍔'),
      cell('pizza', 'פיצה', 'Pizza', 'people', '🍕'),
      cell('vegetarian', 'צמחוני', 'Vegetarian', 'descriptors', '🥬'),
      cell('vegan', 'טבעוני', 'Vegan', 'descriptors', '🌱'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'desserts': {
    id: 'desserts',
    name: 'קינוחים',
    nameEn: 'Desserts',
    parentBoardId: 'main',
    cells: [
      cell('cake', 'עוגה', 'Cake', 'people', '🍰'),
      cell('ice-cream', 'גלידה', 'Ice Cream', 'people', '🍨'),
      cell('fruit', 'פירות', 'Fruit', 'people', '🍓'),
      cell('chocolate', 'שוקולד', 'Chocolate', 'people', '🍫'),
      cell('coffee', 'קפה', 'Coffee', 'people', '☕'),
      cell('tea', 'תה', 'Tea', 'people', '🍵'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'drinks': {
    id: 'drinks',
    name: 'משקאות',
    nameEn: 'Drinks',
    parentBoardId: 'main',
    cells: [
      cell('water', 'מים', 'Water', 'people', '💧'),
      cell('wine', 'יין', 'Wine', 'people', '🍷'),
      cell('beer', 'בירה', 'Beer', 'people', '🍺'),
      cell('juice', 'מיץ', 'Juice', 'people', '🧃'),
      cell('soda', 'סודה', 'Soda', 'people', '🥤'),
      cell('coffee', 'קפה', 'Coffee', 'people', '☕'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// BAKERY BOARDS
// =============================================================================
const bakeryBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'מאפייה',
    nameEn: 'Bakery',
    cells: [
      cell('breads', 'לחמים', 'Breads', 'people', '🍞', 'breads'),
      cell('sweet', 'מאפים מתוקים', 'Sweet Pastries', 'people', '🥐', 'sweet'),
      cell('savory', 'מאפים מלוחים', 'Savory Pastries', 'people', '🥧', 'savory'),
      cell('cakes', 'עוגות', 'Cakes', 'people', '🎂', 'cakes'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      cell('fresh', 'טרי', 'Fresh', 'descriptors', '✨'),
      cell('warm', 'חם', 'Warm', 'descriptors', '🔥'),
      cell('slice', 'פרוסה', 'Slice', 'verbs', '🔪'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'breads': {
    id: 'breads',
    name: 'לחמים',
    nameEn: 'Breads',
    parentBoardId: 'main',
    cells: [
      cell('white-bread', 'לחם לבן', 'White Bread', 'people', '🍞'),
      cell('whole-wheat', 'לחם מלא', 'Whole Wheat', 'people', '🍞'),
      cell('rye', 'לחם שיפון', 'Rye Bread', 'people', '🍞'),
      cell('focaccia', 'פוקאצ׳ה', 'Focaccia', 'people', '🫓'),
      cell('baguette', 'באגט', 'Baguette', 'people', '🥖'),
      cell('challah', 'חלה', 'Challah', 'people', '🍞'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'sweet': {
    id: 'sweet',
    name: 'מאפים מתוקים',
    nameEn: 'Sweet Pastries',
    parentBoardId: 'main',
    cells: [
      cell('croissant', 'קרואסון', 'Croissant', 'people', '🥐'),
      cell('danish', 'שמרית', 'Danish', 'people', '🥮'),
      cell('rugelach', 'רוגלך', 'Rugelach', 'people', '🥐'),
      cell('cookie', 'עוגייה', 'Cookie', 'people', '🍪'),
      cell('donut', 'סופגנייה', 'Donut', 'people', '🍩'),
      cell('cinnamon-roll', 'רולדין', 'Cinnamon Roll', 'people', '🥮'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'savory': {
    id: 'savory',
    name: 'מאפים מלוחים',
    nameEn: 'Savory Pastries',
    parentBoardId: 'main',
    cells: [
      cell('burekas', 'בורקס', 'Burekas', 'people', '🥧'),
      cell('croissant-cheese', 'קרואסון גבינה', 'Cheese Croissant', 'people', '🥐'),
      cell('sambusak', 'סמבוסק', 'Sambusak', 'people', '🥟'),
      cell('pizza-slice', 'פיצה', 'Pizza', 'people', '🍕'),
      cell('quiche', 'קיש', 'Quiche', 'people', '🥧'),
      cell('pretzel', 'בייגלה', 'Pretzel', 'people', '🥨'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'cakes': {
    id: 'cakes',
    name: 'עוגות',
    nameEn: 'Cakes',
    parentBoardId: 'main',
    cells: [
      cell('chocolate-cake', 'עוגת שוקולד', 'Chocolate Cake', 'people', '🍫'),
      cell('cheesecake', 'עוגת גבינה', 'Cheesecake', 'people', '🧀'),
      cell('apple-pie', 'פאי תפוחים', 'Apple Pie', 'people', '🍎'),
      cell('carrot-cake', 'עוגת גזר', 'Carrot Cake', 'people', '🥕'),
      cell('birthday-cake', 'עוגת יום הולדת', 'Birthday Cake', 'people', '🎂'),
      cell('fruit-tart', 'טארט פירות', 'Fruit Tart', 'people', '🍓'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// PIZZA PLACE / PIZZERIA BOARDS
// =============================================================================
const pizzaBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'פיצריה',
    nameEn: 'Pizzeria',
    cells: [
      cell('pizza', 'פיצה', 'Pizza', 'people', '🍕', 'pizza-size'),
      cell('salad', 'סלט', 'Salad', 'people', '🥗', 'salads'),
      cell('drinks', 'משקאות', 'Drinks', 'people', '🥤', 'drinks'),
      cell('desserts', 'קינוחים', 'Desserts', 'people', '🍰', 'desserts'),
      cell('hot', 'חם', 'Hot', 'descriptors', '🔥'),
      cell('spicy', 'חריף', 'Spicy', 'descriptors', '🌶️'),
      cell('vegetarian', 'צמחוני', 'Vegetarian', 'descriptors', '🥬'),
      cell('vegan', 'טבעוני', 'Vegan', 'descriptors', '🌱'),
      cell('takeaway', 'לקחת', 'Takeaway', 'verbs', '📦'),
      cell('eat-here', 'לאכול פה', 'Eat Here', 'verbs', '🍽️'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 3 },
  },
  'pizza-size': {
    id: 'pizza-size',
    name: 'בחר גודל פיצה',
    nameEn: 'Choose Pizza Size',
    parentBoardId: 'main',
    cells: [
      cell('personal', 'אישית', 'Personal', 'descriptors', '🔹', 'pizza-toppings'),
      cell('medium', 'משפחתית', 'Family', 'descriptors', '🔶', 'pizza-toppings'),
      cell('large', 'גדולה', 'Large', 'descriptors', '⬛', 'pizza-toppings'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'pizza-toppings': {
    id: 'pizza-toppings',
    name: 'בחר תוספות',
    nameEn: 'Choose Toppings',
    parentBoardId: 'pizza-size',
    cells: [
      cell('cheese', 'גבינה', 'Cheese', 'people', '🧀', 'pizza-crust'),
      cell('pepperoni', 'פפרוני', 'Pepperoni', 'people', '🍖', 'pizza-crust'),
      cell('olives', 'זיתים', 'Olives', 'people', '🫒', 'pizza-crust'),
      cell('mushrooms', 'פטריות', 'Mushrooms', 'people', '🍄', 'pizza-crust'),
      cell('vegetables', 'ירקות', 'Vegetables', 'people', '🥬', 'pizza-crust'),
      cell('onions', 'בצל', 'Onions', 'people', '🧅', 'pizza-crust'),
      cell('corn', 'תירס', 'Corn', 'people', '🌽', 'pizza-crust'),
      cell('tuna', 'טונה', 'Tuna', 'people', '🐟', 'pizza-crust'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'pizza-crust': {
    id: 'pizza-crust',
    name: 'סוג בצק',
    nameEn: 'Crust Type',
    parentBoardId: 'pizza-toppings',
    cells: [
      cell('thin', 'דק', 'Thin', 'descriptors', '📄'),
      cell('thick', 'עבה', 'Thick', 'descriptors', '📚'),
      cell('stuffed', 'ממולא', 'Stuffed', 'descriptors', '🧀'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'salads': {
    id: 'salads',
    name: 'סלטים',
    nameEn: 'Salads',
    parentBoardId: 'main',
    cells: [
      cell('caesar', 'סיזר', 'Caesar', 'people', '🥗'),
      cell('greek', 'יווני', 'Greek', 'people', '🥗'),
      cell('garden', 'גן', 'Garden', 'people', '🥬'),
      cell('tuna-salad', 'סלט טונה', 'Tuna Salad', 'people', '🐟'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
  'drinks': {
    id: 'drinks',
    name: 'משקאות',
    nameEn: 'Drinks',
    parentBoardId: 'main',
    cells: [
      cell('cola', 'קולה', 'Cola', 'people', '🥤'),
      cell('water', 'מים', 'Water', 'people', '💧'),
      cell('juice', 'מיץ', 'Juice', 'people', '🧃'),
      cell('beer', 'בירה', 'Beer', 'people', '🍺'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
  'desserts': {
    id: 'desserts',
    name: 'קינוחים',
    nameEn: 'Desserts',
    parentBoardId: 'main',
    cells: [
      cell('ice-cream', 'גלידה', 'Ice Cream', 'people', '🍨'),
      cell('tiramisu', 'טירמיסו', 'Tiramisu', 'people', '🍰'),
      cell('chocolate-cake', 'עוגת שוקולד', 'Chocolate Cake', 'people', '🍫'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
};

// =============================================================================
// LAUNDROMAT / DRY CLEANING BOARDS
// =============================================================================
const laundromatBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'מכבסה',
    nameEn: 'Laundromat',
    cells: [
      cell('wash', 'לכבס', 'Wash', 'verbs', '🧺', 'wash-temp'),
      cell('dry', 'לייבש', 'Dry', 'verbs', '💨', 'dry-options'),
      cell('fold', 'לקפל', 'Fold', 'verbs', '👕'),
      cell('dry-clean', 'ניקוי יבש', 'Dry Cleaning', 'people', '🧥', 'dry-clean-items'),
      cell('special', 'פריטים מיוחדים', 'Special Items', 'people', '👗', 'special-items'),
      cell('dirty', 'מלוכלך', 'Dirty', 'descriptors', '💩'),
      cell('clean', 'נקי', 'Clean', 'descriptors', '✨'),
      cell('stain', 'כתם', 'Stain', 'descriptors', '🫗'),
      cell('lost', 'אבד', 'Lost', 'descriptors', '❓'),
      cell('damaged', 'נזק', 'Damaged', 'descriptors', '⚠️'),
      cell('change', 'עודף', 'Change', 'verbs', '💰'),
      cell('help', 'עזרה', 'Help', 'social', '🙋'),
    ],
    gridSize: { cols: 4, rows: 3 },
  },
  'wash-temp': {
    id: 'wash-temp',
    name: 'טמפרטורת כביסה',
    nameEn: 'Wash Temperature',
    parentBoardId: 'main',
    cells: [
      cell('cold', 'קר', 'Cold', 'descriptors', '❄️', 'wash-detergent'),
      cell('warm', 'חמים', 'Warm', 'descriptors', '🌡️', 'wash-detergent'),
      cell('hot', 'חם', 'Hot', 'descriptors', '🔥', 'wash-detergent'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'wash-detergent': {
    id: 'wash-detergent',
    name: 'סבון כביסה',
    nameEn: 'Detergent',
    parentBoardId: 'wash-temp',
    cells: [
      cell('yes', 'כן, צריך', 'Yes, need', 'social', '✅', 'wash-cycle'),
      cell('no', 'לא צריך', 'No, don\'t need', 'social', '❌', 'wash-cycle'),
      cell('own', 'הבאתי משלי', 'Brought my own', 'descriptors', '🧴', 'wash-cycle'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'wash-cycle': {
    id: 'wash-cycle',
    name: 'סוג מחזור',
    nameEn: 'Cycle Type',
    parentBoardId: 'wash-detergent',
    cells: [
      cell('regular', 'רגיל', 'Regular', 'descriptors', '🔄'),
      cell('delicate', 'עדין', 'Delicate', 'descriptors', '🌸'),
      cell('heavy', 'חזק', 'Heavy Duty', 'descriptors', '💪'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'dry-options': {
    id: 'dry-options',
    name: 'אפשרויות ייבוש',
    nameEn: 'Dry Options',
    parentBoardId: 'main',
    cells: [
      cell('low-heat', 'חום נמוך', 'Low Heat', 'descriptors', '🌡️'),
      cell('medium-heat', 'חום בינוני', 'Medium Heat', 'descriptors', '🔥'),
      cell('high-heat', 'חום גבוה', 'High Heat', 'descriptors', '♨️'),
      cell('no-heat', 'בלי חום', 'No Heat', 'descriptors', '❄️'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
  'dry-clean-items': {
    id: 'dry-clean-items',
    name: 'פריטים לניקוי יבש',
    nameEn: 'Dry Clean Items',
    parentBoardId: 'main',
    cells: [
      cell('suit', 'חליפה', 'Suit', 'people', '🤵'),
      cell('dress', 'שמלה', 'Dress', 'people', '👗'),
      cell('coat', 'מעיל', 'Coat', 'people', '🧥'),
      cell('blanket', 'שמיכה', 'Blanket', 'people', '🛏️'),
      cell('curtains', 'וילונות', 'Curtains', 'people', '🪟'),
    ],
    gridSize: { cols: 5, rows: 1 },
  },
  'special-items': {
    id: 'special-items',
    name: 'פריטים מיוחדים',
    nameEn: 'Special Items',
    parentBoardId: 'main',
    cells: [
      cell('leather', 'עור', 'Leather', 'people', '👞'),
      cell('silk', 'משי', 'Silk', 'people', '🎀'),
      cell('wool', 'צמר', 'Wool', 'people', '🧶'),
      cell('wedding-dress', 'שמלת כלה', 'Wedding Dress', 'people', '👰'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
};

// =============================================================================
// PARTY SUPPLIES STORE BOARDS
// =============================================================================
const partySuppliesBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'חנות מסיבות',
    nameEn: 'Party Supplies',
    cells: [
      cell('plates', 'צלחות', 'Plates', 'people', '🍽️', 'plates-options'),
      cell('cups', 'כוסות', 'Cups', 'people', '🥤', 'cups-options'),
      cell('napkins', 'מפיות', 'Napkins', 'people', '🧻'),
      cell('balloons', 'בלונים', 'Balloons', 'people', '🎈', 'balloons-color'),
      cell('decorations', 'קישוטים', 'Decorations', 'people', '🎉', 'decorations'),
      cell('candles', 'נרות', 'Candles', 'people', '🕯️'),
      cell('themes', 'ערכות נושא', 'Party Themes', 'people', '🎭', 'themes'),
      cell('birthday', 'יום הולדת', 'Birthday', 'descriptors', '🎂'),
      cell('party', 'מסיבה', 'Party', 'descriptors', '🎉'),
      cell('event', 'אירוע', 'Event', 'descriptors', '📅'),
      cell('kids', 'ילדים', 'Kids', 'descriptors', '👧'),
      cell('adults', 'מבוגרים', 'Adults', 'descriptors', '👨'),
      cell('many', 'הרבה', 'Many', 'descriptors', '📦'),
      cell('few', 'קצת', 'Few', 'descriptors', '📎'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 4 },
  },
  'balloons-color': {
    id: 'balloons-color',
    name: 'צבע בלונים',
    nameEn: 'Balloon Color',
    parentBoardId: 'main',
    cells: [
      cell('red', 'אדום', 'Red', 'descriptors', '🔴', 'balloons-shape'),
      cell('blue', 'כחול', 'Blue', 'descriptors', '🔵', 'balloons-shape'),
      cell('yellow', 'צהוב', 'Yellow', 'descriptors', '🟡', 'balloons-shape'),
      cell('green', 'ירוק', 'Green', 'descriptors', '🟢', 'balloons-shape'),
      cell('pink', 'ורוד', 'Pink', 'descriptors', '💗', 'balloons-shape'),
      cell('gold', 'זהב', 'Gold', 'descriptors', '🟨', 'balloons-shape'),
      cell('silver', 'כסף', 'Silver', 'descriptors', '⚪', 'balloons-shape'),
      cell('mixed', 'מעורב', 'Mixed', 'descriptors', '🌈', 'balloons-shape'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'balloons-shape': {
    id: 'balloons-shape',
    name: 'צורת בלונים',
    nameEn: 'Balloon Shape',
    parentBoardId: 'balloons-color',
    cells: [
      cell('round', 'עגול', 'Round', 'descriptors', '🎈', 'balloons-helium'),
      cell('number', 'מספר', 'Number', 'descriptors', '🔢', 'balloons-helium'),
      cell('letter', 'אות', 'Letter', 'descriptors', '🔤', 'balloons-helium'),
      cell('animal', 'חיה', 'Animal', 'descriptors', '🐕', 'balloons-helium'),
      cell('heart', 'לב', 'Heart', 'descriptors', '❤️', 'balloons-helium'),
      cell('star', 'כוכב', 'Star', 'descriptors', '⭐', 'balloons-helium'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'balloons-helium': {
    id: 'balloons-helium',
    name: 'הליום?',
    nameEn: 'Helium?',
    parentBoardId: 'balloons-shape',
    cells: [
      cell('yes-helium', 'כן, עם הליום', 'Yes, with Helium', 'social', '✅'),
      cell('no-helium', 'לא, בלי הליום', 'No, without Helium', 'social', '❌'),
    ],
    gridSize: { cols: 2, rows: 1 },
  },
  'plates-options': {
    id: 'plates-options',
    name: 'סוגי צלחות',
    nameEn: 'Plate Types',
    parentBoardId: 'main',
    cells: [
      cell('small-plates', 'צלחות קטנות', 'Small Plates', 'people', '🔹'),
      cell('large-plates', 'צלחות גדולות', 'Large Plates', 'people', '🔶'),
      cell('bowls', 'קערות', 'Bowls', 'people', '🥣'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'cups-options': {
    id: 'cups-options',
    name: 'סוגי כוסות',
    nameEn: 'Cup Types',
    parentBoardId: 'main',
    cells: [
      cell('small-cups', 'כוסות קטנות', 'Small Cups', 'people', '🥛'),
      cell('large-cups', 'כוסות גדולות', 'Large Cups', 'people', '🥤'),
      cell('wine-glasses', 'כוסות יין', 'Wine Glasses', 'people', '🍷'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'decorations': {
    id: 'decorations',
    name: 'קישוטים',
    nameEn: 'Decorations',
    parentBoardId: 'main',
    cells: [
      cell('banner', 'באנר', 'Banner', 'people', '🎏'),
      cell('streamers', 'סרטים', 'Streamers', 'people', '🎊'),
      cell('confetti', 'קונפטי', 'Confetti', 'people', '🎊'),
      cell('garland', 'שרשרת', 'Garland', 'people', '📿'),
      cell('centerpiece', 'מרכז שולחן', 'Centerpiece', 'people', '🏵️'),
    ],
    gridSize: { cols: 5, rows: 1 },
  },
  'themes': {
    id: 'themes',
    name: 'ערכות נושא',
    nameEn: 'Party Themes',
    parentBoardId: 'main',
    cells: [
      cell('princess', 'נסיכה', 'Princess', 'people', '👸'),
      cell('superhero', 'גיבור-על', 'Superhero', 'people', '🦸'),
      cell('unicorn', 'חד קרן', 'Unicorn', 'people', '🦄'),
      cell('dinosaur', 'דינוזאור', 'Dinosaur', 'people', '🦕'),
      cell('sports', 'ספורט', 'Sports', 'people', '⚽'),
      cell('jungle', "ג'ונגל", 'Jungle', 'people', '🌴'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// TOY STORE BOARDS
// =============================================================================
const toyStoreBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'חנות צעצועים',
    nameEn: 'Toy Store',
    cells: [
      cell('action-figures', 'דמויות פעולה', 'Action Figures', 'people', '🦸', 'action-figures'),
      cell('dolls', 'בובות', 'Dolls', 'people', '🎎', 'dolls'),
      cell('building', 'לגו ובנייה', 'Building Blocks', 'people', '🧱', 'building'),
      cell('board-games', 'משחקי קופסה', 'Board Games', 'people', '🎲', 'board-games'),
      cell('puzzles', 'פאזלים', 'Puzzles', 'people', '🧩'),
      cell('outdoor', 'משחקי חוץ', 'Outdoor Toys', 'people', '🏀', 'outdoor'),
      cell('baby-toys', 'צעצועי תינוקות', 'Baby Toys', 'people', '🍼', 'baby-toys'),
      cell('new', 'חדש', 'New', 'descriptors', '✨'),
      cell('play', 'לשחק', 'Play', 'verbs', '🎮'),
      cell('gift', 'מתנה', 'Gift', 'descriptors', '🎁'),
      cell('boy', 'בן', 'Boy', 'descriptors', '👦'),
      cell('girl', 'בת', 'Girl', 'descriptors', '👧'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      cell('show', 'להראות', 'Show me', 'verbs', '👀'),
      cell('how-much', 'כמה עולה?', 'How much?', 'social', '💰'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 4 },
  },
  'action-figures': {
    id: 'action-figures',
    name: 'דמויות פעולה',
    nameEn: 'Action Figures',
    parentBoardId: 'main',
    cells: [
      cell('hero', 'גיבור', 'Hero', 'people', '🦸'),
      cell('villain', 'נבל', 'Villain', 'people', '🦹'),
      cell('animal', 'חיה', 'Animal', 'people', '🦁'),
      cell('vehicle', 'רכב', 'Vehicle', 'people', '🚗'),
      cell('robot', 'רובוט', 'Robot', 'people', '🤖'),
      cell('dinosaur', 'דינוזאור', 'Dinosaur', 'people', '🦖'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'dolls': {
    id: 'dolls',
    name: 'בובות',
    nameEn: 'Dolls',
    parentBoardId: 'main',
    cells: [
      cell('baby-doll', 'בובת תינוק', 'Baby Doll', 'people', '👶'),
      cell('fashion-doll', 'בובת אופנה', 'Fashion Doll', 'people', '💃'),
      cell('princess', 'נסיכה', 'Princess', 'people', '👸'),
      cell('doll-house', 'בית בובות', 'Doll House', 'people', '🏠'),
      cell('accessories', 'אביזרים', 'Accessories', 'people', '👜'),
    ],
    gridSize: { cols: 5, rows: 1 },
  },
  'building': {
    id: 'building',
    name: 'לגו ובנייה',
    nameEn: 'Building Blocks',
    parentBoardId: 'main',
    cells: [
      cell('lego', 'לגו', 'Lego', 'people', '🧱'),
      cell('duplo', 'דופלו', 'Duplo', 'people', '🟥'),
      cell('magnetic', 'מגנטים', 'Magnetic', 'people', '🧲'),
      cell('wood-blocks', 'קוביות עץ', 'Wood Blocks', 'people', '🪵'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
  'board-games': {
    id: 'board-games',
    name: 'משחקי קופסה',
    nameEn: 'Board Games',
    parentBoardId: 'main',
    cells: [
      cell('family-game', 'משחק משפחתי', 'Family Game', 'people', '👨‍👩‍👧'),
      cell('strategy', 'אסטרטגיה', 'Strategy', 'people', '♟️'),
      cell('cards', 'קלפים', 'Cards', 'people', '🃏'),
      cell('trivia', 'טריוויה', 'Trivia', 'people', '❓'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
  'outdoor': {
    id: 'outdoor',
    name: 'משחקי חוץ',
    nameEn: 'Outdoor Toys',
    parentBoardId: 'main',
    cells: [
      cell('ball', 'כדור', 'Ball', 'people', '⚽'),
      cell('bike', 'אופניים', 'Bike', 'people', '🚲'),
      cell('scooter', 'קורקינט', 'Scooter', 'people', '🛴'),
      cell('water-toys', 'צעצועי מים', 'Water Toys', 'people', '💦'),
      cell('sandbox', 'ארגז חול', 'Sandbox', 'people', '🏖️'),
    ],
    gridSize: { cols: 5, rows: 1 },
  },
  'baby-toys': {
    id: 'baby-toys',
    name: 'צעצועי תינוקות',
    nameEn: 'Baby Toys',
    parentBoardId: 'main',
    cells: [
      cell('rattle', 'רעשן', 'Rattle', 'people', '🔔'),
      cell('teether', 'נשכן', 'Teether', 'people', '🦷'),
      cell('mobile', 'מובייל', 'Mobile', 'people', '🌙'),
      cell('soft-toy', 'בובה רכה', 'Soft Toy', 'people', '🧸'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
};

// =============================================================================
// HAIR SALON / BARBERSHOP BOARDS
// =============================================================================
const hairSalonBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'מספרה',
    nameEn: 'Hair Salon',
    cells: [
      cell('haircut', 'תספורת', 'Haircut', 'verbs', '✂️', 'haircut-type'),
      cell('color', 'צביעה', 'Color', 'verbs', '🎨', 'color-options'),
      cell('wash', 'חפיפה', 'Wash', 'verbs', '🚿'),
      cell('style', 'עיצוב', 'Style', 'verbs', '💇', 'style-options'),
      cell('beard', 'זקן', 'Beard Trim', 'people', '🧔', 'beard-options'),
      cell('pain', 'כואב', 'Pain', 'descriptors', '😣'),
      cell('hot', 'חם', 'Hot', 'descriptors', '🔥'),
      cell('cold', 'קר', 'Cold', 'descriptors', '❄️'),
      cell('dry', 'יבש', 'Dry', 'descriptors', '💨'),
      cell('wet', 'רטוב', 'Wet', 'descriptors', '💧'),
      cell('good', 'טוב', 'Good', 'descriptors', '👍'),
      cell('bad', 'רע', 'Bad', 'descriptors', '👎'),
      cell('what-is-this', 'מה זה?', 'What is this?', 'social', '❓'),
      cell('wait', 'לחכות', 'Wait', 'verbs', '⏳'),
      cell('help', 'עזרה', 'Help', 'social', '🙋'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 4 },
  },
  'haircut-type': {
    id: 'haircut-type',
    name: 'סוג תספורת',
    nameEn: 'Haircut Type',
    parentBoardId: 'main',
    cells: [
      cell('short', 'קצר', 'Short', 'descriptors', '📏'),
      cell('long', 'ארוך', 'Long', 'descriptors', '📐'),
      cell('trim-ends', 'לגזור קצוות', 'Trim Ends Only', 'verbs', '✂️'),
      cell('bangs', 'פוני', 'Bangs', 'people', '👧'),
      cell('layered', 'שכבות', 'Layered', 'descriptors', '📚'),
      cell('shaved', 'מגולח', 'Shaved', 'descriptors', '🪒'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'color-options': {
    id: 'color-options',
    name: 'אפשרויות צבע',
    nameEn: 'Color Options',
    parentBoardId: 'main',
    cells: [
      cell('blonde', 'בלונד', 'Blonde', 'descriptors', '🟡'),
      cell('brown', 'חום', 'Brown', 'descriptors', '🟤'),
      cell('black', 'שחור', 'Black', 'descriptors', '⚫'),
      cell('red', 'אדום', 'Red', 'descriptors', '🔴'),
      cell('highlights', 'גוונים', 'Highlights', 'descriptors', '✨'),
      cell('roots', 'שורשים', 'Roots', 'people', '🌱'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'style-options': {
    id: 'style-options',
    name: 'אפשרויות עיצוב',
    nameEn: 'Style Options',
    parentBoardId: 'main',
    cells: [
      cell('blow-dry', 'פן', 'Blow Dry', 'verbs', '💨'),
      cell('straighten', 'להחליק', 'Straighten', 'verbs', '➖'),
      cell('curl', 'תלתלים', 'Curl', 'verbs', '➰'),
      cell('updo', 'תסרוקת', 'Updo', 'verbs', '👰'),
      cell('braid', 'צמה', 'Braid', 'verbs', '🪢'),
    ],
    gridSize: { cols: 5, rows: 1 },
  },
  'beard-options': {
    id: 'beard-options',
    name: 'אפשרויות זקן',
    nameEn: 'Beard Options',
    parentBoardId: 'main',
    cells: [
      cell('trim', 'לגזום', 'Trim', 'verbs', '✂️'),
      cell('shape', 'לעצב', 'Shape', 'verbs', '📐'),
      cell('shave', 'לגלח', 'Shave', 'verbs', '🪒'),
      cell('mustache', 'שפם', 'Mustache', 'people', '👨'),
    ],
    gridSize: { cols: 4, rows: 1 },
  },
};

// =============================================================================
// SHOE STORE BOARDS
// =============================================================================
const shoeStoreBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'חנות נעליים',
    nameEn: 'Shoe Store',
    cells: [
      cell('men', 'גברים', 'Men\'s Shoes', 'people', '👞', 'shoes-size'),
      cell('women', 'נשים', 'Women\'s Shoes', 'people', '👠', 'shoes-size'),
      cell('kids', 'ילדים', 'Kids\' Shoes', 'people', '👟', 'shoes-size'),
      cell('sports', 'ספורט', 'Sports Shoes', 'people', '🏃', 'shoes-size'),
      cell('boots', 'מגפיים', 'Boots', 'people', '🥾', 'shoes-size'),
      cell('sandals', 'סנדלים', 'Sandals', 'people', '🩴', 'shoes-size'),
      cell('try-on', 'למדוד', 'Try on', 'verbs', '👣'),
      cell('fits', 'מתאים', 'Fits', 'descriptors', '✅'),
      cell('too-small', 'קטן מדי', 'Too small', 'descriptors', '📉'),
      cell('too-big', 'גדול מדי', 'Too big', 'descriptors', '📈'),
      cell('comfortable', 'נוח', 'Comfortable', 'descriptors', '😊'),
      cell('walk', 'ללכת', 'Walk', 'verbs', '🚶'),
      cell('run', 'לרוץ', 'Run', 'verbs', '🏃'),
      cell('different', 'אחר', 'Different', 'descriptors', '🔄'),
      cell('how-much', 'כמה עולה?', 'How much?', 'social', '💰'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 4 },
  },
  'shoes-size': {
    id: 'shoes-size',
    name: 'מידה',
    nameEn: 'Size',
    parentBoardId: 'main',
    cells: [
      cell('size-36', '36', '36', 'descriptors', '3️⃣', 'shoes-color'),
      cell('size-37', '37', '37', 'descriptors', '3️⃣', 'shoes-color'),
      cell('size-38', '38', '38', 'descriptors', '3️⃣', 'shoes-color'),
      cell('size-39', '39', '39', 'descriptors', '3️⃣', 'shoes-color'),
      cell('size-40', '40', '40', 'descriptors', '4️⃣', 'shoes-color'),
      cell('size-41', '41', '41', 'descriptors', '4️⃣', 'shoes-color'),
      cell('size-42', '42', '42', 'descriptors', '4️⃣', 'shoes-color'),
      cell('size-43', '43', '43', 'descriptors', '4️⃣', 'shoes-color'),
      cell('size-44', '44', '44', 'descriptors', '4️⃣', 'shoes-color'),
      cell('size-45', '45', '45', 'descriptors', '4️⃣', 'shoes-color'),
    ],
    gridSize: { cols: 5, rows: 2 },
  },
  'shoes-color': {
    id: 'shoes-color',
    name: 'צבע',
    nameEn: 'Color',
    parentBoardId: 'shoes-size',
    cells: [
      cell('black', 'שחור', 'Black', 'descriptors', '⚫', 'shoes-material'),
      cell('white', 'לבן', 'White', 'descriptors', '⚪', 'shoes-material'),
      cell('brown', 'חום', 'Brown', 'descriptors', '🟤', 'shoes-material'),
      cell('blue', 'כחול', 'Blue', 'descriptors', '🔵', 'shoes-material'),
      cell('red', 'אדום', 'Red', 'descriptors', '🔴', 'shoes-material'),
      cell('pink', 'ורוד', 'Pink', 'descriptors', '💗', 'shoes-material'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'shoes-material': {
    id: 'shoes-material',
    name: 'חומר',
    nameEn: 'Material',
    parentBoardId: 'shoes-color',
    cells: [
      cell('leather', 'עור', 'Leather', 'descriptors', '🐄'),
      cell('fabric', 'בד', 'Fabric', 'descriptors', '🧵'),
      cell('synthetic', 'סינתטי', 'Synthetic', 'descriptors', '♻️'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
};

// =============================================================================
// CLOTHING STORE BOARDS
// =============================================================================
const clothingStoreBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'חנות בגדים',
    nameEn: 'Clothing Store',
    cells: [
      cell('shirts', 'חולצות', 'Shirts', 'people', '👕', 'clothing-size'),
      cell('pants', 'מכנסיים', 'Pants', 'people', '👖', 'clothing-size'),
      cell('dresses', 'שמלות', 'Dresses', 'people', '👗', 'clothing-size'),
      cell('skirts', 'חצאיות', 'Skirts', 'people', '🩱', 'clothing-size'),
      cell('jackets', 'מעילים', 'Jackets', 'people', '🧥', 'clothing-size'),
      cell('accessories', 'אביזרים', 'Accessories', 'people', '👜', 'accessories'),
      cell('fitting-room', 'חדר מדידות', 'Fitting Room', 'verbs', '🚪'),
      cell('different-size', 'מידה אחרת', 'Different size', 'verbs', '📏'),
      cell('different-color', 'צבע אחר', 'Different color', 'verbs', '🎨'),
      cell('how-much', 'כמה עולה?', 'How much?', 'social', '💰'),
      cell('like', 'אוהב', 'Like', 'descriptors', '❤️'),
      cell('dont-like', 'לא אוהב', 'Don\'t like', 'descriptors', '💔'),
      cell('casual', 'יומיומי', 'Casual', 'descriptors', '👕'),
      cell('formal', 'רשמי', 'Formal', 'descriptors', '👔'),
      cell('sporty', 'ספורטיבי', 'Sporty', 'descriptors', '🏃'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 4, rows: 4 },
  },
  'clothing-size': {
    id: 'clothing-size',
    name: 'מידה',
    nameEn: 'Size',
    parentBoardId: 'main',
    cells: [
      cell('xs', 'XS', 'XS', 'descriptors', '🔹', 'clothing-color'),
      cell('s', 'S', 'S', 'descriptors', '🔹', 'clothing-color'),
      cell('m', 'M', 'M', 'descriptors', '🔶', 'clothing-color'),
      cell('l', 'L', 'L', 'descriptors', '🔶', 'clothing-color'),
      cell('xl', 'XL', 'XL', 'descriptors', '⬛', 'clothing-color'),
      cell('xxl', 'XXL', 'XXL', 'descriptors', '⬛', 'clothing-color'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'clothing-color': {
    id: 'clothing-color',
    name: 'צבע',
    nameEn: 'Color',
    parentBoardId: 'clothing-size',
    cells: [
      cell('black', 'שחור', 'Black', 'descriptors', '⚫', 'clothing-style'),
      cell('white', 'לבן', 'White', 'descriptors', '⚪', 'clothing-style'),
      cell('blue', 'כחול', 'Blue', 'descriptors', '🔵', 'clothing-style'),
      cell('red', 'אדום', 'Red', 'descriptors', '🔴', 'clothing-style'),
      cell('green', 'ירוק', 'Green', 'descriptors', '🟢', 'clothing-style'),
      cell('gray', 'אפור', 'Gray', 'descriptors', '🩶', 'clothing-style'),
      cell('pink', 'ורוד', 'Pink', 'descriptors', '💗', 'clothing-style'),
      cell('brown', 'חום', 'Brown', 'descriptors', '🟤', 'clothing-style'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'clothing-style': {
    id: 'clothing-style',
    name: 'סגנון',
    nameEn: 'Style',
    parentBoardId: 'clothing-color',
    cells: [
      cell('casual', 'יומיומי', 'Casual', 'descriptors', '👕'),
      cell('formal', 'רשמי', 'Formal', 'descriptors', '👔'),
      cell('sporty', 'ספורטיבי', 'Sporty', 'descriptors', '🏃'),
    ],
    gridSize: { cols: 3, rows: 1 },
  },
  'accessories': {
    id: 'accessories',
    name: 'אביזרים',
    nameEn: 'Accessories',
    parentBoardId: 'main',
    cells: [
      cell('bag', 'תיק', 'Bag', 'people', '👜'),
      cell('belt', 'חגורה', 'Belt', 'people', '🪢'),
      cell('hat', 'כובע', 'Hat', 'people', '🎩'),
      cell('scarf', 'צעיף', 'Scarf', 'people', '🧣'),
      cell('watch', 'שעון', 'Watch', 'people', '⌚'),
      cell('sunglasses', 'משקפי שמש', 'Sunglasses', 'people', '🕶️'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// EXPORT ALL BOARDS BY BUSINESS TYPE
// =============================================================================
export const businessBoardsData: Record<BusinessType, Record<string, AACBoard>> = {
  pharmacy: pharmacyBoards,
  supermarket: supermarketBoards,
  iceCream: iceCreamBoards,
  cafe: cafeBoards,
  restaurant: restaurantBoards,
  bakery: bakeryBoards,
  pizza: pizzaBoards,
  laundromat: laundromatBoards,
  partySupplies: partySuppliesBoards,
  toyStore: toyStoreBoards,
  hairSalon: hairSalonBoards,
  shoeStore: shoeStoreBoards,
  clothingStore: clothingStoreBoards,
};

// Helper function to get boards for a specific business type
export function getBoardsForBusinessType(businessType: BusinessType): Record<string, AACBoard> {
  return businessBoardsData[businessType] || cafeBoards;
}

// Helper to generate base supermarket categories for the creation wizard
export function getSupermarketBaseCategories() {
  const boards = supermarketBoards;
  const mainBoard = boards['main'];
  if (!mainBoard) return [];

  // Convert each main-level folder into a MenuCategory with its items
  return mainBoard.cells
    .filter(c => c.linkToBoardId)
    .map(folderCell => {
      const subBoard = boards[folderCell.linkToBoardId!];
      if (!subBoard) return null;

      // Collect items from this sub-board (non-folder cells only)
      const items = subBoard.cells
        .filter(c => !c.linkToBoardId)
        .map(c => ({
          id: c.id,
          text: c.text,
          textEn: c.textEn,
          icon: c.icon || '📦',
          category: c.category,
        }));

      return {
        id: folderCell.id,
        name: folderCell.text,
        nameEn: folderCell.textEn,
        icon: folderCell.icon || '📁',
        items,
        isOpen: false,
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      name: string;
      nameEn: string;
      icon: string;
      items: Array<{ id: string; text: string; textEn: string; icon: string; category: import('@/types/aac').FitzgeraldCategory }>;
      isOpen: boolean;
    }>;
}

// Preview cards for each business type (for CreateBoard preview)
interface PreviewCard {
  text: string;
  textEn: string;
  category: FitzgeraldCategory;
  icon: string;
}

export const businessPreviewCards: Record<BusinessType, PreviewCard[]> = {
  pharmacy: [
    { text: 'תרופות מרשם', textEn: 'Prescription', category: 'people', icon: '📋' },
    { text: 'תרופות ללא מרשם', textEn: 'OTC', category: 'people', icon: '💊' },
    { text: 'עזרה ראשונה', textEn: 'First Aid', category: 'people', icon: '🩹' },
    { text: 'צריך', textEn: 'Need', category: 'verbs', icon: '👆' },
    { text: 'כואב', textEn: 'Hurts', category: 'descriptors', icon: '😣' },
    { text: 'עזרה', textEn: 'Help', category: 'social', icon: '🙋' },
  ],
  supermarket: [
    { text: 'עזרה ממוכר', textEn: 'Staff Help', category: 'social', icon: '🙋‍♂️' },
    { text: 'קופה ותשלום', textEn: 'Checkout', category: 'social', icon: '💳' },
    { text: 'מעדנייה', textEn: 'Deli', category: 'people', icon: '🧀' },
    { text: 'קצבייה ודגים', textEn: 'Butcher & Fish', category: 'people', icon: '🥩' },
    { text: 'מאפייה', textEn: 'Bakery', category: 'people', icon: '🥖' },
    { text: 'פירות וירקות', textEn: 'Produce', category: 'people', icon: '🍏' },
  ],
  iceCream: [
    { text: 'גלידה', textEn: 'Ice Cream', category: 'people', icon: '🍦' },
    { text: 'תוספות', textEn: 'Toppings', category: 'people', icon: '🍫' },
    { text: 'גדלים', textEn: 'Sizes', category: 'descriptors', icon: '📏' },
    { text: 'רוצה', textEn: 'Want', category: 'verbs', icon: '👆' },
    { text: 'כמה עולה?', textEn: 'How much?', category: 'social', icon: '💰' },
    { text: 'בבקשה', textEn: 'Please', category: 'social', icon: '🙏' },
  ],
  cafe: [
    { text: 'משקאות', textEn: 'Drinks', category: 'people', icon: '🥤' },
    { text: 'אוכל', textEn: 'Food', category: 'people', icon: '🍽️' },
    { text: 'קינוחים', textEn: 'Desserts', category: 'people', icon: '🍰' },
    { text: 'רוצה', textEn: 'Want', category: 'verbs', icon: '👆' },
    { text: 'חם', textEn: 'Hot', category: 'descriptors', icon: '🔥' },
    { text: 'שלום', textEn: 'Hello', category: 'social', icon: '👋' },
  ],
  restaurant: [
    { text: 'מנות פתיחה', textEn: 'Starters', category: 'people', icon: '🥗' },
    { text: 'מנות עיקריות', textEn: 'Mains', category: 'people', icon: '🍽️' },
    { text: 'קינוחים', textEn: 'Desserts', category: 'people', icon: '🍰' },
    { text: 'להזמין', textEn: 'Order', category: 'verbs', icon: '📝' },
    { text: 'מלצר', textEn: 'Waiter', category: 'people', icon: '🧑‍🍳' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  bakery: [
    { text: 'לחמים', textEn: 'Breads', category: 'people', icon: '🍞' },
    { text: 'מאפים מתוקים', textEn: 'Sweet', category: 'people', icon: '🥐' },
    { text: 'מאפים מלוחים', textEn: 'Savory', category: 'people', icon: '🥧' },
    { text: 'רוצה', textEn: 'Want', category: 'verbs', icon: '👆' },
    { text: 'טרי', textEn: 'Fresh', category: 'descriptors', icon: '✨' },
    { text: 'בבקשה', textEn: 'Please', category: 'social', icon: '🙏' },
  ],
  pizza: [
    { text: 'פיצה', textEn: 'Pizza', category: 'people', icon: '🍕' },
    { text: 'תוספות', textEn: 'Toppings', category: 'people', icon: '🧀' },
    { text: 'סלט', textEn: 'Salad', category: 'people', icon: '🥗' },
    { text: 'לקחת', textEn: 'Takeaway', category: 'verbs', icon: '📦' },
    { text: 'חריף', textEn: 'Spicy', category: 'descriptors', icon: '🌶️' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  laundromat: [
    { text: 'לכבס', textEn: 'Wash', category: 'verbs', icon: '🧺' },
    { text: 'לייבש', textEn: 'Dry', category: 'verbs', icon: '💨' },
    { text: 'ניקוי יבש', textEn: 'Dry Clean', category: 'people', icon: '🧥' },
    { text: 'כתם', textEn: 'Stain', category: 'descriptors', icon: '🫗' },
    { text: 'נקי', textEn: 'Clean', category: 'descriptors', icon: '✨' },
    { text: 'עזרה', textEn: 'Help', category: 'social', icon: '🙋' },
  ],
  partySupplies: [
    { text: 'בלונים', textEn: 'Balloons', category: 'people', icon: '🎈' },
    { text: 'קישוטים', textEn: 'Decorations', category: 'people', icon: '🎉' },
    { text: 'צלחות', textEn: 'Plates', category: 'people', icon: '🍽️' },
    { text: 'יום הולדת', textEn: 'Birthday', category: 'descriptors', icon: '🎂' },
    { text: 'הרבה', textEn: 'Many', category: 'descriptors', icon: '📦' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  toyStore: [
    { text: 'דמויות פעולה', textEn: 'Action Figures', category: 'people', icon: '🦸' },
    { text: 'בובות', textEn: 'Dolls', category: 'people', icon: '🎎' },
    { text: 'משחקי קופסה', textEn: 'Board Games', category: 'people', icon: '🎲' },
    { text: 'לשחק', textEn: 'Play', category: 'verbs', icon: '🎮' },
    { text: 'מתנה', textEn: 'Gift', category: 'descriptors', icon: '🎁' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  hairSalon: [
    { text: 'תספורת', textEn: 'Haircut', category: 'verbs', icon: '✂️' },
    { text: 'צביעה', textEn: 'Color', category: 'verbs', icon: '🎨' },
    { text: 'עיצוב', textEn: 'Style', category: 'verbs', icon: '💇' },
    { text: 'קצר', textEn: 'Short', category: 'descriptors', icon: '📏' },
    { text: 'טוב', textEn: 'Good', category: 'descriptors', icon: '👍' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  shoeStore: [
    { text: 'נעלי גברים', textEn: 'Men\'s Shoes', category: 'people', icon: '👞' },
    { text: 'נעלי נשים', textEn: 'Women\'s Shoes', category: 'people', icon: '👠' },
    { text: 'ספורט', textEn: 'Sports', category: 'people', icon: '🏃' },
    { text: 'למדוד', textEn: 'Try on', category: 'verbs', icon: '👣' },
    { text: 'נוח', textEn: 'Comfortable', category: 'descriptors', icon: '😊' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  clothingStore: [
    { text: 'חולצות', textEn: 'Shirts', category: 'people', icon: '👕' },
    { text: 'מכנסיים', textEn: 'Pants', category: 'people', icon: '👖' },
    { text: 'שמלות', textEn: 'Dresses', category: 'people', icon: '👗' },
    { text: 'חדר מדידות', textEn: 'Fitting Room', category: 'verbs', icon: '🚪' },
    { text: 'אוהב', textEn: 'Like', category: 'descriptors', icon: '❤️' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
};
