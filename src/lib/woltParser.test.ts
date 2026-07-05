import { describe, expect, it } from 'vitest';
import { extractWoltMenuDataFromHtml, isWoltHost } from '../../supabase/functions/_shared/wolt';

describe('Wolt parser', () => {
  it('detects Wolt hosts', () => {
    expect(isWoltHost('wolt.com')).toBe(true);
    expect(isWoltHost('www.wolt.com')).toBe(true);
    expect(isWoltHost('pinoli.co.il')).toBe(false);
  });

  it('extracts menu sections, items, and images from Wolt HTML', () => {
    const html = `
      <html>
        <head><title>פינולי | תל אביב</title></head>
        <body>
          <div data-test-id="MenuSection">
            <div data-test-id="MenuSectionTitle"><h2>‫גלידה 🍦</h2></div>
            <div data-test-id="horizontal-item-card">
              <h3 data-test-id="horizontal-item-card-header">‫גלידה S</h3>
              <p class="du2tpot">‫גלידה במשקל בגודל 0.5 קילו, עד 3 טעמים</p>
              <img data-test-id="horizontal-item-card-image" src="https://imageproxy.wolt.com/item-s.jpg" />
            </div>
            <div data-test-id="horizontal-item-card">
              <h3 data-test-id="horizontal-item-card-header">‫גלידה M</h3>
              <p class="du2tpot">‫גלידה במשקל בגודל 0.75 קילו, עד 4 טעמים</p>
              <img data-test-id="horizontal-item-card-image" src="https://imageproxy.wolt.com/item-m.jpg" />
            </div>
          </div>
          <div data-test-id="MenuSection">
            <div data-test-id="MenuSectionTitle"><h2>‫שתייה קלה 🥤</h2></div>
            <div data-test-id="horizontal-item-card">
              <h3 data-test-id="horizontal-item-card-header">קוקה קולה</h3>
              <p class="du2tpot">בקבוק זכוכית 0,35</p>
              <img data-test-id="horizontal-item-card-image" src="https://imageproxy.wolt.com/coke.jpg" />
            </div>
          </div>
        </body>
      </html>
    `;

    const menuData = extractWoltMenuDataFromHtml(html);

    expect(menuData?.businessNameHe).toBe('פינולי');
    expect(menuData?.categories).toHaveLength(2);
    expect(menuData?.categories[0]?.nameHe).toContain('גלידה');
    expect(menuData?.categories[0]?.items.map((item) => item.text)).toEqual(['גלידה S', 'גלידה M']);
    expect(menuData?.categories[0]?.items[0]?.imageUrl).toBe('https://imageproxy.wolt.com/item-s.jpg');
    expect(menuData?.categories[1]?.items[0]?.text).toBe('קוקה קולה');
  });
});