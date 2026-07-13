import { AACCell } from '@/types/aac';
import { BoardGrid } from './BoardGrid';
import { BoardPageTitle } from './BoardPageTitle';
import { CoreActionsBar } from './CoreActionsBar';
import { SpeechOutputBar } from './SpeechOutputBar';
import { AIUploadPlaceholder } from './AIUploadPlaceholder';
import { LucideIcon } from 'lucide-react';

interface PublicBoardPageProps {
  title: string;
  boardEmoji: string;
  prompt: string;
  gridCells: AACCell[];
  infoStripCells: AACCell[];
  sideRailCells: AACCell[];
  extraSocialCells: AACCell[];
  gridCols: number;
  contentDir: 'rtl' | 'ltr';
  language: string;
  selectionSummary: string;
  selectedWordsCount: number;
  isTransitioning?: boolean;
  isEditMode?: boolean;
  isSpeaking?: boolean;
  isCustomerMode?: boolean;
  speakingCellId?: string | null;
  showAIUpload?: boolean;
  backIcon: LucideIcon;
  canGoBack: boolean;
  labels: {
    delete: string;
    speak: string;
    talk: string;
    back: string;
    home: string;
    doneChoosing: string;
    moreMessages: string;
  };
  getCellLabel: (cell: AACCell) => string;
  getUtilityRailImageSrc: (cell: AACCell) => string | undefined;
  onCellClick: (cell: AACCell) => void;
  onDeleteCell: (cellId: string) => void;
  onEditCell: (cell: AACCell) => void;
  onClearSelection: () => void;
  onSpeakSelection: () => void;
  onToggleCustomerMode: () => void;
  onBack: () => void;
  onHome: () => void;
  onDoneChoosing: () => void;
  onUpload?: (file: File) => void;
}

export function PublicBoardPage({
  title,
  boardEmoji,
  prompt,
  gridCells,
  infoStripCells,
  sideRailCells,
  extraSocialCells,
  gridCols,
  contentDir,
  language,
  selectionSummary,
  selectedWordsCount,
  isTransitioning,
  isEditMode,
  isSpeaking,
  isCustomerMode,
  speakingCellId,
  showAIUpload,
  backIcon,
  canGoBack,
  labels,
  getCellLabel,
  getUtilityRailImageSrc,
  onCellClick,
  onDeleteCell,
  onEditCell,
  onClearSelection,
  onSpeakSelection,
  onToggleCustomerMode,
  onBack,
  onHome,
  onDoneChoosing,
  onUpload,
}: PublicBoardPageProps) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[375px] flex-col bg-white" dir={contentDir}>
      <SpeechOutputBar
        summary={selectionSummary}
        doneLabel={labels.doneChoosing}
        hasSelection={selectedWordsCount > 0}
        onDone={onDoneChoosing}
      />

      <BoardPageTitle title={title} emoji={boardEmoji} />

      <div className="flex-1 px-6 pb-6">
        <BoardGrid
          cells={gridCells}
          gridCols={gridCols}
          getLabel={getCellLabel}
          isTransitioning={isTransitioning}
          isEditMode={isEditMode}
          speakingCellId={speakingCellId}
          onCellClick={onCellClick}
          onDeleteCell={onDeleteCell}
          onEditCell={onEditCell}
          prompt={prompt}
        />

        {showAIUpload && !isEditMode && (
          <AIUploadPlaceholder
            className="mx-auto mt-2 max-w-2xl"
            onUpload={(file) => onUpload?.(file)}
          />
        )}
      </div>

      <CoreActionsBar
        labels={{
          delete: labels.delete,
          speak: labels.speak,
          talk: labels.talk,
          back: labels.back,
          home: labels.home,
        }}
        backIcon={backIcon}
        canGoBack={canGoBack}
        canSpeak={selectedWordsCount > 0}
        isSpeaking={isSpeaking}
        isCustomerMode={isCustomerMode}
        onDelete={onClearSelection}
        onSpeak={onSpeakSelection}
        onTalk={onToggleCustomerMode}
        onBack={onBack}
        onHome={onHome}
      />
    </div>
  );
}
