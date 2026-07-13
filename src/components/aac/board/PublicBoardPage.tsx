import { Button } from '@/components/ui/button';
import { AIUploadPlaceholder } from '@/components/aac/AIUploadPlaceholder';
import { AACCell } from '@/types/aac';
import { ManualIceCreamSections } from '@/lib/boardIceCreamUtils';
import { BoardCard } from '@/components/aac/board/BoardCard';
import { BoardGrid, BoardInfoStrip } from '@/components/aac/board/BoardGrid';
import {
  BoardPageHeader,
  BoardPagePanel,
  BoardPagePrompt,
} from '@/components/aac/board/BoardPageTitle';
import {
  CoreActionsBar,
  IceCreamCategoryNav,
  IceCreamReferenceNav,
} from '@/components/aac/board/CoreActionsBar';
import {
  IceCreamSpeechOutputBar,
  SpeechOutputBar,
} from '@/components/aac/board/SpeechOutputBar';
import {
  getUtilityRailImageSrc,
  iceCreamRailVisuals,
  utilityRailCells,
  utilityRailImageVisuals,
} from '@/components/aac/board/constants';
import { Check, MessageCircle, Pencil, Plus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicBoardPageProps {
  language: string;
  contentDir: 'ltr' | 'rtl';
  BackIcon: LucideIcon;
  useIceCreamLayout: boolean;
  useManualIceCreamLayout: boolean;
  useIceCreamReferenceLayout: boolean;
  manualIceCreamSections: ManualIceCreamSections | null;
  isCustomerMode: boolean;
  isEditMode: boolean;
  allowEdit: boolean;
  showMockupSideRail: boolean;
  showAIUpload: boolean;
  isAtRoot: boolean;
  boardTitle: string;
  iceCreamTitle: string;
  iceCreamPrompt: string;
  selectionSummary: string;
  selectedWordsCount: number;
  displayGridCells: AACCell[];
  iceCreamFlavorCards: AACCell[];
  infoStripCells: AACCell[];
  extraSocialCells: AACCell[];
  effectiveGridCols: number;
  isTransitioning: boolean;
  speakingCellId: string | null;
  isSpeaking: boolean;
  canNavigateBack: boolean;
  iceCreamCategoryButtons: Array<{
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
  }>;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell: (cellId: string, boardId?: string) => void;
  onEditCell: (cell: AACCell, boardId?: string) => void;
  onOpenAddItemModal: (boardId?: string) => void;
  onToggleEditMode: () => void;
  onClearSelection: () => void;
  onSpeakSelection: () => void;
  onToggleCustomerMode: () => void;
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onNavigateToToppings: () => void;
  onNavigateToQuantity: () => void;
  onNavigateToFlavors: () => void;
  onAIUpload?: (file: File) => void;
}

export function PublicBoardPage({
  language,
  contentDir,
  BackIcon,
  useIceCreamLayout,
  useManualIceCreamLayout,
  useIceCreamReferenceLayout,
  manualIceCreamSections,
  isCustomerMode,
  isEditMode,
  allowEdit,
  showMockupSideRail,
  showAIUpload,
  isAtRoot,
  boardTitle,
  iceCreamTitle,
  iceCreamPrompt,
  selectionSummary,
  selectedWordsCount,
  displayGridCells,
  iceCreamFlavorCards,
  infoStripCells,
  extraSocialCells,
  effectiveGridCols,
  isTransitioning,
  speakingCellId,
  isSpeaking,
  canNavigateBack,
  iceCreamCategoryButtons,
  onRunSpokenAction,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onOpenAddItemModal,
  onToggleEditMode,
  onClearSelection,
  onSpeakSelection,
  onToggleCustomerMode,
  onNavigateBack,
  onNavigateHome,
  onNavigateToToppings,
  onNavigateToQuantity,
  onNavigateToFlavors,
  onAIUpload,
}: PublicBoardPageProps) {
  const sideRailCells = utilityRailCells;
  const prompt = useIceCreamLayout
    ? iceCreamPrompt
    : language === 'he'
      ? 'בחר אפשרות'
      : 'Choose an option';
  const title = useIceCreamLayout ? iceCreamTitle : boardTitle;

  return (
    <>
      {isCustomerMode && !isEditMode && !useIceCreamLayout && (
        <div className="flex items-center justify-center gap-2 border-b border-green-600/30 bg-green-600/20 px-3 py-2">
          <MessageCircle className="h-5 w-5 text-green-700" />
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            {language === 'he'
              ? '🎯 מצב לקוח: לחץ על פריט כדי להציג ולהקריא אותו'
              : '🎯 Customer Mode: Tap an item to display and speak it'}
          </p>
        </div>
      )}

      {isEditMode && !useIceCreamLayout && (
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary/10 px-3 py-2">
          <p className="text-sm font-medium text-primary">
            {language === 'he'
              ? '🛠️ מצב עריכה: לחץ על פריט לעריכה, או על ה-X למחיקה'
              : '🛠️ Edit mode: Click item to edit, or X to delete'}
          </p>
          <Button
            size="sm"
            onClick={() => onRunSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => onOpenAddItemModal())}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'he' ? 'הוסף פריט' : 'Add Item'}
          </Button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-2 pb-4 md:p-3 md:pb-6">
          {showMockupSideRail && !useIceCreamLayout && (
            <MobileUtilityRail
              language={language}
              speakingCellId={speakingCellId}
              onCellClick={onCellClick}
            />
          )}

          {useIceCreamLayout ? (
            <IceCreamBoardLayout
              language={language}
              contentDir={contentDir}
              BackIcon={BackIcon}
              allowEdit={allowEdit}
              isEditMode={isEditMode}
              useManualIceCreamLayout={useManualIceCreamLayout}
              manualIceCreamSections={manualIceCreamSections}
              iceCreamTitle={iceCreamTitle}
              iceCreamPrompt={iceCreamPrompt}
              iceCreamFlavorCards={iceCreamFlavorCards}
              selectedWordsCount={selectedWordsCount}
              canNavigateBack={canNavigateBack}
              iceCreamCategoryButtons={iceCreamCategoryButtons}
              speakingCellId={speakingCellId}
              onRunSpokenAction={onRunSpokenAction}
              onCellClick={onCellClick}
              onDeleteCell={onDeleteCell}
              onEditCell={onEditCell}
              onOpenAddItemModal={onOpenAddItemModal}
              onToggleEditMode={onToggleEditMode}
              onClearSelection={onClearSelection}
              onSpeakSelection={onSpeakSelection}
              onNavigateBack={onNavigateBack}
              onNavigateHome={onNavigateHome}
            />
          ) : (
            <StandardBoardLayout
              language={language}
              contentDir={contentDir}
              BackIcon={BackIcon}
              useIceCreamLayout={useIceCreamLayout}
              useIceCreamReferenceLayout={useIceCreamReferenceLayout}
              showMockupSideRail={showMockupSideRail}
              showAIUpload={showAIUpload}
              isAtRoot={isAtRoot}
              title={title}
              prompt={prompt}
              selectionSummary={selectionSummary}
              selectedWordsCount={selectedWordsCount}
              displayGridCells={displayGridCells}
              iceCreamFlavorCards={iceCreamFlavorCards}
              infoStripCells={infoStripCells}
              extraSocialCells={extraSocialCells}
              effectiveGridCols={effectiveGridCols}
              isTransitioning={isTransitioning}
              isEditMode={isEditMode}
              speakingCellId={speakingCellId}
              isSpeaking={isSpeaking}
              canNavigateBack={canNavigateBack}
              onRunSpokenAction={onRunSpokenAction}
              onCellClick={onCellClick}
              onDeleteCell={onDeleteCell}
              onEditCell={onEditCell}
              onClearSelection={onClearSelection}
              onSpeakSelection={onSpeakSelection}
              onToggleCustomerMode={onToggleCustomerMode}
              onNavigateBack={onNavigateBack}
              onNavigateHome={onNavigateHome}
              onNavigateToToppings={onNavigateToToppings}
              onNavigateToQuantity={onNavigateToQuantity}
              onNavigateToFlavors={onNavigateToFlavors}
              onAIUpload={onAIUpload}
            />
          )}
        </main>
      </div>
    </>
  );
}

function MobileUtilityRail({
  language,
  speakingCellId,
  onCellClick,
}: {
  language: string;
  speakingCellId: string | null;
  onCellClick: (cell: AACCell) => void;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-2 mb-3 border-b border-slate-200 bg-[#eef2f8]/95 px-2 py-2 backdrop-blur lg:hidden md:-mx-3 md:px-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {utilityRailCells.map((cell) => (
          <button
            key={`mobile-${cell.id}`}
            type="button"
            onClick={() => onCellClick(cell)}
            className={cn(
              'flex h-[86px] min-w-[76px] shrink-0 flex-col items-center justify-start gap-1 rounded-[16px] border-[2px] border-[#cad3e4] bg-white px-1.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_2px_6px_rgba(15,23,42,0.06)]',
              speakingCellId === cell.id && 'ring-2 ring-primary shadow-lg shadow-primary/20',
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
                    cell.id === 'utility-question' ? 'text-[1.5rem]' : 'text-[1.3rem]',
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
  );
}

function IceCreamBoardLayout({
  language,
  contentDir,
  BackIcon,
  allowEdit,
  isEditMode,
  useManualIceCreamLayout,
  manualIceCreamSections,
  iceCreamTitle,
  iceCreamPrompt,
  iceCreamFlavorCards,
  selectedWordsCount,
  canNavigateBack,
  iceCreamCategoryButtons,
  speakingCellId,
  onRunSpokenAction,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onOpenAddItemModal,
  onToggleEditMode,
  onClearSelection,
  onSpeakSelection,
  onNavigateBack,
  onNavigateHome,
}: Pick<
  PublicBoardPageProps,
  | 'language'
  | 'contentDir'
  | 'BackIcon'
  | 'allowEdit'
  | 'isEditMode'
  | 'useManualIceCreamLayout'
  | 'manualIceCreamSections'
  | 'iceCreamTitle'
  | 'iceCreamPrompt'
  | 'iceCreamFlavorCards'
  | 'selectedWordsCount'
  | 'canNavigateBack'
  | 'iceCreamCategoryButtons'
  | 'speakingCellId'
  | 'onRunSpokenAction'
  | 'onCellClick'
  | 'onDeleteCell'
  | 'onEditCell'
  | 'onOpenAddItemModal'
  | 'onToggleEditMode'
  | 'onClearSelection'
  | 'onSpeakSelection'
  | 'onNavigateBack'
  | 'onNavigateHome'
>) {
  return (
    <div className="mx-auto max-w-[1020px] rounded-[30px] border-[3px] border-[#30497a] bg-[#f7f7f2] p-3 shadow-[0_18px_45px_rgba(48,73,122,0.14)]">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_112px]" style={{ direction: 'ltr' }}>
        <section className="space-y-3" dir={contentDir}>
          {allowEdit && (
            <div className="flex items-center justify-end gap-2 rounded-[16px] border-[2px] border-[#c8d1e0] bg-white/95 px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              <Button
                variant={isEditMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRunSpokenAction(
                  isEditMode
                    ? (language === 'he' ? 'סיום עריכה' : 'Done')
                    : (language === 'he' ? 'עריכה' : 'Edit'),
                  onToggleEditMode,
                )}
                className="gap-2"
              >
                {isEditMode ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {isEditMode ? (language === 'he' ? 'סיום עריכה' : 'Done') : (language === 'he' ? 'עריכה' : 'Edit')}
              </Button>
              {isEditMode && !useManualIceCreamLayout && (
                <Button
                  size="sm"
                  onClick={() => onRunSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => onOpenAddItemModal())}
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

          <BoardPageHeader title={iceCreamTitle} compact />

          {useManualIceCreamLayout && manualIceCreamSections ? (
            <ManualIceCreamSectionsView
              language={language}
              isEditMode={isEditMode}
              sections={manualIceCreamSections}
              speakingCellId={speakingCellId}
              onRunSpokenAction={onRunSpokenAction}
              onCellClick={onCellClick}
              onDeleteCell={onDeleteCell}
              onEditCell={onEditCell}
              onOpenAddItemModal={onOpenAddItemModal}
            />
          ) : (
            <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
              <BoardPagePrompt prompt={iceCreamPrompt} useIceCreamLayout className="mb-3" />
              <BoardGrid
                cells={iceCreamFlavorCards}
                gridCols={5}
                language={language}
                isEditMode={isEditMode}
                speakingCellId={speakingCellId}
                useIceCreamLayout
                hideFolderIndicator
                onCellClick={onCellClick}
                onDeleteCell={onDeleteCell}
                onEditCell={onEditCell}
                cardClassName="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
              />
            </div>
          )}

          <IceCreamSpeechOutputBar
            language={language}
            selectedWordsCount={selectedWordsCount}
            variant="ice-cream-panel"
            onClearSelection={onClearSelection}
            onSpeakSelection={onSpeakSelection}
            onRunSpokenAction={onRunSpokenAction}
          />

          {!useManualIceCreamLayout && (
            <IceCreamCategoryNav language={language} buttons={iceCreamCategoryButtons} />
          )}

          <CoreActionsBar
            language={language}
            BackIcon={BackIcon}
            useIceCreamLayout
            iceCreamVariant="dedicated"
            canNavigateBack={canNavigateBack}
            selectedWordsCount={selectedWordsCount}
            onRunSpokenAction={onRunSpokenAction}
            onClearSelection={onClearSelection}
            onSpeakSelection={onSpeakSelection}
            onToggleCustomerMode={() => undefined}
            onNavigateBack={onNavigateBack}
            onNavigateHome={onNavigateHome}
          />
        </section>

        <IceCreamUtilityRail
          language={language}
          contentDir={contentDir}
          speakingCellId={speakingCellId}
          onCellClick={onCellClick}
        />
      </div>
    </div>
  );
}

function ManualIceCreamSectionsView({
  language,
  isEditMode,
  sections,
  speakingCellId,
  onRunSpokenAction,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onOpenAddItemModal,
}: {
  language: string;
  isEditMode: boolean;
  sections: ManualIceCreamSections;
  speakingCellId: string | null;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell: (cellId: string, boardId?: string) => void;
  onEditCell: (cell: AACCell, boardId?: string) => void;
  onOpenAddItemModal: (boardId?: string) => void;
}) {
  return (
    <>
      <ManualIceCreamSection
        title={sections.labels.serving}
        boardId={sections.servingBoardId}
        entries={sections.serving}
        language={language}
        isEditMode={isEditMode}
        speakingCellId={speakingCellId}
        gridClassName={sections.serving.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}
        onRunSpokenAction={onRunSpokenAction}
        onCellClick={onCellClick}
        onDeleteCell={onDeleteCell}
        onEditCell={onEditCell}
        onOpenAddItemModal={onOpenAddItemModal}
      />
      <ManualIceCreamSection
        title={sections.labels.flavors}
        boardId={sections.flavorsBoardId}
        entries={sections.flavors}
        language={language}
        isEditMode={isEditMode}
        speakingCellId={speakingCellId}
        scrollable
        onRunSpokenAction={onRunSpokenAction}
        onCellClick={onCellClick}
        onDeleteCell={onDeleteCell}
        onEditCell={onEditCell}
        onOpenAddItemModal={onOpenAddItemModal}
      />
      <ManualIceCreamSection
        title={sections.labels.toppings}
        boardId={sections.toppingsBoardId}
        entries={sections.toppings}
        language={language}
        isEditMode={isEditMode}
        speakingCellId={speakingCellId}
        gridClassName={sections.toppings.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}
        onRunSpokenAction={onRunSpokenAction}
        onCellClick={onCellClick}
        onDeleteCell={onDeleteCell}
        onEditCell={onEditCell}
        onOpenAddItemModal={onOpenAddItemModal}
      />
    </>
  );
}

function ManualIceCreamSection({
  title,
  boardId,
  entries,
  language,
  isEditMode,
  speakingCellId,
  scrollable,
  gridClassName,
  onRunSpokenAction,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onOpenAddItemModal,
}: {
  title: string;
  boardId?: string;
  entries: Array<{ boardId: string; cell: AACCell }>;
  language: string;
  isEditMode: boolean;
  speakingCellId: string | null;
  scrollable?: boolean;
  gridClassName?: string;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell: (cellId: string, boardId?: string) => void;
  onEditCell: (cell: AACCell, boardId?: string) => void;
  onOpenAddItemModal: (boardId?: string) => void;
}) {
  return (
    <div className="rounded-[20px] border-[3px] border-[#30497a] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[1.85rem] font-extrabold text-slate-900">{title}</h2>
        {isEditMode && boardId && (
          <Button
            size="sm"
            onClick={() => onRunSpokenAction(language === 'he' ? 'הוסף פריט' : 'Add Item', () => onOpenAddItemModal(boardId))}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'he' ? 'הוסף פריט' : 'Add Item'}
          </Button>
        )}
      </div>
      {scrollable ? (
        <div className="max-h-[min(56vh,34rem)] overflow-y-auto pe-1">
          <div className="grid grid-cols-3 gap-4 md:gap-5">
            {entries.map(({ boardId: entryBoardId, cell }) => {
              const normalizedFlavorText = `${cell.text ?? ''} ${cell.textEn ?? ''}`.toLowerCase();
              const shouldEmphasizeFlavorImage = normalizedFlavorText.includes('תות')
                || normalizedFlavorText.includes('strawberry')
                || normalizedFlavorText.includes('גלידת וניל')
                || normalizedFlavorText.includes('vanilla');

              return (
                <BoardCard
                  key={cell.id}
                  text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                  imageSearchTerms={[cell.text, cell.textEn]}
                  category={cell.category}
                  icon={cell.icon}
                  imageUrl={cell.imageUrl}
                  isFolder={false}
                  onClick={() => onCellClick(cell)}
                  size="lg"
                  variant="mockup"
                  labelPosition="top"
                  isEditMode={isEditMode}
                  isSpeaking={speakingCellId === cell.id}
                  onDelete={() => onDeleteCell(cell.id, entryBoardId)}
                  onEdit={() => onEditCell(cell, entryBoardId)}
                  className="h-[112px] min-h-[112px] gap-1.5 rounded-[14px] border-[2px] border-[#efcf63] px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:h-[118px] md:min-h-[118px]"
                  labelClassName="min-h-[1.45rem] text-[0.8rem] md:min-h-[1.55rem] md:text-[0.88rem]"
                  imageContainerClassName="min-h-0 px-0 py-0"
                  imageClassName={cn(
                    'h-[84%] w-[84%] max-h-none max-w-none !scale-[1.0] -translate-y-[18%]',
                    shouldEmphasizeFlavorImage && '!scale-[2.07] -translate-y-[20%]',
                  )}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className={cn('grid gap-3', gridClassName)}>
          {entries.map(({ boardId: entryBoardId, cell }) => (
            <BoardCard
              key={cell.id}
              text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
              imageSearchTerms={[cell.text, cell.textEn]}
              category={cell.category}
              icon={cell.icon}
              imageUrl={cell.imageUrl}
              isFolder={false}
              onClick={() => onCellClick(cell)}
              size="lg"
              variant="mockup"
              labelPosition="top"
              isEditMode={isEditMode}
              isSpeaking={speakingCellId === cell.id}
              onDelete={() => onDeleteCell(cell.id, entryBoardId)}
              onEdit={() => onEditCell(cell, entryBoardId)}
              className="min-h-[108px] rounded-[14px] border-[2px] border-[#efcf63] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] md:min-h-[116px]"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IceCreamUtilityRail({
  language,
  contentDir,
  speakingCellId,
  onCellClick,
}: {
  language: string;
  contentDir: 'ltr' | 'rtl';
  speakingCellId: string | null;
  onCellClick: (cell: AACCell) => void;
}) {
  return (
    <aside className="grid h-[min(56vh,34rem)] grid-rows-4 gap-4 self-start pe-1" dir={contentDir}>
      {utilityRailCells.map((cell) => {
        const visual = iceCreamRailVisuals[cell.id] ?? { center: cell.icon };

        return (
          <button
            key={cell.id}
            type="button"
            onClick={() => onCellClick(cell)}
            className={cn(
              'flex h-full min-h-0 flex-col items-center justify-start gap-1 rounded-[14px] border-[2px] border-[#c6cfdd] bg-white px-1.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]',
              speakingCellId === cell.id && 'ring-4 ring-primary shadow-lg shadow-primary/20',
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
                <span
                  className={cn(
                    'leading-none',
                    cell.id === 'utility-question' ? 'text-[1.5rem]' : 'text-[1.35rem]',
                  )}
                  aria-hidden="true"
                >
                  {visual.center}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </aside>
  );
}

function StandardBoardLayout({
  language,
  contentDir,
  BackIcon,
  useIceCreamLayout,
  useIceCreamReferenceLayout,
  showMockupSideRail,
  showAIUpload,
  isAtRoot,
  title,
  prompt,
  selectionSummary,
  selectedWordsCount,
  displayGridCells,
  iceCreamFlavorCards,
  infoStripCells,
  extraSocialCells,
  effectiveGridCols,
  isTransitioning,
  isEditMode,
  speakingCellId,
  isSpeaking,
  canNavigateBack,
  onRunSpokenAction,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onClearSelection,
  onSpeakSelection,
  onToggleCustomerMode,
  onNavigateBack,
  onNavigateHome,
  onNavigateToToppings,
  onNavigateToQuantity,
  onNavigateToFlavors,
  onAIUpload,
}: {
  language: string;
  contentDir: 'ltr' | 'rtl';
  BackIcon: LucideIcon;
  useIceCreamLayout: boolean;
  useIceCreamReferenceLayout: boolean;
  showMockupSideRail: boolean;
  showAIUpload: boolean;
  isAtRoot: boolean;
  title: string;
  prompt: string;
  selectionSummary: string;
  selectedWordsCount: number;
  displayGridCells: AACCell[];
  iceCreamFlavorCards: AACCell[];
  infoStripCells: AACCell[];
  extraSocialCells: AACCell[];
  effectiveGridCols: number;
  isTransitioning: boolean;
  isEditMode: boolean;
  speakingCellId: string | null;
  isSpeaking: boolean;
  canNavigateBack: boolean;
  onRunSpokenAction: (label: string, action: () => void) => void;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell: (cellId: string, boardId?: string) => void;
  onEditCell: (cell: AACCell, boardId?: string) => void;
  onClearSelection: () => void;
  onSpeakSelection: () => void;
  onToggleCustomerMode: () => void;
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onNavigateToToppings: () => void;
  onNavigateToQuantity: () => void;
  onNavigateToFlavors: () => void;
  onAIUpload?: (file: File) => void;
}) {
  const gridCells = useIceCreamLayout ? iceCreamFlavorCards : displayGridCells;

  return (
    <div className={cn(
      'mx-auto flex min-h-full flex-col border-[3px] bg-[#fbfcff] shadow-[0_20px_60px_rgba(48,73,122,0.15)]',
      'max-w-[1380px] rounded-[26px] border-[#30497a] p-3 md:p-4',
    )}>
      <div
        className={cn('grid min-h-0 gap-3', showMockupSideRail ? 'lg:grid-cols-[minmax(0,1fr)_172px]' : 'grid-cols-1')}
        style={{ direction: 'ltr' }}
      >
        <section className="flex min-h-0 flex-col space-y-3" dir={contentDir}>
          <BoardPageHeader title={title} useIceCreamLayout={useIceCreamLayout} />

          <BoardPagePanel useIceCreamLayout={useIceCreamLayout}>
            <BoardPagePrompt prompt={prompt} useIceCreamLayout={useIceCreamLayout} />

            <BoardGrid
              cells={gridCells}
              gridCols={useIceCreamLayout ? 5 : effectiveGridCols}
              language={language}
              isTransitioning={isTransitioning}
              isEditMode={isEditMode}
              speakingCellId={speakingCellId}
              useIceCreamLayout={useIceCreamLayout}
              hideFolderIndicator={useIceCreamLayout}
              onCellClick={onCellClick}
              onDeleteCell={onDeleteCell}
              onEditCell={onEditCell}
            />

            {useIceCreamLayout ? (
              <IceCreamSpeechOutputBar
                language={language}
                selectedWordsCount={selectedWordsCount}
                onClearSelection={onClearSelection}
                onSpeakSelection={onSpeakSelection}
                onRunSpokenAction={onRunSpokenAction}
              />
            ) : (
              <BoardInfoStrip
                cells={infoStripCells}
                language={language}
                isEditMode={isEditMode}
                speakingCellId={speakingCellId}
                onCellClick={onCellClick}
                onDeleteCell={onDeleteCell}
                onEditCell={onEditCell}
              />
            )}
          </BoardPagePanel>

          {useIceCreamReferenceLayout && (
            <IceCreamReferenceNav
              language={language}
              onRunSpokenAction={onRunSpokenAction}
              onNavigateToToppings={onNavigateToToppings}
              onNavigateToQuantity={onNavigateToQuantity}
              onNavigateToFlavors={onNavigateToFlavors}
            />
          )}

          <CoreActionsBar
            language={language}
            BackIcon={BackIcon}
            useIceCreamLayout={useIceCreamLayout}
            canNavigateBack={canNavigateBack}
            selectedWordsCount={selectedWordsCount}
            isSpeaking={isSpeaking}
            onRunSpokenAction={onRunSpokenAction}
            onClearSelection={onClearSelection}
            onSpeakSelection={onSpeakSelection}
            onToggleCustomerMode={onToggleCustomerMode}
            onNavigateBack={onNavigateBack}
            onNavigateHome={onNavigateHome}
          />

          <SpeechOutputBar
            selectionSummary={selectionSummary}
            language={language}
            selectedWordsCount={selectedWordsCount}
            hidden={useIceCreamLayout}
            onClearSelection={onClearSelection}
            onSpeakSelection={onSpeakSelection}
            onRunSpokenAction={onRunSpokenAction}
          />

          {showAIUpload && isAtRoot && !isEditMode && (
            <AIUploadPlaceholder
              className="mx-auto mt-2 max-w-2xl"
              onUpload={(file) => {
                onAIUpload?.(file);
                console.log('File uploaded for AI processing:', file.name);
              }}
            />
          )}
        </section>

        {showMockupSideRail && (
          <DesktopUtilityRail
            language={language}
            contentDir={contentDir}
            useIceCreamLayout={useIceCreamLayout}
            extraSocialCells={extraSocialCells}
            isEditMode={isEditMode}
            speakingCellId={speakingCellId}
            onCellClick={onCellClick}
            onDeleteCell={onDeleteCell}
            onEditCell={onEditCell}
          />
        )}
      </div>
    </div>
  );
}

function DesktopUtilityRail({
  language,
  contentDir,
  useIceCreamLayout,
  extraSocialCells,
  isEditMode,
  speakingCellId,
  onCellClick,
  onDeleteCell,
  onEditCell,
}: {
  language: string;
  contentDir: 'ltr' | 'rtl';
  useIceCreamLayout: boolean;
  extraSocialCells: AACCell[];
  isEditMode: boolean;
  speakingCellId: string | null;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell: (cellId: string) => void;
  onEditCell: (cell: AACCell) => void;
}) {
  return (
    <aside className={cn('hidden space-y-2.5 ps-1 lg:block', useIceCreamLayout && 'ps-0')} dir={contentDir}>
      <div className="grid auto-rows-fr gap-2.5">
        {utilityRailCells.map((cell) => (
          <BoardCard
            key={cell.id}
            text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
            imageSearchTerms={[cell.text, cell.textEn]}
            category={cell.category}
            icon={cell.icon}
            imageUrl={getUtilityRailImageSrc(cell)}
            isFolder={!!cell.linkToBoardId}
            onClick={() => onCellClick(cell)}
            size="md"
            variant="utility"
            labelPosition="top"
            isEditMode={isEditMode}
            isSpeaking={speakingCellId === cell.id}
            className={cn(
              useIceCreamLayout
                ? 'min-h-[76px] rounded-[14px] px-2 py-2 text-[0.9rem]'
                : 'min-h-[116px] rounded-[20px] px-2.5 py-3 text-base',
            )}
          />
        ))}
      </div>

      {extraSocialCells.length > 0 && !useIceCreamLayout && (
        <div className="rounded-[20px] border-[3px] border-[#d7dfec] bg-white/90 p-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div className="mb-2 px-2 text-center text-sm font-extrabold text-slate-500">
            {language === 'he' ? 'עוד מסרים' : 'More messages'}
          </div>
          <div className="grid gap-2">
            {extraSocialCells.map((cell) => (
              <BoardCard
                key={cell.id}
                text={language === 'he' || language === 'ar' ? cell.text : cell.textEn}
                imageSearchTerms={[cell.text, cell.textEn]}
                category={cell.category}
                icon={cell.icon}
                imageUrl={cell.imageUrl}
                isFolder={!!cell.linkToBoardId}
                onClick={() => onCellClick(cell)}
                size="sm"
                variant="utility"
                labelPosition="top"
                isEditMode={isEditMode}
                isSpeaking={speakingCellId === cell.id}
                onDelete={() => onDeleteCell(cell.id)}
                onEdit={() => onEditCell(cell)}
                className="min-h-[86px] rounded-[16px] px-2 py-2"
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
