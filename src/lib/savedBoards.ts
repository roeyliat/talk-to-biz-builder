import { AACBoard } from '@/types/aac';
import { normalizeLocalAssetUrl } from '@/lib/localImageCatalog';
import { supabase } from '@/integrations/supabase/client';
import { Json, Tables } from '@/integrations/supabase/types';

export interface SavedBoardRecord {
  id: string;
  business_name: string;
  business_type: string;
  boards_data: Record<string, AACBoard>;
  created_at: string;
  view_count: number;
  icon: string;
  updated_at?: string;
  user_id?: string;
}

type BoardRecordRow = Tables<'board_records'>;

const toBoardsJson = (boards: Record<string, AACBoard>): Json =>
  migrateBoardsData(boards) as unknown as Json;

const fromBoardsJson = (boardsData: Json): Record<string, AACBoard> =>
  migrateBoardsData(boardsData as unknown as Record<string, AACBoard>);

const STORAGE_KEY = 'talktobiz_saved_boards';

const BUSINESS_TYPE_ICONS: Record<string, string> = {
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
  other: '🗂️',
};

const canUseStorage = () => typeof window !== 'undefined';

const mapRowToSavedBoardRecord = (row: BoardRecordRow): SavedBoardRecord => ({
  id: row.id,
  user_id: row.user_id,
  business_name: row.business_name,
  business_type: row.business_type,
  boards_data: fromBoardsJson(row.boards_data),
  created_at: row.created_at,
  updated_at: row.updated_at,
  view_count: row.view_count,
  icon: row.icon,
});

const buildRecord = (input: {
  boards: Record<string, AACBoard>;
  businessType: string;
  businessName?: string;
  boardId?: string;
  existing?: SavedBoardRecord | null;
  userId?: string;
}): SavedBoardRecord => {
  const now = new Date().toISOString();
  const nextId = input.boardId ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `board-${Date.now()}`);
  const mainBoardName = input.boards.main?.name || input.businessName || 'Custom Board';

  return {
    id: nextId,
    user_id: input.userId,
    business_name: input.businessName || mainBoardName,
    business_type: input.businessType || 'other',
    boards_data: migrateBoardsData(input.boards),
    created_at: input.existing?.created_at || now,
    updated_at: now,
    view_count: input.existing?.view_count || 0,
    icon: BUSINESS_TYPE_ICONS[input.businessType || 'other'] || BUSINESS_TYPE_ICONS.other,
  };
};

const migrateBoardImages = (board: AACBoard): AACBoard => ({
  ...board,
  cells: board.cells.map((cell) => ({
    ...cell,
    imageUrl: normalizeLocalAssetUrl(cell.imageUrl) ?? cell.imageUrl,
  })),
});

const migrateBoardsData = (boardsData: Record<string, AACBoard>) =>
  Object.fromEntries(Object.entries(boardsData).map(([boardId, board]) => [boardId, migrateBoardImages(board)]));

const getLocalSavedBoards = (): SavedBoardRecord[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SavedBoardRecord[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    const migratedBoards = parsed.map((record) => ({
      ...record,
      boards_data: migrateBoardsData(record.boards_data),
    }));

    if (JSON.stringify(migratedBoards) !== JSON.stringify(parsed)) {
      writeSavedBoards(migratedBoards);
    }

    return migratedBoards;
  } catch {
    return [];
  }
};

const writeSavedBoards = (boards: SavedBoardRecord[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
};

const writeSavedBoardToLocal = (record: SavedBoardRecord) => {
  const existingBoards = getLocalSavedBoards();
  const updatedBoards = [record, ...existingBoards.filter((board) => board.id !== record.id)].sort(
    (first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime()
  );
  writeSavedBoards(updatedBoards);
};

export const deleteSavedBoard = async (boardId: string, userId?: string) => {
  const existingBoards = getLocalSavedBoards();
  const updatedBoards = existingBoards.filter((board) => board.id !== boardId);

  writeSavedBoards(updatedBoards);

  if (!userId) {
    return true;
  }

  const { error } = await supabase
    .from('board_records')
    .delete()
    .eq('user_id', userId)
    .eq('id', boardId);

  if (error) {
    writeSavedBoards(existingBoards);
    console.error('Failed to delete board record from Supabase', error);
    return false;
  }

  return true;
};

export const getSavedBoards = async (userId?: string): Promise<SavedBoardRecord[]> => {
  if (!userId) {
    return getLocalSavedBoards();
  }

  const { data, error } = await supabase
    .from('board_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load board records from Supabase', error);
    return getLocalSavedBoards();
  }

  const records = (data ?? []).map(mapRowToSavedBoardRecord);
  writeSavedBoards(records);
  return records;
};

export const getSavedBoardById = async (boardId?: string, userId?: string) => {
  if (!boardId) {
    return null;
  }

  if (userId) {
    const { data, error } = await supabase
      .from('board_records')
      .select('*')
      .eq('user_id', userId)
      .eq('id', boardId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load board record from Supabase', error);
    } else if (data) {
      const record = mapRowToSavedBoardRecord(data);
      writeSavedBoardToLocal(record);
      return record;
    }
  }

  return getLocalSavedBoards().find((board) => board.id === boardId) ?? null;
};

export const saveBoardRecord = async (input: {
  boards: Record<string, AACBoard>;
  businessType: string;
  businessName?: string;
  boardId?: string;
  userId?: string;
}) => {
  const existingBoards = getLocalSavedBoards();
  const existing = existingBoards.find((board) => board.id === input.boardId) ?? null;
  const record = buildRecord({ ...input, existing });

  writeSavedBoardToLocal(record);

  if (input.userId) {
    const { data, error } = await supabase
      .from('board_records')
      .upsert({
        id: record.id,
        user_id: input.userId,
        business_name: record.business_name,
        business_type: record.business_type,
        boards_data: toBoardsJson(record.boards_data),
        icon: record.icon,
        view_count: record.view_count,
        created_at: record.created_at,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Failed to save board record to Supabase', error);
      return record;
    }

    const cloudRecord = mapRowToSavedBoardRecord(data);
    writeSavedBoardToLocal(cloudRecord);
    return cloudRecord;
  }

  return record;
};

export const updateSavedBoardBoards = async (boardId: string, boards: Record<string, AACBoard>, userId?: string) => {
  const existing = await getSavedBoardById(boardId, userId);
  if (!existing) {
    return null;
  }

  return saveBoardRecord({
    boardId,
    boards,
    businessType: existing.business_type,
    businessName: existing.business_name,
    userId,
  });
};

export const syncLocalBoardsToCloud = async (userId: string) => {
  const localBoards = getLocalSavedBoards();

  if (localBoards.length === 0) {
    return [] as SavedBoardRecord[];
  }

  const payload = localBoards.map((record) => ({
    id: record.id,
    user_id: userId,
    business_name: record.business_name,
    business_type: record.business_type,
    boards_data: toBoardsJson(record.boards_data),
    icon: record.icon,
    view_count: record.view_count,
    created_at: record.created_at,
  }));

  const { data, error } = await supabase
    .from('board_records')
    .upsert(payload)
    .select('*');

  if (error) {
    console.error('Failed to sync local boards to Supabase', error);
    return localBoards;
  }

  const synced = (data ?? []).map(mapRowToSavedBoardRecord);
  writeSavedBoards(synced);
  return synced;
};
