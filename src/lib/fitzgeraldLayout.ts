import { AACBoard, AACBoardSection, AACCell, FitzgeraldCategory } from '@/types/aac';

const MAIN_COLUMN_CATEGORIES: FitzgeraldCategory[] = ['people', 'verbs', 'descriptors', 'social'];

const SECTION_TITLE_KEYS: Record<FitzgeraldCategory, string> = {
  core: 'aac.coreVocabulary',
  people: 'fitzgerald.people',
  verbs: 'fitzgerald.verbs',
  descriptors: 'fitzgerald.descriptors',
  social: 'fitzgerald.social',
};

const SECTION_ORDER: Record<AACBoardSection['placement'], number> = {
  top: 0,
  left: 1,
  main: 2,
  footer: 3,
};

const sortSections = (sections: AACBoardSection[]) =>
  [...sections].sort((first, second) => {
    const placementDiff = SECTION_ORDER[first.placement] - SECTION_ORDER[second.placement];
    if (placementDiff !== 0) {
      return placementDiff;
    }

    if (first.placement === 'main' && second.placement === 'main') {
      const firstIndex = MAIN_COLUMN_CATEGORIES.findIndex((category) => first.id.endsWith(category));
      const secondIndex = MAIN_COLUMN_CATEGORIES.findIndex((category) => second.id.endsWith(category));

      if (firstIndex !== -1 && secondIndex !== -1) {
        return firstIndex - secondIndex;
      }
    }

    return 0;
  });

export const ensureBoardFitzgeraldSections = (board: AACBoard): AACBoard => {
  const existingSections = board.sections ?? [];
  const assignedCellIds = new Set(existingSections.flatMap((section) => section.cellIds));
  const unassignedCells = board.cells.filter((cell) => !assignedCellIds.has(cell.id));

  if (unassignedCells.length === 0 && existingSections.length > 0) {
    return board;
  }

  const autoSections: AACBoardSection[] = [];

  const coreCellIds = unassignedCells
    .filter((cell) => cell.category === 'core')
    .map((cell) => cell.id);

  if (coreCellIds.length > 0) {
    autoSections.push({
      id: `auto-core-${board.id}`,
      titleKey: SECTION_TITLE_KEYS.core,
      placement: 'top',
      required: false,
      cellIds: coreCellIds,
    });
  }

  MAIN_COLUMN_CATEGORIES.forEach((category) => {
    const categoryCellIds = unassignedCells
      .filter((cell) => cell.category === category)
      .map((cell) => cell.id);

    if (categoryCellIds.length === 0) {
      return;
    }

    autoSections.push({
      id: `auto-${category}-${board.id}`,
      titleKey: SECTION_TITLE_KEYS[category],
      placement: 'main',
      required: false,
      cellIds: categoryCellIds,
    });
  });

  return {
    ...board,
    sections: sortSections([...existingSections, ...autoSections]),
  };
};

export const ensureBoardsFollowFitzgeraldLayout = (boards: Record<string, AACBoard>): Record<string, AACBoard> =>
  Object.fromEntries(
    Object.entries(boards).map(([boardId, board]) => [boardId, ensureBoardFitzgeraldSections(board)])
  );