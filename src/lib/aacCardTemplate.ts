import type { FitzgeraldCategory } from '@/types/aac';

/**
 * Shared AAC card surface templates (Figma TalkToBiz-App).
 * Style is chosen by cell.category only — never by text heuristics at render time.
 *
 * noun / people          → 4005:330
 * verb / verbs           → 4005:329
 * descriptor / descriptors → 4005:328
 * question / questions   → 4005:327
 * communication / social → 4005:326
 *
 * Fill tokens from Figma foundation colors (node 4005:123) + noun/descriptor surfaces.
 */
export const AAC_CARD_SURFACE_CLASS: Record<FitzgeraldCategory, string> = {
  people: 'bg-[#fbeec6]', // noun
  verbs: 'bg-[#e8f5e6]', // verb
  descriptors: 'bg-[#efd9e8]', // descriptor
  questions: 'bg-[#e8f2ff]', // question
  social: 'bg-white', // communication
};

/** Single source of truth for card fill by grammatical category. */
export const getAacCardSurfaceClass = (category: FitzgeraldCategory): string =>
  AAC_CARD_SURFACE_CLASS[category] ?? AAC_CARD_SURFACE_CLASS.people;
