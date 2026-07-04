import { describe, expect, it } from 'vitest';
import { createSharedBoardUrl, parseSharedBoardPayload } from './sharedBoard';

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
});