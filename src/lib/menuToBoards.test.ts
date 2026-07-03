import { describe, expect, it } from 'vitest';
import { sanitizeMenuData, type MenuData } from './menuToBoards';

describe('sanitizeMenuData', () => {
  it('merges local composite flavors and removes descriptor fragments', () => {
    const menuData: MenuData = {
      businessName: 'Pinoli',
      businessNameHe: 'פינולי',
      categories: [
        {
          id: 'flavors',
          name: 'Flavors',
          nameHe: 'טעמים',
          items: [
            { text: 'וניל', textEn: 'Vanilla' },
            { text: 'שחור', textEn: 'Black' },
            { text: 'פיסטוק', textEn: 'Pistachio' },
          ],
        },
      ],
    };

    const sanitized = sanitizeMenuData(menuData);
    const texts = sanitized.categories[0]?.items.map((item) => item.text) ?? [];

    expect(texts).toContain('וניל שחור');
    expect(texts).toContain('פיסטוק');
    expect(texts).not.toContain('שחור');
    expect(texts).not.toContain('וניל');
  });
});
