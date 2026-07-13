import { AACCell, AACBoard } from '@/types/aac';

const categoryOrder: Record<AACCell['category'], number> = {
  people: 0,
  verbs: 1,
  descriptors: 2,
  social: 3,
};

export const sortBoardCells = (cells: AACCell[]) =>
  [...cells].sort((first, second) => categoryOrder[first.category] - categoryOrder[second.category]);

export interface BoardLayoutDerived {
  sortedCells: AACCell[];
  peopleCells: AACCell[];
  verbCells: AACCell[];
  descriptorCells: AACCell[];
  socialCells: AACCell[];
  infoStripCells: AACCell[];
  displayGridCells: AACCell[];
  effectiveGridCols: number;
}

export const deriveBoardLayout = (currentBoard: AACBoard): BoardLayoutDerived => {
  const sortedCells = sortBoardCells(currentBoard.cells);
  const peopleCells = sortedCells.filter((cell) => cell.category === 'people');
  const verbCells = sortedCells.filter((cell) => cell.category === 'verbs');
  const descriptorCells = sortedCells.filter((cell) => cell.category === 'descriptors');
  const socialCells = sortedCells.filter((cell) => cell.category === 'social');
  const infoStripCells = [...descriptorCells, ...verbCells].slice(0, 3);
  const featuredCellIds = new Set([...socialCells, ...infoStripCells].map((cell) => cell.id));
  const mainGridCells = peopleCells.length > 0
    ? peopleCells
    : sortedCells.filter((cell) => !featuredCellIds.has(cell.id));
  const displayGridCells = mainGridCells.length > 0 ? mainGridCells : sortedCells;
  const effectiveGridCols = Math.min(
    5,
    Math.max(
      2,
      displayGridCells.length >= 10 ? 5 : displayGridCells.length >= 8 ? 4 : displayGridCells.length || 2,
    ),
  );

  return {
    sortedCells,
    peopleCells,
    verbCells,
    descriptorCells,
    socialCells,
    infoStripCells,
    displayGridCells,
    effectiveGridCols,
  };
};

export const getSelectionSummary = (
  selectedWords: string[],
  infoStripCells: AACCell[],
  language: string,
) => {
  if (selectedWords.length > 0) {
    return selectedWords.join(' • ');
  }

  if (infoStripCells[0]) {
    return language === 'he' || language === 'ar'
      ? infoStripCells[0].text
      : infoStripCells[0].textEn;
  }

  return language === 'he' ? 'בחירה נוספת' : 'Another choice';
};
