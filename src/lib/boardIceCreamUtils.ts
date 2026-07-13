import { AACBoard, AACCell } from '@/types/aac';
import { BusinessType } from '@/data/businessBoards';

export type ManualIceCreamCellEntry = {
  boardId: string;
  cell: AACCell;
};

export type ManualIceCreamSections = {
  servingBoardId?: string;
  serving: ManualIceCreamCellEntry[];
  flavorsBoardId?: string;
  flavors: ManualIceCreamCellEntry[];
  toppingsBoardId?: string;
  toppings: ManualIceCreamCellEntry[];
  labels: {
    serving: string;
    flavors: string;
    toppings: string;
  };
};

const normalizeCategoryLabel = (value: string) => value.trim().replace(/[:：]/g, '').toLowerCase();

const matchesAnyLabel = (value: string, labels: string[]) => {
  const normalizedValue = normalizeCategoryLabel(value);
  return labels.some((label) => normalizedValue.includes(normalizeCategoryLabel(label)));
};

export const isBuiltInIceCreamBoardSet = (activeBoards: Record<string, AACBoard>) =>
  ['ice-cream-type', 'flavors-cup', 'flavors-cone'].every((boardId) => Boolean(activeBoards[boardId]));

export const buildInitialNavState = (
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
  rootBoardId: string,
) => {
  if (businessType !== 'iceCream' || !activeBoards['flavors-cup'] || !activeBoards['ice-cream-type']) {
    return {
      currentBoardId: rootBoardId,
      breadcrumbs: [] as Array<{ id: string; name: string; nameEn: string }>,
    };
  }

  const rootBoard = activeBoards[rootBoardId];
  const iceCreamTypeBoard = activeBoards['ice-cream-type'];

  return {
    currentBoardId: 'flavors-cup',
    breadcrumbs: [
      ...(rootBoard
        ? [{ id: rootBoard.id, name: rootBoard.name, nameEn: rootBoard.nameEn }]
        : []),
      {
        id: iceCreamTypeBoard.id,
        name: iceCreamTypeBoard.name,
        nameEn: iceCreamTypeBoard.nameEn,
      },
    ],
  };
};

export const deriveManualIceCreamSections = (
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
  currentBoard: AACBoard,
  currentBoardId: string,
  rootBoardId: string,
  language: string,
): ManualIceCreamSections | null => {
  if (businessType !== 'iceCream' || currentBoardId !== rootBoardId) {
    return null;
  }

  const linkedBoards = currentBoard.cells
    .filter((cell) => cell.linkToBoardId && activeBoards[cell.linkToBoardId])
    .map((cell) => {
      const linkedBoard = activeBoards[cell.linkToBoardId!];
      return {
        cell,
        board: linkedBoard,
        label: linkedBoard ? linkedBoard.name : cell.text,
      };
    });

  const servingSection = linkedBoards.find(({ label, cell }) =>
    matchesAnyLabel(label, ['איך תרצה', 'איך אתה רוצה', 'סוג הגשה', 'כמות', 'גביע', 'כוס'])
    || matchesAnyLabel(cell.text, ['איך תרצה', 'איך אתה רוצה', 'סוג הגשה', 'כמות', 'גביע', 'כוס']),
  );
  const flavorsSection = linkedBoards.find(({ label, cell }) =>
    matchesAnyLabel(label, ['טעמים', 'טעם', 'בחר טעם'])
    || matchesAnyLabel(cell.text, ['טעמים', 'טעם', 'בחר טעם']),
  );
  const toppingsSection = linkedBoards.find(({ label, cell }) =>
    matchesAnyLabel(label, ['תוספות', 'תוספת'])
    || matchesAnyLabel(cell.text, ['תוספות', 'תוספת']),
  );

  if (!servingSection && !flavorsSection && !toppingsSection) {
    return null;
  }

  return {
    servingBoardId: servingSection?.board.id,
    serving: servingSection
      ? servingSection.board.cells.map((cell) => ({ boardId: servingSection.board.id, cell }))
      : [],
    flavorsBoardId: flavorsSection?.board.id,
    flavors: flavorsSection
      ? flavorsSection.board.cells.map((cell) => ({ boardId: flavorsSection.board.id, cell }))
      : [],
    toppingsBoardId: toppingsSection?.board.id,
    toppings: toppingsSection
      ? toppingsSection.board.cells.map((cell) => ({ boardId: toppingsSection.board.id, cell }))
      : [],
    labels: {
      serving: servingSection?.label ?? (language === 'he' ? 'איך תרצה?' : 'How would you like it?'),
      flavors: flavorsSection?.label ?? (language === 'he' ? 'בחר טעם גלידה' : 'Choose a flavor'),
      toppings: toppingsSection?.label ?? (language === 'he' ? 'תוספות' : 'Toppings'),
    },
  };
};
