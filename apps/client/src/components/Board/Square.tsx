import type { Coord, Piece } from "@jumpfrog/rules";
import { isDarkSquare } from "@jumpfrog/rules";
import { FrogSprite } from "../FrogSprite";
import { FROG_SIZE } from "../../constants/game";
import { isFinishedPosition } from "../../utils/finishHelpers";
import styles from "./Square.module.css";

/**
 * Props for the Square component
 */
interface SquareProps {
  /** Board coordinate of this square */
  coord: Coord;
  /** Piece on this square, or null if empty */
  piece: Piece | null;
  /** Whether this square is currently selected */
  isSelected: boolean;
  /** Whether this square is a valid move target */
  isTarget: boolean;
  /** Whether the piece on this square is animating */
  isAnimating: boolean;
  /** Whether this piece is locked in continuation mode */
  isContinuationLocked?: boolean;
  /** Size of the cell in pixels */
  cellSize: number;
  /** Whether interactions are disabled */
  disabled: boolean;
  /** Click handler */
  onClick: () => void;
  /** Whether board is rotated (BLACK player view) */
  rotated?: boolean;
}

/**
 * Individual board square that can contain a frog piece
 */
export const Square = ({
  coord,
  piece,
  isSelected,
  isTarget,
  isAnimating,
  isContinuationLocked = false,
  cellSize,
  disabled,
  onClick,
  rotated = false
}: SquareProps) => {
  const dark = isDarkSquare(coord);
  const isGoalRowAny = coord.r === 0 || coord.r === 7;
  const renderDark = dark && !isGoalRowAny;
  const isPadTile =
    (coord.r === 7 && (coord.c === 1 || coord.c === 3 || coord.c === 5 || coord.c === 7)) ||
    (coord.r === 0 && (coord.c === 0 || coord.c === 2 || coord.c === 4 || coord.c === 6));
  const playable = dark || isGoalRowAny;
  const showFinish =
    piece !== null && isFinishedPosition(piece.owner, coord);

  return (
    <button
      className={[
        styles.square,
        isPadTile ? styles.padTile : (isGoalRowAny ? styles.goalRow : (renderDark ? "darkSquare" : styles.light)),
        isSelected ? styles.selected : "",
        isTarget ? styles.target : "",
        isContinuationLocked ? styles.continuationLocked : ""
      ]
        .filter(Boolean)
        .join(" ")}
      data-dark={renderDark}
      type="button"
      disabled={!playable || disabled}
      onClick={onClick}
    >
      {piece && !isAnimating && cellSize > 0 ? (
        <div style={{ transform: rotated ? 'rotate(180deg)' : undefined }}>
          <FrogSprite
            color={piece.owner}
            frame={showFinish ? "finish" : "idle"}
            size={cellSize * FROG_SIZE.STATIC}
          />
        </div>
      ) : null}
    </button>
  );
};
