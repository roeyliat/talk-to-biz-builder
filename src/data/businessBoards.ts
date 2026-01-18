import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';

export type BusinessType = 'pharmacy' | 'supermarket' | 'iceCream' | 'cafe' | 'restaurant' | 'bakery';

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
// SUPERMARKET BOARDS
// =============================================================================
const supermarketBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'סופרמרקט',
    nameEn: 'Supermarket',
    cells: [
      cell('dairy', 'מוצרי חלב', 'Dairy', 'people', '🥛', 'dairy'),
      cell('vegetables', 'ירקות', 'Vegetables', 'people', '🥬', 'vegetables'),
      cell('fruits', 'פירות', 'Fruits', 'people', '🍎', 'fruits'),
      cell('snacks', 'חטיפים', 'Snacks', 'people', '🍿', 'snacks'),
      cell('meat', 'בשר ודגים', 'Meat & Fish', 'people', '🥩', 'meat'),
      cell('bread', 'לחם ומאפים', 'Bread & Pastries', 'people', '🍞', 'bread'),
      cell('drinks', 'משקאות', 'Drinks', 'people', '🥤', 'drinks'),
      cell('where', 'איפה', 'Where', 'verbs', '🔍'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'dairy': {
    id: 'dairy',
    name: 'מוצרי חלב',
    nameEn: 'Dairy Products',
    parentBoardId: 'main',
    cells: [
      cell('milk', 'חלב', 'Milk', 'people', '🥛'),
      cell('yogurt', 'יוגורט', 'Yogurt', 'people', '🥛'),
      cell('cheese', 'גבינה', 'Cheese', 'people', '🧀'),
      cell('butter', 'חמאה', 'Butter', 'people', '🧈'),
      cell('cream', 'שמנת', 'Cream', 'people', '🥛'),
      cell('eggs', 'ביצים', 'Eggs', 'people', '🥚'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'vegetables': {
    id: 'vegetables',
    name: 'ירקות',
    nameEn: 'Vegetables',
    parentBoardId: 'main',
    cells: [
      cell('tomato', 'עגבנייה', 'Tomato', 'people', '🍅'),
      cell('cucumber', 'מלפפון', 'Cucumber', 'people', '🥒'),
      cell('carrot', 'גזר', 'Carrot', 'people', '🥕'),
      cell('onion', 'בצל', 'Onion', 'people', '🧅'),
      cell('pepper', 'פלפל', 'Pepper', 'people', '🫑'),
      cell('potato', 'תפוח אדמה', 'Potato', 'people', '🥔'),
      cell('lettuce', 'חסה', 'Lettuce', 'people', '🥬'),
      cell('eggplant', 'חציל', 'Eggplant', 'people', '🍆'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'fruits': {
    id: 'fruits',
    name: 'פירות',
    nameEn: 'Fruits',
    parentBoardId: 'main',
    cells: [
      cell('apple', 'תפוח', 'Apple', 'people', '🍎'),
      cell('banana', 'בננה', 'Banana', 'people', '🍌'),
      cell('orange', 'תפוז', 'Orange', 'people', '🍊'),
      cell('grapes', 'ענבים', 'Grapes', 'people', '🍇'),
      cell('strawberry', 'תות', 'Strawberry', 'people', '🍓'),
      cell('watermelon', 'אבטיח', 'Watermelon', 'people', '🍉'),
      cell('lemon', 'לימון', 'Lemon', 'people', '🍋'),
      cell('peach', 'אפרסק', 'Peach', 'people', '🍑'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'snacks': {
    id: 'snacks',
    name: 'חטיפים',
    nameEn: 'Snacks',
    parentBoardId: 'main',
    cells: [
      cell('bamba', 'במבה', 'Bamba', 'people', '🥜'),
      cell('bissli', 'ביסלי', 'Bissli', 'people', '🍿'),
      cell('chips', "צ'יפס", 'Chips', 'people', '🍟'),
      cell('crackers', 'קרקרים', 'Crackers', 'people', '🍘'),
      cell('chocolate', 'שוקולד', 'Chocolate', 'people', '🍫'),
      cell('candy', 'סוכריות', 'Candy', 'people', '🍬'),
      cell('gum', 'מסטיק', 'Gum', 'people', '🫧'),
      cell('popcorn', 'פופקורן', 'Popcorn', 'people', '🍿'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'meat': {
    id: 'meat',
    name: 'בשר ודגים',
    nameEn: 'Meat & Fish',
    parentBoardId: 'main',
    cells: [
      cell('chicken', 'עוף', 'Chicken', 'people', '🍗'),
      cell('beef', 'בקר', 'Beef', 'people', '🥩'),
      cell('fish', 'דג', 'Fish', 'people', '🐟'),
      cell('ground-meat', 'בשר טחון', 'Ground Meat', 'people', '🍖'),
      cell('sausage', 'נקניקיות', 'Sausages', 'people', '🌭'),
      cell('turkey', 'הודו', 'Turkey', 'people', '🦃'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'bread': {
    id: 'bread',
    name: 'לחם ומאפים',
    nameEn: 'Bread & Pastries',
    parentBoardId: 'main',
    cells: [
      cell('white-bread', 'לחם לבן', 'White Bread', 'people', '🍞'),
      cell('pita', 'פיתה', 'Pita', 'people', '🫓'),
      cell('challah', 'חלה', 'Challah', 'people', '🍞'),
      cell('rolls', 'לחמניות', 'Rolls', 'people', '🥯'),
      cell('croissant', 'קרואסון', 'Croissant', 'people', '🥐'),
      cell('bagel', 'בייגל', 'Bagel', 'people', '🥯'),
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
      cell('juice', 'מיץ', 'Juice', 'people', '🧃'),
      cell('soda', 'סודה', 'Soda', 'people', '🥤'),
      cell('beer', 'בירה', 'Beer', 'people', '🍺'),
      cell('wine', 'יין', 'Wine', 'people', '🍷'),
      cell('coffee', 'קפה', 'Coffee', 'people', '☕'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
};

// =============================================================================
// ICE CREAM SHOP BOARDS
// =============================================================================
const iceCreamBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'גלידריה',
    nameEn: 'Ice Cream Shop',
    cells: [
      cell('flavors', 'טעמים', 'Flavors', 'people', '🍦', 'flavors'),
      cell('toppings', 'תוספות', 'Toppings', 'people', '🍫', 'toppings'),
      cell('sizes', 'גדלים', 'Sizes', 'people', '📏', 'sizes'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      cell('taste', 'לטעום', 'Taste', 'verbs', '👅'),
      cell('cold', 'קר', 'Cold', 'descriptors', '❄️'),
      cell('sweet', 'מתוק', 'Sweet', 'descriptors', '🍬'),
      cell('please', 'בבקשה', 'Please', 'social', '🙏'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'flavors': {
    id: 'flavors',
    name: 'טעמים',
    nameEn: 'Flavors',
    parentBoardId: 'main',
    cells: [
      cell('chocolate', 'שוקולד', 'Chocolate', 'people', '🍫'),
      cell('vanilla', 'וניל', 'Vanilla', 'people', '🍨'),
      cell('strawberry', 'תות', 'Strawberry', 'people', '🍓'),
      cell('pistachio', 'פיסטוק', 'Pistachio', 'people', '🥜'),
      cell('lemon', 'לימון', 'Lemon', 'people', '🍋'),
      cell('mango', 'מנגו', 'Mango', 'people', '🥭'),
      cell('cookies', 'עוגיות', 'Cookies', 'people', '🍪'),
      cell('coffee', 'קפה', 'Coffee', 'people', '☕'),
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'toppings': {
    id: 'toppings',
    name: 'תוספות',
    nameEn: 'Toppings',
    parentBoardId: 'main',
    cells: [
      cell('sprinkles', 'סוכריות', 'Sprinkles', 'people', '🍬'),
      cell('choco-chips', 'שבבי שוקולד', 'Chocolate Chips', 'people', '🍫'),
      cell('whipped-cream', 'קצפת', 'Whipped Cream', 'people', '🥛'),
      cell('sauce', 'רוטב', 'Sauce', 'people', '🍯'),
      cell('nuts', 'אגוזים', 'Nuts', 'people', '🥜'),
      cell('fruits', 'פירות', 'Fruits', 'people', '🍓'),
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'sizes': {
    id: 'sizes',
    name: 'גדלים',
    nameEn: 'Sizes',
    parentBoardId: 'main',
    cells: [
      cell('small', 'קטן', 'Small', 'descriptors', '🔹'),
      cell('medium', 'בינוני', 'Medium', 'descriptors', '🔶'),
      cell('large', 'גדול', 'Large', 'descriptors', '⬛'),
      cell('scoop', 'כדור', 'Scoop', 'people', '🍦'),
      cell('cup', 'גביע', 'Cup', 'people', '🥤'),
      cell('cone', 'גלידה על מקל', 'Cone', 'people', '🍦'),
    ],
    gridSize: { cols: 3, rows: 2 },
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
      cell('hot-drinks', 'משקאות חמים', 'Hot Drinks', 'people', '☕', 'hot-drinks'),
      cell('cold-drinks', 'משקאות קרים', 'Cold Drinks', 'people', '🥤', 'cold-drinks'),
      cell('pastries', 'מאפים', 'Pastries', 'people', '🥐', 'pastries'),
      cell('food', 'אוכל', 'Food', 'people', '🍽️', 'food'),
      cell('want', 'רוצה', 'Want', 'verbs', '👆'),
      cell('order', 'להזמין', 'Order', 'verbs', '📝'),
      cell('hot', 'חם', 'Hot', 'descriptors', '🔥'),
      cell('cold', 'קר', 'Cold', 'descriptors', '❄️'),
      cell('thanks', 'תודה', 'Thank you', 'social', '🙏'),
    ],
    gridSize: { cols: 3, rows: 3 },
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
// EXPORT ALL BOARDS BY BUSINESS TYPE
// =============================================================================
export const businessBoardsData: Record<BusinessType, Record<string, AACBoard>> = {
  pharmacy: pharmacyBoards,
  supermarket: supermarketBoards,
  iceCream: iceCreamBoards,
  cafe: cafeBoards,
  restaurant: restaurantBoards,
  bakery: bakeryBoards,
};

// Helper function to get boards for a specific business type
export function getBoardsForBusinessType(businessType: BusinessType): Record<string, AACBoard> {
  return businessBoardsData[businessType] || cafeBoards;
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
    { text: 'מוצרי חלב', textEn: 'Dairy', category: 'people', icon: '🥛' },
    { text: 'ירקות', textEn: 'Vegetables', category: 'people', icon: '🥬' },
    { text: 'פירות', textEn: 'Fruits', category: 'people', icon: '🍎' },
    { text: 'חטיפים', textEn: 'Snacks', category: 'people', icon: '🍿' },
    { text: 'איפה', textEn: 'Where', category: 'verbs', icon: '🔍' },
    { text: 'תודה', textEn: 'Thanks', category: 'social', icon: '🙏' },
  ],
  iceCream: [
    { text: 'טעמים', textEn: 'Flavors', category: 'people', icon: '🍦' },
    { text: 'תוספות', textEn: 'Toppings', category: 'people', icon: '🍫' },
    { text: 'גדלים', textEn: 'Sizes', category: 'people', icon: '📏' },
    { text: 'רוצה', textEn: 'Want', category: 'verbs', icon: '👆' },
    { text: 'מתוק', textEn: 'Sweet', category: 'descriptors', icon: '🍬' },
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
};
