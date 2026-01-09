// AAC Board Types with Hierarchical Navigation Support

export type FitzgeraldCategory = 'people' | 'verbs' | 'descriptors' | 'social';

export interface AACCell {
  id: string;
  text: string;
  textEn: string;
  category: FitzgeraldCategory;
  icon?: string;
  imageUrl?: string;
  // Hierarchical navigation - if set, this cell acts as a folder
  linkToBoardId?: string;
}

export interface AACBoard {
  id: string;
  name: string;
  nameEn: string;
  parentBoardId?: string;
  cells: AACCell[];
  gridSize: {
    cols: number;
    rows: number;
  };
}

export interface BoardNavigationState {
  currentBoardId: string;
  breadcrumbs: Array<{ id: string; name: string; nameEn: string }>;
}
