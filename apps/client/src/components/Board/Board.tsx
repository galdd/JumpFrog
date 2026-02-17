import type { Board as BoardType, Coord, Player } from "@jumpfrog/rules";
import { coordsEqual } from "../../utils/coordHelpers";
import { Square } from "./Square";
import { BoardLabels } from "./BoardLabels";
import styles from "./Board.module.css";

/**
 * Props for the Board component
 */
interface BoardProps {
  /** Current board state */
  board: BoardType;
  /** Currently selected coordinate */
  selected: Coord | null;
  /** Valid move target coordinates */
  targetSquares: Coord[];
  /** ID of piece currently being animated */
  animatingPieceId: string | null;
  /** ID of piece locked in continuation mode */
  continuationFrogId?: string | null;
  /** Size of each cell in pixels */
  cellSize: number;
  /** Ref to board element for measurements */
  boardRef: React.RefObject<HTMLDivElement | null>;
  /** Whether board interactions are disabled */
  disabled: boolean;
  /** Handler for square clicks */
  onSquareClick: (coord: Coord) => void;
  /** Player color for board rotation (BLACK sees board flipped) */
  myColor?: Player | null;
}

/**
 * Board component that renders the 8x8 game grid with coordinate labels
 */
export const Board = ({
  board,
  selected,
  targetSquares,
  animatingPieceId,
  continuationFrogId = null,
  cellSize,
  boardRef,
  disabled,
  onSquareClick,
  myColor = null
}: BoardProps) => {
  const isBlackPlayer = myColor === "BLACK";
  
  return (
    <div className={styles.boardWrapper}>
      <BoardLabels rotated={isBlackPlayer} />
      <div
        className={`${styles.board} ${isBlackPlayer ? styles.rotated : ''}`}
        role="grid"
        aria-label="Hop 'n' Jump board"
        ref={boardRef}
      >
        {board.map((row, r) =>
          row.map((piece, c) => {
            const coord = { r, c };
            const isSelected = selected ? coordsEqual(selected, coord) : false;
            const isTarget = targetSquares.some((target) =>
              coordsEqual(target, coord)
            );
            const isAnimating = animatingPieceId === piece?.id;
            const isContinuationLocked = 
              continuationFrogId !== null && 
              piece?.id === continuationFrogId;

            return (
              <Square
                key={`${r}-${c}`}
                coord={coord}
                piece={piece}
                isSelected={isSelected}
                isTarget={isTarget}
                isAnimating={isAnimating}
                isContinuationLocked={isContinuationLocked}
                cellSize={cellSize}
                disabled={disabled}
                onClick={() => onSquareClick(coord)}
                rotated={isBlackPlayer}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
