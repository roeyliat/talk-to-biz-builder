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

  it('merges consecutive multi-word fragments into a known local composite flavor', () => {
    const menuData: MenuData = {
      businessName: 'Pinoli',
      businessNameHe: 'פינולי',
      categories: [
        {
          id: 'flavors',
          name: 'Flavors',
          nameHe: 'טעמים',
          items: [
            { text: 'מסקרפונה', textEn: 'Mascarpone' },
            { text: 'פירות יער', textEn: 'Berries' },
            { text: 'וקרמבל', textEn: 'And crumble' },
          ],
        },
      ],
    };

    const sanitized = sanitizeMenuData(menuData);
    const texts = sanitized.categories[0]?.items.map((item) => item.text) ?? [];

    expect(texts).toContain('מסקרפונה פירות יער וקרמבל');
    expect(texts).not.toContain('מסקרפונה');
    expect(texts).not.toContain('פירות יער');
    expect(texts).not.toContain('וקרמבל');
  });

  it('drops composite fragments when the whole flavor already exists', () => {
    const menuData: MenuData = {
      businessName: 'Pinoli',
      businessNameHe: 'פינולי',
      categories: [
        {
          id: 'flavors',
          name: 'Flavors',
          nameHe: 'טעמים',
          items: [
            { text: 'מסקרפונה פירות יער וקרמבל', textEn: 'Mascarpone berries and crumble' },
            { text: 'מסקרפונה', textEn: 'Mascarpone' },
            { text: 'פירות יער', textEn: 'Berries' },
            { text: 'וקרמבל', textEn: 'And crumble' },
            { text: 'שוקולד', textEn: 'Chocolate' },
            { text: 'שוקולד מריר', textEn: 'Dark chocolate' },
          ],
        },
      ],
    };

    const sanitized = sanitizeMenuData(menuData);
    const texts = sanitized.categories[0]?.items.map((item) => item.text) ?? [];

    expect(texts).toContain('מסקרפונה פירות יער וקרמבל');
    expect(texts).toContain('שוקולד');
    expect(texts).toContain('שוקולד מריר');
    expect(texts).not.toContain('מסקרפונה');
    expect(texts).not.toContain('פירות יער');
    expect(texts).not.toContain('וקרמבל');
  });

  it('keeps black vanilla and salted caramel flavors whole', () => {
    const menuData: MenuData = {
      businessName: 'Pinoli',
      businessNameHe: 'פינולי',
      categories: [
        {
          id: 'flavors',
          name: 'Flavors',
          nameHe: 'טעמים',
          items: [
            { text: 'וניל שחור', textEn: 'Black Vanilla' },
            { text: 'וניל', textEn: 'Vanilla' },
            { text: 'שחור', textEn: 'Black' },
            { text: 'קרמל מלוח עם שברי אפרופו', textEn: 'Salted Caramel with Apropo Pieces' },
            { text: 'קרמל', textEn: 'Caramel' },
            { text: 'מלוח', textEn: 'Salted' },
            { text: 'שברי אפרופו', textEn: 'Apropo Pieces' },
          ],
        },
      ],
    };

    const sanitized = sanitizeMenuData(menuData);
    const texts = sanitized.categories[0]?.items.map((item) => item.text) ?? [];

    expect(texts).toContain('וניל שחור');
    expect(texts).toContain('קרמל מלוח עם שברי אפרופו');
    expect(texts).not.toContain('שחור');
    expect(texts).not.toContain('מלוח');
    expect(texts).not.toContain('שברי אפרופו');
  });
});
