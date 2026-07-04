import { describe, expect, it } from 'vitest';
import { canRenderBoardUrlAsQr, createSharedBoardUrl, parseSharedBoardPayload } from './sharedBoard';

const sampleBoards = {
  main: {
    id: 'main',
    name: 'גלידות',
    nameEn: 'Ice Cream',
    cells: [
      {
        id: '1',
        text: 'כדור',
        textEn: 'Scoop',
        category: 'people' as const,
      },
    ],
    gridSize: {
      cols: 4,
      rows: 4,
    },
  },
};

const encodeLegacySharedPayload = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  const base64 = Buffer.from(binary, 'binary').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const largerBoards = {
  main: {
    id: 'main',
    name: 'בדיקת קישור ארוך',
    nameEn: 'Long Link Test',
    cells: Array.from({ length: 12 }, (_, index) => ({
      id: `cell-${index}`,
      text: `קפה מיוחד ${index} עם חלב וסוכר וקצפת`,
      textEn: `Special coffee ${index} with milk sugar and cream`,
      category: 'people' as const,
      imageUrl: 'https://static.arasaac.org/pictograms/5483/5483_500.png',
      linkToBoardId: index % 4 === 0 ? `sub-${index}` : undefined,
    })),
    gridSize: {
      cols: 4,
      rows: 3,
    },
  },
};

describe('sharedBoard', () => {
  it('creates a share URL that contains a shared payload', () => {
    const url = createSharedBoardUrl({
      baseUrl: 'https://example.com',
      boardId: 'board-123',
      businessType: 'iceCream',
      boardName: 'גלידות',
      boards: sampleBoards,
    });

    const parsedUrl = new URL(url);

    expect(parsedUrl.pathname).toBe('/board/board-123');
    expect(parsedUrl.searchParams.get('type')).toBe('iceCream');
    expect(parsedUrl.searchParams.get('shared')).toBeTruthy();
  });

  it('round-trips a shared board payload', () => {
    const url = createSharedBoardUrl({
      baseUrl: 'https://example.com',
      boardId: 'board-123',
      businessType: 'iceCream',
      boardName: 'גלידות',
      boards: sampleBoards,
    });

    const sharedValue = new URL(url).searchParams.get('shared');
    const parsedPayload = parseSharedBoardPayload(sharedValue);

    expect(parsedPayload).toEqual({
      version: 1,
      boardId: 'board-123',
      businessType: 'iceCream',
      boardName: 'גלידות',
      boards: sampleBoards,
    });
  });

  it('returns null for malformed shared payloads', () => {
    expect(parseSharedBoardPayload('not-valid')).toBeNull();
  });

  it('parses legacy base64 shared payloads for backward compatibility', () => {
    const payload = JSON.stringify({
      version: 1,
      boardId: 'board-123',
      businessType: 'iceCream',
      boardName: 'גלידות',
      boards: sampleBoards,
    });

    const legacySharedValue = encodeLegacySharedPayload(payload);

    expect(parseSharedBoardPayload(legacySharedValue)).toEqual({
      version: 1,
      boardId: 'board-123',
      businessType: 'iceCream',
      boardName: 'גלידות',
      boards: sampleBoards,
    });
  });

  it('detects when a URL is too long for a high-correction QR code', () => {
    expect(canRenderBoardUrlAsQr('https://example.com/short', 'H')).toBe(true);
    expect(canRenderBoardUrlAsQr(`https://example.com/${'a'.repeat(2000)}`, 'H')).toBe(false);
  });

  it('compresses larger shared board links enough to stay QR-friendly', () => {
    const compressedUrl = createSharedBoardUrl({
      baseUrl: 'https://example.com',
      boardId: 'board-456',
      businessType: 'cafe',
      boardName: 'בדיקת קישור ארוך',
      boards: largerBoards,
    });

    const legacyPayload = encodeLegacySharedPayload(JSON.stringify({
      version: 1,
      boardId: 'board-456',
      businessType: 'cafe',
      boardName: 'בדיקת קישור ארוך',
      boards: largerBoards,
    }));
    const legacyUrl = `https://example.com/board/board-456?type=cafe&shared=${legacyPayload}`;

    expect(compressedUrl.length).toBeLessThan(legacyUrl.length);
    expect(canRenderBoardUrlAsQr(compressedUrl, 'M')).toBe(true);
  });
});