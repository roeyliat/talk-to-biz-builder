import { AACCell } from '@/types/aac';
import wantImage from '@/assets/aac-local/אני רוצה.png';
import moreImage from '@/assets/aac-local/עוד.png';
import howMuchImage from '@/assets/aac-local/כמה עולה.png';

export const utilityRailCells: AACCell[] = [
  {
    id: 'utility-want',
    text: 'אני רוצה',
    textEn: 'I want',
    category: 'verbs',
    icon: '👉',
  },
  {
    id: 'utility-more',
    text: 'עוד',
    textEn: 'More',
    category: 'descriptors',
    icon: '🟥',
  },
  {
    id: 'utility-thanks',
    text: 'תודה',
    textEn: 'Thank you',
    category: 'social',
    icon: '🙏',
  },
  {
    id: 'utility-price',
    text: 'כמה עולה',
    textEn: 'How much',
    category: 'social',
    icon: '💰',
  },
];

export const utilityRailImageVisuals: Record<string, { src: string; className?: string }> = {
  'utility-want': { src: wantImage, className: 'scale-[1.18]' },
  'utility-more': { src: moreImage, className: 'scale-[1.18]' },
  'utility-thanks': { src: '/aac-local/תודה.png', className: 'scale-[1.15]' },
  'utility-price': { src: howMuchImage, className: 'scale-[1.2]' },
};

export const iceCreamRailVisuals: Record<string, { center?: string }> = {
  'utility-yes': { center: '✅' },
  'utility-no': { center: '❌' },
};

export const getUtilityRailImageSrc = (cell: AACCell) =>
  utilityRailImageVisuals[cell.id]?.src ?? cell.imageUrl;
