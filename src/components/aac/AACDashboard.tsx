import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AACBoard, AACCell, BoardNavigationState } from '@/types/aac';
import { AACCard } from './AACCard';
import { BoardTopNavigation } from './BoardTopNavigation';
import { PublicBoardPage } from './PublicBoardPage';
import { CoreCommunicationBarContext, SentenceSpeechContext, type CoreCommunicationAction } from './CoreActionsBar';
import { AIUploadPlaceholder } from './AIUploadPlaceholder';
import { BoardEditModal } from './BoardEditModal';
import { CustomerModeOverlay } from './CustomerModeOverlay';
import { VoiceSettingsModal } from '@/components/settings/VoiceSettingsModal';
import { GuestWatermark } from './GuestWatermark';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, ArrowRightCircle, Home, ChevronRight, Volume2, Trash2, Pencil, Plus, Check, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getBoardsForBusinessType, BusinessType } from '@/data/businessBoards';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClickSound } from '@/hooks/useClickSound';
import moreImage from '@/assets/aac-local/עוד.png';
import howMuchImage from '@/assets/aac-local/כמה עולה.png';
import wantImage from '@/assets/aac-local/אני רוצה.png';

const ROOT_WANT_ORDER_IMAGE_URL = '/aac-local/flavors/אני רוצה להזמין.png';
const ROOT_WANT_TASTE_IMAGE_URL = '/aac-local/flavors/לטעום.png';
const ROOT_HOW_MUCH_IMAGE_URL = '/aac-local/flavors/כמה עולה.png';
const ROOT_WANT_PAY_IMAGE_URL = '/aac-local/flavors/אני רוצה לשלם.png';
const ROOT_HELP_IMAGE_URL = '/aac-local/flavors/עזרה.png';

const utilityRailCells: AACCell[] = [
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
    icon: '',
  },
];

interface AACDashboardProps {
  boards?: Record<string, AACBoard>;
  rootBoardId?: string;
  showAIUpload?: boolean;
  className?: string;
  businessType?: BusinessType;
  allowEdit?: boolean;
  onBoardsChange?: (boards: Record<string, AACBoard>) => void;
}

type ManualIceCreamCellEntry = {
  boardId: string;
  cell: AACCell;
};

const buildInitialNavState = (
  _activeBoards: Record<string, AACBoard>,
  _businessType: BusinessType,
  rootBoardId: string,
): BoardNavigationState => ({
  currentBoardId: rootBoardId,
  breadcrumbs: [],
});

const isBuiltInIceCreamBoardSet = (activeBoards: Record<string, AACBoard>) =>
  ['ice-cream-type', 'flavors-cup', 'flavors-cone'].every((boardId) => Boolean(activeBoards[boardId]));

const normalizeCategoryLabel = (value: string) => value.trim().replace(/[:：]/g, '').toLowerCase();

const matchesAnyLabel = (value: string, labels: string[]) => {
  const normalizedValue = normalizeCategoryLabel(value);
  return labels.some((label) => normalizedValue.includes(normalizeCategoryLabel(label)));
};

const normalizeHebrewText = (value: string) =>
  value.trim().replace(/[?؟!.,:：'"]/g, '').toLowerCase();

const ICE_CREAM_FLAVOR_BOARD_IDS = new Set(['flavors-cup', 'flavors-cone']);
const FLAVOR_ACTION_MORE_ID = 'more-flavor';
const FLAVOR_ACTION_READY_ID = 'ready-to-order';

const isMilkshakeCell = (cell: AACCell) => {
  if (cell.id === 'milkshake') {
    return true;
  }

  return normalizeHebrewText(cell.text) === normalizeHebrewText('מילקשייק')
    || cell.textEn.trim().toLowerCase() === 'milkshake';
};

const getTakeAwayFlavorLimit = (cellId: string): number | null => {
  if (cellId === 'box-small') {
    return 3;
  }
  if (cellId === 'box-large') {
    return 4;
  }
  return null;
};

type RootCommunicationSlotSpec = {
  knownIds: string[];
  texts: string[];
  fallback: AACCell;
};

const ROOT_WANT_ORDER_FALLBACK_ID = 'ui-root-want-order';
const ROOT_HELP_FALLBACK_ID = 'ui-root-help';
const ROOT_WANT_TASTE_FALLBACK_ID = 'ui-root-want-taste';
const ROOT_WANT_PAY_FALLBACK_ID = 'ui-root-want-pay';
const ROOT_HELP_BOARD_ID = 'root-help-board';
const ROOT_TASTE_BOARD_ID = 'root-taste-board';
const ROOT_PAYMENT_BOARD_ID = 'root-payment-board';

const UI_ONLY_ROOT_BOARD_IDS = new Set([
  ROOT_HELP_BOARD_ID,
  ROOT_TASTE_BOARD_ID,
  ROOT_PAYMENT_BOARD_ID,
]);

const createUiOnlyRootFallbackBoards = (rootBoardId: string): Record<string, AACBoard> => ({
  [ROOT_HELP_BOARD_ID]: {
    id: ROOT_HELP_BOARD_ID,
    name: 'עזרה',
    nameEn: 'Help',
    parentBoardId: rootBoardId,
    cells: [
      {
        id: 'ui-help-staff',
        text: 'סליחה, אתה יכול לעזור לי?',
        textEn: 'Excuse me, can you help me?',
        category: 'social',
        icon: '🙋',
      },
      {
        id: 'ui-help-menu',
        text: 'איפה התפריט?',
        textEn: 'Where is the menu?',
        category: 'social',
        icon: '📋',
      },
      {
        id: 'ui-help-restroom',
        text: 'איפה השירותים?',
        textEn: 'Where is the restroom?',
        category: 'social',
        icon: '🚻',
      },
      {
        id: 'ui-help-allergy',
        text: 'יש לי אלרגיה',
        textEn: 'I have an allergy',
        category: 'social',
        icon: '⚠️',
      },
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  [ROOT_TASTE_BOARD_ID]: {
    id: ROOT_TASTE_BOARD_ID,
    name: 'לטעום',
    nameEn: 'Taste',
    parentBoardId: rootBoardId,
    cells: [
      {
        id: 'ui-taste-sample',
        text: 'אפשר לטעום?',
        textEn: 'Can I taste?',
        category: 'social',
        icon: '👅',
      },
      {
        id: 'ui-taste-small-piece',
        text: 'אפשר חתיכה קטנה?',
        textEn: 'Can I have a small piece?',
        category: 'social',
        icon: '🍽️',
      },
      {
        id: 'ui-taste-before-buy',
        text: 'אפשר לטעום לפני שאני קונה?',
        textEn: 'Can I taste before I buy?',
        category: 'social',
        icon: '🤔',
      },
      {
        id: 'ui-taste-which',
        text: 'מה אפשר לטעום?',
        textEn: 'What can I taste?',
        category: 'social',
        icon: '❓',
      },
    ],
    gridSize: { cols: 2, rows: 2 },
  },
  [ROOT_PAYMENT_BOARD_ID]: {
    id: ROOT_PAYMENT_BOARD_ID,
    name: 'לשלם',
    nameEn: 'Pay',
    parentBoardId: rootBoardId,
    cells: [
      {
        id: 'ui-pay-card',
        text: 'אני משלם באשראי',
        textEn: 'I pay by credit card',
        category: 'social',
        icon: '💳',
      },
      {
        id: 'ui-pay-cash',
        text: 'אני משלם במזומן',
        textEn: 'I pay cash',
        category: 'social',
        icon: '💵',
      },
      {
        id: 'ui-pay-app',
        text: 'אני משלם באפליקציה',
        textEn: 'I pay by phone app',
        category: 'social',
        icon: '📱',
      },
      {
        id: 'ui-pay-bill',
        text: 'אפשר את החשבון?',
        textEn: 'Can I have the bill?',
        category: 'social',
        icon: '🧾',
      },
    ],
    gridSize: { cols: 2, rows: 2 },
  },
});

const withUiOnlyRootFallbackBoards = (
  boards: Record<string, AACBoard>,
  rootBoardId: string,
): Record<string, AACBoard> => {
  const mergedBoards = { ...boards };
  const uiOnlyBoards = createUiOnlyRootFallbackBoards(rootBoardId);

  Object.entries(uiOnlyBoards).forEach(([boardId, board]) => {
    if (!mergedBoards[boardId]) {
      mergedBoards[boardId] = board;
    }
  });
  
  return mergedBoards;
};

const RUNTIME_ICE_CREAM_ENSURE_BOARD_IDS = [
  'ice-cream-type',
  'ice-cream-size-cup',
  'ice-cream-size-cone',
  'flavors-cup',
  'flavors-cone',
  'sorbet-type',
  'yogurt-type',
  'toppings',
  'cold-drinks',
  'hot-drinks',
  'desserts',
  'dessert-spreads',
  'alcoholic-flavors',
  'take-away',
  'help',
  'coffee-size',
  'coffee-type',
  'coffee-milk',
  'allergy-info',
  'allergy-more',
] as const;

const RUNTIME_ICE_CREAM_TEMPLATE_BOARD_IDS = [
  'ice-cream-type',
  'ice-cream-size-cup',
  'ice-cream-size-cone',
  'flavors-cup',
  'flavors-cone',
  'cold-drinks',
  'hot-drinks',
  'take-away',
  'desserts',
  'dessert-spreads',
  'toppings',
  'help',
] as const;

const RUNTIME_ICE_CREAM_ORDER_MENU_CARD_ORDER = [
  { cellId: 'ice-cream', hebrewText: 'גלידה', linkToBoardId: 'ice-cream-type' },
  { cellId: 'desserts', hebrewText: 'קינוחים', linkToBoardId: 'desserts' },
  { cellId: 'cold-drinks', hebrewText: 'שתייה קרה', linkToBoardId: 'cold-drinks' },
  { cellId: 'hot-drinks', hebrewText: 'שתייה חמה', linkToBoardId: 'hot-drinks' },
  { cellId: 'alcoholic-flavors', hebrewText: 'טעמים אלכוהוליים', linkToBoardId: 'alcoholic-flavors' },
  { cellId: 'take-away', hebrewText: 'לקחת הביתה', linkToBoardId: 'take-away' },
] as const;

const isSavedGenericCategoryBoardId = (boardId?: string) =>
  Boolean(boardId?.startsWith('category-'));

const findTemplateOrderCategoryCell = (
  templateBoards: Record<string, AACBoard>,
  cellId: string,
  hebrewText: string,
): AACCell | undefined => {
  const templateOrderMenu = templateBoards['order-menu'];
  const templateMain = templateBoards.main;
  const normalizedHebrew = normalizeHebrewText(hebrewText);

  const fromOrderMenu = templateOrderMenu?.cells.find(
    (cell) => cell.id === cellId || normalizeHebrewText(cell.text) === normalizedHebrew,
  );
  if (fromOrderMenu) {
    return fromOrderMenu;
  }

  return templateMain?.cells.find(
    (cell) => cell.id === cellId || normalizeHebrewText(cell.text) === normalizedHebrew,
  );
};

const buildRuntimeIceCreamOrderMenuBoard = (
  boards: Record<string, AACBoard>,
  templateBoards: Record<string, AACBoard>,
  rootBoardId: string,
): AACBoard | null => {
  const templateOrderMenu = templateBoards['order-menu'];
  const cells: AACCell[] = [];

  RUNTIME_ICE_CREAM_ORDER_MENU_CARD_ORDER.forEach(({ cellId, hebrewText, linkToBoardId }) => {
    if (isSavedGenericCategoryBoardId(linkToBoardId)) {
      return;
    }

    if (!boards[linkToBoardId] && !templateBoards[linkToBoardId]) {
      return;
    }

    const templateCell = findTemplateOrderCategoryCell(templateBoards, cellId, hebrewText);
    if (!templateCell) {
      return;
    }

    cells.push({
      ...templateCell,
      linkToBoardId,
    });
  });

  if (cells.length === 0) {
    return null;
  }

  return {
    id: 'order-menu',
    name: templateOrderMenu?.name ?? 'להזמין',
    nameEn: templateOrderMenu?.nameEn ?? 'Order',
    parentBoardId: rootBoardId,
    cells,
    gridSize: {
      cols: 2,
      rows: Math.max(1, Math.ceil(cells.length / 2)),
    },
  };
};

const injectMissingTemplateBoard = (
  mergedBoards: Record<string, AACBoard>,
  templateBoards: Record<string, AACBoard>,
  boardId: string,
) => {
  if (!mergedBoards[boardId] && templateBoards[boardId]) {
    mergedBoards[boardId] = templateBoards[boardId];
  }
};

const REQUIRED_PAYMENT_BILL_TEXTS = [
  'אפשר חשבון?',
  'קבלה בבקשה',
  'תשלום במזומן',
  'תשלום באשראי',
].map(normalizeHebrewText);

const implementsRequiredPaymentBillFlow = (board?: AACBoard) => {
  if (!board || board.id !== 'payment-bill') {
    return false;
  }

  const texts = new Set(board.cells.map((cell) => normalizeHebrewText(cell.text)));
  return REQUIRED_PAYMENT_BILL_TEXTS.every((text) => texts.has(text));
};

const ensureRuntimePaymentFlowBoards = (
  mergedBoards: Record<string, AACBoard>,
  templateBoards: Record<string, AACBoard>,
) => {
  const templateBill = templateBoards['payment-bill'];

  if (templateBill && !implementsRequiredPaymentBillFlow(mergedBoards['payment-bill'])) {
    mergedBoards['payment-bill'] = templateBill;
  }
};

const injectMissingTemplateBoardsForCells = (
  mergedBoards: Record<string, AACBoard>,
  templateBoards: Record<string, AACBoard>,
  cells: AACCell[],
) => {
  cells.forEach((cell) => {
    if (!cell.linkToBoardId) {
      return;
    }

    injectMissingTemplateBoard(mergedBoards, templateBoards, cell.linkToBoardId);
  });
};

const normalizeIceCreamServingCellLink = (
  cell: AACCell,
  targetBoardId: string,
  boards: Record<string, AACBoard>,
): AACCell => {
  if (cell.linkToBoardId && boards[cell.linkToBoardId]) {
    return cell;
  }

  return {
    ...cell,
    linkToBoardId: targetBoardId,
  };
};

const withRuntimeIceCreamOrderBoards = (
  boards: Record<string, AACBoard>,
  businessType: BusinessType,
  rootBoardId: string,
): Record<string, AACBoard> => {
  if (businessType !== 'iceCream') {
    return boards;
  }

  const mergedBoards = { ...boards };
  const templateBoards = getBoardsForBusinessType('iceCream');

  RUNTIME_ICE_CREAM_ENSURE_BOARD_IDS.forEach((boardId) => {
    injectMissingTemplateBoard(mergedBoards, templateBoards, boardId);
  });

  const runtimeOrderMenu = buildRuntimeIceCreamOrderMenuBoard(
    mergedBoards,
    templateBoards,
    rootBoardId,
  );
  if (runtimeOrderMenu) {
    mergedBoards['order-menu'] = runtimeOrderMenu;
    injectMissingTemplateBoardsForCells(mergedBoards, templateBoards, runtimeOrderMenu.cells);
  } else if (templateBoards['order-menu']) {
    mergedBoards['order-menu'] = {
      ...templateBoards['order-menu'],
      parentBoardId: rootBoardId,
      cells: templateBoards['order-menu'].cells
        .filter((cell) => !isSavedGenericCategoryBoardId(cell.linkToBoardId))
        .map((cell) =>
          normalizeHebrewText(cell.text) === normalizeHebrewText('גלידה')
            || cell.id === 'ice-cream'
            ? { ...cell, linkToBoardId: 'ice-cream-type' }
            : { ...cell },
        ),
    };
    injectMissingTemplateBoardsForCells(
      mergedBoards,
      templateBoards,
      mergedBoards['order-menu']?.cells ?? [],
    );
  }

  RUNTIME_ICE_CREAM_TEMPLATE_BOARD_IDS.forEach((boardId) => {
    const templateBoard = templateBoards[boardId];
    if (!templateBoard) {
      return;
    }

    mergedBoards[boardId] = templateBoard;
    injectMissingTemplateBoardsForCells(mergedBoards, templateBoards, templateBoard.cells);
  });

  ensureRuntimePaymentFlowBoards(mergedBoards, templateBoards);

  return mergedBoards;
};

const stripUiOnlyRootFallbackBoards = (boards: Record<string, AACBoard>) => {
  const persistableBoards = { ...boards };

  UI_ONLY_ROOT_BOARD_IDS.forEach((boardId) => {
    delete persistableBoards[boardId];
  });

  return persistableBoards;
};

const ensureNavigableRootCellLink = (
  cell: AACCell,
  activeBoards: Record<string, AACBoard>,
  preferredBoardIds: string[],
  uiFallbackBoardId: string,
): AACCell => {
  if (cell.linkToBoardId && activeBoards[cell.linkToBoardId]) {
    return cell;
  }

  const linkToBoardId =
    resolveLinkedBoardId(activeBoards, [...preferredBoardIds, uiFallbackBoardId]) ?? uiFallbackBoardId;

  return {
    ...cell,
    linkToBoardId,
  };
};

const findFirstCategoryBoardLink = (
  boardCells: AACCell[],
  activeBoards: Record<string, AACBoard>,
) => {
  const orderMenuCell = boardCells.find((cell) => cell.linkToBoardId === 'order-menu');
  if (orderMenuCell?.linkToBoardId && activeBoards[orderMenuCell.linkToBoardId]) {
    return orderMenuCell.linkToBoardId;
  }

  const linkedCell = boardCells.find(
    (cell) => cell.linkToBoardId && activeBoards[cell.linkToBoardId],
  );

  return linkedCell?.linkToBoardId;
};

const resolveLinkedBoardId = (
  activeBoards: Record<string, AACBoard>,
  candidateBoardIds: string[],
) => candidateBoardIds.find((boardId) => Boolean(activeBoards[boardId]));

const findRootCommunicationCell = (
  boardCells: AACCell[],
  spec: Pick<RootCommunicationSlotSpec, 'knownIds' | 'texts'>,
) => {
  for (const id of spec.knownIds) {
    const cellById = boardCells.find((cell) => cell.id === id);
    if (cellById) {
      return cellById;
    }
  }

  const normalizedTargets = new Set(spec.texts.map(normalizeHebrewText));
  return boardCells.find((cell) => normalizedTargets.has(normalizeHebrewText(cell.text)));
};

const buildRootWantOrderFallback = (
  boardCells: AACCell[],
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
): AACCell => {
  const linkToBoardId =
    (activeBoards['order-menu'] ? 'order-menu' : undefined)
    ?? findFirstCategoryBoardLink(boardCells, activeBoards);

  return {
    id: ROOT_WANT_ORDER_FALLBACK_ID,
    text: 'אני רוצה להזמין',
    textEn: 'I want to order',
    category: 'verbs',
    icon: '📝',
    imageUrl: businessType === 'iceCream' ? ROOT_WANT_ORDER_IMAGE_URL : wantImage,
    ...(linkToBoardId ? { linkToBoardId } : {}),
  };
};

const buildRootHelpFallback = (
  activeBoards: Record<string, AACBoard>,
): AACCell => {
  const linkToBoardId =
    resolveLinkedBoardId(activeBoards, ['help', 'staff', ROOT_HELP_BOARD_ID]) ?? ROOT_HELP_BOARD_ID;

  return {
    id: ROOT_HELP_FALLBACK_ID,
    text: 'עזרה',
    textEn: 'Help',
    category: 'social',
    icon: '🙋',
    linkToBoardId,
  };
};

const buildRootWantTasteFallback = (
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
): AACCell => {
  const preferredBoardIds =
    businessType === 'iceCream'
      ? ['flavors-cup', 'flavors-cone', 'taste-menu', 'taste', ROOT_TASTE_BOARD_ID]
      : ['taste-menu', 'taste', ROOT_TASTE_BOARD_ID];
  const linkToBoardId =
    resolveLinkedBoardId(activeBoards, preferredBoardIds)
    ?? (businessType === 'iceCream' ? 'flavors-cup' : ROOT_TASTE_BOARD_ID);

  return {
    id: ROOT_WANT_TASTE_FALLBACK_ID,
    text: 'אני רוצה לטעום',
    textEn: 'I want to taste',
    category: 'verbs',
    icon: '👅',
    ...(businessType === 'iceCream' ? { imageUrl: ROOT_WANT_TASTE_IMAGE_URL } : {}),
    linkToBoardId,
  };
};

const buildRootWantPayFallback = (
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
): AACCell => {
  const preferredBoardIds =
    businessType === 'iceCream'
      ? ['payment-bill', 'pay-menu', 'checkout', ROOT_PAYMENT_BOARD_ID]
      : ['pay-menu', 'checkout', 'payment-bill', ROOT_PAYMENT_BOARD_ID];
  const linkToBoardId =
    resolveLinkedBoardId(activeBoards, preferredBoardIds)
    ?? (businessType === 'iceCream' ? 'payment-bill' : ROOT_PAYMENT_BOARD_ID);

  return {
    id: ROOT_WANT_PAY_FALLBACK_ID,
    text: 'אני רוצה לשלם',
    textEn: 'I want to pay',
    category: 'social',
    icon: '',
    linkToBoardId,
  };
};

const buildRootCommunicationCells = (
  boardCells: AACCell[],
  activeBoards: Record<string, AACBoard>,
  businessType: BusinessType,
): AACCell[] => {
  const utilityPrice = utilityRailCells.find((cell) => cell.id === 'utility-price');
  const utilityThanks = utilityRailCells.find((cell) => cell.id === 'utility-thanks');

  if (!utilityPrice || !utilityThanks) {
    return [];
  }

  const wantOrderSpec: RootCommunicationSlotSpec = {
    knownIds: ['root-want-order', 'want-order', 'order'],
    texts: ['אני רוצה להזמין'],
    fallback: buildRootWantOrderFallback(boardCells, activeBoards, businessType),
  };
  const helpSpec: RootCommunicationSlotSpec = {
    knownIds: ['root-help', 'help'],
    texts: ['עזרה'],
    fallback: buildRootHelpFallback(activeBoards),
  };
  const wantTasteSpec: RootCommunicationSlotSpec =
    businessType === 'iceCream'
      ? {
          knownIds: ['root-want-taste', 'want-taste'],
          texts: ['אני רוצה לטעום'],
          fallback: buildRootWantTasteFallback(activeBoards, businessType),
        }
      : {
          knownIds: ['root-want-taste', 'want-taste', 'taste'],
          texts: ['אני רוצה לטעום', 'לטעום'],
          fallback: buildRootWantTasteFallback(activeBoards, businessType),
        };
  const wantPaySpec: RootCommunicationSlotSpec = {
    knownIds: ['root-want-pay', 'want-pay', 'bill', 'checkout'],
    texts: ['אני רוצה לשלם'],
    fallback: buildRootWantPayFallback(activeBoards, businessType),
  };

  const resolveSlot = (spec: RootCommunicationSlotSpec) =>
    findRootCommunicationCell(boardCells, spec) ?? spec.fallback;

  const wantOrderLinked = ensureNavigableRootCellLink(
    resolveSlot(wantOrderSpec),
    activeBoards,
    ['order-menu'],
    'order-menu',
  );
  const wantOrderCell: AACCell =
    businessType === 'iceCream'
      ? { ...wantOrderLinked, imageUrl: ROOT_WANT_ORDER_IMAGE_URL }
      : wantOrderLinked;
  const helpCell: AACCell = {
    ...ensureNavigableRootCellLink(
      resolveSlot(helpSpec),
      activeBoards,
      ['help', 'staff'],
      ROOT_HELP_BOARD_ID,
    ),
    imageUrl: ROOT_HELP_IMAGE_URL,
  };

  const wantTasteResolved = resolveSlot(wantTasteSpec);
  const iceCreamTastePreferred = ['flavors-cup', 'flavors-cone', 'taste-menu', 'taste'];
  const wantTasteCell: AACCell =
    businessType === 'iceCream'
      ? {
          ...wantTasteResolved,
          linkToBoardId:
            resolveLinkedBoardId(activeBoards, [...iceCreamTastePreferred, ROOT_TASTE_BOARD_ID])
            ?? 'flavors-cup',
          imageUrl: ROOT_WANT_TASTE_IMAGE_URL,
        }
      : ensureNavigableRootCellLink(
          wantTasteResolved,
          activeBoards,
          ['taste-menu', 'taste'],
          ROOT_TASTE_BOARD_ID,
        );

  const wantPayResolved = resolveSlot(wantPaySpec);
  const wantPayCell: AACCell =
    businessType === 'iceCream'
      ? {
          ...wantPayResolved,
          linkToBoardId:
            resolveLinkedBoardId(activeBoards, ['payment-bill', 'pay-menu', 'checkout', ROOT_PAYMENT_BOARD_ID])
            ?? 'payment-bill',
        }
      : ensureNavigableRootCellLink(
          wantPayResolved,
          activeBoards,
          ['pay-menu', 'checkout', 'payment-bill'],
          ROOT_PAYMENT_BOARD_ID,
        );

  // Root screen renders these six cells in a 2-column RTL grid: array order
  // [0,2,4] fills the right column and [1,3,5] fills the left column.
  // Colors reuse BoardCard's existing category palette (verbs/people = green,
  // descriptors = blue, social = white with a black border) instead of adding
  // a new styling mechanism.
  const priceCell: AACCell = {
    ...utilityPrice,
    category: 'descriptors',
    imageUrl: ROOT_HOW_MUCH_IMAGE_URL,
  };
  const payCell: AACCell = {
    ...wantPayCell,
    category: 'verbs',
    imageUrl: ROOT_WANT_PAY_IMAGE_URL,
  };

  return [
    wantOrderCell,
    priceCell,
    wantTasteCell,
    helpCell,
    payCell,
    utilityThanks,
  ];
};

export function AACDashboard({
  boards,
  rootBoardId = 'main',
  showAIUpload = true,
  className,
  businessType = 'cafe',
  allowEdit = false,
  onBoardsChange,
}: AACDashboardProps) {
  // Use provided boards or get boards based on business type
  const [localBoards, setLocalBoards] = useState<Record<string, AACBoard>>(() => {
    if (boards) return { ...boards };
    return { ...getBoardsForBusinessType(businessType) };
  });
  
  const activeBoards = useMemo(
    () => withUiOnlyRootFallbackBoards(
      withRuntimeIceCreamOrderBoards(localBoards, businessType, rootBoardId),
      rootBoardId,
    ),
    [localBoards, businessType, rootBoardId],
  );
  const { language, direction, t } = useLanguage();
  const { speak, isSpeaking, speakingCellId, isSupported } = useTextToSpeech();
  const { toast } = useToast();
  const { user, isGuest, signOut, loading: authLoading } = useAuth();
  const { playClickSound } = useClickSound();
  const navigate = useNavigate();
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const [navState, setNavState] = useState<BoardNavigationState>(() =>
    buildInitialNavState(localBoards, businessType, rootBoardId)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedOrderFlavors, setSelectedOrderFlavors] = useState<string[]>([]);
  const [takeAwayFlavorLimit, setTakeAwayFlavorLimit] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCell, setEditingCell] = useState<AACCell | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  
  // Customer Communication Mode
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<AACCell | null>(null);

  // Listening/playback mode: tapping an item only speaks it (no select/append/navigate)
  const [isListeningMode, setIsListeningMode] = useState(false);

  const currentBoard = activeBoards[navState.currentBoardId];

  const BackIcon = direction === 'rtl' ? ArrowRightCircle : ArrowLeftCircle;
  const contentDir = direction === 'rtl' ? 'rtl' : 'ltr';

  const handleSignOut = useCallback(async () => {
    const { error } = await signOut();

    if (error) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: language === 'he' ? 'להתראות!' : 'Goodbye!',
      description: language === 'he' ? 'התנתקת בהצלחה' : 'You have been signed out',
    });
    navigate('/');
  }, [language, navigate, signOut, toast]);

  useEffect(() => {
    const nextBoards = boards ? { ...boards } : { ...getBoardsForBusinessType(businessType) };
    setLocalBoards(nextBoards);

    setNavState((prev) => {
      if (nextBoards[prev.currentBoardId]) {
        return prev;
      }

      return buildInitialNavState(nextBoards, businessType, rootBoardId);
    });
  }, [boards, businessType, rootBoardId]);

  const updateBoards = useCallback((newBoards: Record<string, AACBoard>) => {
    const persistableBoards = stripUiOnlyRootFallbackBoards(newBoards);
    setLocalBoards(persistableBoards);
    onBoardsChange?.(persistableBoards);
  }, [onBoardsChange]);

  const navigateToBoard = useCallback((boardId: string) => {
    if (!activeBoards[boardId]) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setNavState(prev => ({
        currentBoardId: boardId,
        breadcrumbs: [
          ...prev.breadcrumbs,
          { 
            id: prev.currentBoardId, 
            name: activeBoards[prev.currentBoardId].name,
            nameEn: activeBoards[prev.currentBoardId].nameEn 
          }
        ],
      }));
      setIsTransitioning(false);
    }, 150);
  }, [activeBoards]);

  const navigateBack = useCallback(() => {
    if (navState.breadcrumbs.length === 0) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setNavState(prev => {
        const newBreadcrumbs = [...prev.breadcrumbs];
        const parentBoard = newBreadcrumbs.pop();
        return {
          currentBoardId: parentBoard?.id || rootBoardId,
          breadcrumbs: newBreadcrumbs,
        };
      });
      setTakeAwayFlavorLimit(null);
      setSelectedOrderFlavors([]);
      setIsTransitioning(false);
    }, 150);
  }, [navState.breadcrumbs, rootBoardId]);

  const navigateToBreadcrumb = useCallback((targetIndex: number) => {
    if (targetIndex === -1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setNavState({
          currentBoardId: rootBoardId,
          breadcrumbs: [],
        });
        setTakeAwayFlavorLimit(null);
        setSelectedOrderFlavors([]);
        setIsTransitioning(false);
      }, 150);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setNavState(prev => ({
        currentBoardId: prev.breadcrumbs[targetIndex].id,
        breadcrumbs: prev.breadcrumbs.slice(0, targetIndex),
      }));
      setIsTransitioning(false);
    }, 150);
  }, [rootBoardId]);

  const getSpokenCellText = useCallback((cell: AACCell) => {
    return language === 'he' || language === 'ar' ? cell.text : cell.textEn;
  }, [language]);

  const speakButtonLabel = useCallback((label: string, cellId?: string) => {
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      return;
    }

    if (!isSupported) {
      playClickSound();
    }
    speak(normalizedLabel, undefined, cellId);
  }, [isSupported, playClickSound, speak]);

  const runSpokenAction = useCallback((label: string, action: () => void, cellId?: string) => {
    speakButtonLabel(label, cellId);
    action();
  }, [speakButtonLabel]);

  // Audio preview: speaks the item's label without selecting it, navigating,
  // or adding it to the accumulated sentence.
  const handlePreviewCell = useCallback((cell: AACCell) => {
    speakButtonLabel(getSpokenCellText(cell), cell.id);
  }, [getSpokenCellText, speakButtonLabel]);

  const beginFlavorSelectionSession = useCallback((limit: number | null) => {
    setTakeAwayFlavorLimit(limit);
    setSelectedOrderFlavors([]);
  }, []);

  const handleCellClick = useCallback((cell: AACCell) => {
    if (isEditMode) return;
    const text = getSpokenCellText(cell);
    const currentBoardId = navState.currentBoardId;
    const onFlavorBoard = businessType === 'iceCream' && ICE_CREAM_FLAVOR_BOARD_IDS.has(currentBoardId);

    // Listening/playback mode: speak the label only - no selection, no sentence append, no navigation
    if (isListeningMode) {
      speakButtonLabel(text, cell.id);
      return;
    }

    // Customer Mode: Show enlarged cell with TTS
    if (isCustomerMode) {
      speakButtonLabel(text, cell.id);
      if (!cell.linkToBoardId) {
        setSelectedCell(cell);
        setSelectedWords((prev) => [...prev, text]);
      } else if (activeBoards[cell.linkToBoardId]) {
        navigateToBoard(cell.linkToBoardId);
      }
      return;
    }

    if (businessType === 'iceCream' && isMilkshakeCell(cell)) {
      speakButtonLabel(text, cell.id);
      setSelectedWords((prev) => [...prev, text]);
      beginFlavorSelectionSession(null);
      if (activeBoards['flavors-cup']) {
        navigateToBoard('flavors-cup');
      }
      return;
    }

    if (businessType === 'iceCream' && (cell.id === 'box-small' || cell.id === 'box-large')) {
      speakButtonLabel(text, cell.id);
      setSelectedWords((prev) => [...prev, text]);
      beginFlavorSelectionSession(getTakeAwayFlavorLimit(cell.id));
      if (cell.linkToBoardId && activeBoards[cell.linkToBoardId]) {
        navigateToBoard(cell.linkToBoardId);
      }
      return;
    }

    if (
      businessType === 'iceCream'
      && cell.linkToBoardId
      && ICE_CREAM_FLAVOR_BOARD_IDS.has(cell.linkToBoardId)
      && activeBoards[cell.linkToBoardId]
    ) {
      speakButtonLabel(text, cell.id);
      setSelectedWords((prev) => [...prev, text]);
      beginFlavorSelectionSession(null);
      navigateToBoard(cell.linkToBoardId);
      return;
    }

    if (onFlavorBoard) {
      if (cell.id === FLAVOR_ACTION_MORE_ID) {
        speakButtonLabel(text, cell.id);
        setSelectedWords((prev) => [...prev, text]);
        return;
      }

      if (cell.id === FLAVOR_ACTION_READY_ID) {
        speakButtonLabel(text, cell.id);
        setSelectedWords((prev) => [...prev, text]);
        if (activeBoards['toppings']) {
          navigateToBoard('toppings');
        }
        return;
      }

      if (takeAwayFlavorLimit != null && selectedOrderFlavors.length >= takeAwayFlavorLimit) {
        const limitMessage = takeAwayFlavorLimit === 3
          ? 'ניתן לבחור עד 3 טעמים בקופסא קטנה'
          : 'ניתן לבחור עד 4 טעמים בקופסא גדולה';
        toast({ title: limitMessage });
        speakButtonLabel(limitMessage);
        return;
      }

      speakButtonLabel(text, cell.id);
      setSelectedOrderFlavors((prev) => [...prev, cell.id]);
      setSelectedWords((prev) => [...prev, text]);
      return;
    }

    speakButtonLabel(text, cell.id);
    setSelectedWords((prev) => [...prev, text]);
    if (cell.linkToBoardId && activeBoards[cell.linkToBoardId]) {
      navigateToBoard(cell.linkToBoardId);
    }
  }, [
    activeBoards,
    beginFlavorSelectionSession,
    businessType,
    getSpokenCellText,
    isCustomerMode,
    isEditMode,
    isListeningMode,
    navState.currentBoardId,
    navigateToBoard,
    selectedOrderFlavors.length,
    speakButtonLabel,
    takeAwayFlavorLimit,
    toast,
  ]);

  const handleCoreWordClick = useCallback((word: { textKey: string }) => {
    const text = t(word.textKey);
    speakButtonLabel(text);
    setSelectedWords(prev => [...prev, text]);
  }, [t, speakButtonLabel]);

  const speakAndAddCommunicationWord = useCallback((word: string) => {
    runSpokenAction(word, () => setSelectedWords((prev) => [...prev, word]));
  }, [runSpokenAction]);

  const coreCommunicationActions = useMemo<CoreCommunicationAction[]>(
    () => [
      { key: 'yes', label: 'כן', onClick: () => speakAndAddCommunicationWord('כן') },
      { key: 'no', label: 'לא', onClick: () => speakAndAddCommunicationWord('לא') },
      { key: 'thanks', label: 'תודה', onClick: () => speakAndAddCommunicationWord('תודה') },
      { key: 'more', label: 'עוד', onClick: () => speakAndAddCommunicationWord('עוד') },
    ],
    [speakAndAddCommunicationWord],
  );

  const clearSelectedWords = useCallback(() => {
    setSelectedWords([]);
  }, []);

  const speakAllWords = useCallback(() => {
    if (selectedWords.length > 0) {
      speak(selectedWords.join(' '));
    }
  }, [selectedWords, speak]);

  const sentenceSpeechValue = useMemo(
    () => ({
      speakSentence: speakAllWords,
      canSpeak: selectedWords.length > 0,
      isSpeaking: Boolean(isSpeaking),
      isListeningMode,
    }),
    [isListeningMode, isSpeaking, selectedWords.length, speakAllWords],
  );

  // Edit mode handlers
  const handleDeleteCell = useCallback((cellId: string, targetBoardId?: string) => {
    const newBoards = { ...activeBoards };
    const boardId = targetBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    newBoards[boardId] = {
      ...board,
      cells: board.cells.filter(c => c.id !== cellId),
    };
    
    updateBoards(newBoards);
    toast({
      title: language === 'he' ? 'הפריט הוסר' : 'Item removed',
    });
  }, [activeBoards, navState.currentBoardId, updateBoards, toast, language]);

  const handleEditCell = useCallback((cell: AACCell, targetBoardId?: string) => {
    setEditingCell(cell);
    setEditingBoardId(targetBoardId ?? navState.currentBoardId);
    setShowAddModal(true);
  }, [navState.currentBoardId]);

  const openAddItemModal = useCallback((targetBoardId?: string) => {
    setEditingCell(null);
    setEditingBoardId(targetBoardId ?? navState.currentBoardId);
    setShowAddModal(true);
  }, [navState.currentBoardId]);

  const handleAddCell = useCallback((cellData: Omit<AACCell, 'id'>) => {
    const newBoards = { ...activeBoards };
    const boardId = editingBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    const newCell: AACCell = {
      ...cellData,
      id: `custom-${Date.now()}`,
    };

    newBoards[boardId] = {
      ...board,
      cells: [...board.cells, newCell],
    };
    
    updateBoards(newBoards);
    setEditingBoardId(null);
    toast({
      title: language === 'he' ? 'הפריט נוסף' : 'Item added',
    });
  }, [activeBoards, editingBoardId, navState.currentBoardId, updateBoards, toast, language]);

  const handleUpdateCell = useCallback((updatedCell: AACCell) => {
    const newBoards = { ...activeBoards };
    const boardId = editingBoardId ?? navState.currentBoardId;
    const board = newBoards[boardId];
    if (!board) return;

    newBoards[boardId] = {
      ...board,
      cells: board.cells.map(c => c.id === updatedCell.id ? updatedCell : c),
    };
    
    updateBoards(newBoards);
    setEditingCell(null);
    setEditingBoardId(null);
    toast({
      title: language === 'he' ? 'הפריט עודכן' : 'Item updated',
    });
  }, [activeBoards, editingBoardId, navState.currentBoardId, updateBoards, toast, language]);

  // Resolves the same "help" destination used by the root grid's own עזרה tile,
  // so the top-nav עזרה tab reaches the identical board regardless of which
  // screen the user is currently on (not gated to the root breadcrumb). Declared
  // above the `!currentBoard` early return below so this hook always runs.
  const topNavHelpCell = useMemo(() => {
    const helpSpec: Pick<RootCommunicationSlotSpec, 'knownIds' | 'texts'> = {
      knownIds: ['root-help', 'help'],
      texts: ['עזרה'],
    };
    const resolved = findRootCommunicationCell(currentBoard?.cells ?? [], helpSpec) ?? buildRootHelpFallback(activeBoards);
    return ensureNavigableRootCellLink(resolved, activeBoards, ['help', 'staff'], ROOT_HELP_BOARD_ID);
  }, [activeBoards, currentBoard?.cells]);

  // The hooks below were previously declared after the `!currentBoard` early
  // return, which violates react-hooks/rules-of-hooks (hooks would not run on
  // renders where the board isn't found). Hoisted above the return and guarded
  // with `currentBoard?.` so every render calls the same hooks in the same
  // order; their computed values are unused on the "board not found" render.
  const sortedCells = useMemo(() => {
    const categoryOrder: Record<AACCell['category'], number> = {
      people: 0,
      verbs: 1,
      descriptors: 2,
      social: 3,
    };

    return [...(currentBoard?.cells ?? [])].sort((first, second) => categoryOrder[first.category] - categoryOrder[second.category]);
  }, [currentBoard?.cells]);

  const currentBoardCells = currentBoard?.cells;
  const rootCommunicationCells = useMemo(() => {
    if (!currentBoardCells || navState.breadcrumbs.length !== 0) {
      return [];
    }

    return buildRootCommunicationCells(currentBoardCells, activeBoards, businessType);
  }, [activeBoards, businessType, currentBoardCells, navState.breadcrumbs.length]);

  const manualIceCreamSections = useMemo(() => {
    if (!currentBoardCells || businessType !== 'iceCream' || navState.currentBoardId !== rootBoardId) {
      return null;
    }

    const linkedBoards = currentBoardCells
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
      matchesAnyLabel(label, ['איך תרצה', 'איך אתה רוצה', 'סוג הגשה', 'כמות', 'גביע', 'כוס']) ||
      matchesAnyLabel(cell.text, ['איך תרצה', 'איך אתה רוצה', 'סוג הגשה', 'כמות', 'גביע', 'כוס'])
    );
    const flavorsSection = linkedBoards.find(({ label, cell }) =>
      matchesAnyLabel(label, ['טעמים', 'טעם', 'בחר טעם']) ||
      matchesAnyLabel(cell.text, ['טעמים', 'טעם', 'בחר טעם'])
    );
    const toppingsSection = linkedBoards.find(({ label, cell }) =>
      matchesAnyLabel(label, ['תוספות', 'תוספת']) ||
      matchesAnyLabel(cell.text, ['תוספות', 'תוספת'])
    );

    if (!servingSection && !flavorsSection && !toppingsSection) {
      return null;
    }

    return {
      servingBoardId: servingSection?.board.id,
      serving: servingSection ? servingSection.board.cells.map((cell) => ({ boardId: servingSection.board.id, cell })) : [],
      flavorsBoardId: flavorsSection?.board.id,
      flavors: flavorsSection ? flavorsSection.board.cells.map((cell) => ({ boardId: flavorsSection.board.id, cell })) : [],
      toppingsBoardId: toppingsSection?.board.id,
      toppings: toppingsSection ? toppingsSection.board.cells.map((cell) => ({ boardId: toppingsSection.board.id, cell })) : [],
      labels: {
        serving: servingSection?.label ?? (language === 'he' ? 'איך תרצה?' : 'How would you like it?'),
        flavors: flavorsSection?.label ?? (language === 'he' ? 'בחר טעם גלידה' : 'Choose a flavor'),
        toppings: toppingsSection?.label ?? (language === 'he' ? 'תוספות' : 'Toppings'),
      },
    };
  }, [activeBoards, businessType, currentBoardCells, language, navState.currentBoardId, rootBoardId]);

  const getCellLabel = useCallback((cell: AACCell) => (
    language === 'he' || language === 'ar' ? cell.text : cell.textEn
  ), [language]);

  if (!currentBoard) {
    return <div className="text-center text-muted-foreground">Board not found</div>;
  }

  const gridCols = currentBoard.gridSize.cols;
  const boardTypeIcon: Record<BusinessType, string> = {
    cafe: '☕',
    restaurant: '🍽️',
    bakery: '🥐',
    pizza: '🍕',
    supermarket: '🛒',
    pharmacy: '💊',
    iceCream: '🍦',
    laundromat: '🧺',
    partySupplies: '🎉',
    toyStore: '🧸',
    hairSalon: '💇',
    shoeStore: '👟',
    clothingStore: '👕',
  };

  const peopleCells = sortedCells.filter((cell) => cell.category === 'people');
  const verbCells = sortedCells.filter((cell) => cell.category === 'verbs');
  const descriptorCells = sortedCells.filter((cell) => cell.category === 'descriptors');
  const socialCells = sortedCells.filter((cell) => cell.category === 'social');

  const sideRailCells = utilityRailCells;
  const extraSocialCells = socialCells.filter(
    (cell) => !utilityRailCells.some((utilityCell) => utilityCell.text === cell.text || utilityCell.textEn === cell.textEn)
  ).slice(0, 4);
  const infoStripCells = [...descriptorCells, ...verbCells].slice(0, 3);
  const rootPublicGridCols = Math.min(2, Math.max(1, rootCommunicationCells.length));

  const featuredCellIds = new Set([...socialCells, ...infoStripCells].map((cell) => cell.id));
  const mainGridCells = peopleCells.length > 0 ? peopleCells : sortedCells.filter((cell) => !featuredCellIds.has(cell.id));
  const displayGridCells = mainGridCells.length > 0 ? mainGridCells : sortedCells;
  const effectiveGridCols = Math.min(5, Math.max(2, displayGridCells.length >= 10 ? 5 : displayGridCells.length >= 8 ? 4 : displayGridCells.length || 2));
  const boardTitle = language === 'he' || language === 'ar' ? currentBoard.name : currentBoard.nameEn;
  const showMockupSideRail = sideRailCells.length > 0;
  const boardEmoji = boardTypeIcon[businessType] || '🗂️';
  const selectionSummary = selectedWords.length > 0
    ? selectedWords.join(' ')
    : infoStripCells[0]
      ? (language === 'he' || language === 'ar' ? infoStripCells[0].text : infoStripCells[0].textEn)
      : language === 'he'
        ? 'בחירה נוספת'
        : 'Another choice';
  const useIceCreamReferenceLayout =
    businessType === 'iceCream' &&
    isBuiltInIceCreamBoardSet(activeBoards) &&
    ['flavors-cup', 'flavors-cone'].includes(navState.currentBoardId);
  const useManualIceCreamLayout = businessType === 'iceCream' && Boolean(manualIceCreamSections);
  const useIceCreamLayout = useIceCreamReferenceLayout || useManualIceCreamLayout;
  const iceCreamPrompt = language === 'he' ? 'בחר טעם גלידה' : 'Choose Ice Cream Flavor';
  const iceCreamTitle = boardTitle || (language === 'he' ? 'גלידריה' : 'Ice Cream Shop');
  const iceCreamFlavorCards = displayGridCells.slice(0, 15);
  const iceCreamRailVisuals: Record<string, { center?: string }> = {
    'utility-yes': { center: '✅' },
    'utility-no': { center: '❌' },
  };
  const utilityRailImageVisuals: Record<string, { src: string; className?: string }> = {
    'utility-want': { src: wantImage, className: 'scale-[1.18]' },
    'utility-more': { src: moreImage, className: 'scale-[1.18]' },
    'utility-thanks': { src: '/aac-local/תודה.png', className: 'scale-[1.15]' },
    'utility-price': { src: howMuchImage, className: 'scale-[1.2]' },
    [ROOT_WANT_ORDER_FALLBACK_ID]: { src: ROOT_WANT_ORDER_IMAGE_URL, className: 'scale-[1.18]' },
    [ROOT_WANT_TASTE_FALLBACK_ID]: { src: ROOT_WANT_TASTE_IMAGE_URL, className: 'scale-[1.18]' },
  };
  const getUtilityRailImageSrc = (cell: AACCell) => utilityRailImageVisuals[cell.id]?.src ?? cell.imageUrl;
  const isAtRoot = navState.breadcrumbs.length === 0;
  const isPublicNestedBoardView = !isAtRoot && (businessType !== 'iceCream' ? !useIceCreamLayout : true);
  const showPublicBoardChrome = isAtRoot || isPublicNestedBoardView;
  const publicBoardPageLabels = {
    delete: language === 'he' ? 'מחק' : 'Delete',
    speak: language === 'he' ? 'השמע' : 'Speak',
    talk: language === 'he' ? 'דבר' : 'Talk',
    back: language === 'he' ? 'חזור' : 'Back',
    home: language === 'he' ? 'דף ראשי' : 'Home',
    doneChoosing: language === 'he' ? 'סיימתי לבחור' : 'Done choosing',
    moreMessages: language === 'he' ? 'עוד מסרים' : 'More messages',
  };

  const iceCreamCategoryButtons = [
    {
      id: 'toppings',
      label: language === 'he' ? 'תוספות' : 'Toppings',
      icon: '🌈',
      onClick: () => runSpokenAction(language === 'he' ? 'תוספות' : 'Toppings', () => navigateToBoard('toppings')),
    },
    {
      id: 'quantity',
      label: language === 'he' ? 'כמות' : 'Quantity',
      icon: '🍦🍦🍦',
      onClick: () => runSpokenAction(language === 'he' ? 'כמות' : 'Quantity', () => navigateToBreadcrumb(0)),
    },
    {
      id: 'flavors',
      label: language === 'he' ? 'טעמים' : 'Flavors',
      icon: '🍨',
      onClick: () => runSpokenAction(
        language === 'he' ? 'טעמים' : 'Flavors',
        () => navigateToBoard(navState.currentBoardId.includes('cone') ? 'flavors-cone' : 'flavors-cup'),
      ),
    },
  ];

  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-hidden bg-[#eef2f8] text-base', className)}>
      {/* Top Bar */}
      {showPublicBoardChrome && (
      <BoardTopNavigation
        backLabel={t('aac.back')}
        backIcon={BackIcon}
        homeLabel={t('nav.home')}
        dashboardLabel={t('nav.dashboard')}
        createLabel={t('nav.create')}
        breadcrumbs={navState.breadcrumbs}
        currentBoardName={boardTitle}
        language={language}
        isCustomerMode={isCustomerMode}
        isEditMode={isEditMode}
        isListeningMode={isListeningMode}
        allowEdit={allowEdit}
        authLoading={authLoading}
        userEmail={user?.email}
        isGuest={isGuest}
        guestLabel={language === 'he' ? 'אורח' : 'Guest'}
        signOutLabel={language === 'he' ? 'התנתק' : 'Sign Out'}
        voiceSettingsLabel={language === 'he' ? 'הגדרות קול' : 'Voice Settings'}
        customerModeOnLabel={language === 'he' ? 'צא ממצב לקוח' : 'Exit Customer Mode'}
        customerModeOffLabel={language === 'he' ? 'אני רוצה לדבר' : 'I Want To Talk'}
        editOnLabel={language === 'he' ? 'סיום עריכה' : 'Done'}
        editOffLabel={language === 'he' ? 'עריכה' : 'Edit'}
        listeningModeOnLabel={language === 'he' ? 'מצב השמעה' : 'Listening Mode'}
        listeningModeOffLabel={language === 'he' ? 'מצב השמעה' : 'Listening Mode'}
        keyboardLabel={language === 'he' ? 'מקלדת' : 'Keyboard'}
        helpLabel={language === 'he' ? 'עזרה' : 'Help'}
        onKeyboard={() => runSpokenAction(language === 'he' ? 'מקלדת' : 'Keyboard', () => {})}
        onHelp={() => runSpokenAction(
          getSpokenCellText(topNavHelpCell),
          () => {
            if (topNavHelpCell.linkToBoardId && activeBoards[topNavHelpCell.linkToBoardId]) {
              navigateToBoard(topNavHelpCell.linkToBoardId);
            }
          },
        )}
        onBack={() => runSpokenAction(t('aac.back'), navigateBack)}
        onBreadcrumb={(index) => runSpokenAction(
          language === 'he' || language === 'ar' ? navState.breadcrumbs[index].name : navState.breadcrumbs[index].nameEn,
          () => navigateToBreadcrumb(index),
        )}
        onHome={() => runSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', () => navigateToBreadcrumb(-1))}
        onToggleCustomerMode={() => runSpokenAction(
          isCustomerMode
            ? (language === 'he' ? 'צא ממצב לקוח' : 'Exit Customer Mode')
            : (language === 'he' ? 'אני רוצה לדבר' : 'I Want To Talk'),
          () => {
            setIsCustomerMode(!isCustomerMode);
            if (isEditMode) setIsEditMode(false);
            if (isListeningMode) setIsListeningMode(false);
          },
        )}
        onToggleEditMode={() => runSpokenAction(
          isEditMode
            ? (language === 'he' ? 'סיום עריכה' : 'Done')
            : (language === 'he' ? 'עריכה' : 'Edit'),
          () => setIsEditMode(!isEditMode),
        )}
        onToggleListeningMode={() => runSpokenAction(
          language === 'he' ? 'מצב השמעה' : 'Listening Mode',
          () => {
            setIsListeningMode((prev) => !prev);
            if (isEditMode) setIsEditMode(false);
            if (isCustomerMode) setIsCustomerMode(false);
          },
        )}
        onVoiceSettings={() => runSpokenAction(language === 'he' ? 'הגדרות קול' : 'Voice Settings', () => setShowVoiceSettings(true))}
        onSignOut={() => runSpokenAction(language === 'he' ? 'התנתק' : 'Sign Out', () => { void handleSignOut(); })}
        isRootView={isAtRoot}
      />
      )}

      {/* Customer Mode Indicator Bar */}
      {isCustomerMode && !isEditMode && showPublicBoardChrome && (
        <div className="flex items-center justify-center gap-2 border-b border-green-600/30 bg-green-600/20 px-3 py-2">
          <MessageCircle className="h-5 w-5 text-green-700" />
          <p className="text-sm text-green-800 dark:text-green-300 font-medium">
            {language === 'he' 
              ? '🎯 מצב לקוח: לחץ על פריט כדי להציג ולהקריא אותו' 
              : '🎯 Customer Mode: Tap an item to display and speak it'}
          </p>
        </div>
      )}

      {/* Edit Mode Bar */}
      {isEditMode && showPublicBoardChrome && (
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary/10 px-3 py-2">
          <p className="text-sm text-primary font-medium">
            {language === 'he' 
              ? '🛠️ מצב עריכה: לחץ על פריט לעריכה, או על ה-X למחיקה' 
              : '🛠️ Edit mode: Click item to edit, or X to delete'}
          </p>
          <Button
            size="sm"
            onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal())}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'he' ? 'הוסף פריט' : 'Add Item'}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main
          className={cn(
            'min-h-0 flex-1 overflow-x-hidden overflow-y-auto',
            showPublicBoardChrome
              ? 'bg-white p-0 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]'
              : 'p-2 pb-4 md:p-3 md:pb-6',
          )}
        >
          {showMockupSideRail && !useIceCreamLayout && !isAtRoot && !isPublicNestedBoardView && (
            <div className="sticky top-0 z-20 -mx-2 mb-3 border-b border-slate-200 bg-[#eef2f8]/95 px-2 py-2 backdrop-blur lg:hidden md:-mx-3 md:px-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sideRailCells.map((cell) => (
                  <button
                    key={`mobile-${cell.id}`}
                    type="button"
                    onClick={() => handleCellClick(cell)}
                    className={cn(
                      'flex h-[86px] min-w-[76px] shrink-0 flex-col items-center justify-start gap-1 rounded-[16px] border-[2px] border-[#cad3e4] bg-white px-1.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_2px_6px_rgba(15,23,42,0.06)]',
                      speakingCellId === cell.id && 'ring-2 ring-primary shadow-lg shadow-primary/20'
                    )}
                    aria-label={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                  >
                    <span className="line-clamp-2 min-h-[1.6rem] text-[0.78rem] font-extrabold leading-tight text-slate-800">
                      {language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                    </span>
                    <div className="mt-0 flex h-[2.2rem] w-full items-center justify-center overflow-hidden">
                      {utilityRailImageVisuals[cell.id] ? (
                        <img
                          src={getUtilityRailImageSrc(cell)}
                          alt=""
                          aria-hidden="true"
                          className="max-h-full w-auto object-contain"
                        />
                      ) : (
                        <span
                          className={cn(
                            'leading-none',
                            cell.id === 'utility-question' ? 'text-[1.5rem]' : 'text-[1.3rem]'
                          )}
                          aria-hidden="true"
                        >
                          {cell.icon}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isAtRoot || isPublicNestedBoardView ? (
            <CoreCommunicationBarContext.Provider value={coreCommunicationActions}>
            <SentenceSpeechContext.Provider value={sentenceSpeechValue}>
              {isAtRoot ? (
            <PublicBoardPage
              title={boardTitle}
              boardEmoji={boardEmoji}
              prompt={language === 'he' ? 'בחר אפשרות' : 'Choose an option'}
              gridCells={rootCommunicationCells}
              isRootView={isAtRoot}
              infoStripCells={[]}
              sideRailCells={[]}
              extraSocialCells={[]}
              gridCols={rootPublicGridCols}
              contentDir={contentDir}
              language={language}
              selectionSummary={selectionSummary}
              selectedWordsCount={selectedWords.length}
              isTransitioning={isTransitioning}
              isEditMode={isEditMode}
              isSpeaking={isSpeaking}
              isCustomerMode={isCustomerMode}
              speakingCellId={speakingCellId}
              showAIUpload={showAIUpload && navState.currentBoardId === rootBoardId}
              backIcon={BackIcon}
              canGoBack={navState.breadcrumbs.length > 0}
              labels={publicBoardPageLabels}
              getCellLabel={getCellLabel}
              getUtilityRailImageSrc={getUtilityRailImageSrc}
              onCellClick={handleCellClick}
              onDeleteCell={handleDeleteCell}
              onEditCell={handleEditCell}
              onPreviewCell={handlePreviewCell}
              onClearSelection={() => runSpokenAction(language === 'he' ? 'מחק' : 'Delete', clearSelectedWords)}
              onSpeakSelection={speakAllWords}
              onToggleCustomerMode={() => runSpokenAction(language === 'he' ? 'דבר' : 'Talk', () => setIsCustomerMode((prev) => !prev))}
              onBack={() => runSpokenAction(language === 'he' ? 'חזור' : 'Back', navigateBack)}
              onHome={() => runSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', () => navigateToBreadcrumb(-1))}
              onDoneChoosing={speakAllWords}
              onUpload={(file) => console.log('File uploaded for AI processing:', file.name)}
            />
              ) : (
            <PublicBoardPage
              title={boardTitle}
              boardEmoji={boardEmoji}
              prompt={language === 'he' ? 'בחר אפשרות' : 'Choose an option'}
              gridCells={currentBoard.cells}
              infoStripCells={[]}
              sideRailCells={[]}
              extraSocialCells={[]}
              gridCols={2}
              contentDir={contentDir}
              language={language}
              selectionSummary={selectionSummary}
              selectedWordsCount={selectedWords.length}
              isTransitioning={isTransitioning}
              isEditMode={isEditMode}
              isSpeaking={isSpeaking}
              isCustomerMode={isCustomerMode}
              speakingCellId={speakingCellId}
              showAIUpload={false}
              backIcon={BackIcon}
              canGoBack
              labels={publicBoardPageLabels}
              getCellLabel={getCellLabel}
              getUtilityRailImageSrc={getUtilityRailImageSrc}
              onCellClick={handleCellClick}
              onDeleteCell={handleDeleteCell}
              onEditCell={handleEditCell}
              onPreviewCell={handlePreviewCell}
              onClearSelection={() => runSpokenAction(language === 'he' ? 'מחק' : 'Delete', clearSelectedWords)}
              onSpeakSelection={speakAllWords}
              onToggleCustomerMode={() => runSpokenAction(language === 'he' ? 'דבר' : 'Talk', () => setIsCustomerMode((prev) => !prev))}
              onBack={() => runSpokenAction(language === 'he' ? 'חזור' : 'Back', navigateBack)}
              onHome={() => runSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', () => navigateToBreadcrumb(-1))}
              onDoneChoosing={speakAllWords}
            />
              )}
            </SentenceSpeechContext.Provider>
            </CoreCommunicationBarContext.Provider>
          ) : (
            <div className="mx-auto max-w-[1020px] rounded-[30px] border-[3px] border-[#30497a] bg-[#f7f7f2] p-3 shadow-[0_18px_45px_rgba(48,73,122,0.14)]">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_112px]" style={{ direction: 'ltr' }}>
                <section className="space-y-3" dir={contentDir}>
                  {allowEdit && (
                    <div className="flex items-center justify-end gap-2 rounded-[16px] border-[2px] border-[#c8d1e0] bg-white/95 px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
                      <Button
                        variant={isEditMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => runSpokenAction(
                          isEditMode
                            ? (language === 'he' ? 'סיום עריכה' : 'Done')
                            : (language === 'he' ? 'עריכה' : 'Edit'),
                          () => setIsEditMode(!isEditMode),
                        )}
                        className="gap-2"
                      >
                        {isEditMode ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                        {isEditMode ? (language === 'he' ? 'סיום עריכה' : 'Done') : (language === 'he' ? 'עריכה' : 'Edit')}
                      </Button>
                      {isEditMode && !useManualIceCreamLayout && (
                        <Button
                          size="sm"
                          onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal())}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                        </Button>
                      )}
                    </div>
                  )}

                  {isEditMode && (
                    <div className="rounded-[16px] border-[2px] border-primary/20 bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
                      {language === 'he'
                        ? '🛠️ מצב עריכה: לחץ על פריט כדי לערוך או למחוק אותו'
                        : '🛠️ Edit mode: tap an item to edit or delete it'}
                    </div>
                  )}

                  <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src="/aac-local/ice-cream.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-16 w-16 object-contain"
                      />
                      <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-[3.35rem]">
                        {iceCreamTitle}
                      </h1>
                    </div>
                  </div>

                  {useManualIceCreamLayout && manualIceCreamSections ? (
                    <>
                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.serving}
                          </h2>
                          {isEditMode && manualIceCreamSections.servingBoardId && (
                            <Button
                              size="sm"
                              onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal(manualIceCreamSections.servingBoardId))}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                            </Button>
                          )}
                        </div>

                        <div className={cn('grid gap-3', manualIceCreamSections.serving.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                          {manualIceCreamSections.serving.map(({ boardId, cell }: ManualIceCreamCellEntry) => (
                            <AACCard
                              key={cell.id}
                              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                              imageSearchTerms={[cell.text, cell.textEn]}
                              category={cell.category}
                              icon={cell.icon}
                              imageUrl={cell.imageUrl}
                              isFolder={false}
                              onClick={() => handleCellClick(cell)}
                              size="lg"
                              variant="mockup"
                              labelPosition="top"
                              isEditMode={isEditMode}
                              isSpeaking={speakingCellId === cell.id}
                              onDelete={() => handleDeleteCell(cell.id, boardId)}
                              onEdit={() => handleEditCell(cell, boardId)}
                              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.flavors}
                          </h2>
                          {isEditMode && manualIceCreamSections.flavorsBoardId && (
                            <Button
                              size="sm"
                              onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal(manualIceCreamSections.flavorsBoardId))}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                            </Button>
                          )}
                        </div>

                        <div className="max-h-[min(56vh,34rem)] overflow-y-auto pe-1">
                          <div className="grid grid-cols-3 gap-4 md:gap-5">
                          {manualIceCreamSections.flavors.map(({ boardId, cell }: ManualIceCreamCellEntry) => {
                            const normalizedFlavorText = `${cell.text ?? ''} ${cell.textEn ?? ''}`.toLowerCase();
                            const shouldEmphasizeFlavorImage = normalizedFlavorText.includes('תות')
                              || normalizedFlavorText.includes('strawberry')
                              || normalizedFlavorText.includes('גלידת וניל')
                              || normalizedFlavorText.includes('vanilla');

                            return (
                            <AACCard
                              key={cell.id}
                              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                              imageSearchTerms={[cell.text, cell.textEn]}
                              category={cell.category}
                              icon={cell.icon}
                              imageUrl={cell.imageUrl}
                              isFolder={false}
                              onClick={() => handleCellClick(cell)}
                              size="lg"
                              variant="mockup"
                              labelPosition="top"
                              isEditMode={isEditMode}
                              isSpeaking={speakingCellId === cell.id}
                              onDelete={() => handleDeleteCell(cell.id, boardId)}
                              onEdit={() => handleEditCell(cell, boardId)}
                              className="h-[112px] min-h-[112px] gap-1.5 rounded-[14px] border-[2px] border-[#efcf63] px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:h-[118px] md:min-h-[118px]"
                              labelClassName="min-h-[1.45rem] text-[0.8rem] md:min-h-[1.55rem] md:text-[0.88rem]"
                              imageContainerClassName="min-h-0 px-0 py-0"
                              imageClassName={cn(
                                'h-[84%] w-[84%] max-h-none max-w-none !scale-[1.0] -translate-y-[18%]',
                                shouldEmphasizeFlavorImage && '!scale-[2.07] -translate-y-[20%]'
                              )}
                            />
                            );
                          })}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                            {manualIceCreamSections.labels.toppings}
                          </h2>
                          {isEditMode && manualIceCreamSections.toppingsBoardId && (
                            <Button
                              size="sm"
                              onClick={() => runSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => openAddItemModal(manualIceCreamSections.toppingsBoardId))}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {language === 'he' ? 'הוסף פריט' : 'Add Item'}
                            </Button>
                          )}
                        </div>

                        <div className={cn('grid gap-3', manualIceCreamSections.toppings.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                          {manualIceCreamSections.toppings.map(({ boardId, cell }: ManualIceCreamCellEntry) => (
                            <AACCard
                              key={cell.id}
                              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                              imageSearchTerms={[cell.text, cell.textEn]}
                              category={cell.category}
                              icon={cell.icon}
                              imageUrl={cell.imageUrl}
                              isFolder={false}
                              onClick={() => handleCellClick(cell)}
                              size="lg"
                              variant="mockup"
                              labelPosition="top"
                              isEditMode={isEditMode}
                              isSpeaking={speakingCellId === cell.id}
                              onDelete={() => handleDeleteCell(cell.id, boardId)}
                              onEdit={() => handleEditCell(cell, boardId)}
                              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                      <div className="mb-3 text-center">
                        <h2 className="text-[1.85rem] font-extrabold text-slate-900">
                          {iceCreamPrompt}
                        </h2>
                      </div>

                      <div className="grid grid-cols-5 gap-2.5 md:gap-3">
                        {iceCreamFlavorCards.map((cell) => (
                          <AACCard
                            key={cell.id}
                            text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                            imageSearchTerms={[cell.text, cell.textEn]}
                            category={cell.category}
                            icon={cell.icon}
                            imageUrl={cell.imageUrl}
                            isFolder={false}
                            onClick={() => handleCellClick(cell)}
                            size="lg"
                            variant="mockup"
                            labelPosition="top"
                            isEditMode={isEditMode}
                            isSpeaking={speakingCellId === cell.id}
                            onDelete={() => handleDeleteCell(cell.id)}
                            onEdit={() => handleEditCell(cell)}
                            className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                    <div className="mt-3 grid gap-2.5 md:grid-cols-[1fr_1.45fr]">
                      <button
                        type="button"
                        onClick={() => runSpokenAction(language === 'he' ? 'טעם אחר' : 'Another flavor', clearSelectedWords)}
                        className="flex min-h-[62px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] px-4 text-xl font-bold text-slate-800"
                      >
                        <span>{language === 'he' ? 'טעם אחר' : 'Another flavor'}</span>
                        <span className="text-3xl" aria-hidden="true">❔</span>
                      </button>
                      <button
                        type="button"
                        onClick={selectedWords.length > 0 ? () => runSpokenAction(language === 'he' ? 'סיימתי לבחור' : 'Done choosing', speakAllWords) : undefined}
                        className="flex min-h-[62px] items-center justify-center gap-3 rounded-[12px] border-[2.5px] border-[#baa6dd] bg-[linear-gradient(180deg,#eee2fb_0%,#dac9f4_100%)] px-4 text-xl font-extrabold text-slate-800"
                      >
                        <span>{language === 'he' ? 'סיימתי לבחור' : 'Done choosing'}</span>
                        <Check className="h-8 w-8 text-emerald-600" />
                      </button>
                    </div>
                  

                  {!useManualIceCreamLayout && (
                    <div className="grid gap-2.5 md:grid-cols-3">
                      {iceCreamCategoryButtons.map((button) => (
                        <button
                          key={button.id}
                          type="button"
                          onClick={button.onClick}
                          className="flex min-h-[74px] flex-col items-center justify-center rounded-[16px] border-[2.5px] border-[#c6cfdd] bg-white px-4 py-2 text-lg font-bold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                        >
                          <span className="mb-1">{button.label}</span>
                          <span className="text-[2rem] leading-none" aria-hidden="true">{button.icon}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-2.5 md:grid-cols-5">
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'מחק' : 'Delete', clearSelectedWords)}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Trash2 className="h-8 w-8" />
                      <span>{language === 'he' ? 'מחק' : 'Delete'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={selectedWords.length > 0 ? () => runSpokenAction(language === 'he' ? 'כן' : 'Yes', speakAllWords) : undefined}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Check className="h-9 w-9 text-emerald-600" />
                      <span>{language === 'he' ? 'כן' : 'Yes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'לא' : 'No', clearSelectedWords)}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <X className="h-9 w-9 text-rose-500" />
                      <span>{language === 'he' ? 'לא' : 'No'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'חזור' : 'Back', navigateBack)}
                      disabled={navState.breadcrumbs.length === 0}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] disabled:opacity-50"
                    >
                      <BackIcon className="h-9 w-9" />
                      <span>{language === 'he' ? 'חזור' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runSpokenAction(language === 'he' ? 'דף ראשי' : 'Home', () => navigateToBreadcrumb(-1))}
                      className="flex min-h-[74px] flex-col items-center justify-center gap-1 rounded-[16px] border-[2.5px] border-[#c8d1e0] bg-white px-3 py-2 text-base font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]"
                    >
                      <Home className="h-9 w-9" />
                      <span>{language === 'he' ? 'דף ראשי' : 'Home'}</span>
                    </button>
                  </div>
                </section>

                <aside className="grid h-[min(56vh,34rem)] grid-rows-4 gap-4 self-start pe-1" dir={contentDir}>
                  {sideRailCells.map((cell) => {
                    const visual = iceCreamRailVisuals[cell.id] ?? { center: cell.icon };

                    return (
                      <button
                        key={cell.id}
                        type="button"
                        onClick={() => handleCellClick(cell)}
                        className={cn(
                          'flex h-full min-h-0 flex-col items-center justify-start gap-1 rounded-[14px] border-[2px] border-[#c6cfdd] bg-white px-1.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]',
                          speakingCellId === cell.id && 'ring-4 ring-primary shadow-lg shadow-primary/20'
                        )}
                      >
                        <span className="text-[0.78rem] font-extrabold leading-tight text-slate-900">
                          {language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                        </span>

                        <div className="mt-0 flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden">
                          {utilityRailImageVisuals[cell.id] ? (
                            <img
                              src={utilityRailImageVisuals[cell.id].src}
                              alt=""
                              aria-hidden="true"
                              className={cn('h-full w-full max-h-none max-w-none object-contain', utilityRailImageVisuals[cell.id].className)}
                            />
                          ) : (
                            <span className={cn(
                              'leading-none',
                              cell.id === 'utility-question' ? 'text-[1.5rem]' : 'text-[1.35rem]'
                            )} aria-hidden="true">
                              {visual.center}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </aside>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      <BoardEditModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCell(null);
          setEditingBoardId(null);
        }}
        onAddCell={handleAddCell}
        editingCell={editingCell}
        onUpdateCell={handleUpdateCell}
      />

      {/* Customer Mode Overlay */}
      {isCustomerMode && (
        <CustomerModeOverlay 
          cell={selectedCell} 
          onClose={() => setSelectedCell(null)} 
        />
      )}

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        open={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />

      {/* Guest Watermark */}
      {isGuest && <GuestWatermark />}
    </div>
  );
}
