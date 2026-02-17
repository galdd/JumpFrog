import { describe, expect, it } from "vitest";

import {
  checkWinner,
  createInitialBoard,
  listLegalMoves,
  type Board,
  type Coord,
  type Move,
  type Player
} from "../src/index";

const makeEmptyBoard = (): Board =>
  Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

const placePiece = (board: Board, coord: Coord, owner: Player, id: string) => {
  board[coord.r][coord.c] = { id, owner };
};

const coord = (r: number, c: number): Coord => ({ r, c });

const hasJumpPath = (moves: Move[], path: Coord[]) =>
  moves.some(
    (move) =>
      move.type === "JUMP" &&
      move.path.length === path.length &&
      move.path.every((step, index) => step.r === path[index].r && step.c === path[index].c)
  );

describe("rules engine", () => {
  it("creates initial positions correctly", () => {
    const board = createInitialBoard();

    const greenCoords = [
      coord(7, 0),
      coord(6, 1),
      coord(7, 2),
      coord(6, 3),
      coord(7, 4),
      coord(6, 5),
      coord(7, 6),
      coord(6, 7)
    ];

    const blackCoords = [
      coord(1, 0),
      coord(0, 1),
      coord(1, 2),
      coord(0, 3),
      coord(1, 4),
      coord(0, 5),
      coord(1, 6),
      coord(0, 7)
    ];

    greenCoords.forEach((square) => {
      const piece = board[square.r][square.c];
      expect(piece?.owner).toBe("GREEN");
    });

    blackCoords.forEach((square) => {
      const piece = board[square.r][square.c];
      expect(piece?.owner).toBe("BLACK");
    });
  });

  it("detects a step move correctly", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(4, 3), "GREEN", "G1");

    const moves = listLegalMoves(board, "GREEN");
    const stepTargets = moves
      .filter((move) => move.type === "STEP")
      .map((move) => (move.type === "STEP" ? move.to : null));

    // GREEN moves toward row 0: only (3,2) and (3,4) are forward
    expect(stepTargets).toContainEqual(coord(3, 2));
    expect(stepTargets).toContainEqual(coord(3, 4));
    // Back steps are allowed
    expect(stepTargets).toContainEqual(coord(5, 2));
    expect(stepTargets).toContainEqual(coord(5, 4));
  });

  it("allows landing on goal rows even if light squares", () => {
    const board = makeEmptyBoard();
    // GREEN can step onto r=0 light squares
    placePiece(board, coord(1, 1), "GREEN", "G1"); // light square
    const greenMoves = listLegalMoves(board, "GREEN");
    const greenStepTargets = greenMoves
      .filter((move) => move.type === "STEP")
      .map((move) => (move.type === "STEP" ? move.to : null));
    expect(greenStepTargets).toContainEqual(coord(0, 0)); // light goal square

    // BLACK can step onto r=7 light squares
    const board2 = makeEmptyBoard();
    placePiece(board2, coord(6, 6), "BLACK", "B1"); // light square
    const blackMoves = listLegalMoves(board2, "BLACK");
    const blackStepTargets = blackMoves
      .filter((move) => move.type === "STEP")
      .map((move) => (move.type === "STEP" ? move.to : null));
    expect(blackStepTargets).toContainEqual(coord(7, 7)); // light goal square
  });

  it("allows straight steps into goal rows (A8/C8/E8/G8 and B1/D1/F1/H1)", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(1, 0), "GREEN", "G1"); // A7
    const greenMoves = listLegalMoves(board, "GREEN");
    const greenStepTargets = greenMoves
      .filter((move) => move.type === "STEP")
      .map((move) => (move.type === "STEP" ? move.to : null));
    expect(greenStepTargets).toContainEqual(coord(0, 0)); // A8

    const board2 = makeEmptyBoard();
    placePiece(board2, coord(6, 1), "BLACK", "B1"); // B2
    const blackMoves = listLegalMoves(board2, "BLACK");
    const blackStepTargets = blackMoves
      .filter((move) => move.type === "STEP")
      .map((move) => (move.type === "STEP" ? move.to : null));
    expect(blackStepTargets).toContainEqual(coord(7, 1)); // B1
  });

  it("allows straight jumps into goal rows when a piece is in the middle", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(2, 0), "GREEN", "G1"); // A6
    placePiece(board, coord(1, 0), "BLACK", "B1"); // A7 (jump over)
    const greenMoves = listLegalMoves(board, "GREEN");
    expect(hasJumpPath(greenMoves, [coord(2, 0), coord(0, 0)])).toBe(true); // A8

    const board2 = makeEmptyBoard();
    placePiece(board2, coord(5, 1), "BLACK", "B1"); // B3
    placePiece(board2, coord(6, 1), "GREEN", "G1"); // B2 (jump over)
    const blackMoves = listLegalMoves(board2, "BLACK");
    expect(hasJumpPath(blackMoves, [coord(5, 1), coord(7, 1)])).toBe(true); // B1
  });

  it("allows back jumps (e.g. GREEN at A7 can jump backward to C5 over B6)", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(1, 0), "GREEN", "G1"); // A7 (rank 7 = row 1)
    placePiece(board, coord(2, 1), "BLACK", "B1");  // B6 - piece to jump over

    const moves = listLegalMoves(board, "GREEN");
    // Back jump from (1,0) over (2,1) to (3,2) = C5 is allowed in rows 7-8
    expect(hasJumpPath(moves, [coord(1, 0), coord(3, 2)])).toBe(true);
  });

  it("allows back jumps for BLACK in ranks 1-2", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(6, 7), "BLACK", "B1"); // H2
    placePiece(board, coord(5, 6), "GREEN", "G1"); // G3 - piece to jump over

    const moves = listLegalMoves(board, "BLACK");
    // Back jump from (6,7) over (5,6) to (4,5) = F4 is allowed in rows 1-2
    expect(hasJumpPath(moves, [coord(6, 7), coord(4, 5)])).toBe(true);
  });

  it("allows a jump over own piece (forward only)", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(4, 3), "GREEN", "G1");
    placePiece(board, coord(3, 2), "GREEN", "G2");

    const moves = listLegalMoves(board, "GREEN");
    expect(hasJumpPath(moves, [coord(4, 3), coord(2, 1)])).toBe(true);
  });

  it("allows a jump over opponent piece", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(4, 3), "GREEN", "G1");
    placePiece(board, coord(3, 2), "BLACK", "B1");

    const moves = listLegalMoves(board, "GREEN");
    expect(hasJumpPath(moves, [coord(4, 3), coord(2, 1)])).toBe(true);
  });

  it("returns only single jumps per move", () => {
    const board = makeEmptyBoard();
    placePiece(board, coord(4, 3), "GREEN", "G1");
    placePiece(board, coord(3, 2), "BLACK", "B1");
    placePiece(board, coord(1, 2), "BLACK", "B2");

    const moves = listLegalMoves(board, "GREEN");
    expect(hasJumpPath(moves, [coord(4, 3), coord(2, 1)])).toBe(true);
    const jumpMoves = moves.filter((m) => m.type === "JUMP");
    jumpMoves.forEach((m) => {
      if (m.type === "JUMP") expect(m.path.length).toBe(2);
    });
  });

  it("detects a winner when all frogs reach the opponent's home side", () => {
    const board = makeEmptyBoard();
    // GREEN wins when all 8 frogs are on rows r=0 or r=1
    placePiece(board, coord(0, 0), "GREEN", "G1");
    placePiece(board, coord(0, 2), "GREEN", "G2");
    placePiece(board, coord(0, 4), "GREEN", "G3");
    placePiece(board, coord(0, 6), "GREEN", "G4");
    placePiece(board, coord(1, 1), "GREEN", "G5");
    placePiece(board, coord(1, 3), "GREEN", "G6");
    placePiece(board, coord(1, 5), "GREEN", "G7");
    placePiece(board, coord(1, 7), "GREEN", "G8");

    expect(checkWinner(board)).toBe("GREEN");

    // BLACK wins when all 8 frogs are on rows r=6 or r=7
    const board2 = makeEmptyBoard();
    placePiece(board2, coord(6, 1), "BLACK", "B1");
    placePiece(board2, coord(6, 3), "BLACK", "B2");
    placePiece(board2, coord(6, 5), "BLACK", "B3");
    placePiece(board2, coord(6, 7), "BLACK", "B4");
    placePiece(board2, coord(7, 0), "BLACK", "B5");
    placePiece(board2, coord(7, 2), "BLACK", "B6");
    placePiece(board2, coord(7, 4), "BLACK", "B7");
    placePiece(board2, coord(7, 6), "BLACK", "B8");

    expect(checkWinner(board2)).toBe("BLACK");

    // Test no winner when not all frogs are on home side
    const board3 = makeEmptyBoard();
    placePiece(board3, coord(0, 0), "GREEN", "G1");
    placePiece(board3, coord(2, 1), "GREEN", "G2");
    expect(checkWinner(board3)).toBe(null);
  });
});
