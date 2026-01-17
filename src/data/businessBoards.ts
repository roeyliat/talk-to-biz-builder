import { AACBoard, FitzgeraldCategory } from '@/types/aac';

export type BusinessType = 'pharmacy' | 'supermarket' | 'iceCream' | 'cafe' | 'restaurant' | 'bakery';

// =============================================================================
// PHARMACY BOARDS
// =============================================================================
const pharmacyBoards: Record<string, AACBoard> = {
  'main': {
    id: 'main',
    name: 'בית מרקחת',
    nameEn: 'Pharmacy',
    cells: [
      { id: 'prescription', text: 'תרופות מרשם', textEn: 'Prescription Meds', category: 'people' as FitzgeraldCategory, icon: '📋', linkToBoardId: 'prescription' },
      { id: 'otc', text: 'תרופות ללא מרשם', textEn: 'Over-the-Counter', category: 'people' as FitzgeraldCategory, icon: '💊', linkToBoardId: 'otc' },
      { id: 'first-aid', text: 'עזרה ראשונה', textEn: 'First Aid', category: 'people' as FitzgeraldCategory, icon: '🩹', linkToBoardId: 'first-aid' },
      { id: 'cosmetics', text: 'קוסמטיקה', textEn: 'Cosmetics', category: 'people' as FitzgeraldCategory, icon: '🧴', linkToBoardId: 'cosmetics' },
      { id: 'need', text: 'צריך', textEn: 'Need', category: 'verbs' as FitzgeraldCategory, icon: '👆' },
      { id: 'where', text: 'איפה', textEn: 'Where', category: 'verbs' as FitzgeraldCategory, icon: '🔍' },
      { id: 'hurts', text: 'כואב', textEn: 'Hurts', category: 'descriptors' as FitzgeraldCategory, icon: '😣' },
      { id: 'help', text: 'עזרה', textEn: 'Help', category: 'social' as FitzgeraldCategory, icon: '🙋' },
      { id: 'thanks', text: 'תודה', textEn: 'Thank you', category: 'social' as FitzgeraldCategory, icon: '🙏' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'prescription': {
    id: 'prescription',
    name: 'תרופות מרשם',
    nameEn: 'Prescription Medications',
    parentBoardId: 'main',
    cells: [
      { id: 'antibiotics', text: 'אנטיביוטיקה', textEn: 'Antibiotics', category: 'people' as FitzgeraldCategory, icon: '💊' },
      { id: 'blood-pressure', text: 'לחץ דם', textEn: 'Blood Pressure', category: 'people' as FitzgeraldCategory, icon: '❤️' },
      { id: 'diabetes', text: 'סוכרת', textEn: 'Diabetes', category: 'people' as FitzgeraldCategory, icon: '🩺' },
      { id: 'heart', text: 'לב', textEn: 'Heart', category: 'people' as FitzgeraldCategory, icon: '❤️‍🔥' },
      { id: 'inhaler', text: 'משאף', textEn: 'Inhaler', category: 'people' as FitzgeraldCategory, icon: '💨' },
      { id: 'refill', text: 'מילוי חוזר', textEn: 'Refill', category: 'verbs' as FitzgeraldCategory, icon: '🔄' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'otc': {
    id: 'otc',
    name: 'תרופות ללא מרשם',
    nameEn: 'Over-the-Counter',
    parentBoardId: 'main',
    cells: [
      { id: 'headache', text: 'כאב ראש', textEn: 'Headache', category: 'people' as FitzgeraldCategory, icon: '🤕' },
      { id: 'cold', text: 'צינון', textEn: 'Cold', category: 'people' as FitzgeraldCategory, icon: '🤧' },
      { id: 'allergy', text: 'אלרגיה', textEn: 'Allergy', category: 'people' as FitzgeraldCategory, icon: '🤢' },
      { id: 'fever', text: 'חום', textEn: 'Fever', category: 'people' as FitzgeraldCategory, icon: '🌡️' },
      { id: 'stomach', text: 'בטן', textEn: 'Stomach', category: 'people' as FitzgeraldCategory, icon: '🤮' },
      { id: 'cough', text: 'שיעול', textEn: 'Cough', category: 'people' as FitzgeraldCategory, icon: '😷' },
      { id: 'vitamins', text: 'ויטמינים', textEn: 'Vitamins', category: 'people' as FitzgeraldCategory, icon: '💪' },
      { id: 'painkillers', text: 'משככי כאבים', textEn: 'Painkillers', category: 'people' as FitzgeraldCategory, icon: '💊' },
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'first-aid': {
    id: 'first-aid',
    name: 'עזרה ראשונה',
    nameEn: 'First Aid',
    parentBoardId: 'main',
    cells: [
      { id: 'bandages', text: 'פלסטרים', textEn: 'Bandages', category: 'people' as FitzgeraldCategory, icon: '🩹' },
      { id: 'gauze', text: 'תחבושות', textEn: 'Gauze', category: 'people' as FitzgeraldCategory, icon: '🩹' },
      { id: 'disinfectant', text: 'חיטוי', textEn: 'Disinfectant', category: 'people' as FitzgeraldCategory, icon: '🧴' },
      { id: 'ointment', text: 'משחה', textEn: 'Ointment', category: 'people' as FitzgeraldCategory, icon: '🧴' },
      { id: 'thermometer', text: 'מדחום', textEn: 'Thermometer', category: 'people' as FitzgeraldCategory, icon: '🌡️' },
      { id: 'ice-pack', text: 'קרח', textEn: 'Ice Pack', category: 'people' as FitzgeraldCategory, icon: '🧊' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'cosmetics': {
    id: 'cosmetics',
    name: 'קוסמטיקה',
    nameEn: 'Cosmetics',
    parentBoardId: 'main',
    cells: [
      { id: 'cream', text: 'קרם', textEn: 'Cream', category: 'people' as FitzgeraldCategory, icon: '🧴' },
      { id: 'shampoo', text: 'שמפו', textEn: 'Shampoo', category: 'people' as FitzgeraldCategory, icon: '🧴' },
      { id: 'soap', text: 'סבון', textEn: 'Soap', category: 'people' as FitzgeraldCategory, icon: '🧼' },
      { id: 'toothpaste', text: 'משחת שיניים', textEn: 'Toothpaste', category: 'people' as FitzgeraldCategory, icon: '🦷' },
      { id: 'deodorant', text: 'דאודורנט', textEn: 'Deodorant', category: 'people' as FitzgeraldCategory, icon: '🧴' },
      { id: 'sunscreen', text: 'קרם הגנה', textEn: 'Sunscreen', category: 'people' as FitzgeraldCategory, icon: '☀️' },
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
      { id: 'dairy', text: 'מוצרי חלב', textEn: 'Dairy', category: 'people' as FitzgeraldCategory, icon: '🥛', linkToBoardId: 'dairy' },
      { id: 'vegetables', text: 'ירקות', textEn: 'Vegetables', category: 'people' as FitzgeraldCategory, icon: '🥬', linkToBoardId: 'vegetables' },
      { id: 'fruits', text: 'פירות', textEn: 'Fruits', category: 'people' as FitzgeraldCategory, icon: '🍎', linkToBoardId: 'fruits' },
      { id: 'snacks', text: 'חטיפים', textEn: 'Snacks', category: 'people' as FitzgeraldCategory, icon: '🍿', linkToBoardId: 'snacks' },
      { id: 'meat', text: 'בשר ודגים', textEn: 'Meat & Fish', category: 'people' as FitzgeraldCategory, icon: '🥩', linkToBoardId: 'meat' },
      { id: 'bread', text: 'לחם ומאפים', textEn: 'Bread & Pastries', category: 'people' as FitzgeraldCategory, icon: '🍞', linkToBoardId: 'bread' },
      { id: 'drinks', text: 'משקאות', textEn: 'Drinks', category: 'people' as FitzgeraldCategory, icon: '🥤', linkToBoardId: 'drinks' },
      { id: 'where', text: 'איפה', textEn: 'Where', category: 'verbs' as FitzgeraldCategory, icon: '🔍' },
      { id: 'thanks', text: 'תודה', textEn: 'Thank you', category: 'social' as FitzgeraldCategory, icon: '🙏' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'dairy': {
    id: 'dairy',
    name: 'מוצרי חלב',
    nameEn: 'Dairy Products',
    parentBoardId: 'main',
    cells: [
      { id: 'milk', text: 'חלב', textEn: 'Milk', category: 'people' as FitzgeraldCategory, icon: '🥛' },
      { id: 'yogurt', text: 'יוגורט', textEn: 'Yogurt', category: 'people' as FitzgeraldCategory, icon: '🥛' },
      { id: 'cheese', text: 'גבינה', textEn: 'Cheese', category: 'people' as FitzgeraldCategory, icon: '🧀' },
      { id: 'butter', text: 'חמאה', textEn: 'Butter', category: 'people' as FitzgeraldCategory, icon: '🧈' },
      { id: 'cream', text: 'שמנת', textEn: 'Cream', category: 'people' as FitzgeraldCategory, icon: '🥛' },
      { id: 'eggs', text: 'ביצים', textEn: 'Eggs', category: 'people' as FitzgeraldCategory, icon: '🥚' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'vegetables': {
    id: 'vegetables',
    name: 'ירקות',
    nameEn: 'Vegetables',
    parentBoardId: 'main',
    cells: [
      { id: 'tomato', text: 'עגבנייה', textEn: 'Tomato', category: 'people' as FitzgeraldCategory, icon: '🍅' },
      { id: 'cucumber', text: 'מלפפון', textEn: 'Cucumber', category: 'people' as FitzgeraldCategory, icon: '🥒' },
      { id: 'carrot', text: 'גזר', textEn: 'Carrot', category: 'people' as FitzgeraldCategory, icon: '🥕' },
      { id: 'onion', text: 'בצל', textEn: 'Onion', category: 'people' as FitzgeraldCategory, icon: '🧅' },
      { id: 'pepper', text: 'פלפל', textEn: 'Pepper', category: 'people' as FitzgeraldCategory, icon: '🫑' },
      { id: 'potato', text: 'תפוח אדמה', textEn: 'Potato', category: 'people' as FitzgeraldCategory, icon: '🥔' },
      { id: 'lettuce', text: 'חסה', textEn: 'Lettuce', category: 'people' as FitzgeraldCategory, icon: '🥬' },
      { id: 'eggplant', text: 'חציל', textEn: 'Eggplant', category: 'people' as FitzgeraldCategory, icon: '🍆' },
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'fruits': {
    id: 'fruits',
    name: 'פירות',
    nameEn: 'Fruits',
    parentBoardId: 'main',
    cells: [
      { id: 'apple', text: 'תפוח', textEn: 'Apple', category: 'people' as FitzgeraldCategory, icon: '🍎' },
      { id: 'banana', text: 'בננה', textEn: 'Banana', category: 'people' as FitzgeraldCategory, icon: '🍌' },
      { id: 'orange', text: 'תפוז', textEn: 'Orange', category: 'people' as FitzgeraldCategory, icon: '🍊' },
      { id: 'grapes', text: 'ענבים', textEn: 'Grapes', category: 'people' as FitzgeraldCategory, icon: '🍇' },
      { id: 'strawberry', text: 'תות', textEn: 'Strawberry', category: 'people' as FitzgeraldCategory, icon: '🍓' },
      { id: 'watermelon', text: 'אבטיח', textEn: 'Watermelon', category: 'people' as FitzgeraldCategory, icon: '🍉' },
      { id: 'lemon', text: 'לימון', textEn: 'Lemon', category: 'people' as FitzgeraldCategory, icon: '🍋' },
      { id: 'peach', text: 'אפרסק', textEn: 'Peach', category: 'people' as FitzgeraldCategory, icon: '🍑' },
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'snacks': {
    id: 'snacks',
    name: 'חטיפים',
    nameEn: 'Snacks',
    parentBoardId: 'main',
    cells: [
      { id: 'bamba', text: 'במבה', textEn: 'Bamba', category: 'people' as FitzgeraldCategory, icon: '🥜' },
      { id: 'bissli', text: 'ביסלי', textEn: 'Bissli', category: 'people' as FitzgeraldCategory, icon: '🍿' },
      { id: 'chips', text: 'צ\'יפס', textEn: 'Chips', category: 'people' as FitzgeraldCategory, icon: '🍟' },
      { id: 'crackers', text: 'קרקרים', textEn: 'Crackers', category: 'people' as FitzgeraldCategory, icon: '🍘' },
      { id: 'chocolate', text: 'שוקולד', textEn: 'Chocolate', category: 'people' as FitzgeraldCategory, icon: '🍫' },
      { id: 'candy', text: 'סוכריות', textEn: 'Candy', category: 'people' as FitzgeraldCategory, icon: '🍬' },
      { id: 'gum', text: 'מסטיק', textEn: 'Gum', category: 'people' as FitzgeraldCategory, icon: '🫧' },
      { id: 'popcorn', text: 'פופקורן', textEn: 'Popcorn', category: 'people' as FitzgeraldCategory, icon: '🍿' },
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'meat': {
    id: 'meat',
    name: 'בשר ודגים',
    nameEn: 'Meat & Fish',
    parentBoardId: 'main',
    cells: [
      { id: 'chicken', text: 'עוף', textEn: 'Chicken', category: 'people' as FitzgeraldCategory, icon: '🍗' },
      { id: 'beef', text: 'בקר', textEn: 'Beef', category: 'people' as FitzgeraldCategory, icon: '🥩' },
      { id: 'fish', text: 'דג', textEn: 'Fish', category: 'people' as FitzgeraldCategory, icon: '🐟' },
      { id: 'ground-meat', text: 'בשר טחון', textEn: 'Ground Meat', category: 'people' as FitzgeraldCategory, icon: '🍖' },
      { id: 'sausage', text: 'נקניקיות', textEn: 'Sausages', category: 'people' as FitzgeraldCategory, icon: '🌭' },
      { id: 'turkey', text: 'הודו', textEn: 'Turkey', category: 'people' as FitzgeraldCategory, icon: '🦃' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'bread': {
    id: 'bread',
    name: 'לחם ומאפים',
    nameEn: 'Bread & Pastries',
    parentBoardId: 'main',
    cells: [
      { id: 'white-bread', text: 'לחם לבן', textEn: 'White Bread', category: 'people' as FitzgeraldCategory, icon: '🍞' },
      { id: 'pita', text: 'פיתה', textEn: 'Pita', category: 'people' as FitzgeraldCategory, icon: '🫓' },
      { id: 'challah', text: 'חלה', textEn: 'Challah', category: 'people' as FitzgeraldCategory, icon: '🍞' },
      { id: 'rolls', text: 'לחמניות', textEn: 'Rolls', category: 'people' as FitzgeraldCategory, icon: '🥯' },
      { id: 'croissant', text: 'קרואסון', textEn: 'Croissant', category: 'people' as FitzgeraldCategory, icon: '🥐' },
      { id: 'bagel', text: 'בייגל', textEn: 'Bagel', category: 'people' as FitzgeraldCategory, icon: '🥯' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'drinks': {
    id: 'drinks',
    name: 'משקאות',
    nameEn: 'Drinks',
    parentBoardId: 'main',
    cells: [
      { id: 'water', text: 'מים', textEn: 'Water', category: 'people' as FitzgeraldCategory, icon: '💧' },
      { id: 'juice', text: 'מיץ', textEn: 'Juice', category: 'people' as FitzgeraldCategory, icon: '🧃' },
      { id: 'soda', text: 'סודה', textEn: 'Soda', category: 'people' as FitzgeraldCategory, icon: '🥤' },
      { id: 'beer', text: 'בירה', textEn: 'Beer', category: 'people' as FitzgeraldCategory, icon: '🍺' },
      { id: 'wine', text: 'יין', textEn: 'Wine', category: 'people' as FitzgeraldCategory, icon: '🍷' },
      { id: 'coffee', text: 'קפה', textEn: 'Coffee', category: 'people' as FitzgeraldCategory, icon: '☕' },
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
      { id: 'flavors', text: 'טעמים', textEn: 'Flavors', category: 'people' as FitzgeraldCategory, icon: '🍦', linkToBoardId: 'flavors' },
      { id: 'toppings', text: 'תוספות', textEn: 'Toppings', category: 'people' as FitzgeraldCategory, icon: '🍫', linkToBoardId: 'toppings' },
      { id: 'sizes', text: 'גדלים', textEn: 'Sizes', category: 'people' as FitzgeraldCategory, icon: '📏', linkToBoardId: 'sizes' },
      { id: 'want', text: 'רוצה', textEn: 'Want', category: 'verbs' as FitzgeraldCategory, icon: '👆' },
      { id: 'taste', text: 'לטעום', textEn: 'Taste', category: 'verbs' as FitzgeraldCategory, icon: '👅' },
      { id: 'cold', text: 'קר', textEn: 'Cold', category: 'descriptors' as FitzgeraldCategory, icon: '❄️' },
      { id: 'sweet', text: 'מתוק', textEn: 'Sweet', category: 'descriptors' as FitzgeraldCategory, icon: '🍬' },
      { id: 'please', text: 'בבקשה', textEn: 'Please', category: 'social' as FitzgeraldCategory, icon: '🙏' },
      { id: 'thanks', text: 'תודה', textEn: 'Thank you', category: 'social' as FitzgeraldCategory, icon: '🙏' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'flavors': {
    id: 'flavors',
    name: 'טעמים',
    nameEn: 'Flavors',
    parentBoardId: 'main',
    cells: [
      { id: 'chocolate', text: 'שוקולד', textEn: 'Chocolate', category: 'people' as FitzgeraldCategory, icon: '🍫' },
      { id: 'vanilla', text: 'וניל', textEn: 'Vanilla', category: 'people' as FitzgeraldCategory, icon: '🍨' },
      { id: 'strawberry', text: 'תות', textEn: 'Strawberry', category: 'people' as FitzgeraldCategory, icon: '🍓' },
      { id: 'pistachio', text: 'פיסטוק', textEn: 'Pistachio', category: 'people' as FitzgeraldCategory, icon: '🥜' },
      { id: 'lemon', text: 'לימון', textEn: 'Lemon', category: 'people' as FitzgeraldCategory, icon: '🍋' },
      { id: 'mango', text: 'מנגו', textEn: 'Mango', category: 'people' as FitzgeraldCategory, icon: '🥭' },
      { id: 'cookies', text: 'עוגיות', textEn: 'Cookies', category: 'people' as FitzgeraldCategory, icon: '🍪' },
      { id: 'coffee', text: 'קפה', textEn: 'Coffee', category: 'people' as FitzgeraldCategory, icon: '☕' },
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'toppings': {
    id: 'toppings',
    name: 'תוספות',
    nameEn: 'Toppings',
    parentBoardId: 'main',
    cells: [
      { id: 'sprinkles', text: 'סוכריות', textEn: 'Sprinkles', category: 'people' as FitzgeraldCategory, icon: '🍬' },
      { id: 'choco-chips', text: 'שבבי שוקולד', textEn: 'Chocolate Chips', category: 'people' as FitzgeraldCategory, icon: '🍫' },
      { id: 'whipped-cream', text: 'קצפת', textEn: 'Whipped Cream', category: 'people' as FitzgeraldCategory, icon: '🥛' },
      { id: 'sauce', text: 'רוטב', textEn: 'Sauce', category: 'people' as FitzgeraldCategory, icon: '🍯' },
      { id: 'nuts', text: 'אגוזים', textEn: 'Nuts', category: 'people' as FitzgeraldCategory, icon: '🥜' },
      { id: 'fruits', text: 'פירות', textEn: 'Fruits', category: 'people' as FitzgeraldCategory, icon: '🍓' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'sizes': {
    id: 'sizes',
    name: 'גדלים',
    nameEn: 'Sizes',
    parentBoardId: 'main',
    cells: [
      { id: 'small', text: 'קטן', textEn: 'Small', category: 'descriptors' as FitzgeraldCategory, icon: '🔹' },
      { id: 'medium', text: 'בינוני', textEn: 'Medium', category: 'descriptors' as FitzgeraldCategory, icon: '🔶' },
      { id: 'large', text: 'גדול', textEn: 'Large', category: 'descriptors' as FitzgeraldCategory, icon: '⬛' },
      { id: 'scoop', text: 'כדור', textEn: 'Scoop', category: 'people' as FitzgeraldCategory, icon: '🍦' },
      { id: 'cup', text: 'גביע', textEn: 'Cup', category: 'people' as FitzgeraldCategory, icon: '🥤' },
      { id: 'cone', text: 'גלילה', textEn: 'Cone', category: 'people' as FitzgeraldCategory, icon: '🍦' },
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
      { id: 'drinks', text: 'משקאות', textEn: 'Drinks', category: 'people' as FitzgeraldCategory, icon: '🥤', linkToBoardId: 'drinks' },
      { id: 'food', text: 'אוכל', textEn: 'Food', category: 'people' as FitzgeraldCategory, icon: '🍽️', linkToBoardId: 'food' },
      { id: 'desserts', text: 'קינוחים', textEn: 'Desserts', category: 'people' as FitzgeraldCategory, icon: '🍰', linkToBoardId: 'desserts' },
      { id: 'want', text: 'רוצה', textEn: 'Want', category: 'verbs' as FitzgeraldCategory, icon: '👆' },
      { id: 'pay', text: 'לשלם', textEn: 'Pay', category: 'verbs' as FitzgeraldCategory, icon: '💳' },
      { id: 'hot', text: 'חם', textEn: 'Hot', category: 'descriptors' as FitzgeraldCategory, icon: '🔥' },
      { id: 'cold', text: 'קר', textEn: 'Cold', category: 'descriptors' as FitzgeraldCategory, icon: '❄️' },
      { id: 'please', text: 'בבקשה', textEn: 'Please', category: 'social' as FitzgeraldCategory, icon: '🙏' },
      { id: 'hello', text: 'שלום', textEn: 'Hello', category: 'social' as FitzgeraldCategory, icon: '👋' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'drinks': {
    id: 'drinks',
    name: 'משקאות',
    nameEn: 'Drinks',
    parentBoardId: 'main',
    cells: [
      { id: 'hot-drinks', text: 'משקאות חמים', textEn: 'Hot Drinks', category: 'people' as FitzgeraldCategory, icon: '☕', linkToBoardId: 'hot-drinks' },
      { id: 'cold-drinks', text: 'משקאות קרים', textEn: 'Cold Drinks', category: 'people' as FitzgeraldCategory, icon: '🧊', linkToBoardId: 'cold-drinks' },
      { id: 'water', text: 'מים', textEn: 'Water', category: 'people' as FitzgeraldCategory, icon: '💧' },
      { id: 'large', text: 'גדול', textEn: 'Large', category: 'descriptors' as FitzgeraldCategory, icon: '📏' },
      { id: 'small', text: 'קטן', textEn: 'Small', category: 'descriptors' as FitzgeraldCategory, icon: '🔹' },
      { id: 'more', text: 'עוד', textEn: 'More', category: 'verbs' as FitzgeraldCategory, icon: '➕' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'hot-drinks': {
    id: 'hot-drinks',
    name: 'משקאות חמים',
    nameEn: 'Hot Drinks',
    parentBoardId: 'drinks',
    cells: [
      { id: 'coffee', text: 'קפה', textEn: 'Coffee', category: 'people' as FitzgeraldCategory, icon: '☕' },
      { id: 'tea', text: 'תה', textEn: 'Tea', category: 'people' as FitzgeraldCategory, icon: '🫖' },
      { id: 'hot-chocolate', text: 'שוקו חם', textEn: 'Hot Chocolate', category: 'people' as FitzgeraldCategory, icon: '🍫' },
      { id: 'latte', text: 'לאטה', textEn: 'Latte', category: 'people' as FitzgeraldCategory, icon: '🥛' },
      { id: 'cappuccino', text: 'קפוצ\'ינו', textEn: 'Cappuccino', category: 'people' as FitzgeraldCategory, icon: '☕' },
      { id: 'espresso', text: 'אספרסו', textEn: 'Espresso', category: 'people' as FitzgeraldCategory, icon: '☕' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'cold-drinks': {
    id: 'cold-drinks',
    name: 'משקאות קרים',
    nameEn: 'Cold Drinks',
    parentBoardId: 'drinks',
    cells: [
      { id: 'juice', text: 'מיץ', textEn: 'Juice', category: 'people' as FitzgeraldCategory, icon: '🧃' },
      { id: 'iced-coffee', text: 'קפה קר', textEn: 'Iced Coffee', category: 'people' as FitzgeraldCategory, icon: '🧋' },
      { id: 'smoothie', text: 'שייק', textEn: 'Smoothie', category: 'people' as FitzgeraldCategory, icon: '🥤' },
      { id: 'soda', text: 'סודה', textEn: 'Soda', category: 'people' as FitzgeraldCategory, icon: '🥤' },
      { id: 'lemonade', text: 'לימונדה', textEn: 'Lemonade', category: 'people' as FitzgeraldCategory, icon: '🍋' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'food': {
    id: 'food',
    name: 'אוכל',
    nameEn: 'Food',
    parentBoardId: 'main',
    cells: [
      { id: 'sandwich', text: 'סנדוויץ\'', textEn: 'Sandwich', category: 'people' as FitzgeraldCategory, icon: '🥪' },
      { id: 'salad', text: 'סלט', textEn: 'Salad', category: 'people' as FitzgeraldCategory, icon: '🥗' },
      { id: 'pastry', text: 'מאפה', textEn: 'Pastry', category: 'people' as FitzgeraldCategory, icon: '🥐' },
      { id: 'toast', text: 'טוסט', textEn: 'Toast', category: 'people' as FitzgeraldCategory, icon: '🍞' },
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  'desserts': {
    id: 'desserts',
    name: 'קינוחים',
    nameEn: 'Desserts',
    parentBoardId: 'main',
    cells: [
      { id: 'cake', text: 'עוגה', textEn: 'Cake', category: 'people' as FitzgeraldCategory, icon: '🍰' },
      { id: 'cookie', text: 'עוגיה', textEn: 'Cookie', category: 'people' as FitzgeraldCategory, icon: '🍪' },
      { id: 'ice-cream', text: 'גלידה', textEn: 'Ice Cream', category: 'people' as FitzgeraldCategory, icon: '🍦' },
      { id: 'muffin', text: 'מאפין', textEn: 'Muffin', category: 'people' as FitzgeraldCategory, icon: '🧁' },
    ],
    gridSize: { cols: 2, rows: 2 },
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
      { id: 'starters', text: 'מנות פתיחה', textEn: 'Starters', category: 'people' as FitzgeraldCategory, icon: '🥗', linkToBoardId: 'starters' },
      { id: 'mains', text: 'מנות עיקריות', textEn: 'Main Courses', category: 'people' as FitzgeraldCategory, icon: '🍽️', linkToBoardId: 'mains' },
      { id: 'desserts', text: 'קינוחים', textEn: 'Desserts', category: 'people' as FitzgeraldCategory, icon: '🍰', linkToBoardId: 'desserts' },
      { id: 'drinks', text: 'משקאות', textEn: 'Drinks', category: 'people' as FitzgeraldCategory, icon: '🥤', linkToBoardId: 'drinks' },
      { id: 'order', text: 'להזמין', textEn: 'Order', category: 'verbs' as FitzgeraldCategory, icon: '📝' },
      { id: 'pay', text: 'לשלם', textEn: 'Pay', category: 'verbs' as FitzgeraldCategory, icon: '💳' },
      { id: 'waiter', text: 'מלצר', textEn: 'Waiter', category: 'people' as FitzgeraldCategory, icon: '🧑‍🍳' },
      { id: 'menu', text: 'תפריט', textEn: 'Menu', category: 'people' as FitzgeraldCategory, icon: '📋' },
      { id: 'thanks', text: 'תודה', textEn: 'Thank you', category: 'social' as FitzgeraldCategory, icon: '🙏' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'starters': {
    id: 'starters',
    name: 'מנות פתיחה',
    nameEn: 'Starters',
    parentBoardId: 'main',
    cells: [
      { id: 'salad', text: 'סלט', textEn: 'Salad', category: 'people' as FitzgeraldCategory, icon: '🥗' },
      { id: 'soup', text: 'מרק', textEn: 'Soup', category: 'people' as FitzgeraldCategory, icon: '🍲' },
      { id: 'bread', text: 'לחם', textEn: 'Bread', category: 'people' as FitzgeraldCategory, icon: '🍞' },
      { id: 'hummus', text: 'חומוס', textEn: 'Hummus', category: 'people' as FitzgeraldCategory, icon: '🫘' },
      { id: 'tahini', text: 'טחינה', textEn: 'Tahini', category: 'people' as FitzgeraldCategory, icon: '🥣' },
      { id: 'fries', text: 'צ\'יפס', textEn: 'Fries', category: 'people' as FitzgeraldCategory, icon: '🍟' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'mains': {
    id: 'mains',
    name: 'מנות עיקריות',
    nameEn: 'Main Courses',
    parentBoardId: 'main',
    cells: [
      { id: 'steak', text: 'סטייק', textEn: 'Steak', category: 'people' as FitzgeraldCategory, icon: '🥩' },
      { id: 'fish', text: 'דג', textEn: 'Fish', category: 'people' as FitzgeraldCategory, icon: '🐟' },
      { id: 'chicken', text: 'עוף', textEn: 'Chicken', category: 'people' as FitzgeraldCategory, icon: '🍗' },
      { id: 'pasta', text: 'פסטה', textEn: 'Pasta', category: 'people' as FitzgeraldCategory, icon: '🍝' },
      { id: 'burger', text: 'המבורגר', textEn: 'Burger', category: 'people' as FitzgeraldCategory, icon: '🍔' },
      { id: 'pizza', text: 'פיצה', textEn: 'Pizza', category: 'people' as FitzgeraldCategory, icon: '🍕' },
      { id: 'schnitzel', text: 'שניצל', textEn: 'Schnitzel', category: 'people' as FitzgeraldCategory, icon: '🍗' },
      { id: 'kebab', text: 'קבב', textEn: 'Kebab', category: 'people' as FitzgeraldCategory, icon: '🍢' },
    ],
    gridSize: { cols: 4, rows: 2 },
  },
  'desserts': {
    id: 'desserts',
    name: 'קינוחים',
    nameEn: 'Desserts',
    parentBoardId: 'main',
    cells: [
      { id: 'cake', text: 'עוגה', textEn: 'Cake', category: 'people' as FitzgeraldCategory, icon: '🍰' },
      { id: 'ice-cream', text: 'גלידה', textEn: 'Ice Cream', category: 'people' as FitzgeraldCategory, icon: '🍦' },
      { id: 'fruit', text: 'פירות', textEn: 'Fruit', category: 'people' as FitzgeraldCategory, icon: '🍓' },
      { id: 'chocolate', text: 'שוקולד', textEn: 'Chocolate', category: 'people' as FitzgeraldCategory, icon: '🍫' },
      { id: 'coffee', text: 'קפה', textEn: 'Coffee', category: 'people' as FitzgeraldCategory, icon: '☕' },
      { id: 'tea', text: 'תה', textEn: 'Tea', category: 'people' as FitzgeraldCategory, icon: '🫖' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'drinks': {
    id: 'drinks',
    name: 'משקאות',
    nameEn: 'Drinks',
    parentBoardId: 'main',
    cells: [
      { id: 'water', text: 'מים', textEn: 'Water', category: 'people' as FitzgeraldCategory, icon: '💧' },
      { id: 'juice', text: 'מיץ', textEn: 'Juice', category: 'people' as FitzgeraldCategory, icon: '🧃' },
      { id: 'soda', text: 'סודה', textEn: 'Soda', category: 'people' as FitzgeraldCategory, icon: '🥤' },
      { id: 'beer', text: 'בירה', textEn: 'Beer', category: 'people' as FitzgeraldCategory, icon: '🍺' },
      { id: 'wine', text: 'יין', textEn: 'Wine', category: 'people' as FitzgeraldCategory, icon: '🍷' },
      { id: 'coffee', text: 'קפה', textEn: 'Coffee', category: 'people' as FitzgeraldCategory, icon: '☕' },
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
      { id: 'breads', text: 'לחמים', textEn: 'Breads', category: 'people' as FitzgeraldCategory, icon: '🍞', linkToBoardId: 'breads' },
      { id: 'sweet-pastries', text: 'מאפים מתוקים', textEn: 'Sweet Pastries', category: 'people' as FitzgeraldCategory, icon: '🥐', linkToBoardId: 'sweet-pastries' },
      { id: 'savory-pastries', text: 'מאפים מלוחים', textEn: 'Savory Pastries', category: 'people' as FitzgeraldCategory, icon: '🥧', linkToBoardId: 'savory-pastries' },
      { id: 'cakes', text: 'עוגות', textEn: 'Cakes', category: 'people' as FitzgeraldCategory, icon: '🎂', linkToBoardId: 'cakes' },
      { id: 'want', text: 'רוצה', textEn: 'Want', category: 'verbs' as FitzgeraldCategory, icon: '👆' },
      { id: 'slice', text: 'פרוסה', textEn: 'Slice', category: 'people' as FitzgeraldCategory, icon: '🍰' },
      { id: 'fresh', text: 'טרי', textEn: 'Fresh', category: 'descriptors' as FitzgeraldCategory, icon: '✨' },
      { id: 'please', text: 'בבקשה', textEn: 'Please', category: 'social' as FitzgeraldCategory, icon: '🙏' },
      { id: 'thanks', text: 'תודה', textEn: 'Thank you', category: 'social' as FitzgeraldCategory, icon: '🙏' },
    ],
    gridSize: { cols: 3, rows: 3 },
  },
  'breads': {
    id: 'breads',
    name: 'לחמים',
    nameEn: 'Breads',
    parentBoardId: 'main',
    cells: [
      { id: 'white-bread', text: 'לחם לבן', textEn: 'White Bread', category: 'people' as FitzgeraldCategory, icon: '🍞' },
      { id: 'whole-wheat', text: 'לחם מלא', textEn: 'Whole Wheat', category: 'people' as FitzgeraldCategory, icon: '🍞' },
      { id: 'rye', text: 'שיפון', textEn: 'Rye', category: 'people' as FitzgeraldCategory, icon: '🍞' },
      { id: 'focaccia', text: 'פוקאצ\'ה', textEn: 'Focaccia', category: 'people' as FitzgeraldCategory, icon: '🫓' },
      { id: 'baguette', text: 'באגט', textEn: 'Baguette', category: 'people' as FitzgeraldCategory, icon: '🥖' },
      { id: 'challah', text: 'חלה', textEn: 'Challah', category: 'people' as FitzgeraldCategory, icon: '🍞' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'sweet-pastries': {
    id: 'sweet-pastries',
    name: 'מאפים מתוקים',
    nameEn: 'Sweet Pastries',
    parentBoardId: 'main',
    cells: [
      { id: 'croissant', text: 'קרואסון', textEn: 'Croissant', category: 'people' as FitzgeraldCategory, icon: '🥐' },
      { id: 'yeast-cake', text: 'עוגת שמרים', textEn: 'Yeast Cake', category: 'people' as FitzgeraldCategory, icon: '🍰' },
      { id: 'rugelach', text: 'רוגלך', textEn: 'Rugelach', category: 'people' as FitzgeraldCategory, icon: '🥐' },
      { id: 'cookies', text: 'עוגיות', textEn: 'Cookies', category: 'people' as FitzgeraldCategory, icon: '🍪' },
      { id: 'danish', text: 'דניש', textEn: 'Danish', category: 'people' as FitzgeraldCategory, icon: '🥐' },
      { id: 'donut', text: 'סופגנייה', textEn: 'Donut', category: 'people' as FitzgeraldCategory, icon: '🍩' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'savory-pastries': {
    id: 'savory-pastries',
    name: 'מאפים מלוחים',
    nameEn: 'Savory Pastries',
    parentBoardId: 'main',
    cells: [
      { id: 'bourekas', text: 'בורקס', textEn: 'Bourekas', category: 'people' as FitzgeraldCategory, icon: '🥧' },
      { id: 'cheese-croissant', text: 'קרואסון גבינה', textEn: 'Cheese Croissant', category: 'people' as FitzgeraldCategory, icon: '🥐' },
      { id: 'sambusak', text: 'סמבוסק', textEn: 'Sambusak', category: 'people' as FitzgeraldCategory, icon: '🥟' },
      { id: 'pizza-bread', text: 'לחם פיצה', textEn: 'Pizza Bread', category: 'people' as FitzgeraldCategory, icon: '🍕' },
      { id: 'pretzel', text: 'בייגלה', textEn: 'Pretzel', category: 'people' as FitzgeraldCategory, icon: '🥨' },
      { id: 'spinach-pie', text: 'מאפה תרד', textEn: 'Spinach Pie', category: 'people' as FitzgeraldCategory, icon: '🥬' },
    ],
    gridSize: { cols: 3, rows: 2 },
  },
  'cakes': {
    id: 'cakes',
    name: 'עוגות',
    nameEn: 'Cakes',
    parentBoardId: 'main',
    cells: [
      { id: 'chocolate-cake', text: 'עוגת שוקולד', textEn: 'Chocolate Cake', category: 'people' as FitzgeraldCategory, icon: '🍫' },
      { id: 'cheesecake', text: 'עוגת גבינה', textEn: 'Cheesecake', category: 'people' as FitzgeraldCategory, icon: '🧀' },
      { id: 'apple-pie', text: 'פאי תפוחים', textEn: 'Apple Pie', category: 'people' as FitzgeraldCategory, icon: '🍎' },
      { id: 'carrot-cake', text: 'עוגת גזר', textEn: 'Carrot Cake', category: 'people' as FitzgeraldCategory, icon: '🥕' },
      { id: 'birthday-cake', text: 'עוגת יום הולדת', textEn: 'Birthday Cake', category: 'people' as FitzgeraldCategory, icon: '🎂' },
      { id: 'fruit-tart', text: 'טארט פירות', textEn: 'Fruit Tart', category: 'people' as FitzgeraldCategory, icon: '🍓' },
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
export const businessPreviewCards: Record<BusinessType, Array<{ text: string; textEn: string; category: FitzgeraldCategory; icon: string }>> = {
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
